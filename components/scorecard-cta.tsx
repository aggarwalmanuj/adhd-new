"use client";

import { useSyncExternalStore } from "react";
import { buildScorecardUrl, SCORECARD_BASE_URL } from "@/lib/scorecard";

type ScorecardCtaProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

// The URL depends on client-only state (localStorage). No external source ever
// changes it after first read, so subscribe is a no-op.
const subscribe = () => () => {};

export function ScorecardCta({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ScorecardCtaProps) {
  // SSR and the first hydration render emit the bare scorecard homepage (no
  // mismatch, and a fast pre-hydration click still lands on the required entry
  // point); the client snapshot then enriches the href with stored attribution
  // + the stable visitor ref. Deliberately a same-tab anchor with NO
  // rel="noreferrer": the scorecard reads the referrer as a secondary signal
  // (lp/ref stay the source of truth).
  const href = useSyncExternalStore(
    subscribe,
    buildScorecardUrl,
    () => SCORECARD_BASE_URL
  );

  const base =
    "pressable inline-flex items-center justify-center gap-2 rounded-full font-semibold";
  const sizing = size === "lg" ? "min-h-13 px-8 text-base" : "min-h-11 px-6 text-sm";
  const look =
    variant === "primary"
      ? "bg-accent text-accent-contrast shadow-sm hover:shadow-md hover:opacity-95"
      : "border border-line bg-surface text-fg hover:bg-surface-2";

  return (
    <a href={href} className={`${base} ${sizing} ${look} ${className}`}>
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
