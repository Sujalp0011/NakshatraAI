import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { badRequest, error, success, tooMany, unauthorized } from "@/lib/api-response";
import { requireSameOrigin } from "@/lib/request-security";
import { BILLING_PLANS, type BillablePlan, isBillablePlan, requireRazorpayConfig } from "@/lib/billing";
import { consumeRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const csrfError = requireSameOrigin(request);
    if (csrfError) return csrfError;
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();
    const body = await request.json().catch(() => ({}));
    if (!isBillablePlan(body.plan)) return badRequest("Invalid paid plan");
    const plan = body.plan as BillablePlan;

    const rateLimit = await consumeRateLimit({
      key: user.id, action: "billing_checkout", limit: 10, windowSeconds: 60 * 60,
    });
    if (!rateLimit.allowed) return tooMany("Too many checkout attempts");

    const config = requireRazorpayConfig();
    const selected = BILLING_PLANS[plan];
    const localId = crypto.randomUUID();
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.keyId}:${config.keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: selected.amount,
        currency: "INR",
        receipt: localId.slice(0, 40),
        notes: { userId: user.id, plan },
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Razorpay order creation failed (${response.status})`);
    const providerOrder = await response.json() as { id?: string; amount?: number; currency?: string };
    if (!providerOrder.id || providerOrder.amount !== selected.amount || providerOrder.currency !== "INR") {
      throw new Error("Razorpay returned an invalid order");
    }

    await prisma.paymentOrder.create({
      data: {
        id: localId,
        userId: user.id,
        providerOrderId: providerOrder.id,
        plan,
        amount: selected.amount,
      },
    });
    return success({
      checkout: {
        keyId: config.keyId,
        orderId: providerOrder.id,
        amount: selected.amount,
        currency: "INR",
        name: "NakshatraAI",
        description: selected.label,
      },
    }, 201);
  } catch (cause) {
    console.error("Billing checkout error:", cause);
    const message = cause instanceof Error && cause.message.includes("not configured")
      ? cause.message
      : "Unable to create checkout";
    return error(message, message.includes("not configured") ? 503 : 502);
  }
}
