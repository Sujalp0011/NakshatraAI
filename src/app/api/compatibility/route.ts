import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { getPlanLimits } from "@/lib/plans";
import { sanitizeString, parseDateOnly, isValidTime, parsePositiveInt, isValidTimeZone } from "@/lib/validate";
import { success, unauthorized, badRequest, error } from "@/lib/api-response";
import type { CompatibilityCategory, CompatibilityResult } from "@/types/api";
import { requireSameOrigin } from "@/lib/request-security";
import { config } from "@/lib/config";
import { astrologyProviderConfigured, calculateVedicCompatibility } from "@/lib/astrology-provider";

export const dynamic = "force-dynamic";

const ASHTAKOOTA_CATEGORIES: { name: string; maxScore: number; desc: string }[] = [
  { name: "Varna", maxScore: 1, desc: "Spiritual & work compatibility" },
  { name: "Vashya", maxScore: 2, desc: "Mutual attraction & power balance" },
  { name: "Tara", maxScore: 3, desc: "Health, longevity & well-being" },
  { name: "Yoni", maxScore: 4, desc: "Intimacy & physical compatibility" },
  { name: "Maitri", maxScore: 5, desc: "Mental compatibility & friendship" },
  { name: "Gana", maxScore: 6, desc: "Temperament & nature match" },
  { name: "Bhakoot", maxScore: 7, desc: "Love, happiness & family prosperity" },
  { name: "Nadi", maxScore: 8, desc: "Genetic health & spiritual lineage" },
];

export async function POST(request: NextRequest) {
  try {
    const csrfError = requireSameOrigin(request);
    if (csrfError) return csrfError;
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();
    if (!astrologyProviderConfigured() && !config.demoAstrologyEnabled) return error("Compatibility engine is not configured", 503);

    const body = await request.json().catch(() => ({}));
    const { partnerName: rawName, partnerDob: rawDob, partnerTob, partnerPlace, partnerLatitude, partnerLongitude, partnerTimeZone } = body || {};

    if (!rawName || typeof rawName !== "string") {
      return badRequest("Partner name is required");
    }
    if (!rawDob) {
      return badRequest("Partner date of birth is required");
    }

    const partnerName = sanitizeString(rawName, 100);
    const partnerDob = parseDateOnly(rawDob);
    if (!partnerDob || partnerDob > new Date()) {
      return badRequest("Invalid partner date of birth");
    }
    if (partnerTob && !isValidTime(partnerTob)) return badRequest("Partner time must use HH:mm format");
    const hasCoordinates = typeof partnerLatitude === "number" && partnerLatitude >= -90 && partnerLatitude <= 90 &&
      typeof partnerLongitude === "number" && partnerLongitude >= -180 && partnerLongitude <= 180;
    if (!hasCoordinates || !isValidTimeZone(partnerTimeZone) || !partnerTob) {
      return badRequest("Partner birth time, coordinates, and timezone are required");
    }
    if (!user.dateOfBirth || !user.timeOfBirth || !user.birthTimeKnown || user.latitude === null || user.longitude === null || !user.timeZone) {
      return badRequest("Complete your own exact birth details in Settings first");
    }

    // Hash-based deterministic Ashtakoota calculation
    const seed = partnerName.length + partnerDob.getTime() + user.id.length;
    let totalScore = 0;
    const categories: CompatibilityCategory[] = ASHTAKOOTA_CATEGORIES.map((cat, idx) => {
      const categoryScore = Math.max(0.5, Math.min(cat.maxScore, Math.round(((seed + idx * 7) % (cat.maxScore + 1)) * 10) / 10));
      totalScore += categoryScore;
      return {
        name: cat.name,
        score: categoryScore,
        maxScore: cat.maxScore,
        description: cat.desc,
      };
    });

    let overallScore = Math.round(((totalScore / 36) * 100) * 10) / 10;
    let calculatedCategories = categories;
    let providerData: unknown = null;
    if (astrologyProviderConfigured()) {
      const match = await calculateVedicCompatibility({
        name: user.name, dateOfBirth: user.dateOfBirth, timeOfBirth: user.timeOfBirth,
        latitude: user.latitude, longitude: user.longitude, timeZone: user.timeZone,
      }, {
        name: partnerName, dateOfBirth: partnerDob, timeOfBirth: partnerTob,
        latitude: partnerLatitude, longitude: partnerLongitude, timeZone: partnerTimeZone,
      });
      overallScore = match.overallScore;
      calculatedCategories = match.categories;
      providerData = match.providerData;
    }
    const limits = getPlanLimits(user.plan);

    const fullAnalysis = {
      overallScore,
      categories: calculatedCategories,
      syntheticDemo: !astrologyProviderConfigured(),
      providerData,
    };

    const record = await prisma.compatibility.create({
      data: {
        userId: user.id,
        partnerName,
        partnerDob,
        partnerTob: partnerTob ? sanitizeString(partnerTob, 10) : null,
        partnerPlace: partnerPlace ? sanitizeString(partnerPlace, 150) : null,
        partnerLatitude,
        partnerLongitude,
        partnerTimeZone,
        score: overallScore,
        analysis: JSON.stringify(fullAnalysis),
      },
    });

    const result: CompatibilityResult = {
      id: record.id,
      partnerName: record.partnerName,
      overallScore: record.score,
      categories: limits.compatibilityFull ? calculatedCategories : null,
      createdAt: record.createdAt.toISOString(),
    };

    return success({ result }, 201);
  } catch (err: unknown) {
    console.error("Compatibility POST error:", err);
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

    const [records, total] = await Promise.all([
      prisma.compatibility.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.compatibility.count({ where: { userId: user.id } }),
    ]);

    const limits = getPlanLimits(user.plan);

    const results: CompatibilityResult[] = records.map((r) => {
      let parsed: { categories?: CompatibilityCategory[] } = {};
      try {
        parsed = JSON.parse(r.analysis);
      } catch {}
      return {
        id: r.id,
        partnerName: r.partnerName,
        overallScore: r.score,
        categories: limits.compatibilityFull ? parsed.categories || null : null,
        createdAt: r.createdAt.toISOString(),
      };
    });

    return success({ results, total, page });
  } catch (err: unknown) {
    console.error("Compatibility GET error:", err);
    return error("Internal server error", 500);
  }
}
