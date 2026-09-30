import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUserFromRequest } from "@/lib/auth";
import { getPlanLimits } from "@/lib/plans";
import { success, unauthorized, forbidden, error } from "@/lib/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUserFromRequest(request);
    if (!user) return unauthorized();

    const { id } = await params;
    const kundli = await prisma.kundli.findUnique({
      where: { id },
    });

    if (!kundli) {
      return error("Kundli not found", 404);
    }

    if (kundli.userId !== user.id) {
      return forbidden("You do not have permission to view this Kundli");
    }

    const limits = getPlanLimits(user.plan);

    return success({
      kundli: {
        id: kundli.id,
        chartType: kundli.chartType,
        createdAt: kundli.createdAt.toISOString(),
        watermarked: limits.kundliWatermark,
        chartData: JSON.parse(kundli.chartData),
        birthData: JSON.parse(kundli.birthData),
      },
    });
  } catch (err: unknown) {
    console.error("Kundli detail error:", err);
    return error("Internal server error", 500);
  }
}
