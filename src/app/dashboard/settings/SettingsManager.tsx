"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { AppSettings } from "@/lib/types";
import { BrandingSettingsPanel } from "./BrandingSettings";
import { FieldSettings } from "./FieldSettings";
import { Palette, SlidersHorizontal } from "lucide-react";

interface SettingsManagerProps {
  settings: AppSettings;
}

export function SettingsManager({ settings }: SettingsManagerProps) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"branding" | "fields">("branding");

  const tabs = [
    { id: "branding" as const, label: t("branding"), icon: Palette },
    { id: "fields" as const, label: t("fieldSettings"), icon: SlidersHorizontal },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t("settings")}</h2>
        <p className="text-gray-500 mt-1">{t("settingsDesc")}</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === item.id
                ? "border-lotus-green text-lotus-green"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === "branding" && <BrandingSettingsPanel initialBranding={settings.branding} />}
      {tab === "fields" && <FieldSettings initialVisibility={settings.fieldVisibility} />}
    </div>
  );
}
