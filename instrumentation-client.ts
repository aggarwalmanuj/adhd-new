// Client instrumentation (Next 15.3+ convention): runs before the app
// becomes interactive.

import { captureFirstTouchAttribution } from "@/lib/attribution";
import { getConsent, onConsentChange } from "@/lib/consent";
import { loadPostHog } from "@/lib/posthog-lazy";

// Attribution is captured unconditionally — it must work even when PostHog
// is off. (captureFirstTouchAttribution is idempotent and try/catch'd.)
captureFirstTouchAttribution();

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const enableDev = process.env.NEXT_PUBLIC_POSTHOG_ENABLE_DEV === "true";

async function startPostHog(): Promise<void> {
  if (
    !token ||
    typeof window === "undefined" ||
    // Dev clicks pollute prod funnels; offline dev machines spam "Failed to fetch".
    (process.env.NODE_ENV !== "production" && !enableDev)
  ) {
    return;
  }
  // Dynamic import: posthog-js is ~227 KB raw and CANNOT run before consent,
  // yet a static import put all of it in the page's critical bundle — 258 ms
  // of parse/compile on a throttled mobile CPU, sitting directly in front of
  // hydration and therefore in front of the LCP paint. Now it is fetched only
  // once consent actually exists.
  const posthog = await loadPostHog();
  if (!posthog) return;
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

// GDPR: PostHog sets cookies/localStorage, so it only starts after explicit
// consent — immediately for returning visitors who already accepted, or the
// moment the banner's Accept is pressed.
if (typeof window !== "undefined") {
  if (getConsent() === "granted") {
    startPostHog();
  } else {
    onConsentChange((value) => {
      if (value === "granted") startPostHog();
    });
  }
}
