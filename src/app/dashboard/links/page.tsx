import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllInviteLinks } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LinksManager } from "./LinksManager";
import { ReceptionQrPanel } from "./ReceptionQrPanel";

export default async function LinksPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasSessionPermission(session, "create_links")) redirect("/dashboard");

  const links = getAllInviteLinks();
  const canDelete = hasSessionPermission(session, "delete_links");

  return (
    <DashboardLayout user={session}>
      <div className="space-y-8">
        <ReceptionQrPanel />
        <LinksManager initialLinks={links} canDelete={canDelete} />
      </div>
    </DashboardLayout>
  );
}
