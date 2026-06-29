"use client";

import { useState } from "react";
import { useBranding } from "./BrandingProvider";
import { getDefaultLogoSrc } from "@/lib/branding";

interface LotusLogoProps {
  className?: string;
  variant?: "official" | "white" | "color";
  width?: number;
  height?: number;
}

export function LotusLogo({
  className = "h-12 w-auto",
  variant = "official",
  width = 120,
  height = 120,
}: LotusLogoProps) {
  const { getLogoSrc, customLogoUrl, loaded } = useBranding();
  const [useFallback, setUseFallback] = useState(false);

  const src = useFallback ? getDefaultLogoSrc(variant) : getLogoSrc(variant);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Lotus Pharmacies - صيدليات لوتس"
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (customLogoUrl && !useFallback) {
          setUseFallback(true);
        }
      }}
      style={{ objectFit: "contain", opacity: loaded ? 1 : 0.7 }}
    />
  );
}
