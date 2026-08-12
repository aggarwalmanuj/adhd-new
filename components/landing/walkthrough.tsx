"use client";

// Section 07 · "The ten minutes" — ported from the Parents walkthrough so the
// two funnels present their assessment identically.
//
// Shape: a browser-framed stage on the left that crossfades between the five
// real captures, and a labelled tablist on the right. A story-style
// auto-advance carries a passive visitor through the whole arc without a
// click — the important thing is that they SEE it end to end before deciding.
//
// Accessibility notes carried over from Parents:
//   · The stage is a real tabpanel and every step is a real tab pointing at it
//     via aria-controls, so selecting a step means something without sight.
//   · Roving tabindex + arrow/Home/End keys, per the ARIA tabs pattern.
//   · Auto-advance is pausable (WCAG 2.2.2), pauses on hover/focus, and is off
//     by default under prefers-reduced-motion and on touch (where the
//     pause-on-hover guard can never fire).
//
// Difference from Parents: the icons are inline SVG rather than lucide-react.
// This project ships no icon library, and two glyphs do not justify one.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";
import { WALKTHROUGH_FRAMES } from "@/lib/landing-assets";

const ADVANCE_MS = 6500;

/** Subscribe to a media query without an effect-driven setState. */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    // Server snapshot: assume the conservative case (reduced motion / no
    // hover), so the server never renders a running animation.
    () => true
  );
}

export function Walkthrough() {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Touch devices: pause-on-hover can never fire there, so autoplay would yank
  // the slide away mid-read.
  const hoverless = useMediaQuery("(hover: none)");

  // `null` = the visitor has not touched the control, so the media queries
  // decide. Deriving it this way (rather than syncing state in an effect)
  // honours a system setting that changes mid-session, and never silently
  // overwrites an explicit choice.
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  const userPlaying = userOverride ?? (!reduced && !hoverless);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const running = userPlaying && !interacting;

  // Depending on `active` restarts the timer whenever the step changes
  // (including manual selection), so every step gets its full dwell time.
  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % WALKTHROUGH_FRAMES.length),
      ADVANCE_MS
    );
    return () => window.clearTimeout(id);
  }, [running, active]);

  // Auto-advance must NOT steal focus; keyboard/click selection should.
  const select = useCallback((index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }, []);

  const onTabKeyDown = (e: React.KeyboardEvent) => {
    const last = WALKTHROUGH_FRAMES.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      select(next, true);
    }
  };

  const current = WALKTHROUGH_FRAMES[active];

  return (
    <div
      className="grid gap-10 lg:grid-cols-12 lg:gap-14"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={() => setInteracting(false)}
    >
      {/* Stage — browser-framed screenshot with story segments. */}
      <div className="min-w-0 lg:col-span-7">
        <div className="mac-window relative">
          <div className="mac-bar">
            <span className="flex gap-1.5" aria-hidden>
              <span className="mac-dot" />
              <span className="mac-dot" />
              <span className="mac-dot" />
            </span>
            <span
              className="ml-1 hidden truncate rounded-full bg-bg/60 px-3 py-1 text-[11px] tracking-wide text-faint sm:inline-block"
              aria-hidden
            >
              aimerge.live / your-score
            </span>
            {/* Decorative spans, not buttons: the tablist beside them is the
                real labelled control, and a 4px-tall click target is a tenth
                of the 44px floor. */}
            <div className="ml-auto flex items-center gap-1.5" aria-hidden>
              {WALKTHROUGH_FRAMES.map((s, i) => (
                <span
                  key={s.src}
                  className="relative block h-1 w-6 overflow-hidden rounded-full bg-line sm:w-8"
                >
                  <span
                    className={`wt-seg-bar absolute inset-0 rounded-full bg-signal ${
                      i < active ? "wt-seg-done" : ""
                    } ${i === active && running ? "wt-seg-fill" : ""}`}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Crossfade stack: all five slides render and toggle by opacity, so
              switching never shows a blank frame while the next file decodes.
              One shared grid cell (.wt-stage) rather than a fixed aspect ratio
              + object-cover, which would crop the near-square plan page and
              lose the pillar rows that are the reason to show it. */}
          <div
            id="wt-panel"
            role="tabpanel"
            aria-labelledby={`wt-tab-${active}`}
            // The shared grid cell takes the height of the TALLEST capture, so
            // the shorter ones letterbox rather than reflowing the page when
            // the step changes. `items-center` centres them in that cell
            // instead of pinning them to the top with all the slack below.
            className="wt-stage relative w-full items-center bg-surface"
          >
            {WALKTHROUGH_FRAMES.map((s, i) => {
              const hidden = i !== active;
              return (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  width={s.width}
                  height={s.height}
                  // Lazy for all five: this section is several screens below
                  // the hero, and `priority` here would emit a high-priority
                  // preload competing with the actual LCP element.
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  // pointer-events-none stops an invisible slide swallowing
                  // clicks.
                  className={`block h-auto w-full transition-opacity duration-700 ${
                    hidden ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                  aria-hidden={hidden}
                />
              );
            })}
            <span aria-hidden className="wt-vignette absolute inset-0" />
          </div>
        </div>

        {/* Caption + play control under the frame. */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <p className="text-[14.5px] leading-[1.7] text-faint" aria-live="polite">
            <span className="text-ink">{current.what}</span> {current.why}
          </p>
          {/* WCAG 2.2.2: auto-updating content needs a pause control. Hidden
              when reduced motion has already stopped it. */}
          {!reduced && (
            <button
              type="button"
              onClick={() => setUserOverride(!userPlaying)}
              aria-label={
                userPlaying
                  ? "Pause the walkthrough"
                  : "Play the walkthrough"
              }
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] uppercase tracking-[0.16em] text-faint transition-colors hover:text-ink"
            >
              {userPlaying ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M7 4v16l13-8z" />
                  </svg>
                  Play
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Step list — the real, labelled tablist. */}
      <div className="min-w-0 lg:col-span-5">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Assessment steps"
          onKeyDown={onTabKeyDown}
        >
          {WALKTHROUGH_FRAMES.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.src}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`wt-tab-${i}`}
                aria-controls="wt-panel"
                aria-selected={isActive}
                // Roving tabindex: one stop for the whole list, arrows move
                // between steps.
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  select(i);
                  trackEvent("walkthrough_step", { step: s.n });
                }}
                className={`row-interactive grid w-full grid-cols-12 items-baseline gap-4 border-t border-line py-5 text-left last:border-b ${
                  isActive ? "" : "opacity-60 hover:opacity-100"
                }`}
              >
                <span
                  className={`row-num col-span-2 font-serif text-2xl ${
                    isActive ? "text-signal" : "text-faint"
                  }`}
                >
                  {s.n}
                </span>
                <span className="col-span-10">
                  <span className="flex items-baseline gap-3">
                    <span className="row-mark" aria-hidden />
                    <span className="text-title">{s.title}</span>
                  </span>
                  <span className="mt-1 block text-[12px] uppercase tracking-[0.14em] text-faint">
                    {s.meta}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
