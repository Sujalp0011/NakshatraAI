import assert from "node:assert/strict";
import test from "node:test";
import { getPlanLimits, isPremium, isWithinLimit } from "../src/lib/plans.ts";

test("unknown plans fail closed to free entitlements", () => {
  assert.deepEqual(getPlanLimits("administrator"), getPlanLimits("free"));
  assert.equal(isPremium("administrator"), false);
});

test("finite and unlimited quota semantics are explicit", () => {
  assert.equal(isWithinLimit(5, 4), true);
  assert.equal(isWithinLimit(5, 5), false);
  assert.equal(isWithinLimit(-1, 1_000_000), true);
});
