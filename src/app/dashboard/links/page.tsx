import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllInviteLinks } from "@/lib/db";
import { hasPermission } from "@/lib/constants";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LinksManager } from "./LinksManager";

export default async function LinksPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasPermission(session.role, "create_links")) redirect("/dashboard");

  const links = getAllInviteLinks();

  return (
    <DashboardLayout user={session}>
      <LinksManager initialLinks={links} />
    </DashboardLayout>
  );
}
