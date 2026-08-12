import Image from "next/image";
import { FaqItem } from "@/components/faq-item";
import { CtaBlock } from "@/components/landing/cta-block";
import {
  ClosingTimeline,
  LayerStack,
  LoopDiagram,
  ScoreGauge,
  WeekChart,
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
import { CRED_LOGOS, FOUNDER_PHOTO } from "@/lib/landing-assets";

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

const HERO_CRED = [
  "Built on AI Merge · published in the Mensa Research Journal",
  "Four patents held by the creator",
  "Reflective tool · not a diagnosis",
];

const WEEK = [
  { when: "Monday", what: "You know exactly what needs doing. You even want to do it.", peak: false },
  { when: "Tuesday", what: "Something smaller gets finished instead. It was easier to start.", peak: false },
  { when: "Wednesday", what: "Still open. Still fine. There is still time.", peak: false },
  { when: "Thursday, 11pm", what: "Now you move. Full focus. Sometimes your best work.", peak: true },
  { when: "Friday", what: "Relief, and a quiet thought: next time I’ll start early.", peak: false },
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
    body: "How clearly you can say what you actually want out of this task, in your own words.",
  },
  {
    name: "Identity Alignment",
    value: 29,
    pillar: 2,
    body: "How closely the way you work matches the person you know you are capable of being.",
  },
  {
    name: "Decision Readiness",
    value: 46,
    pillar: 3,
    body: "How ready you are to start it instead of going round the same loop one more time.",
  },
  {
    name: "Energy Alignment",
    value: 43,
    pillar: 4,
    body: "How much of your energy this pattern is quietly using up before you begin.",
  },
];

const BANDS = [
  {
    level: "Under 36",
    title: "The moment is deciding for you",
    body: "The response arrives before you have chosen it, so the same week keeps repeating. This is where the most room to move sits.",
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
      {/* The video poster is the LCP element on mobile (the silent autoplay
          preview is desktop-only — see canAutoplayPreview in vsl-player).
          A <video poster> is discovered late and fetched at low priority, so
          it is preloaded explicitly: this is the image the ad click is waiting
          on, and it was the difference between a ~3.7s and a ~1.5s LCP. */}
      <link
        rel="preload"
        as="image"
        href="/video/vsl-poster.jpg"
        fetchPriority="high"
      />
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
        <section id="hero" className="relative overflow-hidden">
          <div className="spotlight-hero" aria-hidden />

          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-7 pt-8 text-center sm:px-8 sm:pb-10 sm:pt-16">
            <Reveal immediate>
              <p className="cred-chip">
                For adults with ADHD · free, no card
              </p>
            </Reveal>

            <Reveal immediate>
              <h1 id="hero-headline" className="text-display mt-6 sm:mt-8">
                You don’t want to be fixed.{" "}
                <span className="text-emphasis">
                  You want to finish the thing you started.
                </span>
              </h1>
            </Reveal>

            <Reveal immediate>
              <p className="text-body-lg mt-6 max-w-[52ch] text-muted">
                The plan exists. The ability exists. So why does the work only
                move when it is almost too late?
              </p>
            </Reveal>
          </div>

          <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
            <Reveal immediate>
              <VslPlayer />
            </Reveal>
            <Reveal immediate>
              <CtaBlock
                location="hero"
                label="Get My Free ADHD Belief Score"
                labelShort="Get My Free Score"
                align="center"
                className="mt-8"
              />
            </Reveal>

            {/* "What you get" — kept from the spec, below the CTA so it
                supports the button rather than delaying it. */}
            <Reveal delay={280}>
              <div className="mt-10 rounded-xl border border-line bg-surface p-6 sm:p-7">
                <h2 className="eyebrow mb-5 text-center">
                  What you get, in about 10 minutes
                </h2>
                <ul className="mx-auto grid max-w-2xl list-none gap-3 sm:grid-cols-2">
                  {HERO_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckDot />
                      <span className="text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={320}>
            <ul className="mx-auto mt-8 flex w-full max-w-4xl list-none flex-wrap justify-center gap-x-7 gap-y-2 px-5 pb-16 text-center text-sm text-faint sm:px-8">
              {HERO_CRED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ==================== 01 · THE WEEK YOU ALREADY KNOW ==================== */}
        <Section tint orbs labelledBy="recognition-heading">
          <ChapterHead
            mark="01 · The week you already know"
            id="recognition-heading"
            lead="It never happens on one bad day."
            emphasis="It happens on a hundred ordinary ones."
          />

          <ChapterRule />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <Reveal className="min-w-0 lg:col-span-7">
              <figure className="rounded-xl border border-line bg-bg p-6 shadow-[var(--elev-2)]">
                <figcaption className="eyebrow mb-5">
                  Effort on the thing that actually matters
                </figcaption>
                <WeekChart />
                <p className="mt-3 text-center text-sm text-faint">
                  A shape most people recognise. Not a measurement of you.
                </p>
              </figure>
            </Reveal>

            <Reveal delay={100} className="min-w-0 lg:col-span-5">
              <ol className="list-none">
                {WEEK.map((row) => (
                  <li
                    key={row.when}
                    className="grid gap-x-4 border-t border-line py-3.5 first:border-t-0 first:pt-0 sm:grid-cols-[130px_1fr] sm:items-baseline"
                  >
                    <span
                      className={`font-serif text-[0.95rem] ${
                        row.peak ? "text-signal" : "text-faint"
                      }`}
                    >
                      {row.when}
                    </span>
                    <span className={row.peak ? "font-medium text-fg" : "text-muted"}>
                      {row.what}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <Reveal>
            <blockquote className="mt-12 max-w-[64ch] border-l-2 border-signal pl-6">
              <p className="text-title">
                The work got done, so pressure took the credit. Do that a few
                hundred times and it stops being a schedule. It becomes a
                sentence about you:{" "}
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
            mark="02 · What it is actually costing"
            id="ledger-heading"
            lead="The problem was never the task."
            emphasis="It is everything the task is standing in front of."
          />

          <ChapterRule />

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
            <p className="text-body-lg mt-8 max-w-[66ch] text-muted">
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
            mark="03 · Why it repeats"
            id="loop-heading"
            lead="A loop does not need your permission."
            emphasis="It only needs to work once."
          />

          <ChapterRule />

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            {/* The diagram leads at 7 columns — it IS the argument of this
                section, and at 5 it was too small to read its own labels. */}
            <Reveal className="min-w-0 lg:col-span-7">
              <LoopDiagram />
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
          className="relative border-t border-line py-16 text-center sm:py-24"
          aria-labelledby="breather-heading"
        >
          <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8">
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
                The pull toward something easier can still show up. The sentence{" "}
                <em>I’ll do it later</em> can still arrive. The change is not
                becoming a different person. It is catching the one moment
                before the old conclusion takes over.
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
              No clever wording required. This is a real example of the path
              from a sentence to a map.
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
            mark="06 · The number"
            id="score-heading"
            lead="One number for the thing"
            emphasis="you cannot see yourself."
          >
            <Lede>
              Your score places how much of that moment you are actually
              choosing, and how much of it was decided before you arrived.
            </Lede>
          </ChapterHead>

          <ChapterRule />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
            <Reveal className="min-w-0 lg:col-span-5">
              <div className="rounded-xl border border-line bg-surface p-6 lg:sticky lg:top-24">
                <ScoreGauge />
                <div className="mt-5 grid gap-3">
                  {BANDS.map((band) => (
                    <div
                      key={band.level}
                      className={`rounded-xl border p-5 ${
                        band.high
                          ? "border-signal/40 bg-accent-soft"
                          : "border-line bg-bg"
                      }`}
                    >
                      <span className="text-eyebrow block text-signal">
                        {band.level}
                      </span>
                      <h3 className="text-title mt-2">{band.title}</h3>
                      <p className="mt-2 text-sm text-muted">{band.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="min-w-0 lg:col-span-7">
              {/* data-anim="meters" — the observer fills every bar inside. */}
              <Reveal>
                <div
                  data-anim="meters"
                  className="grid gap-px overflow-hidden rounded-xl border border-line bg-line"
                >
                  {DIMENSIONS.map((dim) => (
                    <div key={dim.name} className="bg-surface p-5 sm:p-6">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-title">{dim.name}</h3>
                        <span
                          className="font-serif text-3xl"
                          style={{ color: `var(--pillar-${dim.pillar}-ink)` }}
                        >
                          {dim.value}
                        </span>
                      </div>
                      {/* The bar is decorative: the number beside it already
                          carries the value for assistive tech. */}
                      <div
                        className="mt-3.5 h-1 overflow-hidden rounded-full bg-[var(--muted-surface)]"
                        aria-hidden
                      >
                        <span
                          className="meter-fill block h-full rounded-full"
                          style={
                            {
                              "--meter-w": `${dim.value}%`,
                              background: `var(--pillar-${dim.pillar})`,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                      <p className="mt-3 text-sm text-muted">{dim.body}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal>
                <p className="mt-5 text-sm text-faint">
                  It is not a grade, and it does not rate you as a person, a
                  professional, or a parent. A lower number means more room to
                  move.
                </p>
              </Reveal>

              <Reveal>
                <CtaBlock
                  location="score_definition"
                  label="See My Number"
                  className="mt-8"
                />
              </Reveal>
            </div>
          </div>
        </Section>

        {/* ==================== 07 · THE TEN MINUTES ==================== */}
        <Section tint labelledBy="ten-heading">
          <ChapterHead
            mark="07 · The ten minutes"
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
            mark="08 · Why not another system"
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
              <LayerStack />
            </div>
          </Reveal>

          <Reveal>
            <p className="text-body-lg mt-8 max-w-[66ch] text-muted">
              Sometimes the next useful step is not another system. It is seeing
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
            mark="09 · Who built it"
            id="founder-heading"
            lead="I could see the pattern."
            emphasis="I could not see what the pattern had taught me."
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
            emphasis="people ask."
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
          className="relative border-t border-line py-16 text-center sm:py-24"
          aria-labelledby="closing-heading"
        >
          <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8">
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
                Five questions, your own words, your score immediately.
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
