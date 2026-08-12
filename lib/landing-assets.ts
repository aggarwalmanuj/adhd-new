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
    meta: "30 seconds",
    src: "/take/audience.png",
    width: 1880,
    height: 892,
    alt: "The entry screen: a short form for your first name and email, then a choice between an individual or an organisation reading.",
    what: "Your first name and the email your result is sent to.",
    why: "Your answers stay private and the score is yours to keep. Free, with no credit card.",
  },
  {
    n: "02",
    title: "Pick one moment",
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
    meta: "Optional",
    src: "/take/reportpdf.png",
    width: 988,
    height: 769,
    alt: "Page one of the written Action Plan: the score, the pattern named, and each dimension with a written reading.",
    what: "A full written breakdown built around your exact answers.",
    why: "What the pattern means, where the loop starts, and what shifts when it lifts.",
  },
];

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
