"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { CandidateCard } from "@/components/CandidateCard";
import type { Candidate } from "@/lib/types";
import { Users, Clock, CheckCircle, Link2 } from "lucide-react";

interface DashboardHomeProps {
  stats: {
    totalCandidates: number;
    pendingApplications: number;
    submittedApplications: number;
    activeLinks: number;
  };
  recentCandidates: Candidate[];
}

export function DashboardHome({ stats, recentCandidates }: DashboardHomeProps) {
  const { t } = useLanguage();

  const statCards = [
    { label: t("totalCandidates"), value: stats.totalCandidates, icon: Users, color: "bg-lotus-green" },
    { label: t("pendingApplications"), value: stats.pendingApplications, icon: Clock, color: "bg-yellow-500" },
    { label: t("submittedApplications"), value: stats.submittedApplications, icon: CheckCircle, color: "bg-lotus-lime" },
    { label: t("activeLinks"), value: stats.activeLinks, icon: Link2, color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t("dashboard")}</h2>
        <p className="text-gray-500 mt-1">{t("appSubtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm card-hover animate-slide-up stagger-${i + 1}`}
            style={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent candidates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t("candidates")}</h3>
          <Link href="/dashboard/candidates" className="text-sm text-lotus-green hover:text-lotus-green-light font-medium transition-colors">
            {t("view")} →
          </Link>
        </div>

        {recentCandidates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center animate-fade-in">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{t("noCandidates")}</p>
            <Link href="/dashboard/links" className="btn-lotus-lime mt-4 inline-flex">
              {t("createInviteLink")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentCandidates.map((candidate, i) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
