import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createInviteLink, getAllInviteLinks } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = getAllInviteLinks();
  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "create_links")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { positionAppliedFor, expiresInDays } = await request.json();
  if (!positionAppliedFor) {
    return NextResponse.json({ error: "Position is required" }, { status: 400 });
  }

  const link = createInviteLink(positionAppliedFor, session.id, expiresInDays);
  return NextResponse.json({ link });
}
