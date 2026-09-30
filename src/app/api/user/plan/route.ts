import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { unauthorized, forbidden } from "@/lib/api-response";

export async function PATCH(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  if (!user) return unauthorized();
  return forbidden("Plans can only be changed by a verified payment webhook");
}
