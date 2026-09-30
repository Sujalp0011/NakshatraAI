import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createSession, setAuthCookie } from "@/lib/auth";
import { sanitizeString } from "@/lib/validate";
import { success, unauthorized, badRequest, tooMany, error } from "@/lib/api-response";
import type { UserProfile } from "@/types/api";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email: rawEmail, password: rawPassword } = body || {};

    if (!rawEmail || !rawPassword || typeof rawEmail !== "string" || typeof rawPassword !== "string") {
      return badRequest("Email and password are required");
    }

    const email = sanitizeString(rawEmail.toLowerCase(), 150);
    const password = rawPassword;

    const rateLimit = await consumeRateLimit({
      key: `${getClientIp(request)}:${email}`,
      action: "login",
      limit: 8,
      windowSeconds: 15 * 60,
    });
    if (!rateLimit.allowed) {
      return tooMany("Too many login attempts. Try again later.");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return unauthorized("Invalid credentials");
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return unauthorized("Invalid credentials");
    }

    const token = await createSession(user, request);

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

    const response = success({ user: userProfile });
    setAuthCookie(response, token);
    return response;
  } catch (err: unknown) {
    console.error("Login error:", err);
    return error("Internal server error", 500);
  }
}
