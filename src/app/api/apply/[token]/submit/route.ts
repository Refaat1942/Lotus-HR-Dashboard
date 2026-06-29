import { NextRequest, NextResponse } from "next/server";
import {
  getCandidateByToken,
  submitCandidateApplication,
  markInviteLinkUsed,
  isLinkUsable,
} from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const check = isLinkUsable(token);

  if (!check.usable) {
    return NextResponse.json({ error: check.reason || "invalid" }, { status: check.reason === "invalid" ? 404 : 410 });
  }

  const candidate = getCandidateByToken(token);
  if (!candidate) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (candidate.status !== "pending") {
    return NextResponse.json({ error: "used" }, { status: 410 });
  }

  const body = await request.json();
  markInviteLinkUsed(token, candidate.id);
  const updated = submitCandidateApplication(candidate.id, body);

  return NextResponse.json({ success: true, candidate: updated });
}
