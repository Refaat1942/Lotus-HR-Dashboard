import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllUsers, createUser, deleteUser } from "@/lib/db";
import { hasPermission } from "@/lib/constants";

export async function GET() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "manage_users")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "manage_users")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { username, password, role, nameAr, nameEn } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const user = createUser(username, password, role, nameAr || "", nameEn || "");
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        nameAr: user.nameAr,
        nameEn: user.nameEn,
        createdAt: user.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session || !hasPermission(session.role, "manage_users")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await request.json();
  const success = deleteUser(id);
  if (!success) {
    return NextResponse.json({ error: "Cannot delete user" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
