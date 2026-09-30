import assert from "node:assert/strict";
import test from "node:test";
import {
  dateOnlyString,
  isValidTime,
  parseDateOnly,
  parsePositiveInt,
  validateEmail,
  validatePassword,
} from "../src/lib/validate.ts";

test("parsePositiveInt rejects malformed pagination", () => {
  assert.equal(parsePositiveInt("abc", 1, 50), null);
  assert.equal(parsePositiveInt("0", 1, 50), null);
  assert.equal(parsePositiveInt("-1", 1, 50), null);
  assert.equal(parsePositiveInt("500", 1, 50), 50);
  assert.equal(parsePositiveInt(null, 10, 50), 10);
});

test("parseDateOnly strictly validates calendar dates in UTC", () => {
  const leapDay = parseDateOnly("2024-02-29");
  assert.ok(leapDay);
  assert.equal(dateOnlyString(leapDay), "2024-02-29");
  assert.equal(parseDateOnly("2023-02-29"), null);
  assert.equal(parseDateOnly("2024-2-9"), null);
  assert.equal(parseDateOnly("not-a-date"), null);
});

test("birth time validation only accepts HH:mm", () => {
  assert.equal(isValidTime("00:00"), true);
  assert.equal(isValidTime("23:59"), true);
  assert.equal(isValidTime("24:00"), false);
  assert.equal(isValidTime("9:30"), false);
});

test("credential validation enforces baseline rules", () => {
  assert.equal(validateEmail("person@example.com"), true);
  assert.equal(validateEmail("broken@"), false);
  assert.equal(validatePassword("1234567").valid, false);
  assert.equal(validatePassword("correct-horse").valid, true);
});
