"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LotusLogo } from "@/components/LotusLogo";
import { JOB_POSITIONS } from "@/lib/jobs";
import { QrCode, ArrowRight } from "lucide-react";

export default function ReceptionApplyPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [jobValue, setJobValue] = useState("");
  const [otherJob, setOtherJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!jobValue) return;
    if (jobValue === "other" && !otherJob.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reception", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobValue, otherJob }),
      });

      if (!res.ok) {
        setError(t("receptionError"));
        return;
      }

      const data = await res.json();
      router.push(data.url);
    } catch {
      setError(t("receptionError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-lotus-green shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-2">
              <LotusLogo variant="official" className="h-10 w-auto" width={40} height={40} />
            </div>
            <div>
              <h1 className="text-white font-bold">{t("lotusPharmacies")}</h1>
              <p className="text-white/70 text-xs">{t("receptionWelcome")}</p>
            </div>
          </div>
          <LanguageSwitcher variant="dark" />
        </div>
      </header>

      <main className="max-w-lg mx-auto p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lotus-lime/30">
              <QrCode className="h-6 w-6 text-lotus-green" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t("startApplication")}</h2>
              <p className="text-sm text-gray-500">{t("receptionInstructions")}</p>
            </div>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("positionAppliedFor")} <span className="text-red-500">*</span>
              </label>
              <select
                value={jobValue}
                onChange={(e) => setJobValue(e.target.value)}
                className="select-field"
                required
              >
                <option value="">{t("selectOption")}</option>
                {JOB_POSITIONS.map((job) => (
                  <option key={job.value} value={job.value}>
                    {locale === "ar" ? job.ar : job.en}
                  </option>
                ))}
              </select>
            </div>

            {jobValue === "other" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {t("otherJobTitle")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={otherJob}
                  onChange={(e) => setOtherJob(e.target.value)}
                  placeholder={t("otherJobPlaceholder")}
                  className="input-field"
                  required
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-lotus w-full py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("startApplication")}...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t("startApplication")}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
