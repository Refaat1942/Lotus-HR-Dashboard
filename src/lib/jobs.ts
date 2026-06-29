export const JOB_POSITIONS = [
  { ar: "مساعد صيدلي", en: "Pharmacist Assistant", value: "pharmacist_assistant" },
  { ar: "صيدلي", en: "Pharmacist", value: "pharmacist" },
  { ar: "مدير فرع", en: "Branch Manager", value: "branch_manager" },
  { ar: "مدير منطقة", en: "Area Manager", value: "area_manager" },
  { ar: "محاسب", en: "Accountant", value: "accountant" },
  { ar: "IT", en: "IT", value: "it" },
  { ar: "مندوب توصيل", en: "Delivery", value: "delivery" },
  { ar: "أخرى", en: "Other", value: "other" },
];

export const LINK_EXPIRY_DAYS = [1, 2, 3] as const;

export function getJobPositionLabel(locale: "ar" | "en", value: string): string {
  const found = JOB_POSITIONS.find((p) => p.value === value);
  if (!found) return value;
  return locale === "ar" ? found.ar : found.en;
}

export function resolveJobPositionLabel(locale: "ar" | "en", stored: string): string {
  if (!stored) return stored;
  const found = JOB_POSITIONS.find(
    (p) => p.value === stored || p.ar === stored || p.en === stored
  );
  if (!found) return stored;
  return locale === "ar" ? found.ar : found.en;
}

export function resolveJobPositionStorage(value: string, customText: string): string {
  if (value === "other") return customText.trim();
  return value;
}

/** @deprecated use resolveJobPositionStorage + resolveJobPositionLabel */
export function resolveJobPosition(value: string, customText: string, locale: "ar" | "en"): string {
  return resolveJobPositionStorage(value, customText) === value
    ? getJobPositionLabel(locale, value)
    : customText.trim();
}

export function normalizeJobPositionStorage(stored: string): string {
  if (!stored) return stored;
  const found = JOB_POSITIONS.find(
    (p) => p.value === stored || p.ar === stored || p.en === stored
  );
  return found?.value ?? stored;
}
