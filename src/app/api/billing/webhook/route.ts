import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { addPlanDuration, BILLING_PLANS, isBillablePlan, verifyRazorpayWebhook } from "@/lib/billing";
import { badRequest, error, success, unauthorized } from "@/lib/api-response";

type RazorpayEvent = {
  event?: string;
  payload?: {
    order?: { entity?: { id?: string; amount?: number; currency?: string } };
    payment?: { entity?: { id?: string; order_id?: string; captured?: boolean; status?: string } };
  };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!verifyRazorpayWebhook(rawBody, request.headers.get("x-razorpay-signature"))) {
    return unauthorized("Invalid webhook signature");
  }
  const eventId = request.headers.get("x-razorpay-event-id");
  if (!eventId || eventId.length > 200) return badRequest("Missing webhook event ID");

  try {
    const event = JSON.parse(rawBody) as RazorpayEvent;
    if (event.event !== "order.paid" && event.event !== "payment.captured") {
      await prisma.webhookEvent.create({ data: { provider: "razorpay", eventId, type: event.event || "unknown" } });
      return success({ received: true });
    }
    const orderEntity = event.payload?.order?.entity;
    const paymentEntity = event.payload?.payment?.entity;
    const providerOrderId = orderEntity?.id || paymentEntity?.order_id;
    if (!providerOrderId || !paymentEntity?.id) return badRequest("Malformed payment event");

    await prisma.$transaction(async (tx) => {
      await tx.webhookEvent.create({ data: { provider: "razorpay", eventId, type: event.event! } });
      const order = await tx.paymentOrder.findUnique({ where: { providerOrderId }, include: { user: true } });
      if (!order || !isBillablePlan(order.plan)) throw new Error("Unknown billing order");
      if (orderEntity && (orderEntity.amount !== order.amount || orderEntity.currency !== order.currency)) {
        throw new Error("Billing amount mismatch");
      }
      if (order.status === "paid") return;
      const plan = BILLING_PLANS[order.plan];
      await Promise.all([
        tx.paymentOrder.update({
          where: { id: order.id },
          data: { status: "paid", providerPaymentId: paymentEntity.id, paidAt: new Date() },
        }),
        tx.user.update({
          where: { id: order.userId },
          data: { plan: order.plan, planExpiresAt: addPlanDuration(order.user.planExpiresAt, plan.durationDays) },
        }),
      ]);
    });
    return success({ received: true });
  } catch (cause) {
    if (cause instanceof Prisma.PrismaClientKnownRequestError && cause.code === "P2002") {
      return success({ received: true, duplicate: true });
    }
    console.error("Razorpay webhook error:", cause);
    return error("Webhook processing failed", 500);
  }
}
