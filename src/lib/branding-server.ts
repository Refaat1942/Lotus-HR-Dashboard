import path from "path";
import fs from "fs";
import { LOGO_BASENAME } from "./branding";

export const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

export function ensureUploadsDir(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function getLogoFilePath(): string | null {
  ensureUploadsDir();
  if (!fs.existsSync(UPLOADS_DIR)) return null;
  const files = fs.readdirSync(UPLOADS_DIR).filter((f) => f.startsWith(LOGO_BASENAME));
  if (files.length === 0) return null;
  return path.join(UPLOADS_DIR, files[0]);
}

export function deleteCustomLogo(): void {
  ensureUploadsDir();
  if (!fs.existsSync(UPLOADS_DIR)) return;
  const files = fs.readdirSync(UPLOADS_DIR).filter((f) => f.startsWith(LOGO_BASENAME));
  for (const file of files) {
    fs.unlinkSync(path.join(UPLOADS_DIR, file));
  }
}
