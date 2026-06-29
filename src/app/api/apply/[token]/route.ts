import { NextRequest, NextResponse } from "next/server";
import { getInviteLinkByToken, getCandidateByToken, getSettings, isLinkUsable } from "@/lib/db";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const check = isLinkUsable(token);

  if (!check.usable) {
    const link = getInviteLinkByToken(token);
    const status = check.reason === "invalid" ? 404 : 410;
    return NextResponse.json({ error: check.reason, valid: false, link }, { status });
  }

  const link = getInviteLinkByToken(token)!;
  const candidate = getCandidateByToken(token);
  const settings = getSettings();

  return NextResponse.json({
    valid: true,
    link,
    candidate,
    fieldVisibility: settings.fieldVisibility,
  });
}
