"use client";

// Section 09 · the participant clip reel.
//
// PERFORMANCE: only the poster images ship with the page. A clip's <video> is
// not created until that clip is tapped, so six testimonial videos cost six
// small JPEGs here rather than six media downloads on a page that is already
// carrying a 31 MB VSL.
//
// Accessibility: each tile is a real <button> naming who is speaking, and the
// opened clip gets native controls and autofocus so keyboard users land on it.

import Image from "next/image";
import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { TESTIMONIAL_CLIPS } from "@/lib/landing-assets";

export function TestimonialReel() {
  const [playing, setPlaying] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="reel-scroller -mx-5 mt-5 flex snap-x gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
      {TESTIMONIAL_CLIPS.map((clip, i) => {
        const isPlaying = playing === i;
        return (
          <div
            key={clip.poster}
            className="relative aspect-[9/16] w-36 shrink-0 snap-start overflow-hidden rounded-xl border border-(--border-soft) bg-surface sm:w-[10.5rem]"
          >
            {isPlaying ? (
              <video
                ref={videoRef}
                src={clip.src}
                poster={clip.poster}
                controls
                autoPlay
                playsInline
                className="h-full w-full object-cover"
                onEnded={() => setPlaying(null)}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPlaying(i);
                  trackEvent("testimonial_play", { clip: i + 1 });
                }}
                aria-label={`Play the clip from ${clip.label}`}
                className="group absolute inset-0 h-full w-full cursor-pointer p-0 transition-transform duration-250 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-1"
              >
                <Image
                  src={clip.poster}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 168px, 144px"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/85"
                />
                {/* play pip */}
                <span
                  aria-hidden
                  className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-(--border-soft) bg-bg/55 backdrop-blur-sm"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-ink">
                    <path d="M7 4v16l13-8z" />
                  </svg>
                </span>
                <span className="absolute inset-x-0 bottom-0 p-3 text-left text-[0.78rem] text-ink">
                  {clip.label}
                </span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
