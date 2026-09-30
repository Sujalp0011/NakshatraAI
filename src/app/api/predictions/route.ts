import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { getPlanLimits } from "@/lib/plans";
import { success, unauthorized, forbidden, error } from "@/lib/api-response";
import type { PredictionData } from "@/types/api";
import { parseDateOnly, dateOnlyString } from "@/lib/validate";
import { config } from "@/lib/config";
import { astrologyProviderConfigured, generateSignPrediction } from "@/lib/astrology-provider";

export const dynamic = "force-dynamic";

// // TODO: Replace with real transit astrology calculation engine
const PREDICTION_TEMPLATES: PredictionData[] = [
  {
    summary: "Jupiter's favorable aspect on your 5th house brings creative energy and intellectual clarity today.",
    health: "Mars transit suggests high energy levels. Focus on physical workouts and drinking plenty of water.",
    career: "Mercury's position favors effective communication. An excellent day for client presentations and negotiations.",
    love: "Venus in your 7th house creates harmony and warmth in intimate partnerships.",
    finance: "Saturn counsels financial prudence. Avoid impulsive stock trades or large unverified purchases.",
    luckyColor: "Saffron",
    luckyNumber: 7,
    luckyDirection: "Northeast",
    overallRating: 4,
  },
  {
    summary: "The Moon transit through your 9th house enhances your intuition and philosophical perspective.",
    health: "Vitality is steady. Practice mindfulness or meditation to clear minor mental fatigue.",
    career: "Collaborative projects move forward smoothly. Sun's alignment rewards your hard work.",
    love: "Honest communication resolves recent misunderstandings. Single users may feel drawn to someone new.",
    finance: "Favorable planetary influences suggest minor unexpected financial gains or bonus approval.",
    luckyColor: "Emerald Green",
    luckyNumber: 3,
    luckyDirection: "East",
    overallRating: 5,
  },
  {
    summary: "Rahu's influence calls for careful attention to details before signing any new agreements.",
    health: "Take short breaks to reduce eye strain and maintain proper physical posture.",
    career: "Focus on completing existing pending tasks rather than starting ambitious new initiatives today.",
    love: "Patience is essential today. Give your partner space and listen carefully without immediate judgment.",
    finance: "Budgeting and expense auditing are recommended today. Postpone luxury investments.",
    luckyColor: "Royal Blue",
    luckyNumber: 9,
    luckyDirection: "North",
    overallRating: 3,
  },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();
    if (!astrologyProviderConfigured() && !config.demoAstrologyEnabled) return error("Prediction engine is not configured", 503);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "daily";
    if (!(["daily", "weekly", "monthly"] as const).includes(type as "daily" | "weekly" | "monthly")) {
      return error("Invalid prediction type", 400);
    }
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];

    const targetDate = parseDateOnly(dateStr);
    if (!targetDate) {
      return error("Invalid date format. Use YYYY-MM-DD", 400);
    }

    const today = parseDateOnly(new Date().toISOString().slice(0, 10))!;
    if (targetDate > today) return error("Future predictions are not available", 400);

    const daysDiff = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    const limits = getPlanLimits(user.plan);

    if (daysDiff > 0 && limits.predictionDaysBack !== -1 && daysDiff > limits.predictionDaysBack) {
      return forbidden("Upgrade to Premium for full prediction history", true);
    }

    let prediction = await prisma.prediction.findUnique({
      where: {
        userId_type_date: {
          userId: user.id,
          type,
          date: targetDate,
        },
      },
    });

    let contentData: PredictionData;

    if (prediction) {
      try {
        contentData = JSON.parse(prediction.content);
      } catch {
        contentData = PREDICTION_TEMPLATES[0];
      }
    } else {
      if (targetDate.getTime() !== today.getTime() && astrologyProviderConfigured()) {
        return error("A verified historical prediction is not available for this date", 404);
      }
      const hashInput = `${user.id}_${type}_${dateStr}`;
      let hash = 0;
      for (let i = 0; i < hashInput.length; i++) {
        hash = (hash << 5) - hash + hashInput.charCodeAt(i);
        hash |= 0;
      }
      const templateIndex = Math.abs(hash) % PREDICTION_TEMPLATES.length;
      if (astrologyProviderConfigured()) {
        const latestKundli = await prisma.kundli.findFirst({
          where: { userId: user.id, chartType: "vedic" },
          orderBy: { createdAt: "desc" },
        });
        if (!latestKundli) return error("Generate a verified Vedic Kundli before requesting predictions", 400);
        let moonSign = "";
        try { moonSign = JSON.parse(latestKundli.chartData).moonSign || ""; } catch {}
        if (!moonSign) return error("The saved Kundli does not contain a Moon sign", 422);
        contentData = await generateSignPrediction(moonSign, type as "daily" | "weekly" | "monthly");
      } else {
        contentData = { ...PREDICTION_TEMPLATES[templateIndex], syntheticDemo: true } as PredictionData;
      }

      prediction = await prisma.prediction.create({
        data: {
          userId: user.id,
          type,
          date: targetDate,
          content: JSON.stringify(contentData),
        },
      });
    }

    return success({
      prediction: {
        id: prediction.id,
        type: prediction.type,
        date: dateOnlyString(prediction.date),
        content: contentData,
      },
    });
  } catch (err: unknown) {
    console.error("Prediction error:", err);
    return error("Internal server error", 500);
  }
}
