import { getAuthUserFromCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { utcPeriod } from "@/lib/request-security";

export default async function DashboardPage() {
  const user = await getAuthUserFromCookies();
  if (!user) return null;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [kundliCount, chatUsage, todayPrediction] = await Promise.all([
    prisma.kundli.count({ where: { userId: user.id } }),
    prisma.dailyUsage.findUnique({
      where: { userId_kind_period: { userId: user.id, kind: "chat", period: utcPeriod() } },
    }),
    prisma.prediction.findFirst({
      where: { userId: user.id, type: "daily", date: { gte: startOfToday } },
    }),
  ]);

  return (
    <DashboardClient
      user={{
        name: user.name,
        plan: user.plan,
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : null,
      }}
      kundliCount={kundliCount}
      todayChatCount={chatUsage?.count ?? 0}
      todayPredictionExists={!!todayPrediction}
    />
  );
}
