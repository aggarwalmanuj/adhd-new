"use client";

import { useSyncExternalStore } from "react";
import { getStoredFirstTouch } from "@/lib/attribution";
import { trackCustom } from "@/lib/fbpixel";
import { buildScorecardUrl, LP_SLUG, SCORECARD_BASE_URL } from "@/lib/scorecard";

type ScorecardCtaProps = {
  children: React.ReactNode;
  /** "primary" = near-white ink pill, "signal" = teal accent pill (sparingly). */
  variant?: "primary" | "signal" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

// The URL depends on client-only state (localStorage / cookies). Nothing
// external changes it after first read, so subscribe is a no-op.
const subscribe = () => () => {};

export function ScorecardCta({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: ScorecardCtaProps) {
  // SSR and the first hydration render emit the bare entry point (no mismatch,
  // and a fast pre-hydration click still lands correctly); the client snapshot
  // then enriches the href with stored attribution + the stable visitor ref.
  // Deliberately a same-tab anchor with NO rel="noreferrer": the scorecard reads
  // the referrer as a secondary signal (lp/ref stay the source of truth).
  const href = useSyncExternalStore(
    subscribe,
    buildScorecardUrl,
    () => SCORECARD_BASE_URL
  );

  // Funnel-visibility ping. A CUSTOM event, not a standard Lead/Purchase.
  // Those fire on the scorecard and would double-count. Fire-and-forget so it
  // never blocks the navigation that follows.
  const handleClick = () => {
    if (typeof window !== "undefined" && window.fbq) {
      trackCustom("ScorecardClick", {
        lp: LP_SLUG,
        utm_campaign: getStoredFirstTouch().utmCampaign ?? "adhd-doorway",
      });
    }
  };

  const variantClass =
    variant === "signal"
      ? "btn-signal"
      : variant === "ghost"
        ? "btn-ghost"
        : "btn-primary";

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`btn ${variantClass} ${size === "lg" ? "btn-lg" : ""} ${className}`}
    >
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
      >
        <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
