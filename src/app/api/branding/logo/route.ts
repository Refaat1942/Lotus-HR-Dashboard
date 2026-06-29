import { NextResponse } from "next/server";
import fs from "fs";
import { getLogoFilePath } from "@/lib/branding-server";
import { getSettings } from "@/lib/db";

export async function GET() {
  const settings = getSettings();
  if (!settings.branding.customLogo) {
    return NextResponse.json({ error: "No custom logo" }, { status: 404 });
  }

  const filePath = getLogoFilePath();
  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Logo file not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const mimeType = settings.branding.logoMimeType || "image/png";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
