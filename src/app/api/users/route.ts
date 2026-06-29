import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllUsers, createUser, deleteUser } from "@/lib/db";
import { hasSessionPermission } from "@/lib/constants";

export async function GET() {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "manage_users")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "manage_users")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { username, password, role, nameAr, nameEn, customPermissions } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const user = createUser(username, password, role, nameAr || "", nameEn || "", customPermissions ?? null);
    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasSessionPermission(session, "manage_users")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await request.json();
  const success = deleteUser(id);
  if (!success) {
    return NextResponse.json({ error: "Cannot delete user" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
