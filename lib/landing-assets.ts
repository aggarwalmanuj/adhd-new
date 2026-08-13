// SINGLE SOURCE OF TRUTH for every image on the landing page.
//
// ▸ To swap in a new ADHD screenshot: drop the file in /public/take/ and change
//   the `src` below. Nothing else on the page needs touching.
//
// `width`/`height` are the file's INTRINSIC pixel dimensions, not its rendered
// size. next/image needs them to reserve the right aspect ratio before the
// bytes arrive, which is what keeps CLS at zero. If you replace a file with one
// of different proportions, update these two numbers too.

export type LandingImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Section 07 · "The ten minutes" — the five screens, in order. */
export type WalkthroughFrame = LandingImage & {
  /** Two-digit step number shown in the tablist. */
  n: string;
  /** Step title. */
  title: string;
  /** Short label for the tab rail — must stay short enough to fit a pill. */
  tab: string;
  /** Duration / kind, e.g. "30 seconds". */
  meta: string;
  /** Caption clause 1 — what the visitor actually does on this screen. */
  what: string;
  /** Caption clause 2 — why it is worth doing. */
  why: string;
};

export const WALKTHROUGH_FRAMES: WalkthroughFrame[] = [
  {
    n: "01",
    title: "Tell us who this is for",
    tab: "Who it’s for",
    meta: "30 seconds",
    src: "/take/audience.png",
    width: 1880,
    height: 892,
    alt: "The entry screen: a short form for your first name and email, then a choice between an individual or an organisation reading.",
    what: "Your first name and the email your result is sent to.",
    why: "Your answers stay private and the score is yours to keep.",
  },
  {
    n: "02",
    title: "Pick one moment",
    tab: "One moment",
    meta: "In your own words",
    src: "/take/question.png",
    width: 1888,
    height: 906,
    alt: "The first question: pick one ADHD moment that keeps repeating and describe the last real time it happened.",
    what: "Five open questions about one repeated moment, in your own words.",
    why: "There is nothing to study and no right answer. Messy answers are genuinely fine.",
  },
  {
    n: "03",
    title: "Watch it reflect back",
    tab: "Reflect back",
    meta: "As you go",
    src: "/take/beat.png",
    width: 1879,
    height: 891,
    alt: "A reflection screen partway through: the moment you described is read back to you in composed language.",
    what: "Between questions, what you described is read back to you in plain language.",
    why: "This is where most people feel seen: language for what they knew but had not named.",
  },
  {
    n: "04",
    title: "Receive your score",
    tab: "Your score",
    meta: "Instant",
    src: "/take/reportsummary.png",
    width: 1792,
    height: 815,
    alt: "The result screen: a Belief Score out of 100 with the four dimensions listed beneath it and a peer benchmark.",
    what: "Your ADHD Belief Score across four dimensions, and the pattern underneath it.",
    why: "A precise, honest score. Not a label, and not a diagnosis.",
  },
  {
    n: "05",
    title: "Go deeper, if you choose",
    tab: "Go deeper",
    meta: "Optional",
    src: "/take/reportpdf.png",
    width: 988,
    height: 769,
    alt: "Page one of the written Action Plan: the score, the pattern named, and each dimension with a written reading.",
    what: "A full written breakdown built around your exact answers.",
    why: "What the pattern means, where the loop starts, and what shifts when it lifts.",
  },
];

/* ---------------------------------------------------------------------------
   PHOTOGRAPHY (spec v4)

   Each slot is either a real file or `null`. A null slot renders a styled,
   labelled placeholder frame at the correct aspect ratio — the layout is
   final either way, so dropping a file in later changes nothing but the
   picture. To fill one: add the file to /public/images/ and replace `null`
   with { src, alt, width, height }.

   Three slots are deliberately EMPTY rather than filled from the existing
   library, because the available photo contradicts the copy it sits under.
   Each carries a `needs` note describing the shot to source. Using a
   stressed-man stock photo under a line about calm mornings would undercut
   the sentence it is meant to support.
--------------------------------------------------------------------------- */

export type PhotoSlot =
  | (LandingImage & { needs?: never })
  /** Not yet supplied — renders a placeholder. `needs` is the shot brief. */
  | { src: null; needs: string; alt: string };

/** 01 · beside the week chart. */
export const PHOTO_WEEK: PhotoSlot = {
  src: "/images/Week.jpg",
  alt: "Someone at a desk, head in hand, the work still open in front of them.",
  width: 941,
  height: 1412,
};

/** 02 · left panel, "the version you are living". */
export const PHOTO_LIVING: PhotoSlot = {
  src: "/images/Looking.avif",
  alt: "Turned away from the desk toward a window, coffee going cold.",
  width: 6000,
  height: 4000,
};

/** 02 · right panel, "the version you want".
 *
 *  A tall portrait (4480x6720) dropped into a 4:3 landscape panel, so the
 *  crop matters: `object-position` is set to the top third in page.tsx so the
 *  frame keeps his face and the daylight window rather than centring on the
 *  sofa. A default centre crop cut his head off. */
export const PHOTO_WANTED: PhotoSlot = {
  src: "/images/wanted.avif",
  alt: "Leaning back from the desk in daylight, hands behind head, unhurried.",
  width: 4480,
  height: 6720,
};

/** 04 · full-bleed breather background.
 *
 *  Morning light raking across a wall, one mug, one frame. It earns the slot
 *  by what it leaves out: no people, no screens, no office. The left two
 *  thirds is empty wall, which is where the headline sits — a busier image
 *  would fight the words it exists to support. */
export const PHOTO_BREATHER: PhotoSlot = {
  src: "/images/breather.jpg",
  alt: "Morning light falling across a wall above a desk with a mug and a picture frame.",
  width: 5040,
  height: 3360,
};

/** Closing · full-bleed background.
 *
 *  An open blank notebook, pen resting on it, coffee poured, daylight and
 *  greenery through the window. It carries the closing line — "You decide who
 *  opens it" — because nothing in it has started yet.
 *
 *  An earlier candidate had the same subject but was mostly shadow with
 *  near-black corners; under the scrim it read as gloom rather than
 *  possibility, which is the opposite of what this section argues. */
export const PHOTO_CLOSING: PhotoSlot = {
  src: "/images/closing.avif",
  alt: "An open blank notebook and a cup of coffee on a windowsill in morning light.",
  width: 4634,
  height: 3082,
};

/**
 * Section 09 · the testimonial reel. Posters only; clips load on demand.
 *
 * TODO(names): the spec labelled clips 1 and 2 as "Nick H." and "Oliver", but
 * those names do not match the people in the actual files (clip-1 is a woman;
 * clip-4 captions itself "Lee Killingsworth"). Attributing a real testimonial
 * to the wrong person is not a cosmetic error, so every clip is labelled
 * neutrally until someone who knows the recordings supplies the right names.
 * Several clips caption their own speaker on screen, which is a good source.
 */
export const TESTIMONIAL_CLIPS = [
  { poster: "/video/testimonials/posters/clip-1.jpg", src: "/video/testimonials/clip-1.mp4", label: "AI Merge participant" },
  { poster: "/video/testimonials/posters/clip-2.jpg", src: "/video/testimonials/clip-2.mp4", label: "AI Merge participant" },
  { poster: "/video/testimonials/posters/clip-3.jpg", src: "/video/testimonials/clip-3.mp4", label: "AI Merge participant" },
  { poster: "/video/testimonials/posters/clip-4.jpg", src: "/video/testimonials/clip-4.mp4", label: "AI Merge participant" },
  { poster: "/video/testimonials/posters/clip-5.jpg", src: "/video/testimonials/clip-5.mp4", label: "AI Merge participant" },
  { poster: "/video/testimonials/posters/clip-6.jpg", src: "/video/testimonials/clip-6.mp4", label: "AI Merge participant" },
] as const;

/** Section 09 · founder portrait. */
export const FOUNDER_PHOTO: LandingImage = {
  src: "/manuj/closeup.jpg",
  alt: "Manuj Aggarwal, creator of AI Merge",
  width: 1400,
  height: 1867,
};

/** Section 09 · prior-work logos. Served locally, never hotlinked. */
export const CRED_LOGOS: LandingImage[] = [
  { src: "/logos/ibm.png", alt: "IBM", width: 2500, height: 1000 },
  { src: "/logos/microsoft.png", alt: "Microsoft", width: 500, height: 500 },
  { src: "/logos/tmobile.png", alt: "T-Mobile", width: 225, height: 225 },
  { src: "/logos/pearson.png", alt: "Pearson", width: 1420, height: 1556 },
  { src: "/logos/un.png", alt: "United Nations", width: 3840, height: 3269 },
];

/** Hero VSL. Left exactly as it was: same file, same poster, preload="none". */
export const VSL = {
  src: "/video/vsl-adhd-v1.mp4",
  poster: "/video/vsl-poster.jpg",
} as const;
