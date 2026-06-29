"use client";

import { useState } from "react";

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
  const [failed, setFailed] = useState(false);

  const src =
    variant === "white"
      ? "/lotus-logo-white.png"
      : variant === "color"
        ? "/lotus-logo.png"
        : "/lotus-logo-official.png";

  if (failed) {
    return (
      <div className={`font-bold text-[#083f23] ${className}`} style={{ fontSize: height * 0.2 }}>
        LOTUS
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Lotus Pharmacies - صيدليات لوتس"
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
      style={{ objectFit: "contain" }}
    />
  );
}
