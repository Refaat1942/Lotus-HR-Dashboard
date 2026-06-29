"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getDefaultLogoSrc } from "@/lib/branding";

interface BrandingContextType {
  customLogoUrl: string | null;
  getLogoSrc: (variant?: "official" | "white" | "color") => string;
  refreshBranding: () => Promise<void>;
  loaded: boolean;
}

const BrandingContext = createContext<BrandingContextType>({
  customLogoUrl: null,
  getLogoSrc: (variant = "official") => getDefaultLogoSrc(variant),
  refreshBranding: async () => {},
  loaded: false,
});

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refreshBranding = useCallback(async () => {
    try {
      const res = await fetch("/api/branding");
      if (res.ok) {
        const data = await res.json();
        setCustomLogoUrl(data.logoUrl || null);
      }
    } catch {
      setCustomLogoUrl(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refreshBranding();
  }, [refreshBranding]);

  const getLogoSrc = useCallback(
    (variant: "official" | "white" | "color" = "official") => {
      if (customLogoUrl) return customLogoUrl;
      return getDefaultLogoSrc(variant);
    },
    [customLogoUrl]
  );

  return (
    <BrandingContext.Provider value={{ customLogoUrl, getLogoSrc, refreshBranding, loaded }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
