import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { deleteInviteLink } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "delete_links")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const success = deleteInviteLink(id);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
