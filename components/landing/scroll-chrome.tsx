// The two fixed elements: the scroll progress bar and the mobile sticky CTA.
//
// Both are SERVER-rendered markup. <ScrollEffects> toggles them by writing a
// CSS variable and a class onto these two ids — no state, no client component,
// no second observer. The old <MobileStickyCta> was a client component that
// existed solely to flip one boolean; this replaces it.

import { CTA_MICROCOPY } from "@/components/landing/cta-block";
import { ScorecardCta } from "@/components/scorecard-cta";

export function ScrollChrome() {
  return (
    <>
      <div id="scroll-progress" className="scroll-progress" aria-hidden />

      {/* Sticky CTA. Starts translated out of view; .is-visible slides it in
          once 75% of a viewport has scrolled (spec). inert while hidden so it
          is not reachable by keyboard or announced while off-screen. */}
      <div
        id="mobile-sticky"
        className="mobile-sticky fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pt-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <span className="cta-halo w-full">
          <ScorecardCta
            variant="signal"
            size="lg"
            location="mobile_sticky"
            className="w-full min-h-11"
          >
            Get My Free Score
          </ScorecardCta>
        </span>
        <p className="mt-2 text-center text-xs text-faint">{CTA_MICROCOPY}</p>
      </div>
    </>
  );
}
