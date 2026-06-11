"use client";

// Sticky header that gains a border + blur once the page scrolls — signals
// position in the document without a hard layout jump.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WaitlistCta } from "@/components/waitlist-cta";

const NAV = [
  { href: "#why", label: "Why" },
  { href: "#program", label: "Program" },
  { href: "#founder", label: "Founder" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/icon/logo.png"
            alt="AIMERGE"
            width={1274}
            height={179}
            priority
            className="brand-logo h-5 w-auto"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <WaitlistCta>Join the waitlist</WaitlistCta>
        </div>
      </div>
    </header>
  );
}
