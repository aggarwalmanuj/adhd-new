// First-touch attribution + safe PostHog wrappers.
// Everything here is defensive: attribution must never break the page.

import { getPostHog } from "./posthog-lazy";

const STORAGE_KEY = "hf-first-touch";

export type FirstTouch = {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  msclkid?: string;
};

export type LeadAttribution = FirstTouch & {
  posthogSessionId?: string;
  posthogDistinctId?: string;
};

/**
 * Store the acquiring channel exactly once. The lead usually converts minutes
 * after landing, when the UTM query string is long gone — a return visit must
 * not overwrite first touch.
 */
export function captureFirstTouchAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const get = (k: string) => params.get(k)?.slice(0, 500) || undefined;
    const touch: FirstTouch = {
      landingPage: window.location.href.slice(0, 500),
      referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
      utmSource: get("utm_source"),
      utmMedium: get("utm_medium"),
      utmCampaign: get("utm_campaign"),
      utmTerm: get("utm_term"),
      utmContent: get("utm_content"),
      fbclid: get("fbclid"),
      gclid: get("gclid"),
      ttclid: get("ttclid"),
      msclkid: get("msclkid"),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(touch));
  } catch {
    // localStorage unavailable (private mode, etc.) — never break the page.
  }
}

export function getPostHogIds(): Pick<
  LeadAttribution,
  "posthogSessionId" | "posthogDistinctId"
> {
  try {
    const posthog = getPostHog();
    if (!posthog) return {};
    return {
      posthogSessionId: posthog.get_session_id() || undefined,
      posthogDistinctId: posthog.get_distinct_id() || undefined,
    };
  } catch {
    return {};
  }
}

/** Read the persisted first-touch record (channel + click ids). Empty if none. */
export function getStoredFirstTouch(): FirstTouch {
  try {
    if (typeof window === "undefined") return {};
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FirstTouch;
  } catch {
    // ignore — corrupt/unavailable storage must never break the page.
  }
  return {};
}

/** Attached to every waitlist POST — partial and complete. */
export function getLeadAttribution(): LeadAttribution {
  return { ...getStoredFirstTouch(), ...getPostHogIds() };
}

export function phCapture(event: string, props?: Record<string, unknown>): void {
  try {
    getPostHog()?.capture(event, props);
  } catch {
    // ignore
  }
}

export function phIdentify(id: string, props?: Record<string, unknown>): void {
  try {
    getPostHog()?.identify(id, props);
  } catch {
    // ignore
  }
}
