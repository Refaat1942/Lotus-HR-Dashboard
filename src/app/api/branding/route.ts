import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";

export async function GET() {
  const settings = getSettings();
  const { branding } = settings;

  return NextResponse.json({
    hasCustomLogo: branding.customLogo,
    logoUpdatedAt: branding.logoUpdatedAt,
    logoUrl: branding.customLogo && branding.logoUpdatedAt
      ? `/api/branding/logo?t=${branding.logoUpdatedAt}`
      : null,
  });
}
