import crypto from "node:crypto";

export const BILLING_PLANS = {
  premium: { amount: 29_900, durationDays: 30, label: "Premium 30-day access" },
  yearly: { amount: 199_900, durationDays: 365, label: "Premium 365-day access" },
} as const;

export type BillablePlan = keyof typeof BILLING_PLANS;

export function isBillablePlan(value: unknown): value is BillablePlan {
  return typeof value === "string" && value in BILLING_PLANS;
}

export function requireRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay checkout is not configured");
  return { keyId, keySecret };
}

export function verifyRazorpayWebhook(rawBody: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
}

export function addPlanDuration(currentExpiry: Date | null, days: number): Date {
  const base = currentExpiry && currentExpiry > new Date() ? currentExpiry : new Date();
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}
