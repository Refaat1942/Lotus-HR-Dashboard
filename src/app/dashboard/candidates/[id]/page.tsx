import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCandidateById } from "@/lib/db";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CandidateDetail } from "./CandidateDetail";

export default async function CandidateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const candidate = getCandidateById(id);
  if (!candidate) notFound();

  return (
    <DashboardLayout user={session}>
      <CandidateDetail candidate={candidate} userRole={session.role} />
    </DashboardLayout>
  );
}
