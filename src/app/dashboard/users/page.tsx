import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllUsers } from "@/lib/db";
import { hasPermission } from "@/lib/constants";
import { DashboardLayout } from "@/components/DashboardLayout";
import { UsersManager } from "./UsersManager";

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasPermission(session.role, "manage_users")) redirect("/dashboard");

  const users = getAllUsers();

  return (
    <DashboardLayout user={session}>
      <UsersManager initialUsers={users} />
    </DashboardLayout>
  );
}
