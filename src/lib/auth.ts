import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "./prisma";
import type { User } from "@prisma/client";

import { config } from "./config";

const JWT_SECRET_KEY = () => new TextEncoder().encode(config.jwtSecret);

const COOKIE_NAME = "nakshatra-token";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const JWT_ISSUER = "nakshatra-ai";
const JWT_AUDIENCE = "nakshatra-ai-web";

// --- Password ---
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// --- JWT ---
type AuthPayload = { userId: string; email: string; sessionId: string; securityVersion: number };

export async function signToken(payload: AuthPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setJti(payload.sessionId)
    .setExpirationTime("7d")
    .sign(JWT_SECRET_KEY());
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET_KEY(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.sessionId !== "string" ||
      typeof payload.securityVersion !== "number"
    ) return null;
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export async function createSession(user: User, request: Request): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      securityVersion: user.securityVersion,
      userAgent: request.headers.get("user-agent")?.slice(0, 500) || null,
      ipAddress: forwarded || request.headers.get("x-real-ip") || null,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });
  return signToken({
    userId: user.id,
    email: user.email,
    sessionId: session.id,
    securityVersion: user.securityVersion,
  });
}

function tokenFromRequest(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  const cookieToken = cookieHeader?.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))?.[1];
  if (cookieToken) return cookieToken;
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined;
}

async function userForPayload(payload: AuthPayload): Promise<User | null> {
  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  });
  if (
    !session ||
    session.userId !== payload.userId ||
    session.revokedAt ||
    session.expiresAt <= new Date() ||
    session.securityVersion !== payload.securityVersion ||
    session.user.securityVersion !== payload.securityVersion
  ) return null;
  if (session.user.plan !== "free" && session.user.planExpiresAt && session.user.planExpiresAt <= new Date()) {
    return prisma.user.update({
      where: { id: session.user.id },
      data: { plan: "free", planExpiresAt: null },
    });
  }
  return session.user;
}

export async function revokeRequestSession(request: Request): Promise<void> {
  const token = tokenFromRequest(request);
  if (!token) return;
  const payload = await verifyToken(token);
  if (!payload) return;
  await prisma.session.updateMany({
    where: { id: payload.sessionId, userId: payload.userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

// --- Cookie ---
export function setAuthCookie(response: Response, token: string): void {
  response.headers.append("Set-Cookie", [
    `${COOKIE_NAME}=${token}`,
    "HttpOnly",
    `SameSite=Lax`,           // CSRF protection
    `Path=/`,
    `Max-Age=${60 * 60 * 24 * 7}`,
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ].filter(Boolean).join("; "));
}

export function clearAuthCookie(response: Response): void {
  response.headers.append("Set-Cookie", [
    `${COOKIE_NAME}=`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0",
  ].join("; "));
}

// --- Get authenticated user ---

/** For API Route Handlers — reads token from cookie or Authorization header */
export async function getAuthUserFromRequest(request: Request): Promise<User | null> {
  const token = tokenFromRequest(request);
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return userForPayload(payload);
}

/** For Server Components — reads token from next/headers cookies() (Next.js 14 sync) */
export async function getAuthUserFromCookies(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return userForPayload(payload);
}
