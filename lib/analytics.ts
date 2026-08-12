// Unified funnel-event helper. Every doc-specified analytics event
// (landing_page_view, scroll_depth_*, vsl_*, cta_click) flows through here so
// PostHog and the Meta Pixel always see the same event names and payloads.
// Both sinks are consent-gated upstream and no-op safely when absent.

import { trackCustom } from "./fbpixel";
import { getPostHog } from "./posthog-lazy";
import { LP_SLUG } from "./scorecard";

/** CTA placements the doc requires distinct tracking for. */
export type CtaLocation =
  | "header"
  | "hero"
  // The picker's answer panel in 01 · the week you already know.
  | "recognition"
  // 02 · what it is actually costing.
  | "ledger"
  // 05 · from your words to your map.
  | "mechanism"
  // 06 · the number.
  | "score_definition"
  // 07 · the ten minutes.
  | "how_it_works"
  | "final"
  | "mobile_sticky";

export function trackEvent(
  name: string,
  props?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  const payload = { lp: LP_SLUG, ...props };
  try {
    // null until the chunk has loaded AND init has run (i.e. before consent).
    getPostHog()?.capture(name, payload);
  } catch {
    // Analytics must never break the page.
  }
  trackCustom(name, payload);
}
