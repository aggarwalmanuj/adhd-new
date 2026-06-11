// Client instrumentation (Next 15.3+ convention): runs before the app
// becomes interactive.

import posthog from "posthog-js";
import { captureFirstTouchAttribution } from "@/lib/attribution";

// Attribution is captured unconditionally — it must work even when PostHog
// is off. (captureFirstTouchAttribution is idempotent and try/catch'd.)
captureFirstTouchAttribution();

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const enableDev = process.env.NEXT_PUBLIC_POSTHOG_ENABLE_DEV === "true";

if (
  token &&
  typeof window !== "undefined" &&
  // Dev clicks pollute prod funnels; offline dev machines spam "Failed to fetch".
  (process.env.NODE_ENV === "production" || enableDev)
) {
  posthog.init(token, {
    // Own-origin reverse proxy (next.config rewrites) — defeats ad blockers
    // that drop *.posthog.com by hostname.
    api_host: "/ingest",
    // Dashboard host for toolbar/"Open in PostHog" links only — never the proxy.
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com",
    defaults: "2026-01-30",
    // The dated defaults use history_change, which can miss the very first
    // page load in some Next.js boot orderings — keep explicit pageviews on.
    capture_pageview: true,
    persistence: "localStorage+cookie",
    debug: process.env.NODE_ENV !== "production",
    session_recording: { maskAllInputs: true },
    loaded: (ph) => {
      // A stale opt-out flag in localStorage silently blocks ALL captures
      // forever; opting back in makes capture self-healing.
      try {
        if (ph.has_opted_out_capturing()) {
          ph.opt_in_capturing();
        }
      } catch {
        // ignore
      }
    },
  });
}
