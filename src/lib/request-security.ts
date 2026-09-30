import { NextRequest } from "next/server";
import { forbidden } from "./api-response";

/** Require cookie-authenticated mutations to originate from this application. */
export function requireSameOrigin(request: NextRequest) {
  // Bearer clients do not use ambient cookie credentials and are not vulnerable to CSRF.
  if (request.headers.get("authorization")?.startsWith("Bearer ")) return null;

  const origin = request.headers.get("origin");
  if (!origin) return forbidden("Missing request origin");

  try {
    if (new URL(origin).origin !== request.nextUrl.origin) {
      return forbidden("Cross-origin request rejected");
    }
  } catch {
    return forbidden("Invalid request origin");
  }

  return null;
}

export function utcPeriod(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
