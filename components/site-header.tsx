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
      // The bottom border is ALWAYS visible, exactly as on Parents. It was
      // `border-transparent` until scroll, which let the header dissolve into
      // the hero and made the two sites look different at the top of the page.
      className={`sticky top-0 z-30 border-b border-line transition-[background-color,border-color,backdrop-filter] duration-250 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        scrolled ? "bg-bg/75 backdrop-blur-lg" : ""
      }`}
    >
      {/* Two mobile fixes, both measured at 320px:

          1. min-w-0 + gap-3. The logo (~114px), the CTA and the padding
             together exceeded the viewport, and because BOTH children were
             shrink-0 nothing could give. The logo keeps shrink-0 (it must not
             squash); the CTA wrapper is allowed to shrink instead.

          2. overflow-x-clip. The CTA's decorative .cta-halo glow is a pseudo-
             element scaled 1.6x, so it spills ~43px past the button and counted
             as scrollable width — clipping the pill against the screen edge on
             every phone. Clipping HERE keeps the glow at full strength
             everywhere else on the page. `clip` not `hidden`: `hidden` would
             make this a scroll container and break `position: sticky`. */}
      <div className="mx-auto flex h-16 w-full min-w-0 max-w-6xl items-center justify-between gap-3 overflow-x-clip px-5 sm:gap-4 sm:px-8">
        {/* min-h-11: the anchor otherwise hugged the 16px-tall logo image,
            leaving a 114x16 tap target. The extra height is vertical padding
            inside the 64px header row, so nothing moves visually.
            prefetch={false}: this link points at the page the visitor is
            already on, so there is nothing to prefetch. */}
        <Link
          href="/"
          prefetch={false}
          className="flex min-h-11 shrink-0 items-center"
        >
          <Image
            src="/icon/logo.png"
            alt="AIMERGE"
            width={1274}
            height={179}
            priority
            // Without `sizes`, `priority` preloads the 1920w AND 3840w variants
            // of a logo that renders ~114px wide, competing with the real LCP
            // element. h-4 (16px) / h-5 (20px) at a 1274/179 ratio.
            sizes="(min-width: 640px) 142px, 114px"
            className="brand-logo h-4 w-auto sm:h-5"
          />
        </Link>

        <div className="flex min-w-0 items-center gap-2.5">
          <span className="cta-halo min-w-0">
            <ScorecardCta
              variant="signal"
              location="header"
              // Tighter horizontal padding on phones; with min-w-0 above this
              // keeps the row inside a 320px viewport.
              className="min-w-0 !px-4 sm:!px-6"
            >
              {/* Both strings ship in the DOM, so the hidden one must not
                  contribute width — `hidden` is what guarantees that. */}
              <span className="hidden sm:inline">Free ADHD Belief Score</span>
              <span className="sm:hidden">My ADHD Score</span>
            </ScorecardCta>
          </span>
        </div>
      </div>
    </header>
  );
}
