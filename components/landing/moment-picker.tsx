"use client";

// Section 01 · "Which one sounds most like you?"
//
// v4 upgrade: picking an option no longer just prints a sentence — it renders
// a small mock of the FIRST PAGE OF A RESULT, with the repeated moment and the
// belief filled in from the choice and the rest of the card blurred out. That
// turns an inert copy block into the cheapest possible demonstration of the
// product, immediately before the CTA that asks for ten minutes.
//
// Accessibility: real <button>s carrying aria-pressed, so keyboard and screen
// reader users get toggle semantics with no custom key handling. The preview
// is aria-live so the result is announced rather than silently painted.

import { useState } from "react";
import { CtaMicrocopy } from "@/components/landing/cta-block";
import { ScorecardCta } from "@/components/scorecard-cta";

const OPTIONS = [
  {
    key: "Option A",
    quote: "The thing that matters most is the thing I open last.",
    moment: "Important work stays untouched until the pressure becomes intense.",
    belief: "“I cannot rely on myself without an emergency.”",
  },
  {
    key: "Option B",
    quote: "I do brilliant work, but only when it is almost too late.",
    moment: "Good work arrives, but only once the deadline makes it unavoidable.",
    belief: "“The rescue is the only version of me that can be trusted.”",
  },
  {
    key: "Option C",
    quote: "I start strong. Day four is where it dies.",
    moment: "A new system holds for three days, then quietly stops being yours.",
    belief: "“Starting is easy for me. Staying is not.”",
  },
] as const;

export function MomentPicker() {
  const [picked, setPicked] = useState<number | null>(null);
  const choice = picked === null ? null : OPTIONS[picked];

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--elev-1)] sm:p-10">
      <h3 className="text-headline" id="picker-heading">
        Which ADHD pattern sounds most like you?
      </h3>
      <p className="mt-2 text-sm text-faint">
        Tap one and you will see the shape your result would take.
      </p>

      <div
        className="mt-6 grid gap-3 sm:grid-cols-3"
        role="group"
        aria-labelledby="picker-heading"
      >
        {OPTIONS.map((opt, i) => {
          const on = picked === i;
          return (
            <button
              key={opt.key}
              type="button"
              aria-pressed={on}
              onClick={() => setPicked(i)}
              className={`pressable rounded-xl border p-5 text-left transition-[background-color,border-color,transform] duration-250 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                on
                  ? "border-signal bg-accent-soft"
                  : "border-line bg-bg/50 hover:border-line-strong hover:bg-surface-2"
              }`}
            >
              <span className="text-eyebrow block text-signal">{opt.key}</span>
              <span className="text-title mt-3 block">“{opt.quote}”</span>
            </button>
          );
        })}
      </div>

      {/* Live region rendered at all times — swapping the whole node in and
          out is what makes announcements get missed in Safari. */}
      <div aria-live="polite">
        {choice && (
          <div className="anim-step-in mt-7 grid gap-5 border-t border-line pt-7 lg:grid-cols-2 lg:items-center">
            {/* The mock result card. */}
            <div className="rounded-xl border border-signal/30 bg-accent-soft p-5">
              <p className="mb-3 text-sm text-faint">
                A preview of page one of your result
              </p>
              <span className="text-eyebrow block text-signal">
                Your repeated ADHD moment
              </span>
              <p className="text-title mt-2">{choice.moment}</p>

              <span className="text-eyebrow mt-5 block text-signal">
                A possible belief underneath
              </span>
              <p className="mt-2 font-serif text-lg italic font-light text-muted">
                {choice.belief}
              </p>

              {/* The rest of the page, withheld. Decorative only. */}
              <div className="mt-4 grid gap-2" aria-hidden>
                <i className="block h-2 rounded bg-ink/10" />
                <i className="block h-2 w-[82%] rounded bg-ink/10" />
                <i className="block h-2 w-[64%] rounded bg-ink/10" />
              </div>
            </div>

            <div>
              <p className="text-body-lg text-fg">
                That is roughly the shape of it. The real one is written from
                your words, not from three options.
              </p>
              <div className="mt-6 flex flex-col items-start gap-4">
                <span className="cta-halo w-full sm:w-auto">
                  <ScorecardCta
                    variant="signal"
                    size="lg"
                    location="recognition"
                    className="w-full min-h-11 sm:w-auto"
                  >
                    Build Mine Properly
                  </ScorecardCta>
                </span>
                <CtaMicrocopy className="text-left" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
