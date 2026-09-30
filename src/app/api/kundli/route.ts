import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { getPlanLimits } from "@/lib/plans";
import { success, unauthorized, badRequest, error } from "@/lib/api-response";
import type { KundliSummary } from "@/types/api";
import { requireSameOrigin } from "@/lib/request-security";
import { parsePositiveInt } from "@/lib/validate";
import { config } from "@/lib/config";
import { astrologyProviderConfigured, generateVedicChart } from "@/lib/astrology-provider";

export const dynamic = "force-dynamic";

// // TODO: Replace with real astrology API (Swiss Ephemeris / AstroSage)
const MOCK_CHARTS = [
  {
    sunSign: "Mesha (Aries)",
    moonSign: "Vrishabha (Taurus)",
    ascendant: "Kanya (Virgo)",
    nakshatra: "Rohini Pada 2",
    houses: [
      { house: 1, sign: "Kanya", grahas: ["Ascendant"] },
      { house: 2, sign: "Tula", grahas: ["Venus"] },
      { house: 3, sign: "Vrishchika", grahas: ["Ketu"] },
      { house: 4, sign: "Dhanu", grahas: ["Jupiter"] },
      { house: 5, sign: "Makara", grahas: ["Saturn"] },
      { house: 6, sign: "Kumbha", grahas: [] },
      { house: 7, sign: "Meena", grahas: ["Mercury"] },
      { house: 8, sign: "Mesha", grahas: ["Sun"] },
      { house: 9, sign: "Vrishabha", grahas: ["Moon", "Rahu"] },
      { house: 10, sign: "Mithuna", grahas: ["Mars"] },
      { house: 11, sign: "Karka", grahas: [] },
      { house: 12, sign: "Simha", grahas: [] },
    ],
  },
  {
    sunSign: "Simha (Leo)",
    moonSign: "Karka (Cancer)",
    ascendant: "Vrishchika (Scorpio)",
    nakshatra: "Pushya Pada 4",
    houses: [
      { house: 1, sign: "Vrishchika", grahas: ["Ascendant", "Mars"] },
      { house: 2, sign: "Dhanu", grahas: [] },
      { house: 3, sign: "Makara", grahas: ["Rahu"] },
      { house: 4, sign: "Kumbha", grahas: ["Saturn"] },
      { house: 5, sign: "Meena", grahas: ["Jupiter"] },
      { house: 6, sign: "Mesha", grahas: [] },
      { house: 7, sign: "Vrishabha", grahas: [] },
      { house: 8, sign: "Mithuna", grahas: ["Venus"] },
      { house: 9, sign: "Karka", grahas: ["Moon", "Ketu"] },
      { house: 10, sign: "Simha", grahas: ["Sun", "Mercury"] },
      { house: 11, sign: "Kanya", grahas: [] },
      { house: 12, sign: "Tula", grahas: [] },
    ],
  },
];

export async function POST(request: NextRequest) {
  try {
    const csrfError = requireSameOrigin(request);
    if (csrfError) return csrfError;
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();
    if (!astrologyProviderConfigured() && !config.demoAstrologyEnabled) {
      return error("Kundli calculation engine is not configured", 503);
    }

    if (!user.dateOfBirth || !user.timeOfBirth || !user.birthTimeKnown || user.latitude === null || user.longitude === null || !user.timeZone) {
      return badRequest("Exact birth date, time, coordinates, and timezone are required for a verified chart");
    }

    const body = await request.json().catch(() => ({}));
    const chartType = body?.chartType === "western" ? "western" : "vedic";

    if (chartType === "western" && !config.demoAstrologyEnabled) {
      return error("Western chart integration is not configured", 503);
    }
    const hash = (user.id.length + user.dateOfBirth.getTime()) % MOCK_CHARTS.length;
    const template = MOCK_CHARTS[hash];
    const limits = getPlanLimits(user.plan);

    const chartData = astrologyProviderConfigured() && chartType === "vedic"
      ? await generateVedicChart({
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          timeOfBirth: user.timeOfBirth,
          latitude: user.latitude!,
          longitude: user.longitude!,
          timeZone: user.timeZone,
        })
      : { ...template, generatedFor: user.name, chartType, syntheticDemo: true };

    const birthData = {
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : null,
      timeOfBirth: user.timeOfBirth || "12:00",
      placeOfBirth: user.placeOfBirth || "Unknown",
      latitude: user.latitude,
      longitude: user.longitude,
      timeZone: user.timeZone,
    };

    const kundli = await prisma.kundli.create({
      data: {
        userId: user.id,
        chartType,
        chartData: JSON.stringify(chartData),
        birthData: JSON.stringify(birthData),
      },
    });

    return success({
      kundli: {
        id: kundli.id,
        chartType: kundli.chartType as "vedic" | "western",
        createdAt: kundli.createdAt.toISOString(),
        sunSign: chartData.sunSign,
        moonSign: chartData.moonSign,
        ascendant: chartData.ascendant,
        watermarked: limits.kundliWatermark,
        chartData,
        birthData,
      },
    }, 201);
  } catch (err: unknown) {
    console.error("Kundli creation error:", err);
    return error("Internal server error", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();
    const { searchParams } = new URL(request.url);
    const page = parsePositiveInt(searchParams.get("page"), 1, 100000);
    const limit = parsePositiveInt(searchParams.get("limit"), 10, 50);
    if (!page || !limit) return badRequest("Invalid pagination parameters");
    const skip = (page - 1) * limit;

    const [kundlis, total] = await Promise.all([
      prisma.kundli.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.kundli.count({ where: { userId: user.id } }),
    ]);

    const limits = getPlanLimits(user.plan);

    const summaries: KundliSummary[] = kundlis.map((k) => {
      let parsed: { sunSign?: string; moonSign?: string; ascendant?: string } = {};
      try {
        parsed = JSON.parse(k.chartData);
      } catch {}
      return {
        id: k.id,
        chartType: k.chartType as "vedic" | "western",
        createdAt: k.createdAt.toISOString(),
        sunSign: parsed.sunSign || "Mesha",
        moonSign: parsed.moonSign || "Vrishabha",
        ascendant: parsed.ascendant || "Kanya",
        watermarked: limits.kundliWatermark,
      };
    });

    return success({ kundlis: summaries, total, page });
  } catch (err: unknown) {
    console.error("Kundli list error:", err);
    return error("Internal server error", 500);
  }
}
