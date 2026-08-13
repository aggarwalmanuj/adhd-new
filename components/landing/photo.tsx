// Photo slot: renders a real image, or a labelled placeholder when the shot
// has not been supplied yet (see PhotoSlot in lib/landing-assets.ts).
//
// The placeholder is deliberately designed rather than a grey box. It holds
// the exact aspect ratio the final image will occupy, so the page's rhythm is
// already correct and dropping the file in later changes nothing else — and
// it prints the shot brief, so whoever sources the photo can read what is
// needed without opening the code.
//
// A SERVER component.

import Image from "next/image";
import type { PhotoSlot } from "@/lib/landing-assets";

export function Photo({
  slot,
  /** CSS aspect-ratio for the frame, e.g. "4 / 3". */
  ratio,
  sizes,
  className = "",
  /** Renders the scrim + caption overlay used by the diptych and bleeds. */
  children,
  /** `fill` images need a positioned parent; the caller supplies the box. */
  priority = false,
  /**
   * Suppress the placeholder's brief text.
   *
   * Set on FULL-BLEED slots, where the section's own headline is positioned
   * on top of this box — printing the brief there renders two overlapping
   * blocks of copy. The empty frame still holds the correct height, and the
   * brief is still readable in lib/landing-assets.ts.
   */
  quietPlaceholder = false,
  /**
   * CSS object-position for the image, e.g. "50% 25%".
   *
   * Needed whenever a portrait file lands in a landscape frame: the default
   * centre crop takes the middle of a tall photo, which is usually a torso
   * rather than a face.
   */
  focus,
}: {
  slot: PhotoSlot;
  ratio?: string;
  sizes: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
  quietPlaceholder?: boolean;
  focus?: string;
}) {
  const empty = slot.src === null;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-(--border-soft) ${
        empty ? "border-dashed" : ""
      } ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {empty ? (
        <div className="absolute inset-0 grid place-items-center bg-surface p-6 text-center">
          {/* Faint hatch so an empty slot never reads as a broken image. */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, var(--ink) 0 1px, transparent 1px 10px)",
            }}
          />
          {!quietPlaceholder && (
            <div className="relative max-w-[38ch]">
              <p className="eyebrow mb-2 text-signal">Photo to add</p>
              <p className="text-sm leading-relaxed text-faint">{slot.needs}</p>
            </div>
          )}
        </div>
      ) : (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
          style={focus ? { objectPosition: focus } : undefined}
        />
      )}
      {children}
    </div>
  );
}

/** The gradient + caption overlay used on the diptych panels and the bleeds. */
export function PhotoOverlay({
  badge,
  children,
}: {
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-bg/10 to-bg/95"
      />
      {badge && (
        <span className="eyebrow absolute left-4 top-4 rounded-full border border-(--border-soft) bg-bg/70 px-3 py-1.5">
          {badge}
        </span>
      )}
      {children && (
        <div className="absolute inset-x-0 bottom-0 p-6">{children}</div>
      )}
    </>
  );
}
