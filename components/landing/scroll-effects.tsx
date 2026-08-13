"use client";

// Every scroll-driven effect on the landing page, in ONE client component and
// ONE IntersectionObserver pass. The alternative — a "use client" wrapper per
// animated section — ships the same code four times and adds four observers to
// a page whose whole problem is that it is too slow to paint on mobile.
//
// Progressive enhancement is the load-bearing idea here: the server HTML is
// already the FINISHED state (chart drawn, bars filled, marker placed). This
// component adds `.js-anim` to <html>, which is what *un*-finishes them, and
// then plays them back on scroll. If hydration never happens, the visitor gets
// a complete page instead of empty boxes.

import { useEffect } from "react";

/** The illustrative score shown in section 06. Matches SCORE in page.tsx. */
const SCORE_TARGET = 44;

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

    // ---- one observer for every scroll-triggered effect on the page ----
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

            // Section 01: the week columns grow from the axis, staggered so
            // the eye travels Monday→Friday and lands on the Thursday spike.
            case "bars":
              el.querySelectorAll<HTMLElement>(".bar-fill").forEach((b, i) => {
                window.setTimeout(() => b.classList.add("is-grown"), i * 110);
              });
              el.querySelectorAll<HTMLElement>(".bar-cap").forEach((c) =>
                c.classList.add("is-grown")
              );
              break;

            // Section 06: the "you" marker slides along the scale to its
            // position and the number counts up beside it.
            case "score":
              el.querySelector(".you")?.classList.add("is-placed");
              countUp(
                el.querySelector<HTMLElement>(".score-number"),
                SCORE_TARGET,
                reduce
              );
              break;

            // Section 06: the radar polygon grows out from the centre, and
            // the four dimension bars fill alongside it.
            case "radar": {
              el.querySelectorAll<HTMLElement>(".dim-bar > i").forEach((b) =>
                b.classList.add("is-filled")
              );
              const petal = el.querySelector<SVGPolygonElement>(".radar-petal");
              if (!petal) break;
              const final = petal.getAttribute("points") ?? "";
              if (reduce) break;
              // Collapse to the centre, then release on the next frame so the
              // CSS transition has two distinct values to animate between.
              const c = 170;
              petal.setAttribute("points", `${c},${c} ${c},${c} ${c},${c} ${c},${c}`);
              requestAnimationFrame(() =>
                requestAnimationFrame(() => petal.setAttribute("points", final))
              );
              break;
            }

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

/**
 * Count an element's text up to `target`.
 *
 * Cubic ease-out so it decelerates into the final number rather than ticking
 * linearly and stopping dead. Under reduced motion the number is simply set.
 */
function countUp(
  el: Element | null,
  target: number,
  reduce: boolean,
  durationMs = 1400
) {
  if (!el) return;
  if (reduce) {
    el.textContent = String(target);
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - start) / durationMs, 1);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
