// Builds the outbound link that hands a visitor off to the AI Merge "Belief
// Score" scorecard, carrying our stored acquisition data as URL query params.
// The scorecard reads these on page load. No API call, no other integration.
// Our only job is to build the URL correctly.

import { getStoredFirstTouch } from "./attribution";

/** The Belief Score entry point for this funnel (the "adhd doorway"). */
export const SCORECARD_BASE_URL =
  "https://www.aimerge.live/challenge/audience";

/** Short slug identifying THIS landing page / funnel. */
export const LP_SLUG = "adhd";

/**
 * Channel defaults for organic / direct visitors who carry no stored ad
 * attribution. Real first-touch values (from an actual ad click) override these
 * per-param below, and `lp` always marks the doorway regardless of source.
 */
const DEFAULT_UTMS: Record<string, string> = {
  utm_source: "adhd",
  utm_medium: "organic",
  utm_campaign: "adhd-doorway",
};

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
 * Stable, first-party visitor id used as `ref`: the JOIN key the scorecard
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

/** Read a single cookie value (browser only). Undefined if absent. */
function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Build the full scorecard URL with every value we have. Values are set via
 * URLSearchParams (URL-encoded for us); any param we lack is omitted entirely,
 * never an empty param.
 */
export function buildScorecardUrl(): string {
  const dest = new URL(SCORECARD_BASE_URL);
  const ft = getStoredFirstTouch();

  const params: Record<string, string | undefined> = {
    // Real ad-click attribution wins; organic visitors fall back to defaults.
    utm_source: ft.utmSource ?? DEFAULT_UTMS.utm_source,
    utm_medium: ft.utmMedium ?? DEFAULT_UTMS.utm_medium,
    utm_campaign: ft.utmCampaign ?? DEFAULT_UTMS.utm_campaign,
    utm_term: ft.utmTerm,
    utm_content: ft.utmContent,
    // fbclid is what attributes the eventual Lead/Purchase (fired on the
    // scorecard) back to this ad click: aimerge.live's pixel reads it and sets
    // the _fbc cookie automatically.
    fbclid: ft.fbclid,
    gclid: ft.gclid,
    ttclid: ft.ttclid,
    msclkid: ft.msclkid,
    // Forward THIS page's Meta browser cookies so the scorecard can pass them
    // to the Conversions API for higher match quality. Best-effort.
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    ref: getOrCreateVisitorRef(),
    lp: LP_SLUG,
  };

  for (const [key, value] of Object.entries(params)) {
    if (value) dest.searchParams.set(key, value);
  }

  return dest.toString();
}
