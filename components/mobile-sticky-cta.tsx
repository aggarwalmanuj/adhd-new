"use client";

// Mobile-only sticky CTA bar. Doc requirement: appears after the hero leaves
// view, full width, ≥44px tap height, must not cover controls or fields
// (nothing interactive is fixed to the bottom of this page).

import { useEffect, useState } from "react";
import { ScorecardCta } from "@/components/scorecard-cta";

export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      // Trip only once the hero is fully gone, not while its edge lingers.
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 px-4 pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <ScorecardCta
        variant="signal"
        size="lg"
        location="mobile_sticky"
        className={`w-full min-h-11 ${visible ? "" : "pointer-events-none"}`}
      >
        Get My ADHD Belief Score
      </ScorecardCta>
    </div>
  );
}
