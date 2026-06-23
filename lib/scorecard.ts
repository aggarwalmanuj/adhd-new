// Builds the outbound link that hands a visitor off to the AI Merge "Belief
// Score" scorecard (aimerge.live), carrying our stored acquisition data as URL
// query params. The scorecard reads these on page load — no API call, no other
// integration. Our only job is to build the URL correctly.

import { getStoredFirstTouch } from "./attribution";

/** The scorecard homepage — the required entry point. Never deep-link past it. */
export const SCORECARD_BASE_URL = "https://aimerge.live/";

/** Short slug identifying THIS landing page / funnel. */
export const LP_SLUG = "adhd";

const REF_STORAGE_KEY = "aimerge-ref";

function newRef(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `${LP_SLUG}_${crypto.randomUUID()}`;
    }
  } catch {
    // fall through to the best-effort fallback
  }
  return `${LP_SLUG}_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/**
 * Stable, first-party visitor id used as `ref` — the JOIN key the scorecard
 * echoes back so a completed score reconciles 1:1 to this visitor. We no longer
 * store a server-side lead, so this replaces the old DB primary key. Generated
 * once and persisted; first touch wins, so the first click that lands is the id
 * that sticks (and every later click resends the same one).
 */
export function getOrCreateVisitorRef(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(REF_STORAGE_KEY);
    if (existing) return existing;
    const id = newRef();
    window.localStorage.setItem(REF_STORAGE_KEY, id);
    return id;
  } catch {
    // localStorage unavailable (private mode): still send a ref for this click
    // so attribution flows, even though it can't persist across visits.
    return newRef();
  }
}

/**
 * Build the full scorecard URL with every value we have. Values are set via
 * URLSearchParams (URL-encoded for us); any param we lack is omitted entirely —
 * never an empty param.
 */
export function buildScorecardUrl(): string {
  const dest = new URL(SCORECARD_BASE_URL);
  const ft = getStoredFirstTouch();

  const params: Record<string, string | undefined> = {
    utm_source: ft.utmSource,
    utm_medium: ft.utmMedium,
    utm_campaign: ft.utmCampaign,
    utm_term: ft.utmTerm,
    utm_content: ft.utmContent,
    fbclid: ft.fbclid,
    gclid: ft.gclid,
    ttclid: ft.ttclid,
    msclkid: ft.msclkid,
    ref: getOrCreateVisitorRef(),
    lp: LP_SLUG,
  };

  for (const [key, value] of Object.entries(params)) {
    if (value) dest.searchParams.set(key, value);
  }

  return dest.toString();
}
