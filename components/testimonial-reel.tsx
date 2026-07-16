"use client";

// Participant video testimonials: a horizontally snap-scrolling reel of
// vertical (9:16) clips. Videos never autoplay; a tap starts one clip with
// sound and pauses whichever other clip was playing. preload="none" +
// generated poster frames keep the 12 clips almost free until interaction.

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const CLIP_COUNT = 12;
const CLIPS = Array.from({ length: CLIP_COUNT }, (_, i) => ({
  id: i + 1,
  src: `/video/testimonials/clip-${i + 1}.mp4`,
  poster: `/video/testimonials/posters/clip-${i + 1}.jpg`,
}));

export function TestimonialReel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggle = (id: number) => {
    const video = videoRefs.current.get(id);
    if (!video) return;
    if (activeId === id && !video.paused) {
      video.pause();
      setActiveId(null);
      return;
    }
    // Pause whatever else is playing before starting this clip.
    videoRefs.current.forEach((v, otherId) => {
      if (otherId !== id && !v.paused) v.pause();
    });
    video.muted = false;
    setActiveId(id);
    trackEvent("testimonial_play", { clip: id });
    video.play().catch(() => setActiveId(null));
  };

  const scrollByPage = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="reel-scroller -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8"
        aria-label="Participant video testimonials"
      >
        {CLIPS.map((clip) => (
          <figure
            key={clip.id}
            className="relative w-52 shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-surface-2 sm:w-60"
          >
            <video
              ref={(el) => {
                if (el) videoRefs.current.set(clip.id, el);
                else videoRefs.current.delete(clip.id);
              }}
              className="aspect-[9/16] w-full object-cover"
              src={clip.src}
              poster={clip.poster}
              preload="none"
              playsInline
              controls={activeId === clip.id}
              onEnded={() => setActiveId(null)}
              onPause={() => {
                if (activeId === clip.id) setActiveId(null);
              }}
              aria-label={`Participant testimonial video ${clip.id}`}
            />
            {activeId !== clip.id && (
              <button
                type="button"
                onClick={() => toggle(clip.id)}
                className="group absolute inset-0 flex cursor-pointer items-end justify-start bg-linear-to-t from-bg/60 via-transparent to-transparent p-4"
                aria-label={`Play participant testimonial video ${clip.id}`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bg shadow-lg transition-transform duration-200 group-hover:scale-105">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                  </svg>
                </span>
              </button>
            )}
          </figure>
        ))}
      </div>

      {/* Desktop paging arrows; the strip itself swipes on touch. */}
      <div className="mt-5 hidden items-center justify-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          className="pressable flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-fg transition-colors hover:bg-surface-2"
          aria-label="Scroll testimonials left"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          className="pressable flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-fg transition-colors hover:bg-surface-2"
          aria-label="Scroll testimonials right"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
