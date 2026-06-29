"use client";

import { useState } from "react";

interface LotusLogoProps {
  className?: string;
  variant?: "color" | "white";
  width?: number;
  height?: number;
}

export function LotusLogo({
  className = "h-10 w-auto",
  variant = "color",
  width = 180,
  height = 48,
}: LotusLogoProps) {
  const [failed, setFailed] = useState(false);
  const src = variant === "white" ? "/lotus-logo-white.png" : "/lotus-logo.png";

  if (failed) {
    return (
      <div
        className={`flex items-center gap-2 font-bold ${variant === "white" ? "text-white" : "text-[#083f23]"} ${className}`}
        style={{ fontSize: height * 0.45 }}
      >
        <span
          className="inline-flex items-center justify-center rounded-full"
          style={{
            width: height * 0.85,
            height: height * 0.85,
            background: variant === "white" ? "#8dc63f" : "#083f23",
          }}
        >
          <span
            className="rounded-full"
            style={{
              width: height * 0.4,
              height: height * 0.4,
              background: variant === "white" ? "#083f23" : "#8dc63f",
            }}
          />
        </span>
        Lotus
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Lotus Pharmacies"
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
      style={{ objectFit: "contain" }}
    />
  );
}
