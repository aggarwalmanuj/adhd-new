"use client";

// Every scroll-driven effect on the landing page, in ONE client component and
// ONE IntersectionObserver pass. The alternative — a "use client" wrapper per
// animated section — ships the same code four times and adds four observers to
// a page whose whole problem is that it is too slow to paint on mobile.
//
// Progressive enhancement is the load-bearing idea here: the server HTML is
// already the FINISHED state (chart drawn, gauge full, meters filled). This
// component adds `.js-anim` to <html>, which is what *un*-finishes them, and
// then plays them back on scroll. If hydration never happens, the visitor gets
// a complete page instead of empty boxes.

import { useEffect } from "react";

/** Score the gauge counts up to. Illustrative, per the spec's own caption. */
const GAUGE_TARGET = 44;

export function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Un-finish the animated states now that we can re-play them.
    root.classList.add("js-anim");

    // ---- scroll progress bar + mobile sticky CTA -------------------------
    // Both read scrollY, so they share one rAF-throttled handler. The bar
    // writes a custom property (no layout), the sticky bar toggles a class.
    const bar = document.getElementById("scroll-progress");
    const sticky = document.getElementById("mobile-sticky");
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = root.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar?.style.setProperty("--scroll-progress", `${pct}%`);
        // Spec: sticky CTA appears after 75% of a viewport has scrolled.
        sticky?.classList.toggle(
          "is-visible",
          window.scrollY > window.innerHeight * 0.75
        );
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ---- one observer for reveals, the chart, the gauge, the meters ------
    // Each target declares what it wants via a data attribute, so adding an
    // animated element later needs no new observer and no new effect.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;

          switch (el.dataset.anim) {
            case "draw":
              el.classList.add("is-drawn");
              break;

            case "meters":
              el.querySelectorAll<HTMLElement>(".meter-fill").forEach((m) =>
                m.classList.add("is-filled")
              );
              break;

            case "gauge":
              playGauge(el, reduce);
              break;

            default:
              // Plain scroll reveal.
              el.classList.add("is-visible");
          }

          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    document
      .querySelectorAll<HTMLElement>("[data-anim]")
      .forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      root.classList.remove("js-anim");
    };
  }, []);

  return null;
}

/** Sweep the gauge arc and count the number up to the target. */
function playGauge(wrap: HTMLElement, reduce: boolean) {
  const arc = wrap.querySelector<SVGPathElement>(".gauge-arc");
  const num = wrap.querySelector<SVGTextElement>(".gauge-number");

  if (arc) {
    // Ask the BROWSER for the path length rather than trusting a number in a
    // custom property. The two disagreed once already (a hand-computed arc
    // length against a path whose radius later changed), and the visible
    // symptom is a gauge that sweeps past its own score.
    const len = arc.getTotalLength();
    arc.style.strokeDasharray = String(len);
    arc.style.strokeDashoffset = String(len - (len * GAUGE_TARGET) / 100);
  }

  if (!num) return;
  if (reduce) {
    num.textContent = String(GAUGE_TARGET);
    return;
  }

  // Cubic ease-out on the count so it decelerates into the final number
  // rather than ticking linearly and stopping dead.
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - start) / 1400, 1);
    num.textContent = String(
      Math.round(GAUGE_TARGET * (1 - Math.pow(1 - p, 3)))
    );
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
