import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllUsers } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UsersManager } from "./UsersManager";

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasSessionPermission(session, "manage_users")) redirect("/dashboard");

  const users = getAllUsers();

  return (
    <DashboardLayout user={session}>
      <UsersManager initialUsers={users} />
    </DashboardLayout>
  );
}
