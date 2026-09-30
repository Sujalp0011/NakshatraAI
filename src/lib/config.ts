function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`FATAL: Missing required environment variable: ${name}`);
  }
  return value;
}

export function getJwtSecret(): string {
  return requireEnv("JWT_SECRET");
}

export const config = {
  get jwtSecret() {
    return getJwtSecret();
  },
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  isProduction: process.env.NODE_ENV === "production",
  demoAstrologyEnabled: process.env.ENABLE_DEMO_ASTROLOGY === "true",
} as const;
