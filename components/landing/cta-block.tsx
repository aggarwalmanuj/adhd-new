// The page's repeating CTA unit: the Parents button, plus the four-clause
// microcopy underneath. A SERVER component — <ScorecardCta> is the only client
// part, and it is already marked as such.
//
// Every CTA on the page goes through here so the label, the microcopy and the
// button treatment can never drift apart between sections.

import { ScorecardCta } from "@/components/scorecard-cta";
import type { CtaLocation } from "@/lib/analytics";

/** The four clauses under every button. Verbatim from the spec. */
export const CTA_MICROCOPY = "Free · 5 questions · About 10 minutes · No credit card";

export function CtaMicrocopy({ className = "" }: { className?: string }) {
  return (
    <p className={`text-balance text-sm text-faint ${className}`}>
      {CTA_MICROCOPY}
    </p>
  );
}

export function CtaBlock({
  location,
  label,
  /** Shorter label for phones, where the full string would wrap to three lines. */
  labelShort,
  align = "start",
  className = "",
}: {
  location: CtaLocation;
  label: string;
  labelShort?: string;
  align?: "start" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 ${
        centered ? "items-center text-center" : "items-start"
      } ${className}`}
    >
      {/* Wrapper hosts the ambient light behind the button — see .cta-halo. */}
      <span className="cta-halo w-full sm:w-auto">
        <ScorecardCta
          variant="signal"
          size="lg"
          location={location}
          className="w-full min-h-11 sm:w-auto"
        >
          {labelShort ? (
            <>
              <span className="sm:hidden">{labelShort}</span>
              <span className="hidden sm:inline">{label}</span>
            </>
          ) : (
            label
          )}
        </ScorecardCta>
      </span>
      <CtaMicrocopy className={centered ? "px-2" : ""} />
    </div>
  );
}
