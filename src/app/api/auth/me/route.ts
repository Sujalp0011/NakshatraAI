import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { success, unauthorized } from "@/lib/api-response";
import type { UserProfile } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return unauthorized();
  }

  const userProfile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    language: user.language,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : null,
    timeOfBirth: user.timeOfBirth,
    placeOfBirth: user.placeOfBirth,
  };

  return success({ user: userProfile });
}
