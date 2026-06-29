export const LOGO_BASENAME = "company-logo";

export const ALLOWED_LOGO_TYPES: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

export const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2 MB

export function defaultBranding() {
  return {
    customLogo: false,
    logoUpdatedAt: null,
    logoMimeType: null,
  };
}

export const DEFAULT_LOGO_PATHS = {
  official: "/lotus-logo-official.png",
  white: "/lotus-logo-white.png",
  color: "/lotus-logo.png",
} as const;

export function getDefaultLogoSrc(variant: keyof typeof DEFAULT_LOGO_PATHS = "official"): string {
  return DEFAULT_LOGO_PATHS[variant];
}
