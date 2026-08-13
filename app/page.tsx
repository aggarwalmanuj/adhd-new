import Image from "next/image";
import { FaqItem } from "@/components/faq-item";
import { CtaBlock } from "@/components/landing/cta-block";
import {
  ClosingTimeline,
  DimensionRadar,
  Flywheel,
  Strata,
} from "@/components/landing/illustrations";
import { MomentPicker } from "@/components/landing/moment-picker";
import { Reveal } from "@/components/landing/reveal";
import { ScrollChrome } from "@/components/landing/scroll-chrome";
import { ScrollEffects } from "@/components/landing/scroll-effects";
import { Walkthrough } from "@/components/landing/walkthrough";
import { WordsToMap } from "@/components/landing/words-to-map";
import { LandingAnalytics } from "@/components/landing-analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VslPlayer } from "@/components/vsl-player";
import { Photo, PhotoOverlay } from "@/components/landing/photo";
import { TestimonialReel } from "@/components/landing/testimonial-reel";
import {
  CRED_LOGOS,
  FOUNDER_PHOTO,
  PHOTO_BREATHER,
  PHOTO_CLOSING,
  PHOTO_LIVING,
  PHOTO_WANTED,
  PHOTO_WEEK,
} from "@/lib/landing-assets";

/* ==========================================================================
   ADHD Belief Score landing page.

   Section order follows the design spec exactly:
     hero → 01 recognition → 02 ledger → 03 why it repeats → 04 breather
     → 05 from your words to your map → 06 the number → 07 the ten minutes
     → 08 why not another system → 09 who built it → 10 questions → closing

   Every section below the hero is a SERVER component. The only client code on
   the page is: the CTA (attribution URL), the VSL player, the picker in 01,
   and one <ScrollEffects> that drives every scroll-triggered effect.

   Typography, buttons and the navbar come from the Parents design system —
   .text-display / .text-headline / .btn-signal etc. in globals.css. The spec
   HTML's gold gradient buttons and cream sections are deliberately NOT used.
========================================================================== */

/* --------------------------- section primitives ---------------------------
   All three are lifted from the Parents landing page so the two funnels share
   one rhythm: same max width, same gutters, same vertical padding, same
   chapter-head grid, same animated rule. Do not re-tune these per section.
-------------------------------------------------------------------------- */

/** Section shell. `tint` alternates the ground so adjacent sections separate
 *  without introducing a second (light) palette. */
function Section({
  id,
  tint = false,
  orbs = false,
  labelledBy,
  children,
}: {
  id?: string;
  tint?: boolean;
  orbs?: boolean;
  labelledBy?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative overflow-hidden border-t border-line py-16 sm:py-24 lg:py-28 ${
        tint ? "bg-surface" : ""
      }`}
    >
      {orbs && <div className="section-orbs" aria-hidden />}
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-10 lg:px-16">
        {children}
      </div>
    </section>
  );
}

/** Chapter head: numbered mark, a two-clause serif headline, optional lede in
 *  the right column. The 7/5 split is Parents' — it is what stops a headline
 *  and its lede reading as two unrelated blocks. */
function ChapterHead({
  mark,
  id,
  lead,
  emphasis,
  children,
}: {
  mark: string;
  id?: string;
  /** First clause, upright. */
  lead: string;
  /** Second clause, italic, on its own line. */
  emphasis?: string;
  /** Right-column lede. One sentence, or nothing. */
  children?: React.ReactNode;
}) {
  return (
    <Reveal className="grid items-end gap-8 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <p className="eyebrow mb-6">{mark}</p>
        {/* Separate block spans, not raw text + a span: without the wrapper
            the two clauses concatenate with no whitespace in the accessible
            name, even though the visual line break looks right. */}
        <h2 id={id} className="text-section">
          <span className="block">{lead}</span>
          {emphasis && <span className="block font-serif-italic">{emphasis}</span>}
        </h2>
      </div>
      {children && <div className="lg:col-span-5">{children}</div>}
    </Reveal>
  );
}

/** The animated rule that separates a chapter head from its content. */
function ChapterRule({ className = "my-12 sm:my-16" }: { className?: string }) {
  return (
    <Reveal delay={150} className={className}>
      <div className="hairline-anim hairline" />
    </Reveal>
  );
}

/** Section lede — the one-sentence right column of a chapter head. */
function Lede({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-[1.8] text-muted">{children}</p>;
}

/* ---------------------------------- data --------------------------------- */

const HERO_CHECKLIST = [
  "Your score out of 100, and how it compares",
  "Four dimensions behind the number",
  "The one moment your own answers keep circling",
  "The next step that would prove something different",
];

/** The three credibility lines under the hero CTA.
 *
 *  `short` is what phones show: the full sentences wrap to five lines at
 *  375px and push the CTA off the fold, which is the one thing the v7 hero
 *  layout exists to prevent. Desktop has the room for the full versions. */
const HERO_CRED = [
  {
    short: "Mensa Research Journal",
    full: "Built on AI Merge · published in the Mensa Research Journal",
  },
  { short: "4 patents", full: "Four patents held by the creator" },
  { short: "Not a diagnosis", full: "Reflective tool · not a diagnosis" },
];

const WEEK = [
  { when: "Monday", what: "You know exactly what needs doing. You even want to do it.", peak: false },
  { when: "Tuesday", what: "Something smaller gets finished instead. It was easier to start.", peak: false },
  { when: "Wednesday", what: "Still open. Still fine. There is still time.", peak: false },
  { when: "Thursday, 11pm", what: "Now you move. Full focus. Sometimes your best work.", peak: true },
  { when: "Friday", what: "Relief, and a quiet thought: next time I’ll start early.", peak: false },
];

/** v4 illustration A: the week as five columns. `h` is the bar's height as a
 *  percentage of the plot area. Thursday is the whole point of the chart. */
const WEEK_BARS = [
  { day: "Mon", h: 9, cap: "barely", peak: false },
  { day: "Tue", h: 14, cap: "a little", peak: false },
  { day: "Wed", h: 11, cap: "still not", peak: false },
  { day: "Thu 11pm", h: 92, cap: "all of it", peak: true },
  { day: "Fri", h: 22, cap: "the rest", peak: false },
];

const LEDGER_COST = [
  "The idea you had in March, still unopened",
  "The version of the work only you could have made, traded for the version that fit the last four hours",
  "Evenings paid back to a deadline that never had to get that loud",
  "The apology you make to yourself on Friday, and mean",
];

const LEDGER_WANT = [
  "To open the important thing first, once, and see what happens",
  "To do the good work without the panic tax on top of it",
  "To finish and still have the evening",
  "To trust yourself without needing an emergency to prove it",
];

const LOOP_STEPS = [
  {
    title: "The task matters",
    body: "You know what to do and you want it done. Nothing is wrong yet.",
  },
  {
    title: "Something smaller wins",
    body: "A tab, a message, a task that will actually close today. Closing something feels like proof you are working.",
  },
  {
    title: "Pressure arrives",
    body: "The deadline gets loud enough to be unignorable, and suddenly starting is no longer optional.",
  },
  {
    title: "You deliver — and the wrong thing gets the credit",
    body: "The work is done, so your mind files the receipt under pressure worked. Not I worked.",
    tag: "This is the step that repeats",
  },
];

/** The four scored dimensions. `pillar` maps to --pillar-1..4 (see globals). */
const DIMENSIONS = [
  {
    name: "Direction Clarity",
    value: 58,
    pillar: 1,
    ask: "Can you say what you actually want here?",
  },
  {
    name: "Identity Alignment",
    value: 29,
    pillar: 2,
    ask: "Does how you work match who you are?",
  },
  {
    name: "Decision Readiness",
    value: 46,
    pillar: 3,
    ask: "Can you start instead of circling?",
  },
  {
    name: "Energy Alignment",
    value: 43,
    pillar: 4,
    ask: "What is this pattern costing you to hold?",
  },
];

/** The three score bands.
 *
 *  The middle band matters most and was missing: with only "under 36" and
 *  "76 and above" on the page, the whole centre of the scale went unexplained
 *  — and 44, the number shown right beside it, falls in that gap. A visitor
 *  who lands mid-range could read the two extremes and conclude neither
 *  described them. */
/** The illustrative score, and the peer benchmark, in one place. */
const SCORE = 44;
const PEER_AVG = 48;

const BANDS = [
  {
    level: "Under 36",
    title: "The moment is deciding for you",
    body: "The response arrives before you have chosen it, so the same week keeps repeating. This is where the most room to move sits.",
    high: false,
  },
  {
    level: "36 – 75",
    title: "Some of it is yours",
    body: "Where most people land. The four dimensions show which part is holding you back.",
    high: false,
  },
  {
    level: "76 and above",
    title: "You are deciding",
    body: "You can open the thing that matters, take one real step, and let the day end without needing a rescue.",
    high: true,
  },
];

const TIERS = [
  {
    kicker: "Free · on screen in ~10 min",
    title: "Your ADHD Belief Score",
    body: "Your number out of 100, the four dimensions behind it, and the moment your own answers keep circling back to.",
    featured: true,
  },
  {
    kicker: "Optional · after your score",
    title: "The full written breakdown",
    body: "The belief your words point to, where the loop starts, and the point where you have more choice than it feels like you do.",
    featured: false,
  },
  {
    kicker: "Optional · if you want to go further",
    title: "The AI Merge program",
    body: "The guided path for people who would rather work a pattern than read about one.",
    featured: false,
  },
];

const FIT_YES = [
  "You have ADHD, diagnosed or strongly suspected",
  "You know what to do and still do not start",
  "You have read the advice and it did not change the moment",
  "You are willing to describe one situation honestly",
];

const FIT_NO = [
  "You are looking for a diagnosis or a clinical assessment",
  "You want a productivity template to install this afternoon",
  "You are in crisis and need immediate support — please contact a qualified service",
];

const CREDS = [
  { label: "Founder & CIO", value: "TetraNoodle Technologies" },
  { label: "Four patents", value: "Granted" },
  { label: "Mensa Research Journal", value: "Published methodology" },
  { label: "AI Merge", value: "Creator of the method" },
];

const QUOTES = [
  {
    quote: "There’s a stress part of my brain that has gone silent.",
    by: "Nick H. · Video Producer · ADHD",
  },
  {
    quote: "It shifted something within. It’s something I’m going to be reading over and over again.",
    by: "Oliver · Real Estate",
  },
];

const SCOPE_DOES = [
  "One repeated moment",
  "The words you use for it",
  "The meaning that formed around it",
  "Where the next choice sits",
];

const SCOPE_DOES_NOT = [
  "Diagnose ADHD",
  "Replace medication or therapy",
  "Read your mind or your history",
  "Decide who you are",
];

const FAQS = [
  {
    q: "Is this an ADHD diagnosis?",
    a: "No. It does not determine whether you have ADHD. It is an educational and reflective tool, and it is not diagnosis, medical care, treatment, psychotherapy, or crisis support.",
    open: true,
  },
  {
    q: "Does this claim belief causes ADHD?",
    a: "No. ADHD is a real neurodevelopmental condition. The score examines whether a belief has become attached to one repeated ADHD experience. It does not claim belief causes ADHD or explains every ADHD difficulty.",
    open: false,
  },
  {
    q: "Is it really free?",
    a: "Yes. You receive your complete ADHD Belief Score before any paid offer is presented, and no credit card is required. Afterward you may be offered an optional next step. It is optional.",
    open: false,
  },
  {
    q: "What if the result feels inaccurate?",
    a: "Treat it as a hypothesis, not a verdict. Keep what fits. Correct, refine, or reject what does not. You remain the authority on your own experience.",
    open: false,
  },
  {
    q: "Is technology deciding what is true about me?",
    a: "No. It organises patterns in the information you choose to provide. It does not know your history, your medical records, or your social media, and it does not define who you are.",
    open: false,
  },
  {
    q: "How long does it really take?",
    a: "About ten minutes. Five questions, answered in your own words. There is no perfect wording and messy answers are fine — the reflection is built from how you actually talk.",
    open: false,
  },
  {
    q: "What happens with the information I provide?",
    a: "Your answers are used to generate your personalised score. Selected team members may review limited information for quality assurance, safety, or support, according to the published Privacy Policy. Your information is not sold.",
    open: false,
  },
];

/* ---------------------------------- page --------------------------------- */

export default function Home() {
  return (
    <>
      <LandingAnalytics />
      <ScrollEffects />
      <ScrollChrome />
      <SiteHeader />

      <main id="main" className="relative flex-1">
        <div className="ambient-field" aria-hidden />
        <div className="page-vignette" aria-hidden />

        {/* ============================ HERO ============================
            Structure, copy and the checklist are kept exactly as specified.
            Only the typography and the button treatment change: .text-display
            and .btn-signal, both from the Parents system. */}
        {/* Parents' hero shape exactly: a centred column — chip, headline,
            one line of sub-copy, then the video and the CTA at full column
            width. Nothing sits beside the headline, so the h1 gets the whole
            measure and the video is never competing with it for the fold. */}
        {/* ============================ HERO (spec v7) ============================
            Two columns from 900px — copy + CTA left, video right, one eyeful.
            Below that, a budgeted stack: headline → video → CTA, with the
            explainer and checklist pushed below the fold. See .hero-grid in
            globals.css for the measurements this is based on. */}
        <section id="hero" className="relative overflow-hidden">
          <div className="spotlight-hero" aria-hidden />

          <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-10 lg:px-16">
            <div className="hero-grid">
              <div className="hero-copy">
                <Reveal immediate className="hero-chip">
                  <p className="cred-chip">
                    For adults with ADHD · free, no card
                  </p>
                </Reveal>

                <Reveal immediate className="hero-head">
                  <h1 id="hero-headline" className="text-display">
                    You don’t want your ADHD fixed.{" "}
                    <span className="text-emphasis">
                      You want to finish the thing you started.
                    </span>
                  </h1>
                </Reveal>

                <Reveal immediate className="hero-sub">
                  <p className="text-body-lg text-muted">
                    A free 10-minute reflection. One ADHD moment, five
                    questions, your score on screen.
                  </p>
                </Reveal>

                <Reveal immediate className="hero-cta">
                  <CtaBlock
                    location="hero"
                    label="Get My Free ADHD Belief Score"
                    labelShort="Get My Free Score"
                    className="items-center lg:items-start"
                  />

                  {/* Credibility sits directly under the CTA microcopy, inside
                      the first screen. It is the answer to "why should I trust
                      this?" — which a visitor asks at the moment they look at
                      the button, not several scrolls later. `immediate` and no
                      reveal delay, because anything above the fold must paint
                      from the HTML rather than wait on the observer. */}
                  <ul className="hero-cred mt-3 flex list-none flex-wrap justify-center gap-x-2 gap-y-0.5 text-center text-[0.75rem] leading-snug text-faint lg:mt-4 lg:flex-col lg:gap-y-1 lg:text-left lg:text-[0.8rem]">
                    {HERO_CRED.map((item, i) => (
                      <li key={item.full} className="flex items-center gap-2">
                        {/* Separator only between items, and only while they
                            share a line (phones). Hidden once the list stacks. */}
                        {i > 0 && (
                          <span aria-hidden className="text-faint/50 lg:hidden">
                            ·
                          </span>
                        )}
                        <span className="lg:hidden">{item.short}</span>
                        <span className="hidden lg:inline">{item.full}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <Reveal immediate className="hero-video">
                <VslPlayer />
              </Reveal>

              {/* Everything that is NOT headline, video or button. On a phone
                  this sits below the fold by design. */}
              <div className="hero-extras">
                <Reveal delay={280}>
                  <div className="mb-12 rounded-xl border border-line bg-surface p-5 sm:p-7">
                    <p className="mx-auto max-w-[60ch] text-center text-ink lg:mx-0 lg:text-left">
                      The{" "}
                      <strong className="font-medium">ADHD Belief Score</strong>{" "}
                      asks you to describe one ADHD moment that keeps
                      repeating, then shows you what that moment has quietly
                      taught you to believe about yourself.
                    </p>
                    <ul className="mt-4 grid list-none gap-3 border-t border-line pt-4 text-left sm:grid-cols-2 sm:gap-x-8">
                      {HERO_CHECKLIST.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <CheckDot />
                          <span className="text-[0.95rem] text-muted">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

              </div>
            </div>
          </div>
        </section>

        {/* ==================== 01 · THE WEEK YOU ALREADY KNOW ==================== */}
        <Section tint orbs labelledBy="recognition-heading">
          <ChapterHead
            mark="01 · The ADHD week you already know"
            id="recognition-heading"
            lead="It never happens on one bad day."
            emphasis="It happens on a hundred ordinary ones."
          >
            <Lede>
              Most ADHD advice describes the behaviour. This is about one week
              you have probably already lived.
            </Lede>
          </ChapterHead>

          <ChapterRule />

          {/* v4 illustration A: the week as five columns. A column chart
              states "four days of almost nothing, then one night of
              everything" more directly than a line, because the eye compares
              heights without having to trace a path. */}
          <div className="grid gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6">
            <Reveal className="min-w-0 lg:col-span-8">
              <figure className="relative h-full rounded-xl border border-line bg-surface shadow-[var(--elev-1)]">
                <figcaption className="absolute left-6 top-6 max-w-[22ch] text-sm text-faint">
                  How much of the important task actually got done each day
                </figcaption>
                <div
                  data-anim="bars"
                  className="grid h-[280px] grid-cols-5 items-end gap-3 px-6 pt-7 sm:h-[340px] sm:gap-5 sm:px-8 sm:pt-8"
                >
                  {WEEK_BARS.map((bar) => (
                    <div key={bar.day} className="flex h-full flex-col justify-end">
                      <span
                        className={`bar-cap mb-2 text-center font-serif text-[0.95rem] ${
                          bar.peak ? "text-signal" : "text-faint"
                        }`}
                      >
                        {bar.cap}
                      </span>
                      <span
                        className={`bar-fill w-full rounded-t-lg border border-b-0 ${
                          bar.peak
                            ? "border-signal bg-gradient-to-b from-signal to-signal/20 shadow-[0_0_44px_rgb(var(--glow)/.22)]"
                            : "border-signal/20 bg-gradient-to-b from-signal/20 to-signal/5"
                        }`}
                        style={{ "--bar-h": `${bar.h}%` } as React.CSSProperties}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-3 border-t border-line px-6 pb-6 pt-3 sm:gap-5 sm:px-8 sm:pb-7">
                  {WEEK_BARS.map((bar) => (
                    <span
                      key={bar.day}
                      className={`text-center text-[0.86rem] font-medium ${
                        bar.peak ? "text-ink" : "text-faint"
                      }`}
                    >
                      {bar.day}
                    </span>
                  ))}
                </div>
              </figure>
            </Reveal>

            <Reveal delay={100} className="min-w-0 lg:col-span-4">
              <Photo
                slot={PHOTO_WEEK}
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="h-full min-h-64"
              >
                <PhotoOverlay>
                  <p className="font-serif text-xl leading-snug text-ink">
                    By Thursday it is not a plan any more. It is a rescue.
                  </p>
                  <p className="mt-2 text-sm text-faint">
                    And the rescue always works, which is the problem.
                  </p>
                </PhotoOverlay>
              </Photo>
            </Reveal>
          </div>

          <div className="mt-8">
            <Reveal delay={100} className="min-w-0">
              <ol className="list-none overflow-hidden rounded-xl border border-line">
                {WEEK.map((row) => (
                  <li
                    key={row.when}
                    className={`grid gap-x-4 border-t border-line px-5 py-4 first:border-t-0 sm:grid-cols-[8rem_1fr] sm:items-baseline ${
                      row.peak ? "bg-accent-soft" : "bg-surface/45"
                    }`}
                  >
                    <span className="font-serif text-[0.95rem] text-signal">
                      {row.when}
                    </span>
                    <span className={row.peak ? "text-ink" : "text-muted"}>
                      {row.what}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <Reveal>
            <blockquote className="mt-12 max-w-[64ch] border-l-2 border-signal pl-6">
              {/* v6 "key line": the one sentence that has to land even if the
                  section is skimmed. Set larger than body copy so the eye
                  stops on it. */}
              <p className="keyline">
                The work got done, so pressure took the credit.
              </p>
              <p className="mt-3 text-muted">
                Do that a few hundred times and it stops being a schedule. It
                becomes a sentence about you:{" "}
                <em className="text-emphasis">
                  nothing moves unless it is an emergency.
                </em>
              </p>
              <footer className="mt-3 text-sm text-faint">
                Not laziness. Not a shortage of intelligence, motivation, or
                ambition.
              </footer>
            </blockquote>
          </Reveal>

          <Reveal>
            <div className="mt-12">
              <MomentPicker />
            </div>
          </Reveal>
        </Section>

        {/* ==================== 02 · WHAT IT IS ACTUALLY COSTING ==================== */}
        <Section labelledBy="ledger-heading">
          <ChapterHead
            mark="02 · What ADHD is actually costing you"
            id="ledger-heading"
            lead="The problem was never the task."
            emphasis="It is everything the task is standing in front of."
          >
            <Lede>
              Ask most people what ADHD costs them and they name the thing they
              missed. It is rarely the thing.
            </Lede>
          </ChapterHead>

          <ChapterRule />

          {/* v4: the two versions of the same week, as pictures. The ledger
              below states them in words; the diptych makes the gap felt
              before it is read. */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <Reveal className="min-w-0">
              <Photo
                slot={PHOTO_LIVING}
                ratio="4 / 3"
                sizes="(min-width: 768px) 46vw, 100vw"
                className="[&_img]:saturate-50 [&_img]:brightness-[0.62]"
              >
                <PhotoOverlay badge="The version you are living">
                  <p className="font-serif text-xl leading-snug text-ink">
                    Finishing at midnight, and calling it focus.
                  </p>
                </PhotoOverlay>
              </Photo>
            </Reveal>
            <Reveal delay={80} className="min-w-0">
              <Photo
                slot={PHOTO_WANTED}
                ratio="4 / 3"
                sizes="(min-width: 768px) 46vw, 100vw"
              >
                <PhotoOverlay badge="The version you want">
                  <p className="font-serif text-xl leading-snug text-ink">
                    Finishing on Wednesday, and still having the evening.
                  </p>
                </PhotoOverlay>
              </Photo>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="grid overflow-hidden rounded-xl border border-line md:grid-cols-2">
              <div className="border-b border-line p-6 sm:p-8 md:border-b-0 md:border-r">
                <h3 className="text-eyebrow mb-5">
                  What the pattern quietly takes
                </h3>
                <ul className="grid list-none gap-4">
                  {LEDGER_COST.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted">
                      <span
                        className="mt-3 h-px w-3 shrink-0 bg-[var(--muted-foreground)]"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-accent-soft p-6 sm:p-8">
                <h3 className="text-eyebrow mb-5 text-signal">
                  What you actually want
                </h3>
                <ul className="grid list-none gap-4">
                  {LEDGER_WANT.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-fg">
                      <CheckDot />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <p className="keyline mt-8 max-w-[44rem]">
              Nothing on the right requires a different brain. It requires one
              moment to go differently — and knowing which moment that is.
            </p>
          </Reveal>

          <Reveal>
            <CtaBlock
              location="ledger"
              label="Find My Moment"
              className="mt-9"
            />
          </Reveal>
        </Section>

        {/* ==================== 03 · WHY IT REPEATS ==================== */}
        <Section tint orbs labelledBy="loop-heading">
          <ChapterHead
            mark="03 · Why the ADHD loop repeats"
            id="loop-heading"
            lead="A loop does not need your permission."
            emphasis="It only needs to work once."
          >
            <Lede>
              Four steps. The fourth is the one that keeps the wheel turning.
            </Lede>
          </ChapterHead>

          <ChapterRule />

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            {/* The diagram leads at 7 columns — it IS the argument of this
                section, and at 5 it was too small to read its own labels. */}
            <Reveal className="min-w-0 lg:col-span-7">
              <Flywheel />
            </Reveal>

            <div className="min-w-0 lg:col-span-5">
              <ol className="relative list-none">
                {/* the spine */}
                <span
                  className="absolute left-[7px] top-2 bottom-2 w-px bg-line"
                  aria-hidden
                />
                {LOOP_STEPS.map((step, i) => (
                  <Reveal as="li" key={step.title} delay={i * 70} className="relative pb-7 pl-10 last:pb-0">
                    <span
                      className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 ${
                        i === LOOP_STEPS.length - 1
                          ? "border-signal bg-signal"
                          : "border-signal bg-bg"
                      }`}
                      aria-hidden
                    />
                    <h3 className="text-title">{step.title}</h3>
                    <p className="mt-1.5 text-muted">{step.body}</p>
                    {step.tag && (
                      <span className="text-eyebrow mt-3 inline-block rounded-full border border-signal px-3 py-1 text-signal">
                        {step.tag}
                      </span>
                    )}
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </Section>

        {/* ==================== 04 · BREATHER ==================== */}
        <section
          // No vertical padding: the photo sets the height and the copy is
          // absolutely centred over it.
          className="relative border-y border-line text-center"
          aria-labelledby="breather-heading"
        >
          {/* v4: the breather runs full-bleed behind a photograph. It is the
              one section with no argument to make — the picture carries it. */}
          <Photo
            slot={PHOTO_BREATHER}
            sizes="100vw"
            quietPlaceholder
            className="!rounded-none !border-x-0 min-h-[62vh]"
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/70 to-bg/95"
            />
          </Photo>
          <div className="absolute inset-0 mx-auto flex w-full max-w-3xl flex-col justify-center px-5 text-center sm:px-8">
            <Reveal>
              <h2 id="breather-heading" className="text-section mx-auto max-w-[22ch]">
                <span className="block">ADHD does not have to disappear</span>
                <span className="block font-serif-italic">
                  for Thursday to go differently.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-body-lg mx-auto mt-6 max-w-[56ch] text-muted">
                The pull toward something easier can still show up. The
                sentence <em>I’ll do it later</em> can still arrive. The change
                is catching the one moment before the old conclusion takes
                over.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ============== 05 · FROM YOUR WORDS TO YOUR MAP ============== */}
        <Section tint orbs labelledBy="mechanism-heading">
          <ChapterHead
            mark="05 · From your words to your map"
            id="mechanism-heading"
            lead="You write one messy paragraph."
            emphasis="Here is what comes back."
          >
            <Lede>
              Left: what one person typed. Right: the five things the Belief
              Score gave back.
            </Lede>
          </ChapterHead>

          <ChapterRule />

          <WordsToMap />

          <Reveal>
            <CtaBlock
              location="mechanism"
              label="Map My Pattern"
              className="mt-10"
            />
          </Reveal>
        </Section>

        {/* ==================== 06 · THE NUMBER ==================== */}
        <Section labelledBy="score-heading">
          <ChapterHead
            mark="06 · Your ADHD Belief Score"
            id="score-heading"
            lead="One number for the thing"
            emphasis="you cannot see yourself."
          >
            <Lede>
              It scores{" "}
              <strong className="font-medium text-ink">
                how much of that one ADHD moment you are actually choosing
              </strong>
              . It does not score your ADHD, and it is not a grade.
            </Lede>
          </ChapterHead>

          <ChapterRule />

          {/* v6: ONE linear scale replaces the bell curve. A distribution
              asks the reader to decode a shape before they can find
              themselves on it; a track with two marks — you, and where most
              people start — says the same thing at a glance. */}
          <Reveal>
            <div
              data-anim="score"
              className="rounded-xl border border-line bg-surface p-6 shadow-[var(--elev-1)]"
            >
              <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr] sm:gap-7">
                <div>
                  <span className="score-number block font-serif text-[clamp(3.5rem,3rem+4vw,5.5rem)] leading-[0.95] text-signal">
                    44
                  </span>
                  <p className="text-sm text-faint">out of 100 · illustrative</p>
                </div>

                <div>
                  <div
                    className="score-scale"
                    style={{ "--score-pos": `${SCORE}%` } as React.CSSProperties}
                  >
                    <span className="track" aria-hidden />
                    <span className="avg" style={{ left: `${PEER_AVG}%` }}>
                      <i aria-hidden />
                      <span>most start near {PEER_AVG}</span>
                    </span>
                    <span className="you">
                      <span>you</span>
                      <i aria-hidden />
                    </span>
                  </div>
                  <div className="flex justify-between text-[0.78rem] text-faint">
                    <span>0 · the moment decides</span>
                    <span>100 · you decide</span>
                  </div>
                </div>
              </div>

              {/* Three bands, not two. The middle one is where most people
                  actually land — and where the 44 above sits — so leaving it
                  out let a mid-range visitor read both extremes and conclude
                  neither described them. */}
              <div className="mt-5 grid gap-2.5">
                {BANDS.map((band) => (
                  <div
                    key={band.level}
                    className={`grid items-baseline gap-4 rounded-xl border p-4 sm:grid-cols-[5.5rem_1fr] ${
                      band.high
                        ? "border-signal/40 bg-accent-soft"
                        : "border-line bg-bg/30"
                    }`}
                  >
                    <span
                      className={`text-[0.72rem] uppercase tracking-[0.16em] ${
                        band.high ? "text-signal" : "text-faint"
                      }`}
                    >
                      {band.level}
                    </span>
                    <div>
                      <b className="font-medium text-ink">{band.title}</b>
                      <p className="mt-0.5 text-sm text-muted">{band.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* The radar and the four bars, side by side: the shape gives the
              gestalt, the bars give the numbers. */}
          <div
            data-anim="radar"
            className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-10"
          >
            <Reveal className="min-w-0">
              <DimensionRadar />
              <p className="mt-3 text-center text-sm text-faint">
                A wider shape means more of the moment is yours.
              </p>
            </Reveal>

            <Reveal delay={100} className="min-w-0">
              <div className="grid gap-3.5">
                {DIMENSIONS.map((dim) => (
                  <div key={dim.name} className="grid gap-1.5">
                    <span className="flex items-baseline gap-2.5">
                      <i
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 -translate-y-px rounded-[3px]"
                        style={{ background: `var(--pillar-${dim.pillar})` }}
                      />
                      <b className="font-medium text-ink">{dim.name}</b>
                      <span
                        className="ml-auto font-serif text-lg"
                        style={{ color: `var(--pillar-${dim.pillar}-ink)` }}
                      >
                        {dim.value}
                      </span>
                    </span>
                    {/* Decorative: the number above already carries the value. */}
                    <span className="dim-bar" aria-hidden>
                      <i
                        style={
                          {
                            "--bar-w": `${dim.value}%`,
                            background: `var(--pillar-${dim.pillar})`,
                          } as React.CSSProperties
                        }
                      />
                    </span>
                    <span className="text-sm text-faint">{dim.ask}</span>
                  </div>
                ))}
                <p className="mt-1 text-sm text-faint">
                  Colour only says which dimension it is, never how good the
                  number is.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <CtaBlock
              location="score_definition"
              label="See My Number"
              className="mt-9"
            />
          </Reveal>
        </Section>

        {/* ==================== 07 · THE TEN MINUTES ==================== */}
        <Section tint labelledBy="ten-heading">
          <ChapterHead
            mark="07 · The ten minutes, screen by screen"
            id="ten-heading"
            lead="See the whole thing"
            emphasis="before you begin."
          >
            <Lede>
              Every screen you will meet, in order. No call to book before you
              see a result, and no card at any point.
            </Lede>
          </ChapterHead>

          <ChapterRule />

          <Reveal delay={150}>
            <Walkthrough />
          </Reveal>

          <p className="mt-4 text-sm text-faint">
            Illustrative — yours is built from your own words.
          </p>

          <ul className="mt-14 grid list-none gap-4 md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <Reveal
                as="li"
                key={tier.title}
                delay={i * 70}
                className={`rounded-xl border p-6 ${
                  tier.featured
                    ? "border-signal/50 bg-accent-soft shadow-[var(--elev-2)]"
                    : "border-line bg-bg"
                }`}
              >
                <span className="text-eyebrow block text-signal">
                  {tier.kicker}
                </span>
                <h3 className="text-title mt-3">{tier.title}</h3>
                <p className="mt-2 text-sm text-muted">{tier.body}</p>
              </Reveal>
            ))}
          </ul>
          <p className="mt-4 text-sm text-faint">
            Step one is free and complete on its own. You are never required to
            buy anything to receive it.
          </p>

          <Reveal>
            <CtaBlock
              location="how_it_works"
              label="Start Question One"
              className="mt-9"
            />
          </Reveal>
        </Section>

        {/* ================ 08 · WHY NOT ANOTHER SYSTEM ================ */}
        <Section labelledBy="layers-heading">
          <ChapterHead
            mark="08 · Where this sits in your ADHD support"
            id="layers-heading"
            lead="You have already tried"
            emphasis="the layer above this one."
          >
            <Lede>
              Keep every one of them. They work on real things. None of them is
              aimed at the layer underneath.
            </Lede>
          </ChapterHead>

          <ChapterRule />

          <Reveal delay={140}>
            <div className="mx-auto max-w-3xl">
              <Strata />
            </div>
          </Reveal>

          <Reveal>
            <p className="keyline mt-8 max-w-[44rem]">
              The next useful step may not be another system. It may be seeing
              the belief clearly enough to stop mistaking it for your identity.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-xl border border-line p-6">
                <h3 className="text-eyebrow mb-4 text-signal">
                  Worth ten minutes if
                </h3>
                <ul className="grid list-none gap-3">
                  {FIT_YES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted">
                      <span className="mt-2.5 h-px w-2.5 shrink-0 bg-signal" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="h-full rounded-xl border border-line p-6">
                <h3 className="text-eyebrow mb-4">Probably not for you if</h3>
                <ul className="grid list-none gap-3">
                  {FIT_NO.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted">
                      <span
                        className="mt-2.5 h-px w-2.5 shrink-0 bg-[var(--muted-foreground)]"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ==================== 09 · WHO BUILT IT ==================== */}
        <Section tint orbs labelledBy="founder-heading">
          <ChapterHead
            mark="09 · Who built the ADHD Belief Score"
            id="founder-heading"
            lead="I could see the pattern."
            emphasis="I could not see what it had taught me."
          />

          <ChapterRule />

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal delay={150} className="min-w-0 lg:col-span-4">
              {/* Square crop, top-weighted so it takes the face rather than
                  centring on the torso. Same treatment as Parents. */}
              <figure className="mx-auto w-full max-w-[400px]">
                <div className="signal-halo relative aspect-square overflow-hidden rounded-xl border border-line shadow-[var(--elev-2)]">
                  <Image
                    src={FOUNDER_PHOTO.src}
                    alt={FOUNDER_PHOTO.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover object-top"
                  />
                </div>
              </figure>
            </Reveal>

            <Reveal delay={250} className="min-w-0 lg:col-span-8">
              <div className="space-y-5 text-[1.05rem] leading-[1.85] text-muted">
                <p>
                  I could create plans, systems, and strategies. I could still
                  watch something change the moment vision had to become
                  consistent action.
                </p>
                <p>
                  Understanding ADHD gave me language for the behaviour. It did
                  not automatically reveal the belief that had formed around it.
                  That gap is why I built the Belief Score, using AI Merge, a
                  methodology I created and published in the{" "}
                  <em>Mensa Research Journal</em>.
                </p>
                <p className="font-serif-italic text-xl text-ink">
                  The result is not meant to replace your judgment. It is meant
                  to give you something clear enough to examine.
                </p>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-title">Manuj Aggarwal</p>
                {/* As a card grid each claim is countable at a glance, rather
                    than a wall of prose beside a portrait. */}
                <ul className="mt-4 grid list-none gap-2.5 sm:grid-cols-2">
                  {CREDS.map((c) => (
                    <li
                      key={c.label}
                      className="flex items-start gap-3 rounded-lg border border-line bg-card px-4 py-3"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden />
                      <span className="min-w-0">
                        <b className="block text-sm font-semibold text-fg">
                          {c.label}
                        </b>
                        <span className="text-sm text-faint">{c.value}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* v4: participant clips. Posters only until one is tapped —
                  see TestimonialReel. Placed under the bio so the founder
                  block itself keeps the layout it already had. */}
              <p className="eyebrow mt-9">In their words · tap a clip to play</p>
              <TestimonialReel />
            </Reveal>
          </div>

          <div className="mt-11 grid gap-4 md:grid-cols-2">
            {QUOTES.map((q, i) => (
              <Reveal as="figure" key={q.by} delay={i * 80} className="border-l-2 border-signal/60 pl-5">
                <blockquote className="text-title">“{q.quote}”</blockquote>
                <figcaption className="mt-2 text-sm text-faint">{q.by}</figcaption>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 max-w-[76ch] text-xs leading-relaxed text-faint">
            Individual experiences vary. These accounts reflect experiences
            across the broader AI Merge work rather than the free ADHD Belief
            Score, and do not guarantee that another participant will receive
            the same result.
          </p>

          {/* Logo strip — same treatment as Parents: a bordered block with an
              eyebrow, a 2-up/5-up grid, and grayscale logos that come to full
              colour on hover. `fill` inside a fixed-height cell is what keeps
              five logos of wildly different aspect ratios optically level;
              the previous flat `h-5` row made the UN roundel tiny and IBM huge. */}
          <Reveal delay={300}>
            <div className="mt-16 border-t border-line pt-10">
              <p className="eyebrow mb-8 text-center">Prior professional work</p>
              <ul className="grid list-none grid-cols-2 items-center justify-items-center gap-x-10 gap-y-8 sm:grid-cols-5 sm:gap-x-12">
                {CRED_LOGOS.map((logo) => (
                  <li key={logo.src} className="relative h-7 w-full">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      loading="lazy"
                      sizes="(min-width: 640px) 120px, 100px"
                      // These are DARK-inked logos on transparent PNGs, so
                      // Parents' plain `grayscale` leaves them almost invisible
                      // on the navy ground. `brightness-0 invert` flattens each
                      // to pure white first, then opacity does the recessing —
                      // same visual weight as Parents, but legible here.
                      className="object-contain opacity-55 brightness-0 invert transition-opacity duration-700 hover:opacity-90"
                    />
                  </li>
                ))}
              </ul>
              {/* Mandatory whenever the strip is shown. */}
              <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-faint">
                Organizations shown reflect prior professional work by Manuj
                Aggarwal and do not imply endorsement of the ADHD Belief Score,
                AI Merge, TetraNoodle Technologies, or this offer.
              </p>
            </div>
          </Reveal>
        </Section>

        {/* ==================== 10 · BEFORE YOU START ==================== */}
        <Section labelledBy="faq-heading">
          <ChapterHead
            mark="10 · Before you start"
            id="faq-heading"
            lead="Questions"
            emphasis="people with ADHD ask."
          />

          <ChapterRule />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
            <Reveal className="min-w-0 lg:col-span-5">
              <div className="rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
                <h3 className="text-eyebrow mb-4 text-signal">
                  What it looks at
                </h3>
                <ul className="grid list-none gap-2.5">
                  {SCOPE_DOES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-fg">
                      <CheckDot />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-eyebrow mb-4 mt-7">What it does not do</h3>
                <ul className="grid list-none gap-2.5">
                  {SCOPE_DOES_NOT.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-muted">
                      <span
                        className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border border-dashed border-[var(--muted-foreground)]"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100} className="min-w-0 lg:col-span-7">
              {FAQS.map((item) => (
                <FaqItem key={item.q} question={item.q} defaultOpen={item.open}>
                  <p>{item.a}</p>
                </FaqItem>
              ))}
            </Reveal>
          </div>
        </Section>

        {/* ==================== CLOSING ==================== */}
        <section
          className="relative border-t border-line text-center"
          aria-labelledby="closing-heading"
        >
          <Photo
            slot={PHOTO_CLOSING}
            sizes="100vw"
            quietPlaceholder
            className="!rounded-none !border-x-0 min-h-[70vh]"
          >
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/70 to-bg/95"
            />
          </Photo>
          <div className="absolute inset-0 mx-auto flex w-full max-w-3xl flex-col justify-center px-5 py-12 sm:px-8">
            <Reveal>
              <div className="mx-auto mb-8 max-w-xl">
                <ClosingTimeline />
              </div>
            </Reveal>
            <Reveal>
              <h2 id="closing-heading" className="text-section mx-auto max-w-[19ch]">
                <span className="block">
                  The next task is already on your list.
                </span>
                <span className="block font-serif-italic">
                  You decide who opens it.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="text-body-lg mx-auto mt-6 max-w-[46ch] text-muted">
                Five questions about one ADHD moment, in your own words, and
                your Belief Score on screen straight away.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <CtaBlock
                location="final"
                label="Get My Free ADHD Belief Score"
                labelShort="Get My Free Score"
                align="center"
                className="mt-9"
              />
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-8 text-sm text-faint">
                Your result is a personalised hypothesis. You decide what fits.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

/** The teal tick used by the hero checklist, the ledger and the scope card. */
function CheckDot() {
  return (
    <span
      aria-hidden
      className="mt-1.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-accent-soft"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path
          d="M1.5 5.2L3.8 7.5L8.5 2.5"
          stroke="var(--signal)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
