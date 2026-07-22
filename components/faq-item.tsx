"use client";

// Zone C accordion row. Same markup and native exclusive-accordion behaviour as
// before (shared `name` attribute, closed by default); the only addition is the
// faq_open event carrying the question, so opened questions can be read back as
// fears the body copy failed to settle.

import { trackEvent } from "@/lib/analytics";

export function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <details
      className="faq-item"
      name="faq"
      onToggle={(e) => {
        if (e.currentTarget.open) trackEvent("faq_open", { question });
      }}
    >
      <summary>{question}</summary>
      <div className="faq-body">{children}</div>
    </details>
  );
}
