import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { updateBranding } from "@/lib/db";
import { hasPermission } from "@/lib/constants";
import {
  ALLOWED_LOGO_TYPES,
  MAX_LOGO_SIZE,
  LOGO_BASENAME,
} from "@/lib/branding";
import {
  UPLOADS_DIR,
  deleteCustomLogo,
  ensureUploadsDir,
} from "@/lib/branding-server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "manage_settings")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("logo");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_LOGO_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Invalid file type. Use PNG, JPG, WEBP, or SVG." },
        { status: 400 }
      );
    }

    if (file.size > MAX_LOGO_SIZE) {
      return NextResponse.json({ error: "File too large. Max 2 MB." }, { status: 400 });
    }

    ensureUploadsDir();
    deleteCustomLogo();

    const ext = ALLOWED_LOGO_TYPES[file.type];
    const filename = `${LOGO_BASENAME}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const now = new Date().toISOString();
    const settings = updateBranding({
      customLogo: true,
      logoUpdatedAt: now,
      logoMimeType: file.type,
    });

    return NextResponse.json({
      success: true,
      branding: settings.branding,
      logoUrl: `/api/branding/logo?t=${now}`,
    });
  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "manage_settings")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  deleteCustomLogo();
  const settings = updateBranding({
    customLogo: false,
    logoUpdatedAt: null,
    logoMimeType: null,
  });

  return NextResponse.json({ success: true, branding: settings.branding });
}
