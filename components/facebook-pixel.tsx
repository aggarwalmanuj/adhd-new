"use client";

// Fires route-level pixel events on client-side navigation.
// Rendered once in the root layout inside <Suspense> (uses useSearchParams).

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { FB_PIXEL_ID, isValidPixelId, pageview, routeEventName, trackCustom } from "@/lib/fbpixel";

export function FacebookPixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!FB_PIXEL_ID || !isValidPixelId(FB_PIXEL_ID)) return;

    const eventName = routeEventName(pathname);

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      // The base snippet already fired PageView for the first load — only the
      // route's custom event is missing. fbevents.js may still be loading, so poll.
      if (!eventName) return;
      let attempts = 20;
      const fire = () => {
        if (window.fbq) {
          trackCustom(eventName, { path: pathname });
          return;
        }
        if (attempts-- > 0) window.setTimeout(fire, 150);
      };
      fire();
      return;
    }

    pageview();
    if (eventName) trackCustom(eventName, { path: pathname });
  }, [pathname, searchParams]);

  return null;
}
