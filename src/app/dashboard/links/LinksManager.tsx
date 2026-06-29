"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { InviteLink } from "@/lib/types";
import { Link2, Copy, Check, Plus, ExternalLink } from "lucide-react";

interface LinksManagerProps {
  initialLinks: InviteLink[];
}

export function LinksManager({ initialLinks }: LinksManagerProps) {
  const { t } = useLanguage();
  const [links, setLinks] = useState(initialLinks);
  const [position, setPosition] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("30");
  const [creating, setCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [newLinkUrl, setNewLinkUrl] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!position.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/invite-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positionAppliedFor: position,
          expiresInDays: expiresInDays ? parseInt(expiresInDays) : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLinks([data.link, ...links]);
        const url = `${window.location.origin}/apply/${data.link.token}`;
        setNewLinkUrl(url);
        setPosition("");
      }
    } finally {
      setCreating(false);
    }
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/apply/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  const activeLinks = links.filter((l) => !l.usedAt && (!l.expiresAt || new Date(l.expiresAt) > new Date()));
  const usedLinks = links.filter((l) => l.usedAt);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t("inviteLinks")}</h2>
        <p className="text-gray-500 mt-1">{t("createInviteLink")}</p>
      </div>

      {/* Create form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-slide-up">
        <h3 className="text-lg font-semibold text-lotus-green mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          {t("generateLink")}
        </h3>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder={t("positionAppliedFor")}
            className="input-field flex-1"
            required
          />
          <select
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            className="select-field sm:w-40"
          >
            <option value="7">7 {t("days")}</option>
            <option value="14">14 {t("days")}</option>
            <option value="30">30 {t("days")}</option>
            <option value="90">90 {t("days")}</option>
            <option value="">{t("neverExpires")}</option>
          </select>
          <button type="submit" disabled={creating} className="btn-lotus whitespace-nowrap">
            <Link2 className="h-4 w-4" />
            {t("createInviteLink")}
          </button>
        </form>

        {newLinkUrl && (
          <div className="mt-4 rounded-lg bg-lotus-lime/20 border border-lotus-lime p-4 animate-scale-in">
            <p className="text-sm font-medium text-lotus-green mb-2">{t("linkCreated")}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-white rounded px-3 py-2 truncate" dir="ltr">{newLinkUrl}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newLinkUrl);
                  setCopiedToken("new");
                }}
                className="btn-lotus-lime shrink-0"
              >
                {copiedToken === "new" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active links */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("activeLinks")} ({activeLinks.length})</h3>
        {activeLinks.length === 0 ? (
          <p className="text-gray-500 text-sm">{t("noCandidates")}</p>
        ) : (
          <div className="space-y-3">
            {activeLinks.map((link, i) => (
              <div
                key={link.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                style={{ opacity: 0 }}
              >
                <div>
                  <p className="font-medium text-gray-900">{link.positionAppliedFor}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("createdAt")}: {new Date(link.createdAt).toLocaleDateString()}
                    {link.expiresAt && ` · ${t("expiresIn")} ${Math.ceil((new Date(link.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ${t("days")}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 text-green-800 px-2.5 py-1 text-xs font-medium">{t("active")}</span>
                  <button onClick={() => copyLink(link.token)} className="btn-lotus-outline text-xs py-2">
                    {copiedToken === link.token ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {t("copyLink")}
                  </button>
                  <a
                    href={`/apply/${link.token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-lotus-lime text-xs py-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Used links */}
      {usedLinks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{t("usedLinks")} ({usedLinks.length})</h3>
          <div className="space-y-3">
            {usedLinks.map((link) => (
              <div key={link.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div>
                  <p className="font-medium text-gray-700">{link.positionAppliedFor}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("usedAt")}: {link.usedAt ? new Date(link.usedAt).toLocaleDateString() : "-"}
                  </p>
                </div>
                <span className="rounded-full bg-gray-200 text-gray-600 px-2.5 py-1 text-xs font-medium">{t("used")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
