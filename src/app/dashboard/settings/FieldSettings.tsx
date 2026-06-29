"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { APPLICATION_FIELDS, FIELD_SECTIONS } from "@/lib/fieldConfig";
import { Save, Eye, EyeOff, Check } from "lucide-react";

interface FieldSettingsProps {
  initialVisibility: Record<string, boolean>;
}

export function FieldSettings({ initialVisibility }: FieldSettingsProps) {
  const { t } = useLanguage();
  const [visibility, setVisibility] = useState(initialVisibility);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldVisibility: visibility }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  function toggle(key: string) {
    setVisibility({ ...visibility, [key]: !visibility[key] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t("fieldSettings")}</h2>
        <p className="text-gray-500 mt-1 text-sm">{t("fieldSettingsDesc")}</p>
      </div>

      {FIELD_SECTIONS.map((section) => {
        const fields = APPLICATION_FIELDS.filter((f) => f.section === section.id);
        if (fields.length === 0) return null;

        return (
          <div key={section.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="section-header">{t(section.labelKey)}</div>
            <div className="divide-y divide-gray-100">
              {fields.map((field) => (
                <div key={field.key} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-700">{t(field.labelKey)}</span>
                  <button
                    type="button"
                    onClick={() => toggle(field.key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      visibility[field.key] !== false
                        ? "bg-lotus-lime/30 text-lotus-green"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {visibility[field.key] !== false ? (
                      <><Eye className="h-3.5 w-3.5" /> {t("showField")}</>
                    ) : (
                      <><EyeOff className="h-3.5 w-3.5" /> {t("hideField")}</>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button onClick={handleSave} disabled={saving} className="btn-lotus">
        {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {saved ? t("settingsSaved") : t("saveSettings")}
      </button>
    </div>
  );
}
