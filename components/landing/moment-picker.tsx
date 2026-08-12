"use client";

// Section 01's "Which one sounds most like you?" picker.
//
// The only genuinely stateful block on the page, so it is the only section
// below the hero that ships as a client component.
//
// Accessibility: these are real <button>s in a group, each carrying
// aria-pressed, so keyboard and screen-reader users get the toggle semantics
// for free — no roving tabindex or key handlers to reimplement badly. The
// answer panel is aria-live so a screen-reader user hears the response without
// having to go looking for it.

import { useState } from "react";
import { ScorecardCta } from "@/components/scorecard-cta";
import { CtaMicrocopy } from "@/components/landing/cta-block";

const OPTIONS = [
  {
    key: "Option A",
    quote: "The thing that matters most is the thing I open last.",
    answer:
      "Then your score starts exactly there. Not with your whole life — with the one thing you keep opening last, and what leaving it has quietly come to mean about you.",
  },
  {
    key: "Option B",
    quote: "I do brilliant work, but only when it is almost too late.",
    answer:
      "Then the question is not whether you can do the work. You clearly can. It is what the rescue keeps teaching you about when you are allowed to trust yourself.",
  },
  {
    key: "Option C",
    quote: "I start strong. Day four is where it dies.",
    answer:
      "Then your score looks at day four: the exact moment a new system stops feeling like yours, and the conclusion you quietly draw about yourself when it does.",
  },
] as const;

export function MomentPicker() {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--elev-2)] sm:p-10">
      <h3 className="text-headline" id="picker-heading">
        Which one sounds most like you?
      </h3>
      <p className="mt-2 text-muted">
        Pick one. It takes a second, and it is where your score would begin.
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
                  : "border-line bg-bg hover:border-line-strong hover:bg-surface-2"
              }`}
            >
              <span className="text-eyebrow block text-signal">{opt.key}</span>
              <span className="text-title mt-3 block">“{opt.quote}”</span>
            </button>
          );
        })}
      </div>

      {/* aria-live so the answer is announced, not just painted. Rendered as a
          region that exists at all times — swapping the whole node in and out
          is what makes live regions miss announcements in Safari. */}
      <div aria-live="polite" className="mt-0">
        {picked !== null && (
          <div className="anim-step-in mt-7 border-t border-line pt-7">
            <p className="text-body-lg max-w-[62ch] text-muted">
              {OPTIONS[picked].answer}
            </p>
            <div className="mt-6 flex flex-col items-start gap-4">
              <span className="cta-halo w-full sm:w-auto">
                <ScorecardCta
                  variant="signal"
                  size="lg"
                  location="recognition"
                  className="w-full min-h-11 sm:w-auto"
                >
                  Start with that moment
                </ScorecardCta>
              </span>
              <CtaMicrocopy className="text-left" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
