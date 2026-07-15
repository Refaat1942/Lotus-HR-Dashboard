"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Database, HardDrive, Clock, RefreshCw, Check } from "lucide-react";

interface BackupMeta {
  lastBackupAt: string | null;
  lastBackupFile: string | null;
  totalBackups: number;
}

export function DatabaseSettings() {
  const { t, locale } = useLanguage();
  const [meta, setMeta] = useState<BackupMeta | null>(null);
  const [backing, setBacking] = useState(false);
  const [saved, setSaved] = useState(false);

  async function loadMeta() {
    const res = await fetch("/api/backup");
    if (res.ok) {
      const data = await res.json();
      setMeta(data.meta);
    }
  }

  useEffect(() => {
    loadMeta();
  }, []);

  async function handleBackup() {
    setBacking(true);
    try {
      const res = await fetch("/api/backup", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setMeta(data.meta);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setBacking(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t("databaseSettings")}</h2>
        <p className="text-gray-500 mt-1 text-sm">{t("databaseSettingsDesc")}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="section-header flex items-center gap-2">
          <Database className="h-5 w-5" />
          {t("databaseInfo")}
        </div>
        <div className="p-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <HardDrive className="h-5 w-5 text-lotus-lime shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">{t("databaseLocation")}</p>
              <p className="text-gray-500 mt-0.5 font-mono text-xs" dir="ltr">/app/data/db.json</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-lotus-lime shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">{t("backupSchedule")}</p>
              <p className="text-gray-500 mt-0.5">{t("backupScheduleDesc")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="section-header">{t("databaseBackup")}</div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-gray-500">{t("lastBackup")}</p>
              <p className="font-semibold text-gray-900 mt-1">
                {meta?.lastBackupAt
                  ? new Date(meta.lastBackupAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-GB")
                  : "—"}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-gray-500">{t("backupCount")}</p>
              <p className="font-semibold text-gray-900 mt-1">{meta?.totalBackups ?? 0}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-gray-500">{t("backupRetention")}</p>
              <p className="font-semibold text-gray-900 mt-1">30</p>
            </div>
          </div>

          <button type="button" onClick={handleBackup} disabled={backing} className="btn-lotus">
            {saved ? <Check className="h-4 w-4" /> : <RefreshCw className={`h-4 w-4 ${backing ? "animate-spin" : ""}`} />}
            {saved ? t("backupSuccess") : t("backupNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
