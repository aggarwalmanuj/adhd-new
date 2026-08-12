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
  // Zone A: the chips around the hero player carry the artifact spec, never a
  // caveat. "Not a diagnosis" used to sit here — it now lives only in the
  // Block 12 FAQ, which is its permanent home.
  {
    text: "5 questions · One ADHD pattern",
    className: "bottom-[12%] left-0 -translate-x-1/2",
  },
] as const;

type Mode = "preview" | "poster" | "playing";

/** Connection hints, where the browser exposes them (Chromium/Android). */
type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * Is this visitor eligible for the silent muted-autoplay preview?
 *
 * Returns false — meaning "show the poster and fetch nothing" — when:
 *   · we are on the server (SSR must match the pre-hydration markup),
 *   · the visitor prefers reduced motion,
 *   · the connection is metered (Save-Data) or slow (2G/3G),
 *   · IntersectionObserver is missing, so we cannot defer the fetch safely.
 *
 * Deliberately conservative: the cost of wrongly showing a poster is one extra
 * tap, while the cost of wrongly autoplaying is a 31 MB download on a metered
 * phone connection during the hero paint.
 */
function canAutoplayPreview(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof IntersectionObserver === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  // NO silent preview on phones.
  //
  // This is the single biggest performance decision on the page. The video is
  // 31 MB, it sits inside the fold, and a muted autoplay preview pulls ~3.8 MB
  // of it before the visitor has decided they want it — measured as the whole
  // difference between a 3.7s and a sub-2s LCP on a throttled 4G profile.
  //
  // This page is bought traffic, and the reported failure is people leaving
  // before it paints at all. A phone visitor gets the poster and a play
  // button; the autoplay flourish is kept for desktop, where the bandwidth is
  // not the thing standing between the ad click and the landing-page view.
  if (!window.matchMedia("(min-width: 1024px)").matches) return false;

  const conn = (navigator as Navigator & { connection?: NetworkInfo })
    .connection;
  if (conn?.saveData) return false;
  if (/(^|-)[23]g$/.test(conn?.effectiveType ?? "")) return false;
  return true;
}

export function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Quartile flags live in a ref: timeupdate fires ~4×/s and must not re-render.
  const firedRef = useRef<Set<string>>(new Set());
  // "poster" is the SSR and first-hydration state: poster image, native play
  // button, nothing fetched. It is also the permanent state for anyone who is
  // not eligible for the silent preview, so the markup React hydrates always
  // matches what the server sent.
  //
  // Eligible visitors are promoted to "preview" from inside the observer
  // below, at the moment the player scrolls into view — which is also the
  // moment the first byte of video is requested.
  const [mode, setMode] = useState<Mode>("poster");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canAutoplayPreview()) return;

    // Deliberately deferred rather than fired on mount.
    //
    // `preload="none"` only suppresses the browser's OWN speculative fetch —
    // calling play() overrides it and pulls the video immediately. On paid
    // mobile traffic that put a 31 MB download in direct competition with the
    // hero paint, which is the thing this page cannot afford to lose. So the
    // player must actually be in view before a single byte is requested.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        video.muted = true;
        // Muted autoplay is allowed almost everywhere, but Low-Power-Mode iOS
        // and some browsers still reject it — in which case we simply stay on
        // the poster and the visitor presses play.
        video
          .play()
          .then(() => setMode("preview"))
          .catch(() => {
            /* stays "poster" */
          });
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
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
          // "none", not "metadata": this page runs on paid mobile traffic and
          // the video is 31 MB. Even a metadata fetch opens a connection that
          // competes with the LCP paint on a throttled connection. The poster
          // is what the visitor sees until they ask for the video.
          preload="none"
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
            // Must CONTAIN the visible text ("Your video is playing. Click to
            // unmute.") or voice-control users cannot say what they see.
            aria-label="Your video is playing. Click to unmute and restart from the beginning."
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
