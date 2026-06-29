import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateUser, getUserById } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";
import type { Permission, UserRole } from "@/lib/types";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "manage_users")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { username, password, role, nameAr, nameEn, customPermissions } = body as {
    username?: string;
    password?: string;
    role?: UserRole;
    nameAr?: string;
    nameEn?: string;
    customPermissions?: Permission[] | null;
  };

  const existing = getUserById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.username === "admin" && session.id !== existing.id && role && role !== "admin") {
    return NextResponse.json({ error: "Cannot change admin role" }, { status: 400 });
  }

  try {
    const user = updateUser(id, {
      username,
      password: password || undefined,
      role,
      nameAr,
      nameEn,
      customPermissions,
    });

    if (!user) {
      return NextResponse.json({ error: "Update failed" }, { status: 400 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }
}
