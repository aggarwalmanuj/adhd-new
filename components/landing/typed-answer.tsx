"use client";

// Section 05 · the typed sentence.
//
// It types itself out when scrolled into view, which is the point: the section
// is about what happens to ONE messy sentence, so watching it appear the way a
// participant would actually write it does more than presenting it as a
// finished quotation.
//
// The full sentence is in the server-rendered HTML and is only cleared once
// this component mounts and starts typing, so a visitor without JS — or before
// hydration — reads the complete sentence rather than an empty box.

import { useEffect, useRef, useState } from "react";

const SENTENCE =
  "I keep putting off important work even when I know exactly what to do. Once the deadline is close, I suddenly become productive.";

export function TypedAnswer() {
  const ref = useRef<HTMLParagraphElement>(null);
  // `null` = not started; the server text is still showing.
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // leave the server-rendered full sentence in place

    // Held outside the observer so unmounting mid-type cancels the pending
    // tick — otherwise the timer keeps firing setState on a dead component.
    let timer = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let i = 0;
        const tick = () => {
          i += 1;
          setShown(SENTENCE.slice(0, i));
          if (i < SENTENCE.length) timer = window.setTimeout(tick, 22);
        };
        tick();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <p
      ref={ref}
      // The caret only belongs on text that is actively being typed.
      className={`font-serif text-[clamp(1.15rem,2.2vw,1.45rem)] leading-[1.45] text-ink ${
        shown !== null ? "type-caret" : ""
      }`}
      style={{ minHeight: "9.5rem" }}
    >
      {shown ?? SENTENCE}
    </p>
  );
}
