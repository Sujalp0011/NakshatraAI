import { clearAuthCookie, revokeRequestSession } from "@/lib/auth";
import { success } from "@/lib/api-response";
import { NextRequest } from "next/server";
import { requireSameOrigin } from "@/lib/request-security";

export async function POST(request: NextRequest) {
  const csrfError = requireSameOrigin(request);
  if (csrfError) return csrfError;
  await revokeRequestSession(request);
  const response = success({ message: "Logged out successfully" });
  clearAuthCookie(response);
  return response;
}
