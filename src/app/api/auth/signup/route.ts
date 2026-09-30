import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createSession, setAuthCookie } from "@/lib/auth";
import { validateEmail, validatePassword, sanitizeString } from "@/lib/validate";
import { success, badRequest, conflict, error, tooMany } from "@/lib/api-response";
import type { UserProfile } from "@/types/api";
import { Prisma } from "@prisma/client";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const rateLimit = await consumeRateLimit({
      key: getClientIp(request), action: "signup", limit: 5, windowSeconds: 60 * 60,
    });
    if (!rateLimit.allowed) return tooMany("Too many signup attempts. Try again later.");
    const body = await request.json();
    const { name: rawName, email: rawEmail, password: rawPassword } = body || {};

    if (!rawName || typeof rawName !== "string") {
      return badRequest("Name is required");
    }
    if (!rawEmail || typeof rawEmail !== "string") {
      return badRequest("Email is required");
    }
    if (!rawPassword || typeof rawPassword !== "string") {
      return badRequest("Password is required");
    }

    const name = sanitizeString(rawName, 100);
    const email = sanitizeString(rawEmail.toLowerCase(), 150);
    const password = rawPassword;

    if (!name) {
      return badRequest("Name cannot be empty");
    }
    if (!validateEmail(email)) {
      return badRequest("Invalid email address format");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return badRequest(passwordValidation.message || "Invalid password");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return conflict("Email already registered");
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        plan: "free",
        language: "en",
      },
    });

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

    const response = success({ user: userProfile }, 201);
    setAuthCookie(response, token);
    return response;
  } catch (err: unknown) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return conflict("Email already registered");
    }
    console.error("Signup error:", err);
    return error("Internal server error", 500);
  }
}
