"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { ApplicationForm } from "@/components/ApplicationForm";
import type { Candidate, Permission } from "@/lib/types";
import { hasSessionPermission } from "@/lib/constants";
import { CANDIDATE_STATUSES } from "@/lib/constants";
import { getStatusLabel, getLocalizedOption } from "@/lib/i18n";
import { resolveOptionLabel } from "@/lib/options-i18n";
import { EGYPTIAN_GOVERNORATES } from "@/lib/constants";
import { resolveJobPositionLabel } from "@/lib/jobs";
import { ArrowLeft, Save, Trash2, Printer } from "lucide-react";

interface CandidateDetailProps {
  candidate: Candidate;
  userPermissions: Permission[];
  userRole: "admin" | "hr" | "viewer";
}

export function CandidateDetail({ candidate: initial, userPermissions, userRole }: CandidateDetailProps) {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [candidate, setCandidate] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sessionLike = { role: userRole, permissions: userPermissions };
  const canEdit = hasSessionPermission(sessionLike, "edit_candidates");
  const canDelete = hasSessionPermission(sessionLike, "delete_candidates");
  const canEditInterviews = hasSessionPermission(sessionLike, "edit_interviews");

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(candidate),
      });
      if (res.ok) {
        const data = await res.json();
        setCandidate(data.candidate);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/candidates/${candidate.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/candidates");
      router.refresh();
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/candidates" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t("candidateDetails")}</h2>
            <p className="text-sm text-gray-500">{candidate.applicationNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <>
              <select
                value={candidate.status}
                onChange={(e) => setCandidate({ ...candidate, status: e.target.value as Candidate["status"] })}
                className="select-field w-auto text-sm"
              >
                {getLocalizedOption(locale, CANDIDATE_STATUSES).map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button onClick={handleSave} disabled={saving} className="btn-lotus">
                <Save className="h-4 w-4" />
                {saved ? "✓" : t("save")}
              </button>
            </>
          )}
          <button onClick={handlePrint} className="btn-lotus-outline">
            <Printer className="h-4 w-4" />
            {t("print")}
          </button>
          {canDelete && (
            <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg border-2 border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
              <Trash2 className="h-4 w-4" />
              {t("delete")}
            </button>
          )}
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-lotus-green to-lotus-green-light p-6 text-white animate-slide-up print:bg-white print:text-black print:border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">{candidate.fullName || t("notSubmitted")}</h3>
            <p className="text-white/80 mt-1 print:text-gray-600">{resolveJobPositionLabel(locale, candidate.positionAppliedFor)}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/20 px-3 py-1 print:bg-gray-100 print:text-gray-800">
              {getStatusLabel(locale, candidate.status)}
            </span>
            {candidate.mobile1 && (
              <span className="rounded-full bg-white/20 px-3 py-1 print:bg-gray-100 print:text-gray-800" dir="ltr">
                {candidate.mobile1}
              </span>
            )}
            {candidate.governorate && (
              <span className="rounded-full bg-white/20 px-3 py-1 print:bg-gray-100 print:text-gray-800">
                {resolveOptionLabel(locale, EGYPTIAN_GOVERNORATES, candidate.governorate)}
              </span>
            )}
          </div>
        </div>
      </div>

      <ApplicationForm
        data={candidate}
        onChange={(data) => setCandidate({ ...candidate, ...data } as Candidate)}
        readOnly={!canEdit}
        showHrSection={canEditInterviews}
      />
    </div>
  );
}
