import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import type { Candidate, InviteLink, User, UserRole, AppSettings, BrandingSettings, Permission } from "./types";
import { createEmptyCandidate, emptyJobOffer, emptyExamScores, CANDIDATE_OPTION_FIELDS } from "./constants";
import { normalizeOptionFields } from "./options-i18n";
import { normalizeJobPositionStorage } from "./jobs";
import { defaultFieldVisibility, mergeFieldVisibility } from "./fieldConfig";
import { defaultBranding } from "./branding";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface DbSchema {
  users: User[];
  candidates: Candidate[];
  inviteLinks: InviteLink[];
  settings?: AppSettings;
}

function defaultDb(): DbSchema {
  const hash = bcrypt.hashSync("admin", 10);
  return {
    users: [
      {
        id: uuidv4(),
        username: "admin",
        passwordHash: hash,
        role: "admin",
        nameAr: "مدير النظام",
        nameEn: "System Admin",
        customPermissions: null,
        createdAt: new Date().toISOString(),
      },
    ],
    candidates: [],
    inviteLinks: [],
    settings: { fieldVisibility: defaultFieldVisibility(), branding: defaultBranding() },
  };
}

function readDb(): DbSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const db = defaultDb();
    writeDb(db);
    return db;
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  const db = JSON.parse(raw) as DbSchema;
  return ensureDbIntegrity(db);
}

function ensureDbIntegrity(db: DbSchema): DbSchema {
  let changed = false;

  if (!db.settings) {
    db.settings = { fieldVisibility: defaultFieldVisibility(), branding: defaultBranding() };
    changed = true;
  } else {
    db.settings.fieldVisibility = mergeFieldVisibility(db.settings.fieldVisibility);
    if (!db.settings.branding) {
      db.settings.branding = defaultBranding();
      changed = true;
    }
  }

  db = ensureDefaultAdmin(db);

  db.candidates = db.candidates.map((c) => {
    let normalized = {
      ...c,
      jobOffer: c.jobOffer || emptyJobOffer(),
      examScores: c.examScores || emptyExamScores(),
    };
    if (!c.jobOffer || !c.examScores) changed = true;

    const withOptions = normalizeOptionFields(
      normalized,
      CANDIDATE_OPTION_FIELDS.map((f) => ({ key: f.key, options: f.options }))
    );
    const position = normalizeJobPositionStorage(withOptions.positionAppliedFor);
    if (withOptions !== normalized) changed = true;
    if (position !== withOptions.positionAppliedFor) changed = true;
    if (withOptions.decisionReason === undefined) changed = true;
    if (withOptions.decidedAt === undefined) changed = true;

    return {
      ...withOptions,
      positionAppliedFor: position,
      decisionReason: withOptions.decisionReason ?? "",
      decidedAt: withOptions.decidedAt ?? null,
    };
  });

  db.inviteLinks = db.inviteLinks.map((link) => {
    const position = normalizeJobPositionStorage(link.positionAppliedFor);
    if (position !== link.positionAppliedFor) {
      changed = true;
      return { ...link, positionAppliedFor: position };
    }
    return link;
  });

  db.users = db.users.map((u) => {
    if (u.customPermissions === undefined) {
      changed = true;
      return { ...u, customPermissions: null };
    }
    return u;
  });

  if (changed) writeDb(db);
  return db;
}

function ensureDefaultAdmin(db: DbSchema): DbSchema {
  const adminIndex = db.users.findIndex((u) => u.username === "admin");

  if (adminIndex === -1) {
    const hash = bcrypt.hashSync("admin", 10);
    db.users.unshift({
      id: uuidv4(),
      username: "admin",
      passwordHash: hash,
      role: "admin",
      nameAr: "مدير النظام",
      nameEn: "System Admin",
      customPermissions: null,
      createdAt: new Date().toISOString(),
    });
    writeDb(db);
    return db;
  }

  const admin = db.users[adminIndex];
  if (!admin.passwordHash || !bcrypt.compareSync("admin", admin.passwordHash)) {
    db.users[adminIndex] = {
      ...admin,
      passwordHash: bcrypt.hashSync("admin", 10),
    };
    writeDb(db);
  }

  return db;
}

function writeDb(db: DbSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

function generateApplicationNumber(db: DbSchema): string {
  const year = new Date().getFullYear();
  return `LOT-${year}-${String(db.candidates.length + 1).padStart(5, "0")}`;
}

// Users
export function getUserByUsername(username: string): User | null {
  const db = readDb();
  return db.users.find((u) => u.username === username) || null;
}

export function getUserById(id: string): User | null {
  const db = readDb();
  return db.users.find((u) => u.id === id) || null;
}

export function getAllUsers(): Omit<User, "passwordHash">[] {
  const db = readDb();
  return db.users.map(({ passwordHash: _, ...user }) => user);
}

export function createUser(
  username: string,
  password: string,
  role: UserRole,
  nameAr: string,
  nameEn: string,
  customPermissions: Permission[] | null = null
): User {
  const db = readDb();
  if (db.users.some((u) => u.username === username)) {
    throw new Error("Username already exists");
  }
  const hash = bcrypt.hashSync(password, 10);
  const user: User = {
    id: uuidv4(),
    username,
    passwordHash: hash,
    role,
    nameAr,
    nameEn,
    customPermissions,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  return user;
}

export function updateUser(
  id: string,
  updates: {
    username?: string;
    role?: UserRole;
    nameAr?: string;
    nameEn?: string;
    customPermissions?: Permission[] | null;
    password?: string;
  }
): Omit<User, "passwordHash"> | null {
  const db = readDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const user = db.users[index];
  if (user.username === "admin" && updates.role && updates.role !== "admin") {
    return null;
  }

  if (updates.username && updates.username !== user.username) {
    if (db.users.some((u) => u.username === updates.username && u.id !== id)) {
      throw new Error("Username already exists");
    }
  }

  const updated: User = {
    ...user,
    username: updates.username ?? user.username,
    role: updates.role ?? user.role,
    nameAr: updates.nameAr ?? user.nameAr,
    nameEn: updates.nameEn ?? user.nameEn,
    customPermissions:
      updates.customPermissions !== undefined ? updates.customPermissions : user.customPermissions,
  };

  if (updates.password) {
    updated.passwordHash = bcrypt.hashSync(updates.password, 10);
  }

  db.users[index] = updated;
  writeDb(db);

  const { passwordHash: _, ...safe } = updated;
  return safe;
}

export function deleteUser(id: string): boolean {
  const db = readDb();
  const user = db.users.find((u) => u.id === id);
  if (!user || user.username === "admin") return false;
  db.users = db.users.filter((u) => u.id !== id);
  writeDb(db);
  return true;
}

export function verifyPassword(username: string, password: string): User | null {
  const user = getUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) return null;
  return user;
}

// Candidates
export function getAllCandidates(): Candidate[] {
  const db = readDb();
  return [...db.candidates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getCandidateById(id: string): Candidate | null {
  const db = readDb();
  return db.candidates.find((c) => c.id === id) || null;
}

export function getCandidateByToken(token: string): Candidate | null {
  const db = readDb();
  return db.candidates.find((c) => c.inviteToken === token) || null;
}

export function createCandidateForInvite(positionAppliedFor: string, token: string): Candidate {
  const db = readDb();
  const id = uuidv4();
  const appNumber = generateApplicationNumber(db);
  const now = new Date().toISOString();
  const candidate = {
    ...createEmptyCandidate(id, appNumber, positionAppliedFor, token),
    createdAt: now,
    updatedAt: now,
  };
  db.candidates.push(candidate);
  writeDb(db);
  return candidate;
}

export function updateCandidate(id: string, updates: Partial<Candidate>): Candidate | null {
  const db = readDb();
  const index = db.candidates.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const merged = { ...db.candidates[index], ...updates, updatedAt: new Date().toISOString() };
  db.candidates[index] = merged;
  writeDb(db);
  return merged;
}

export function deleteCandidate(id: string): boolean {
  const db = readDb();
  db.candidates = db.candidates.filter((c) => c.id !== id);
  writeDb(db);
  return true;
}

export function submitCandidateApplication(id: string, data: Partial<Candidate>): Candidate | null {
  const now = new Date().toISOString();
  return updateCandidate(id, {
    ...data,
    status: "submitted",
    submittedAt: now,
    applicationDate: now.split("T")[0],
  });
}

// Invite Links
export function createInviteLink(positionAppliedFor: string, createdBy: string, expiresInDays: number = 3): InviteLink {
  const days = [1, 2, 3].includes(expiresInDays) ? expiresInDays : 3;
  const db = readDb();
  const id = uuidv4();
  const token = uuidv4();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

  const link: InviteLink = {
    id,
    token,
    positionAppliedFor,
    createdBy,
    createdAt: now,
    expiresAt,
    usedAt: null,
    candidateId: null,
  };

  db.inviteLinks.push(link);
  writeDb(db);
  createCandidateForInvite(positionAppliedFor, token);

  return link;
}

export function getInviteLinkByToken(token: string): InviteLink | null {
  const db = readDb();
  return db.inviteLinks.find((l) => l.token === token) || null;
}

export function getAllInviteLinks(): InviteLink[] {
  const db = readDb();
  return [...db.inviteLinks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function deleteInviteLink(id: string): boolean {
  const db = readDb();
  const link = db.inviteLinks.find((l) => l.id === id);
  if (!link) return false;

  db.inviteLinks = db.inviteLinks.filter((l) => l.id !== id);

  const candidate = db.candidates.find((c) => c.inviteToken === link.token);
  if (candidate && candidate.status === "pending") {
    db.candidates = db.candidates.filter((c) => c.id !== candidate.id);
  }

  writeDb(db);
  return true;
}

export function markInviteLinkUsed(token: string, candidateId: string): void {
  const db = readDb();
  const link = db.inviteLinks.find((l) => l.token === token);
  if (link) {
    link.usedAt = new Date().toISOString();
    link.candidateId = candidateId;
    writeDb(db);
  }
}

export function getDashboardStats() {
  const db = readDb();
  return {
    totalCandidates: db.candidates.length,
    pendingApplications: db.candidates.filter((c) => c.status === "pending").length,
    submittedApplications: db.candidates.filter((c) => c.status !== "pending").length,
    activeLinks: db.inviteLinks.filter((l) => !l.usedAt).length,
    usedLinks: db.inviteLinks.filter((l) => l.usedAt).length,
    acceptedCandidates: db.candidates.filter((c) => c.status === "accepted").length,
    rejectedCandidates: db.candidates.filter((c) => c.status === "rejected").length,
  };
}

export function getSettings(): AppSettings {
  const db = readDb();
  return (
    db.settings || {
      fieldVisibility: defaultFieldVisibility(),
      branding: defaultBranding(),
    }
  );
}

export function updateSettings(settings: Partial<AppSettings>): AppSettings {
  const db = readDb();
  const current = getSettings();

  db.settings = {
    fieldVisibility: settings.fieldVisibility
      ? mergeFieldVisibility({ ...current.fieldVisibility, ...settings.fieldVisibility })
      : current.fieldVisibility,
    branding: settings.branding
      ? { ...current.branding, ...settings.branding }
      : current.branding,
  };

  writeDb(db);
  return db.settings;
}

export function updateBranding(branding: Partial<BrandingSettings>): AppSettings {
  return updateSettings({ branding: branding as BrandingSettings });
}

export function getReportData() {
  const db = readDb();
  return {
    stats: getDashboardStats(),
    candidates: getAllCandidates(),
    links: getAllInviteLinks(),
    users: getAllUsers(),
    generatedAt: new Date().toISOString(),
  };
}

export function isLinkUsable(token: string): { usable: boolean; reason?: string } {
  const link = getInviteLinkByToken(token);
  if (!link) return { usable: false, reason: "invalid" };
  if (link.usedAt) return { usable: false, reason: "used" };
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) return { usable: false, reason: "expired" };

  const candidate = getCandidateByToken(token);
  if (candidate && candidate.status !== "pending") {
    return { usable: false, reason: "used" };
  }

  return { usable: true };
}
