import { NextRequest, NextResponse } from "next/server";
import { getInviteLinkByToken, getCandidateByToken } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const link = getInviteLinkByToken(token);

  if (!link) {
    return NextResponse.json({ error: "invalid", valid: false }, { status: 404 });
  }

  if (link.usedAt) {
    return NextResponse.json({ error: "used", valid: false, link }, { status: 410 });
  }

  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return NextResponse.json({ error: "expired", valid: false, link }, { status: 410 });
  }

  const candidate = getCandidateByToken(token);
  return NextResponse.json({ valid: true, link, candidate });
}
