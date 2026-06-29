import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionUser } from "./types";
import { getUserById } from "./db";
import { getEffectivePermissions } from "./constants";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "lotus-hr-dashboard-secret-key-2026"
);

const COOKIE_NAME = "lotus-hr-session";

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  if (!session.permissions || session.permissions.length === 0) {
    const user = getUserById(session.id);
    if (user) {
      session.permissions = getEffectivePermissions(user);
    }
  }

  return session;
}

export { COOKIE_NAME };
