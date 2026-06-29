import { NextRequest, NextResponse } from "next/server";
import {
  getInviteLinkByToken,
  getCandidateByToken,
  submitCandidateApplication,
  markInviteLinkUsed,
} from "@/lib/db";

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const link = getInviteLinkByToken(token);

  if (!link) {
    return NextResponse.json({ error: "invalid" }, { status: 404 });
  }

  if (link.usedAt) {
    return NextResponse.json({ error: "used" }, { status: 410 });
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  const candidate = getCandidateByToken(token);
  if (!candidate) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await request.json();
  const updated = submitCandidateApplication(candidate.id, body);
  markInviteLinkUsed(token, candidate.id);

  return NextResponse.json({ success: true, candidate: updated });
}
