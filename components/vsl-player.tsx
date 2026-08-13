"use client";

// Hero VSL — spec v7.
//
// CLICK TO PLAY ONLY. Nothing autoplays, nothing loops, nothing is muted-
// previewed. Two reasons this replaced the muted-autoplay preview:
//
//   1. Performance. `preload="none"` only suppresses the browser's own
//      speculative fetch; calling play() overrides it. The autoplay preview
//      was pulling ~3.8 MB of a 31 MB file inside the fold, on a page bought
//      with paid mobile traffic, in direct competition with the LCP paint.
//   2. The affordance. A native poster gives a thin control bar and otherwise
//      reads as "an image". A large play target, a duration badge and a
//      one-line "what this video is" label are what lift play rate.
//
// The custom poster hands off to the native player on first tap, so controls,
// captions, fullscreen and keyboard all still work afterwards.

import Image from "next/image";
import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const QUARTILES = [
  { at: 0.25, event: "vsl_25" },
  { at: 0.5, event: "vsl_50" },
  { at: 0.75, event: "vsl_75" },
] as const;

export function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Quartile flags live in a ref: timeupdate fires ~4×/s and must not re-render.
  const firedRef = useRef<Set<string>>(new Set());
  const [started, setStarted] = useState(false);

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    trackEvent("vsl_play");
    video.play().catch(() => {
      // A gesture-initiated play should never be blocked; if it somehow is,
      // the native controls are now visible and the visitor can press play.
    });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !started || !video.duration) return;
    const progress = video.currentTime / video.duration;
    for (const q of QUARTILES) {
      if (progress >= q.at && !firedRef.current.has(q.event)) {
        firedRef.current.add(q.event);
        trackEvent(q.event);
      }
    }
  };

  const handleEnded = () => {
    if (firedRef.current.has("vsl_complete")) return;
    firedRef.current.add("vsl_complete");
    trackEvent("vsl_complete");
  };

  return (
    <div className="vsl-stage relative">
      <div className="hero-glow" aria-hidden />
      <div className="vsl-frame relative aspect-video overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/video/vsl-adhd-v1.mp4"
          poster="/video/vsl-poster.jpg"
          // See the note at the top of this file: this is load-bearing for LCP.
          preload="none"
          playsInline
          controls={started}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          aria-label="Introduction to the ADHD Belief Score"
        >
          {/* TODO(launch): add <track kind="captions" src="/video/vsl-captions.vtt" srcLang="en" label="English" />
              once the caption file is supplied. Captions are currently burned
              into the video itself. */}
          Your browser does not support the video tag.
        </video>

        {!started && (
          <button
            type="button"
            onClick={start}
            // NO aria-label at all.
            //
            // The button's accessible name is computed from its own contents,
            // which are already exactly what a sighted visitor reads:
            // "Watch: what the score actually does" + "90 sec". Any hand-
            // written label has to CONTAIN that visible text verbatim or
            // voice-control users cannot say what they see — and every
            // rewording drifted out of sync with it. Letting the content be
            // the name cannot drift.
            className="group absolute inset-0 grid w-full cursor-pointer place-items-center border-0 bg-transparent p-0"
          >
            {/* The poster as a real image rather than the video's own poster
                attribute: it is the LCP element on mobile, and an <img> is
                discovered by the preload scanner where a poster attribute is
                not. `priority` emits the preload and marks it high-priority,
                which is exactly what the LCP element wants. */}
            <Image
              src="/video/vsl-poster.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 900px) 34rem, 100vw"
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-[rgba(2,12,18,0.15)] to-[rgba(2,12,18,0.62)]"
            />

            <span className="relative z-10 grid h-18 w-18 place-items-center rounded-full bg-signal shadow-[0_0_44px_rgb(var(--glow)/.35),0_10px_30px_rgba(2,12,18,.45)] transition-transform duration-250 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-105 sm:h-21 sm:w-21">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
                className="ml-1 text-bg"
              >
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>

            {/* What the video IS, plus how long it takes. Both raise play
                rate more than the play triangle does on its own. */}
            <span className="absolute inset-x-3.5 bottom-3.5 z-10 flex items-center justify-between gap-3 text-left">
              <b className="text-[0.88rem] font-medium text-ink [text-shadow:0_1px_12px_rgba(2,12,18,0.9)]">
                Watch: what the score actually does
              </b>
              <span className="shrink-0 rounded-full border border-(--border-soft) bg-[rgba(2,12,18,0.6)] px-2.5 py-1 text-[0.72rem] tracking-wide text-ink">
                90 sec
              </span>
            </span>
          </button>
        )}
      </div>

    </div>
  );
}
