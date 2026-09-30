export type PlanType = "free" | "premium" | "yearly";

// Use -1 to mean "unlimited". Do NOT use Infinity — it is not JSON-serializable.
export const PLAN_LIMITS = {
  free: {
    kundliWatermark: true,
    predictionDaysBack: 3,
    chatMessagesPerDay: 5,
    compatibilityFull: false,
    remediesPerWeek: 2,
    dashaAccess: false,
    showAds: true,
  },
  premium: {
    kundliWatermark: false,
    predictionDaysBack: -1,
    chatMessagesPerDay: -1,
    compatibilityFull: true,
    remediesPerWeek: -1,
    dashaAccess: true,
    showAds: false,
  },
  yearly: {
    kundliWatermark: false,
    predictionDaysBack: -1,
    chatMessagesPerDay: -1,
    compatibilityFull: true,
    remediesPerWeek: -1,
    dashaAccess: true,
    showAds: false,
  },
} as const;

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan as PlanType] ?? PLAN_LIMITS.free;
}

export function isPremium(plan: string): boolean {
  return plan === "premium" || plan === "yearly";
}

/** Check if a usage count is within the plan limit. -1 means unlimited. */
export function isWithinLimit(limit: number, currentCount: number): boolean {
  return limit === -1 || currentCount < limit;
}
