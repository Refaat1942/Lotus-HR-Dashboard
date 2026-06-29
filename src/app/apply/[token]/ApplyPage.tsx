"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ApplicationForm } from "@/components/ApplicationForm";
import { LotusLogo } from "@/components/LotusLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Candidate } from "@/lib/types";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function ApplyPage({ token }: { token: string }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<Partial<Candidate> | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch(`/api/apply/${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "invalid");
          return;
        }

        setCandidate(data.candidate);
      } catch {
        setError("invalid");
      } finally {
        setLoading(false);
      }
    }
    validate();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!candidate) return;

    if (!candidate.fullName || !candidate.mobile1) {
      alert(t("required"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/apply/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidate),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "invalid");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lotus-green border-t-transparent" />
      </div>
    );
  }

  if (error) {
    const errorMessages: Record<string, { icon: typeof XCircle; message: string }> = {
      expired: { icon: AlertTriangle, message: t("linkExpired") },
      used: { icon: XCircle, message: t("linkUsed") },
      invalid: { icon: XCircle, message: t("linkInvalid") },
    };
    const err = errorMessages[error] || errorMessages.invalid;
    const Icon = err.icon;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <Icon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{err.message}</h2>
            <p className="text-gray-500">{t("lotusPharmacies")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <CheckCircle className="h-16 w-16 text-lotus-lime mx-auto mb-4" />
            <h2 className="text-xl font-bold text-lotus-green mb-2">{t("applicationSubmitted")}</h2>
            <p className="text-gray-600">{t("thankYou")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-lotus-green shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-1.5 ring-1 ring-white/20">
              <LotusLogo variant="white" className="h-8 w-auto" width={140} height={36} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">{t("jobApplicationForm")}</h1>
              <p className="text-white/70 text-xs">{t("lotusPharmacies")}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-12">
        <p className="text-gray-600 mb-6 animate-fade-in">{t("fillApplication")}</p>

        <form onSubmit={handleSubmit}>
          <ApplicationForm
            data={candidate || {}}
            onChange={(data) => setCandidate({ ...candidate, ...data })}
          />

          <div className="mt-8 flex justify-center animate-slide-up">
            <button type="submit" disabled={submitting} className="btn-lotus px-12 py-3 text-base">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("submit")}...
                </span>
              ) : (
                t("submit")
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
