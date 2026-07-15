import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url_required" }, { status: 400 });
  }

  try {
    const png = await QRCode.toBuffer(url, {
      width: 400,
      margin: 2,
      color: { dark: "#083f23", light: "#ffffff" },
    });

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "qr_failed" }, { status: 500 });
  }
}
