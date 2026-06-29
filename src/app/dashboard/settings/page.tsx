import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SettingsManager } from "./SettingsManager";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasSessionPermission(session, "manage_settings")) redirect("/dashboard");

  const settings = getSettings();

  return (
    <DashboardLayout user={session}>
      <SettingsManager settings={settings} />
    </DashboardLayout>
  );
}
