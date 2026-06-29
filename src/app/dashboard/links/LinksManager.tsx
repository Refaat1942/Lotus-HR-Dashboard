"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { InviteLink } from "@/lib/types";
import { copyToClipboard } from "@/lib/clipboard";
import { JOB_POSITIONS, LINK_EXPIRY_DAYS, resolveJobPositionStorage, resolveJobPositionLabel } from "@/lib/jobs";
import { Link2, Copy, Check, Plus, ExternalLink, AlertCircle, Trash2 } from "lucide-react";

interface LinksManagerProps {
  initialLinks: InviteLink[];
  canDelete?: boolean;
}

export function LinksManager({ initialLinks, canDelete = true }: LinksManagerProps) {
  const { t, locale } = useLanguage();
  const [links, setLinks] = useState(initialLinks);
  const [jobValue, setJobValue] = useState("");
  const [otherJob, setOtherJob] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("3");
  const [creating, setCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState<string | null>(null);

  async function handleCopy(url: string, tokenId: string) {
    setCopyError(false);
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedToken(tokenId);
      setTimeout(() => setCopiedToken(null), 2500);
    } else {
      setCopyError(true);
      window.prompt(t("copyLinkManually"), url);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("confirmDeleteLink"))) return;
    const res = await fetch(`/api/invite-links/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLinks(links.filter((l) => l.id !== id));
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!jobValue) return;
    if (jobValue === "other" && !otherJob.trim()) return;

    const position = resolveJobPositionStorage(jobValue, otherJob);
    setCreating(true);

    try {
      const res = await fetch("/api/invite-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positionAppliedFor: position,
          expiresInDays: parseInt(expiresInDays),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLinks([data.link, ...links]);
        const url = `${window.location.origin}/apply/${data.link.token}`;
        setNewLinkUrl(url);
        setJobValue("");
        setOtherJob("");
      }
    } finally {
      setCreating(false);
    }
  }

  const activeLinks = links.filter((l) => !l.usedAt && (!l.expiresAt || new Date(l.expiresAt) > new Date()));
  const usedLinks = links.filter((l) => l.usedAt);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t("inviteLinks")}</h2>
        <p className="text-gray-500 mt-1">{t("oneTimeLinkNote")}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-lotus-green mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {t("generateLink")}
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("linkExpiry")} <span className="text-red-500">*</span>
              </label>
              <select
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                className="select-field"
                required
              >
                {LINK_EXPIRY_DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? t("day") : t("days")}
                  </option>
                ))}
              </select>
            </div>
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

          <button type="submit" disabled={creating} className="btn-lotus">
            <Link2 className="h-4 w-4" />
            {t("createInviteLink")}
          </button>
        </form>

        {copyError && (
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
            <AlertCircle className="h-4 w-4" />
            {t("copyFailedHint")}
          </div>
        )}

        {newLinkUrl && (
          <div className="mt-4 rounded-lg bg-lotus-lime/20 border border-lotus-lime p-4">
            <p className="text-sm font-medium text-lotus-green mb-2">{t("linkCreated")}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-white rounded px-3 py-2 break-all" dir="ltr">{newLinkUrl}</code>
              <button type="button" onClick={() => handleCopy(newLinkUrl, "new")} className="btn-lotus-lime shrink-0">
                {copiedToken === "new" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {t("copyLink")}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("activeLinks")} ({activeLinks.length})</h3>
        {activeLinks.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("noActiveLinks")}</p>
        ) : (
          <div className="space-y-3">
            {activeLinks.map((link) => {
              const url = `${typeof window !== "undefined" ? window.location.origin : ""}/apply/${link.token}`;
              return (
                <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div>
                    <p className="font-medium text-gray-900">{resolveJobPositionLabel(locale, link.positionAppliedFor)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("createdAt")}: {new Date(link.createdAt).toLocaleDateString()}
                      {link.expiresAt && ` · ${t("expiresIn")} ${Math.max(0, Math.ceil((new Date(link.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} ${t("days")}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-green-100 text-green-800 px-2.5 py-1 text-xs font-medium">{t("active")}</span>
                    <button type="button" onClick={() => handleCopy(url, link.token)} className="btn-lotus-outline text-xs py-2">
                      {copiedToken === link.token ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {t("copyLink")}
                    </button>
                    <a href={`/apply/${link.token}`} target="_blank" rel="noopener noreferrer" className="btn-lotus-lime text-xs py-2">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    {canDelete && (
                      <button type="button" onClick={() => handleDelete(link.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" title={t("delete")}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {usedLinks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("usedLinks")} ({usedLinks.length})</h3>
          <div className="space-y-3">
            {usedLinks.map((link) => (
              <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="font-medium text-gray-700">{resolveJobPositionLabel(locale, link.positionAppliedFor)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("usedAt")}: {link.usedAt ? new Date(link.usedAt).toLocaleDateString() : "-"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-200 text-gray-600 px-2.5 py-1 text-xs font-medium">{t("used")}</span>
                  {canDelete && (
                    <button type="button" onClick={() => handleDelete(link.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
