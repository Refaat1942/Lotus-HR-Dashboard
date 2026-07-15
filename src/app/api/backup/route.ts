import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasSessionPermission } from "@/lib/constants";
import { getBackupMeta, runDatabaseBackup } from "@/lib/backup";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "manage_settings")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({ meta: getBackupMeta() });
}

export async function POST() {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "manage_settings")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const meta = runDatabaseBackup();
    return NextResponse.json({ success: true, meta });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Backup failed" },
      { status: 500 }
    );
  }
}
