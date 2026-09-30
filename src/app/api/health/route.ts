import prisma from "@/lib/prisma";
import { error, success } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return success({ status: "ok", timestamp: new Date().toISOString() });
  } catch {
    return error("Database unavailable", 503);
  }
}
