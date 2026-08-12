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
  /** Step label, e.g. "01 · Who this is for". */
  step: string;
  /** Right-hand micro-label, e.g. "30 seconds". */
  note: string;
};

export const WALKTHROUGH_FRAMES: WalkthroughFrame[] = [
  {
    step: "01 · Who this is for",
    note: "30 seconds",
    src: "/take/audience.png",
    alt: "The entry screen: a short form for your first name and email, then a choice between an individual or an organisation reading.",
    width: 1880,
    height: 892,
  },
  {
    step: "02 · Pick one moment",
    note: "In your own words",
    src: "/take/question.png",
    alt: "The first question: pick one ADHD moment that keeps repeating and describe the last real time it happened.",
    width: 1888,
    height: 906,
  },
  {
    step: "03 · Watch it reflect back",
    note: "As you go",
    src: "/take/beat.png",
    alt: "A reflection screen partway through: the moment you described is read back to you in composed language.",
    width: 1879,
    height: 891,
  },
  {
    step: "04 · Receive your score",
    note: "Instant",
    src: "/take/reportsummary.png",
    alt: "The result screen: a Belief Score out of 100 with the four dimensions listed beneath it and a peer benchmark.",
    width: 1792,
    height: 815,
  },
  {
    step: "05 · Go deeper, if you choose",
    note: "Optional",
    src: "/take/reportpdf.png",
    alt: "Page one of the written Action Plan: the score, the pattern named, and each dimension with a written reading.",
    width: 988,
    height: 769,
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
