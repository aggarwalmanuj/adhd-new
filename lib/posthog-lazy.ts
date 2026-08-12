// Lazy accessor for posthog-js.
//
// WHY THIS EXISTS: posthog-js is ~227 KB raw. A static `import posthog from
// "posthog-js"` anywhere in the client graph pulls all of it into the page's
// critical bundle, where it costs ~258 ms of parse/compile on a throttled
// mobile CPU — directly in front of hydration, and therefore in front of the
// LCP paint. On a page bought with paid mobile traffic that is the most
// expensive 227 KB on the site.
//
// PostHog is consent-gated and does nothing at all until `init` runs, so the
// module is fetched only when it is genuinely needed:
//   · `loadPostHog()` — awaits the chunk. Used by the consent path.
//   · `getPostHog()`  — returns the ALREADY-loaded instance, or null. Used by
//                       the hot paths (trackEvent, attribution), which must
//                       stay synchronous and must never trigger the download
//                       themselves. Before consent they simply no-op.

import type posthogJs from "posthog-js";

type PostHog = typeof posthogJs;

let instance: PostHog | null = null;
let pending: Promise<PostHog | null> | null = null;

/** Fetch and cache the posthog-js module. Safe to call repeatedly. */
export function loadPostHog(): Promise<PostHog | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (instance) return Promise.resolve(instance);
  pending ??= import("posthog-js")
    .then((mod) => {
      instance = mod.default;
      return instance;
    })
    .catch(() => {
      // A blocked or failed analytics chunk must never break the page.
      pending = null;
      return null;
    });
  return pending;
}

/**
 * The loaded, initialised PostHog instance — or null.
 *
 * Returns null when the chunk has not been loaded (no consent yet) or when
 * `init` has not run. Deliberately does NOT trigger a load: callers are
 * fire-and-forget analytics helpers on interaction paths, and an event that
 * arrives before consent is an event that must be dropped, not deferred.
 */
export function getPostHog(): PostHog | null {
  if (!instance) return null;
  try {
    return instance.__loaded ? instance : null;
  } catch {
    return null;
  }
}
