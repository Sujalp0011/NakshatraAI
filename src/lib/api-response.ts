import { NextResponse } from "next/server";

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function unauthorized(message = "Authentication required") {
  return error(message, 401);
}

export function forbidden(message = "Access denied", upgradeRequired = false) {
  return error(message, 403, upgradeRequired ? { upgradeRequired: true } : undefined);
}

export function badRequest(message: string) {
  return error(message, 400);
}

export function conflict(message: string) {
  return error(message, 409);
}

export function tooMany(message: string, upgradeRequired = false) {
  return error(message, 429, upgradeRequired ? { upgradeRequired: true } : undefined);
}
