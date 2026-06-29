import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllCandidates, getDashboardStats } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = getAllCandidates();
  const stats = getDashboardStats();
  return NextResponse.json({ candidates, stats });
}
