import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const META_FILE = path.join(BACKUP_DIR, "backup-meta.json");
const MAX_BACKUPS = 30;
const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

export interface BackupMeta {
  lastBackupAt: string | null;
  lastBackupFile: string | null;
  totalBackups: number;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readMeta(): BackupMeta {
  ensureDir(BACKUP_DIR);
  if (!fs.existsSync(META_FILE)) {
    return { lastBackupAt: null, lastBackupFile: null, totalBackups: 0 };
  }
  try {
    return JSON.parse(fs.readFileSync(META_FILE, "utf-8")) as BackupMeta;
  } catch {
    return { lastBackupAt: null, lastBackupFile: null, totalBackups: 0 };
  }
}

function writeMeta(meta: BackupMeta) {
  ensureDir(BACKUP_DIR);
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), "utf-8");
}

function copyDir(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function pruneOldBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return;
  const folders = fs
    .readdirSync(BACKUP_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("backup-"))
    .map((d) => d.name)
    .sort()
    .reverse();

  for (const folder of folders.slice(MAX_BACKUPS)) {
    fs.rmSync(path.join(BACKUP_DIR, folder), { recursive: true, force: true });
  }
}

export function getBackupMeta(): BackupMeta {
  return readMeta();
}

export function runDatabaseBackup(): BackupMeta {
  ensureDir(BACKUP_DIR);

  if (!fs.existsSync(DB_FILE)) {
    throw new Error("Database file not found");
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const folderName = `backup-${stamp}`;
  const targetDir = path.join(BACKUP_DIR, folderName);

  ensureDir(targetDir);
  fs.copyFileSync(DB_FILE, path.join(targetDir, "db.json"));

  if (fs.existsSync(UPLOADS_DIR)) {
    copyDir(UPLOADS_DIR, path.join(targetDir, "uploads"));
  }

  pruneOldBackups();

  const meta: BackupMeta = {
    lastBackupAt: new Date().toISOString(),
    lastBackupFile: folderName,
    totalBackups: fs
      .readdirSync(BACKUP_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith("backup-")).length,
  };

  writeMeta(meta);
  console.log(`[backup] Database backed up to ${folderName}`);
  return meta;
}

let schedulerStarted = false;

export function startBackupScheduler() {
  if (schedulerStarted || process.env.NODE_ENV === "test") return;
  schedulerStarted = true;

  const meta = readMeta();
  const last = meta.lastBackupAt ? new Date(meta.lastBackupAt).getTime() : 0;
  const elapsed = Date.now() - last;
  const initialDelay = elapsed >= BACKUP_INTERVAL_MS ? 0 : BACKUP_INTERVAL_MS - elapsed;

  setTimeout(() => {
    try {
      runDatabaseBackup();
    } catch (err) {
      console.error("[backup] Scheduled backup failed:", err);
    }

    setInterval(() => {
      try {
        runDatabaseBackup();
      } catch (err) {
        console.error("[backup] Scheduled backup failed:", err);
      }
    }, BACKUP_INTERVAL_MS);
  }, initialDelay);

  console.log(`[backup] Scheduler started — next backup in ${Math.round(initialDelay / 60000)} min`);
}
