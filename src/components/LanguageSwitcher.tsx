"use client";

import { useLanguage } from "./LanguageProvider";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "ar" ? "EN" : "عربي"}</span>
    </button>
  );
}
