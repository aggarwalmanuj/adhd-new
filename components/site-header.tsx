"use client";

// Sticky header that gains a border + blur once the page scrolls — signals
// position in the document without a hard layout jump.

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScorecardCta } from "@/components/scorecard-cta";

// Doorway page: no nav menu. The doc's hero spec forbids navigation that
// consumes meaningful height or leaks visitors away from the single CTA.
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
      className={`sticky top-0 z-30 border-b transition-[background-color,border-color,backdrop-filter] duration-250 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        scrolled
          ? "border-(--border-soft) bg-bg/75 backdrop-blur-lg"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/icon/logo.png"
            alt="AIMERGE"
            width={1274}
            height={179}
            priority
            className="brand-logo h-4 w-auto sm:h-5"
          />
        </Link>

        <div className="flex shrink-0 items-center gap-2.5">
          <span className="cta-halo">
            <ScorecardCta variant="signal" location="header">
              {/* Long label overflows a 360px viewport next to the logo. */}
              <span className="hidden sm:inline">Free Belief Score</span>
              <span className="sm:hidden">Belief Score</span>
            </ScorecardCta>
          </span>
        </div>
      </div>
    </header>
  );
}
