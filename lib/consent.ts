// GDPR cookie consent state. Analytics that set cookies/storage (PostHog,
// Meta Pixel) must not start until consent is "granted". Everything here is
// defensive: consent checks must never break the page.

export type ConsentValue = "granted" | "denied";

const STORAGE_KEY = "hf-cookie-consent";
const CHANGE_EVENT = "hf-consent-change";

/** null = the visitor has not decided yet (banner should show). */
export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "granted" || raw === "denied" ? raw : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage unavailable (private mode, etc.) — consent still applies
    // for this page view via the event below.
  }
  try {
    window.dispatchEvent(new CustomEvent<ConsentValue>(CHANGE_EVENT, { detail: value }));
  } catch {
    // ignore
  }
}

/** Subscribe to consent decisions made after page load. Returns unsubscribe. */
export function onConsentChange(cb: (value: ConsentValue) => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handler = (e: Event) => cb((e as CustomEvent<ConsentValue>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

// useSyncExternalStore plumbing. "unknown" is the server/hydration snapshot:
// components render their no-consent state (no banner, no trackers) until the
// client store is read, so returning visitors never see a banner flash.
export type ConsentSnapshot = ConsentValue | null | "unknown";

export function subscribeConsent(cb: () => void): () => void {
  return onConsentChange(cb);
}

export function getServerConsentSnapshot(): ConsentSnapshot {
  return "unknown";
}
