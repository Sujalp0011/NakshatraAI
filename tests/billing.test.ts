import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { addPlanDuration, isBillablePlan, verifyRazorpayWebhook } from "../src/lib/billing.ts";

test("billing accepts only server-defined paid plans", () => {
  assert.equal(isBillablePlan("premium"), true);
  assert.equal(isBillablePlan("yearly"), true);
  assert.equal(isBillablePlan("free"), false);
  assert.equal(isBillablePlan("admin"), false);
});

test("webhook verification uses the exact raw body", () => {
  process.env.RAZORPAY_WEBHOOK_SECRET = "test-webhook-secret";
  const body = JSON.stringify({ event: "order.paid", value: 1 });
  const signature = crypto.createHmac("sha256", "test-webhook-secret").update(body).digest("hex");
  assert.equal(verifyRazorpayWebhook(body, signature), true);
  assert.equal(verifyRazorpayWebhook(`${body} `, signature), false);
  delete process.env.RAZORPAY_WEBHOOK_SECRET;
});

test("renewals extend an active entitlement instead of replacing it", () => {
  const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
  const extended = addPlanDuration(future, 30);
  assert.equal(extended.getTime(), future.getTime() + 30 * 24 * 60 * 60 * 1000);
});
