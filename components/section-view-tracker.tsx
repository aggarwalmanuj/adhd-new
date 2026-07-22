"use client";

// Fires a named funnel event the first time a section scrolls into view, then
// stops observing. Block 01B ("What you'll get") requires whatyouget_view so
// the artifact-clarity fix can be measured against assessment starts.

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function SectionViewTracker({ event }: { event: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      trackEvent(event);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trackEvent(event);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [event]);

  return <span ref={ref} aria-hidden className="block h-0 w-0" />;
}
