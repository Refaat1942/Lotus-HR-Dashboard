"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { CandidateCard } from "@/components/CandidateCard";
import type { Candidate } from "@/lib/types";
import { Search, Users } from "lucide-react";
import { CANDIDATE_STATUSES } from "@/lib/constants";

interface CandidatesListProps {
  initialCandidates: Candidate[];
}

export function CandidatesList({ initialCandidates }: CandidatesListProps) {
  const { t, locale } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return initialCandidates.filter((c) => {
      const matchesSearch =
        !search ||
        c.fullName.toLowerCase().includes(search.toLowerCase()) ||
        c.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.positionAppliedFor.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile1.includes(search);

      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialCandidates, search, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t("candidates")}</h2>
        <p className="text-gray-500 mt-1">{initialCandidates.length} {t("totalCandidates").toLowerCase()}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="input-field ps-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field sm:w-48"
        >
          <option value="all">{t("allStatuses")}</option>
          {CANDIDATE_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {locale === "ar" ? s.ar : s.en}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("noCandidates")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((candidate, i) => (
            <CandidateCard key={candidate.id} candidate={candidate} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
