import { redirect } from "next/navigation";
import { getAuthUserFromCookies } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import type { UserProfile } from "@/types/api";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUserFromCookies();

  if (!user) {
    redirect("/login");
  }

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

  return <DashboardShell user={userProfile}>{children}</DashboardShell>;
}
