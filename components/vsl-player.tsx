"use client";

// Hero VSL. Playback model (mirrors the reference layout management sent):
// 1. Attempt muted autoplay behind a "click to unmute" overlay. The doc's
//    "no autoplay audio" rule is satisfied — sound only ever starts from a
//    user gesture.
// 2. First click unmutes, restarts from 0 (so no one joins mid-argument) and
//    hands over to native controls (keyboard + screen-reader accessible).
// 3. If autoplay is blocked or the visitor prefers reduced motion, we show
//    the poster with a plain play button instead.
// Captions are burned into the video file itself; swap to a <track> element
// when a .vtt file is supplied.

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const QUARTILES = [
  { at: 0.25, event: "vsl_25" },
  { at: 0.5, event: "vsl_50" },
  { at: 0.75, event: "vsl_75" },
] as const;

/** Floating annotation chips around the player (desktop only), as in the
 *  reference hero. Copy stays factual — no manufactured claims. */
const CHIPS = [
  {
    text: "Built from your own words",
    className: "left-0 top-[12%] -translate-x-1/2",
  },
  {
    text: "Free · No credit card",
    className: "right-0 top-[44%] translate-x-1/2",
  },
  {
    text: "Not a diagnosis. You decide what fits.",
    className: "bottom-[12%] left-0 -translate-x-1/2",
  },
] as const;

type Mode = "preview" | "poster" | "playing";

export function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Quartile flags live in a ref: timeupdate fires ~4×/s and must not re-render.
  const firedRef = useRef<Set<string>>(new Set());
  const [mode, setMode] = useState<Mode>("preview");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Muted autoplay: allowed by policy almost everywhere, but Low-Power-Mode
    // iOS and some browsers still reject. Reduced-motion visitors get the
    // same fallback: poster + plain play button, no motion until asked.
    video.muted = true;
    const attempt = reduceMotion
      ? Promise.reject(new Error("prefers-reduced-motion"))
      : video.play();
    attempt.catch(() => setMode("poster"));
  }, []);

  const startWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    setMode("playing");
    trackEvent("vsl_play");
    video.play().catch(() => {
      // A gesture-initiated play should never be blocked; if it somehow is,
      // native controls are visible and the visitor can press play directly.
    });
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    // Quartiles only count real (unmuted) viewing, not the silent preview.
    if (!video || mode !== "playing" || !video.duration) return;
    const progress = video.currentTime / video.duration;
    for (const q of QUARTILES) {
      if (progress >= q.at && !firedRef.current.has(q.event)) {
        firedRef.current.add(q.event);
        trackEvent(q.event);
      }
    }
  };

  const handleEnded = () => {
    if (mode !== "playing" || firedRef.current.has("vsl_complete")) return;
    firedRef.current.add("vsl_complete");
    trackEvent("vsl_complete");
  };

  return (
    <div className="vsl-stage relative">
      {/* Annotation chips float outside the frame on large screens only. */}
      {CHIPS.map((chip) => (
        <span
          key={chip.text}
          aria-hidden
          className={`vsl-chip absolute z-20 hidden lg:inline-flex ${chip.className}`}
        >
          {chip.text}
        </span>
      ))}

      <div className="hero-glow" aria-hidden />
      <div className="vsl-frame relative overflow-hidden rounded-2xl bg-surface">
        <video
          ref={videoRef}
          className="aspect-video w-full"
          src="/video/vsl-adhd-v1.mp4"
          poster="/video/vsl-poster.jpg"
          preload="metadata"
          playsInline
          muted
          controls={mode !== "preview"}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          aria-label="AI Merge ADHD Belief Score video"
        >
          {/* TODO(launch): add <track kind="captions" src="/video/vsl-captions.vtt" srcLang="en" label="English" />
              once the caption file is supplied. Captions are currently burned
              into the video itself. */}
          Your browser does not support the video tag.
        </video>

        {mode === "preview" && (
          <button
            type="button"
            onClick={startWithSound}
            className="group absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
            aria-label="Unmute and play the video from the beginning"
          >
            <span className="flex flex-col items-center gap-2 rounded-2xl bg-bg/75 px-5 py-4 text-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-[1.03] sm:gap-4 sm:px-12 sm:py-9">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="h-7 w-7 text-signal sm:h-11 sm:w-11"
              >
                <path
                  d="M11 5 6.5 9H3v6h3.5L11 19V5Z"
                  fill="currentColor"
                />
                <path
                  d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-title max-sm:text-base">
                Your video is playing.
                <br />
                Click to unmute.
              </span>
            </span>
          </button>
        )}

        {mode === "poster" && (
          <button
            type="button"
            onClick={startWithSound}
            className="group absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
            aria-label="Play the video"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-signal text-bg shadow-lg transition-transform duration-300 group-hover:scale-105">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
