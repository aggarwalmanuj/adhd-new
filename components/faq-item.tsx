"use client";

// Zone C accordion row. Same markup and native exclusive-accordion behaviour as
// before (shared `name` attribute, closed by default); the only addition is the
// faq_open event carrying the question, so opened questions can be read back as
// fears the body copy failed to settle.

import { trackEvent } from "@/lib/analytics";

export function FaqItem({
  question,
  /** Render this row open on first paint. The spec opens the first question
   *  ("Is this an ADHD diagnosis?") so the disclaimer is visible without a
   *  click. `defaultOpen`, not `open`: passing `open` to <details> would make
   *  it a controlled attribute React re-asserts, and the row could never be
   *  closed by the visitor. */
  defaultOpen = false,
  children,
}: {
  question: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      className="faq-item"
      name="faq"
      {...(defaultOpen ? { open: true } : {})}
      onToggle={(e) => {
        if (e.currentTarget.open) trackEvent("faq_open", { question });
      }}
    >
      <summary>{question}</summary>
      <div className="faq-body">{children}</div>
    </details>
  );
}
