import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/db";
import { createSession, COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

function cookieOptions() {
  // Allow HTTP on VPS (port 16310) — set COOKIE_SECURE=true only when using HTTPS
  const secure = process.env.COOKIE_SECURE === "true";

  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24,
    path: "/",
  };
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const trimmedUsername = String(username || "").trim();

    if (!trimmedUsername || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const user = verifyPassword(trimmedUsername, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSession({
      id: user.id,
      username: user.username,
      role: user.role,
      nameAr: user.nameAr,
      nameEn: user.nameEn,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        nameAr: user.nameAr,
        nameEn: user.nameEn,
      },
    });

    response.cookies.set(COOKIE_NAME, token, cookieOptions());

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
