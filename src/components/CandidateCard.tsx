"use client";

import Link from "next/link";
import type { Candidate } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";
import { getStatusLabel } from "@/lib/i18n";
import { resolveOptionLabel } from "@/lib/options-i18n";
import { EDUCATIONAL_QUALIFICATIONS, EGYPTIAN_GOVERNORATES } from "@/lib/constants";
import { resolveJobPositionLabel } from "@/lib/jobs";
import { User, Phone, Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  index?: number;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  submitted: "bg-blue-100 text-blue-800",
  reviewing: "bg-purple-100 text-purple-800",
  interviewed: "bg-indigo-100 text-indigo-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export function CandidateCard({ candidate, index = 0 }: CandidateCardProps) {
  const { t, locale } = useLanguage();

  return (
    <Link
      href={`/dashboard/candidates/${candidate.id}`}
      className={`card-hover block rounded-xl border border-gray-200 bg-white p-5 shadow-sm animate-slide-up stagger-${Math.min(index + 1, 6)}`}
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lotus-green/10">
            <User className="h-6 w-6 text-lotus-green" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {candidate.fullName || t("notSubmitted")}
            </h3>
            <p className="text-xs text-gray-500">
              {candidate.applicationNumber || t("numberAfterSubmit")}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[candidate.status]}`}>
          {getStatusLabel(locale, candidate.status)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-lotus-lime shrink-0" />
          <span className="truncate">{resolveJobPositionLabel(locale, candidate.positionAppliedFor)}</span>
        </div>
        {candidate.mobile1 && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-lotus-lime shrink-0" />
            <span dir="ltr">{candidate.mobile1}</span>
          </div>
        )}
        {candidate.educationalQualification && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-lotus-lime shrink-0" />
            <span className="truncate">{resolveOptionLabel(locale, EDUCATIONAL_QUALIFICATIONS, candidate.educationalQualification)}</span>
          </div>
        )}
        {candidate.governorate && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-lotus-lime shrink-0" />
            <span>{resolveOptionLabel(locale, EGYPTIAN_GOVERNORATES, candidate.governorate)}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-lotus-lime shrink-0" />
          <span>{candidate.applicationDate}</span>
        </div>
      </div>
    </Link>
  );
}
