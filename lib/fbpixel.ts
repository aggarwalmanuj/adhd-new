// Meta Pixel helpers. Every function is a safe no-op when the pixel is not
// configured or fbevents.js has not loaded.

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";

/** Pixel ids are numeric. Reject anything else before it reaches an inline script. */
export function isValidPixelId(id: string): boolean {
  return /^\d{6,20}$/.test(id);
}

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export function pageview(): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", "PageView");
}

export function track(name: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", name, data ?? {});
}

export function trackCustom(name: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("trackCustom", name, data ?? {});
}

/**
 * fbevents.js loads async; events fired right after mount (or on pages reached
 * via a full-page redirect) are silently dropped by plain track(). Poll until
 * fbq exists, then fire. eventID enables Conversions-API dedup.
 */
export function trackWhenReady(
  name: string,
  data?: Record<string, unknown>,
  eventID?: string,
  attempts = 30
): void {
  if (typeof window === "undefined" || !FB_PIXEL_ID) return;
  const attempt = (left: number) => {
    if (window.fbq) {
      if (eventID) {
        window.fbq("track", name, data ?? {}, { eventID });
      } else {
        window.fbq("track", name, data ?? {});
      }
      return;
    }
    if (left <= 0) return;
    window.setTimeout(() => attempt(left - 1), 150);
  };
  attempt(attempts);
}

/** Route → custom event fired on every visit to that route. /admin is excluded on purpose. */
export const ROUTE_EVENT_MAP: Record<string, string> = {
  "/": "Landing",
  "/privacy": "PrivacyPolicy",
  "/terms": "TermsOfService",
};

/** Normalize before lookup — un-normalized paths ("/privacy/") silently miss. */
export function routeEventName(pathname: string): string | undefined {
  let path = pathname.trim();
  if (path.length > 1 && path.endsWith("/")) path = path.replace(/\/+$/, "");
  if (path === "") path = "/";
  return ROUTE_EVENT_MAP[path];
}
