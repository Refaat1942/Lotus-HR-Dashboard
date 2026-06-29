import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllCandidates } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CandidatesList } from "./CandidatesList";

export default async function CandidatesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const candidates = getAllCandidates();

  return (
    <DashboardLayout user={session}>
      <CandidatesList initialCandidates={candidates} />
    </DashboardLayout>
  );
}
