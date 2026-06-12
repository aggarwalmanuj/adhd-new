"use client";

// GDPR cookie banner. Renders only for visitors with no stored decision;
// analytics (PostHog, Meta Pixel) stay off until "Accept" is pressed.
// Consent is an external store (localStorage + change event), so
// useSyncExternalStore keeps server and client renders consistent.

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getConsent,
  getServerConsentSnapshot,
  setConsent,
  subscribeConsent,
} from "@/lib/consent";

export function CookieConsent() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    getServerConsentSnapshot
  );

  // "unknown" = still hydrating; null = no decision yet (show the banner).
  if (consent !== null) return null;

  return (
    <section
      aria-label="Cookie consent"
      className="anim-dialog-in fixed inset-x-0 bottom-0 z-40 p-4 sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-sm sm:p-0"
    >
      <div className="rounded-2xl border border-line bg-bg p-5 shadow-2xl">
        <h2 className="text-sm font-semibold">Cookies, briefly</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          We use cookies for analytics and to measure our ads. Accept to help
          us improve the site, or decline and we&apos;ll only use what&apos;s
          strictly necessary.{" "}
          <Link
            href="/privacy"
            className="font-medium text-fg underline underline-offset-4"
          >
            Privacy policy
          </Link>
        </p>
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="pressable inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-contrast hover:opacity-90"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="pressable inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-line bg-surface px-4 text-sm font-medium hover:bg-surface-2"
          >
            Decline
          </button>
        </div>
      </div>
    </section>
  );
}
