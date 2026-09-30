import prisma from "./prisma";

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

function fixedWindowPeriod(windowSeconds: number, now = Date.now()): string {
  return String(Math.floor(now / (windowSeconds * 1000)));
}

export async function consumeRateLimit(options: {
  key: string;
  action: string;
  limit: number;
  windowSeconds: number;
}): Promise<{ allowed: boolean; remaining: number }> {
  const period = fixedWindowPeriod(options.windowSeconds);
  const record = await prisma.rateLimit.upsert({
    where: { key_action_period: { key: options.key, action: options.action, period } },
    create: { key: options.key, action: options.action, period, count: 1 },
    update: { count: { increment: 1 } },
  });

  return {
    allowed: record.count <= options.limit,
    remaining: Math.max(0, options.limit - record.count),
  };
}
