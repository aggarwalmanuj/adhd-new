"use client";

// Meta Pixel: consent-gated loader + route-level event tracker.
// Rendered once in the root layout. The pixel sets cookies, so the script is
// only injected after GDPR consent — immediately for returning visitors who
// already accepted, or the moment the banner's Accept is pressed.

import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { getConsent, getServerConsentSnapshot, subscribeConsent } from "@/lib/consent";
import { FB_PIXEL_ID, isValidPixelId, pageview, routeEventName, trackCustom } from "@/lib/fbpixel";

export function FacebookPixel() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    getConsent,
    getServerConsentSnapshot
  );

  if (consent !== "granted" || !isValidPixelId(FB_PIXEL_ID)) return null;

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <Suspense fallback={null}>
        <FacebookPixelTracker />
      </Suspense>
    </>
  );
}

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
