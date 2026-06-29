"use client";

import { useLanguage } from "./LanguageProvider";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

export function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();
  const nextLocale = locale === "ar" ? "en" : "ar";
  const nextLabel = nextLocale === "ar" ? t("arabic") : t("english");

  const styles =
    variant === "dark"
      ? "text-white/90 hover:bg-white/10 hover:text-white"
      : "text-lotus-green hover:bg-lotus-green/10 hover:text-lotus-green-light border border-lotus-green/20";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 ${styles}`}
      aria-label={t("switchLanguage")}
    >
      <Globe className="h-4 w-4" />
      <span>{nextLabel}</span>
    </button>
  );
}
