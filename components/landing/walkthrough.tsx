"use client";

// Section 07 · "The ten minutes, screen by screen" — spec v6.
//
// WHY THIS SHAPE (and why it replaced the Parents walkthrough):
//
// The Parents version auto-advanced through five slides on a 6.5s timer. That
// is the right call on a parenting page, but this page is read by people with
// ADHD, and content that moves on its own is a documented reading barrier —
// the eye returns to the moving thing and the sentence has to be started
// again. v6 removes the timer entirely: the visitor taps a tab and the screen
// changes, and nothing moves unless they move it. The pause control the old
// version needed disappears with it, because there is no longer anything to
// pause.
//
// The rail is also a better fit for a phone than a vertical tablist: five
// short pills scroll horizontally in the space one stacked list row used.
//
// Accessibility: a real ARIA tabs widget — roving tabindex, arrow/Home/End
// keys, aria-controls pointing at the single panel, and the caption block in
// an aria-live region so a screen reader hears the step change.

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { WALKTHROUGH_FRAMES } from "@/lib/landing-assets";

export function Walkthrough() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = useCallback((index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = WALKTHROUGH_FRAMES.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
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
    <div>
      {/* The rail. Scrolls horizontally on a phone; scrollbar hidden because
          the pills themselves are the affordance. */}
      <div
        role="tablist"
        aria-label="Walk through the five screens"
        onKeyDown={onKeyDown}
        className="reel-scroller -mx-5 flex gap-2 overflow-x-auto px-5 pb-3 pt-1 sm:mx-0 sm:px-0"
      >
        {WALKTHROUGH_FRAMES.map((frame, i) => {
          const on = i === active;
          return (
            <button
              key={frame.src}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`wt-tab-${i}`}
              aria-controls="wt-panel"
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => {
                select(i);
                trackEvent("walkthrough_step", { step: frame.n });
              }}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.82rem] transition-colors duration-250 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                on
                  ? "border-signal bg-signal text-bg"
                  : "border-line text-faint hover:border-line-strong hover:text-ink"
              }`}
            >
              {frame.n} · {frame.tab}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-12 lg:items-center lg:gap-9">
        <div className="min-w-0 lg:col-span-8">
          {/* One panel; the five images share it and only the active one is
              displayed. All five are in the DOM so switching never waits on a
              network request. */}
          <div
            id="wt-panel"
            role="tabpanel"
            aria-labelledby={`wt-tab-${active}`}
            className="overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--elev-3)]"
          >
            {WALKTHROUGH_FRAMES.map((frame, i) => (
              <Image
                key={frame.src}
                src={frame.src}
                alt={frame.alt}
                width={frame.width}
                height={frame.height}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 62vw"
                className={`h-auto w-full ${i === active ? "block" : "hidden"}`}
              />
            ))}
          </div>

          {/* Position in the sequence, as a bar rather than a counter. */}
          <div
            className="mt-3 h-0.5 overflow-hidden rounded-sm bg-line"
            aria-hidden
          >
            <span
              className="block h-full rounded-sm bg-signal transition-[width] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `${((active + 1) / WALKTHROUGH_FRAMES.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* The caption for the selected screen. aria-live so the change is
            announced, since the visual change is in the panel beside it. */}
        <div className="min-w-0 lg:col-span-4" aria-live="polite">
          <p className="eyebrow mb-2">{current.meta}</p>
          <h3 className="text-headline mb-2">{current.title}</h3>
          <p className="text-muted">{current.what}</p>
          <p className="mt-3 text-sm text-faint">{current.why}</p>
        </div>
      </div>
    </div>
  );
}
