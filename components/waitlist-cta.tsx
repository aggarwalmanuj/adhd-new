"use client";

import { openApplyModal } from "@/lib/apply-modal-store";

type WaitlistCtaProps = {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

export function WaitlistCta({
  children,
  variant = "primary",
  size = "md",
  className = "",
}: WaitlistCtaProps) {
  const base =
    "pressable inline-flex items-center justify-center gap-2 rounded-full font-semibold";
  const sizing = size === "lg" ? "min-h-13 px-8 text-base" : "min-h-11 px-6 text-sm";
  const look =
    variant === "primary"
      ? "bg-accent text-accent-contrast shadow-sm hover:shadow-md hover:opacity-95"
      : "border border-line bg-surface text-fg hover:bg-surface-2";
  return (
    <button type="button" onClick={openApplyModal} className={`${base} ${sizing} ${look} ${className}`}>
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        <path d="M1 7h11M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
