import type { Locale } from "./types";

export interface LocalizedOption {
  ar: string;
  en: string;
  value: string;
}

export function getLocalizedOption(
  locale: Locale,
  options: readonly LocalizedOption[]
): { value: string; label: string }[] {
  return options.map((opt) => ({
    value: opt.value,
    label: locale === "ar" ? opt.ar : opt.en,
  }));
}

export function resolveOptionValue(
  options: readonly LocalizedOption[],
  stored: string | null | undefined
): string {
  if (!stored) return "";
  const byValue = options.find((o) => o.value === stored);
  if (byValue) return stored;
  const byText = options.find((o) => o.ar === stored || o.en === stored);
  return byText?.value ?? stored;
}

export function resolveOptionLabel(
  locale: Locale,
  options: readonly LocalizedOption[],
  stored: string | null | undefined
): string {
  if (!stored) return "";
  const canonical = resolveOptionValue(options, stored);
  const found = options.find((o) => o.value === canonical);
  if (!found) return stored;
  return locale === "ar" ? found.ar : found.en;
}

export function normalizeOptionFields<T extends Record<string, unknown>>(
  data: T,
  fields: { key: keyof T; options: readonly LocalizedOption[] }[]
): T {
  let changed = false;
  const next = { ...data };
  for (const { key, options } of fields) {
    const raw = next[key];
    if (typeof raw !== "string" || !raw) continue;
    const normalized = resolveOptionValue(options, raw);
    if (normalized !== raw) {
      next[key] = normalized as T[keyof T];
      changed = true;
    }
  }
  return changed ? next : data;
}
