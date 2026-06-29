"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useBranding } from "@/components/BrandingProvider";
import { LotusLogo } from "@/components/LotusLogo";
import type { BrandingSettings } from "@/lib/types";
import { Upload, Trash2, ImageIcon, Check, AlertCircle } from "lucide-react";

interface BrandingSettingsProps {
  initialBranding: BrandingSettings;
}

export function BrandingSettingsPanel({ initialBranding }: BrandingSettingsProps) {
  const { t } = useLanguage();
  const { refreshBranding, customLogoUrl } = useBranding();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    initialBranding.customLogo && initialBranding.logoUpdatedAt
      ? `/api/branding/logo?t=${initialBranding.logoUpdatedAt}`
      : null
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess(false);
    setUploading(true);

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const res = await fetch("/api/settings/logo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("uploadFailed"));
        return;
      }

      setPreview(data.logoUrl);
      setSuccess(true);
      await refreshBranding();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(t("uploadFailed"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (!confirm(t("confirmRemoveLogo"))) return;

    setRemoving(true);
    setError("");

    try {
      const res = await fetch("/api/settings/logo", { method: "DELETE" });
      if (res.ok) {
        setPreview(null);
        await refreshBranding();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setRemoving(false);
    }
  }

  const displayUrl = preview || customLogoUrl;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t("branding")}</h2>
        <p className="text-gray-500 mt-1">{t("brandingDesc")}</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Preview */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-gray-600">{t("logoPreview")}</p>
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4">
              {displayUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayUrl}
                  alt="Logo preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <LotusLogo variant="official" className="h-24 w-auto" width={96} height={96} />
              )}
            </div>
            <p className="text-xs text-gray-400 text-center max-w-[160px]">{t("logoPreviewHint")}</p>
          </div>

          {/* Upload controls */}
          <div className="flex-1 space-y-4">
            <div className="rounded-lg bg-lotus-green/5 border border-lotus-green/20 p-4">
              <div className="flex items-start gap-3">
                <ImageIcon className="h-5 w-5 text-lotus-green shrink-0 mt-0.5" />
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{t("logoUploadHint")}</p>
                  <p className="text-xs text-gray-400">{t("logoFormats")}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
                <Check className="h-4 w-4 shrink-0" />
                {t("logoUploadSuccess")}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={handleUpload}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn-lotus"
              >
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? t("uploading") : t("uploadLogo")}
              </button>

              {(displayUrl || initialBranding.customLogo) && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={removing}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("removeLogo")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
