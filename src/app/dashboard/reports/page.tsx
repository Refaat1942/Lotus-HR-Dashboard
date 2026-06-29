import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getReportData } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ReportsPage } from "./ReportsPage";

export default async function ReportsRoute() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasSessionPermission(session, "view_reports")) redirect("/dashboard");

  const data = getReportData();

  return (
    <DashboardLayout user={session}>
      <ReportsPage data={data} />
    </DashboardLayout>
  );
}
