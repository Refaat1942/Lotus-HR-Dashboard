import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardStats, getAllCandidates } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardHome } from "./DashboardHome";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const stats = getDashboardStats();
  const candidates = getAllCandidates().slice(0, 6);

  return (
    <DashboardLayout user={session}>
      <DashboardHome stats={stats} recentCandidates={candidates} />
    </DashboardLayout>
  );
}
