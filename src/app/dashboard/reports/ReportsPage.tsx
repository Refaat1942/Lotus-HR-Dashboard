"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { Candidate, InviteLink } from "@/lib/types";
import { getStatusLabel } from "@/lib/i18n";
import { resolveOptionLabel } from "@/lib/options-i18n";
import { EGYPTIAN_GOVERNORATES } from "@/lib/constants";
import { resolveJobPositionLabel } from "@/lib/jobs";
import { Download, Printer, BarChart3, Users, Link2, CheckCircle, XCircle } from "lucide-react";

interface ReportsPageProps {
  data: {
    stats: {
      totalCandidates: number;
      pendingApplications: number;
      submittedApplications: number;
      activeLinks: number;
      usedLinks: number;
      acceptedCandidates: number;
      rejectedCandidates: number;
    };
    candidates: Candidate[];
    links: InviteLink[];
    generatedAt: string;
  };
}

export function ReportsPage({ data }: ReportsPageProps) {
  const { t, locale } = useLanguage();
  const { stats, candidates, links } = data;

  const byStatus = candidates.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const byPosition = candidates.reduce<Record<string, number>>((acc, c) => {
    const key = resolveJobPositionLabel(locale, c.positionAppliedFor || "") || "—";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const byGovernorate = candidates.reduce<Record<string, number>>((acc, c) => {
    const key = resolveOptionLabel(locale, EGYPTIAN_GOVERNORATES, c.governorate) || "—";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const statCards = [
    { label: t("totalCandidates"), value: stats.totalCandidates, icon: Users },
    { label: t("submittedApplications"), value: stats.submittedApplications, icon: CheckCircle },
    { label: t("pendingApplications"), value: stats.pendingApplications, icon: BarChart3 },
    { label: t("acceptedCandidates"), value: stats.acceptedCandidates, icon: CheckCircle },
    { label: t("rejectedCandidates"), value: stats.rejectedCandidates, icon: XCircle },
    { label: t("activeLinks"), value: stats.activeLinks, icon: Link2 },
    { label: t("usedLinksCount"), value: stats.usedLinks, icon: Link2 },
  ];

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("reports")}</h2>
          <p className="text-gray-500 mt-1">{t("reportsDesc")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/api/reports?type=candidates-csv" className="btn-lotus-outline text-sm">
            <Download className="h-4 w-4" /> {t("exportCandidates")}
          </a>
          <a href="/api/reports?type=links-csv" className="btn-lotus-outline text-sm">
            <Download className="h-4 w-4" /> {t("exportLinks")}
          </a>
          <button onClick={() => window.print()} className="btn-lotus text-sm">
            <Printer className="h-4 w-4" /> {t("printReport")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <s.icon className="h-5 w-5 text-lotus-lime mb-2" />
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ReportTable title={t("status")} rows={Object.entries(byStatus).map(([k, v]) => [getStatusLabel(locale, k), v])} />
        <ReportTable title={t("positionAppliedFor")} rows={Object.entries(byPosition).map(([k, v]) => [k, v])} />
        <ReportTable title={t("governorate")} rows={Object.entries(byGovernorate).map(([k, v]) => [k, v])} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="section-header">{t("candidates")} ({candidates.length})</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-start">{t("applicationNumber")}</th>
                <th className="px-3 py-2 text-start">{t("fullName")}</th>
                <th className="px-3 py-2 text-start">{t("positionAppliedFor")}</th>
                <th className="px-3 py-2 text-start">{t("status")}</th>
                <th className="px-3 py-2 text-start">{t("mobile1")}</th>
                <th className="px-3 py-2 text-start">{t("examScore")}</th>
                <th className="px-3 py-2 text-start">{t("totalSalary")}</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{c.applicationNumber || "—"}</td>
                  <td className="px-3 py-2">{c.fullName || t("notSubmitted")}</td>
                  <td className="px-3 py-2">{resolveJobPositionLabel(locale, c.positionAppliedFor)}</td>
                  <td className="px-3 py-2">{getStatusLabel(locale, c.status)}</td>
                  <td className="px-3 py-2" dir="ltr">{c.mobile1}</td>
                  <td className="px-3 py-2">{c.examScores?.examScore || "—"}</td>
                  <td className="px-3 py-2">{c.jobOffer?.totalSalary || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportTable({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700 text-sm">{title}</div>
      <div className="max-h-48 overflow-y-auto">
        {rows.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">—</p>
        ) : (
          rows.map(([label, count]) => (
            <div key={label} className="flex justify-between px-4 py-2 text-sm border-t border-gray-50">
              <span className="truncate">{label}</span>
              <span className="font-semibold text-lotus-green ms-2">{count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
