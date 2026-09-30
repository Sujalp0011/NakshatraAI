import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserFromRequest, clearAuthCookie, verifyPassword } from "@/lib/auth";
import { sanitizeString, parseDateOnly, isValidTime, dateOnlyString, isValidTimeZone } from "@/lib/validate";
import { success, unauthorized, badRequest, error } from "@/lib/api-response";
import type { UserProfile } from "@/types/api";
import { requireSameOrigin } from "@/lib/request-security";

export const dynamic = "force-dynamic";

const ALLOWED_LANGUAGES = ["en", "hi", "es", "ar", "fr"];

export async function GET(request: NextRequest) {
  const user = await getAuthUserFromRequest(request);
  if (!user) return unauthorized();

  const userProfile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    language: user.language,
    dateOfBirth: user.dateOfBirth ? dateOnlyString(user.dateOfBirth) : null,
    timeOfBirth: user.timeOfBirth,
    placeOfBirth: user.placeOfBirth,
    timeZone: user.timeZone,
    latitude: user.latitude,
    longitude: user.longitude,
    birthTimeKnown: user.birthTimeKnown,
  };

  return success({ user: userProfile });
}

export async function PATCH(request: NextRequest) {
  try {
    const csrfError = requireSameOrigin(request);
    if (csrfError) return csrfError;
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();

    const body = await request.json();
    const { name, language, dateOfBirth, timeOfBirth, placeOfBirth, timeZone, latitude, longitude, birthTimeKnown } = body || {};

    const updateData: Record<string, unknown> = {};

    if (typeof name === "string") {
      const sanitized = sanitizeString(name, 100);
      if (!sanitized) return badRequest("Name cannot be empty");
      updateData.name = sanitized;
    }

    if (typeof language === "string") {
      if (ALLOWED_LANGUAGES.includes(language)) {
        updateData.language = language;
      } else {
        return badRequest("Invalid language choice");
      }
    }

    if (dateOfBirth !== undefined) {
      if (!dateOfBirth) {
        updateData.dateOfBirth = null;
      } else {
        const parsedDate = parseDateOnly(dateOfBirth);
        if (!parsedDate || parsedDate > new Date()) {
          return badRequest("Invalid date of birth");
        }
        updateData.dateOfBirth = parsedDate;
      }
    }

    if (timeOfBirth !== undefined) {
      if (!timeOfBirth) {
        updateData.timeOfBirth = null;
      } else if (isValidTime(timeOfBirth)) {
        updateData.timeOfBirth = timeOfBirth;
      } else {
        return badRequest("Time of birth must use HH:mm format");
      }
    }

    if (birthTimeKnown !== undefined) {
      if (typeof birthTimeKnown !== "boolean") return badRequest("Invalid birth-time precision value");
      updateData.birthTimeKnown = birthTimeKnown;
      if (!birthTimeKnown) updateData.timeOfBirth = null;
    }

    if (placeOfBirth !== undefined) {
      if (!placeOfBirth) {
        updateData.placeOfBirth = null;
      } else if (typeof placeOfBirth === "string") {
        // TODO: Geocode to lat/lng using Google Maps API
        const sanitized = sanitizeString(placeOfBirth, 200);
        if (!sanitized) return badRequest("Place of birth cannot be empty");
        updateData.placeOfBirth = sanitized;
      } else {
        return badRequest("Invalid place of birth");
      }
    }


    if (timeZone !== undefined) {
      if (timeZone === null || timeZone === "") updateData.timeZone = null;
      else if (isValidTimeZone(timeZone)) updateData.timeZone = timeZone;
      else return badRequest("Invalid IANA time zone");
    }

    if (latitude !== undefined || longitude !== undefined) {
      if (latitude === null && longitude === null) {
        updateData.latitude = null;
        updateData.longitude = null;
      } else if (
        typeof latitude === "number" && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
        typeof longitude === "number" && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180
      ) {
        updateData.latitude = latitude;
        updateData.longitude = longitude;
      } else return badRequest("Invalid birth coordinates");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const userProfile: UserProfile = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      plan: updatedUser.plan,
      language: updatedUser.language,
      dateOfBirth: updatedUser.dateOfBirth ? dateOnlyString(updatedUser.dateOfBirth) : null,
      timeOfBirth: updatedUser.timeOfBirth,
      placeOfBirth: updatedUser.placeOfBirth,
      timeZone: updatedUser.timeZone,
      latitude: updatedUser.latitude,
      longitude: updatedUser.longitude,
      birthTimeKnown: updatedUser.birthTimeKnown,
    };

    return success({ user: userProfile });
  } catch (err: unknown) {
    console.error("Profile patch error:", err);
    return error("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const csrfError = requireSameOrigin(request);
    if (csrfError) return csrfError;
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();

    const body = await request.json().catch(() => ({}));
    if (typeof body.password !== "string" || !(await verifyPassword(body.password, user.passwordHash))) {
      return unauthorized("Current password is required to delete your account");
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    const response = success({ message: "Account deleted successfully" });
    clearAuthCookie(response);
    return response;
  } catch (err: unknown) {
    console.error("Account delete error:", err);
    return error("Internal server error", 500);
  }
}
