import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";

export async function GET() {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "manage_settings")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return NextResponse.json({ settings: getSettings() });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "manage_settings")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const settings = updateSettings(body);
  return NextResponse.json({ settings });
}
