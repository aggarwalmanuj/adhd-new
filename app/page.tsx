import Image from "next/image";
import { LandingAnalytics } from "@/components/landing-analytics";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { Reveal } from "@/components/reveal";
import { ScorecardCta } from "@/components/scorecard-cta";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VslPlayer } from "@/components/vsl-player";
import type { CtaLocation } from "@/lib/analytics";

/* ==========================================================================
   ADHD Belief Score landing page. Section order, copy, and CTA tracking
   locations follow the "REBUILT CONVERSION EDITION" spec doc block by block
   (Blocks 01-14). Block numbers appear only in comments, never on the page.
========================================================================== */

const TRUST_LOGOS = [
  { src: "/logos/ibm.png", alt: "IBM" },
  { src: "/logos/microsoft.png", alt: "Microsoft" },
  { src: "/logos/tmobile.png", alt: "T-Mobile" },
  { src: "/logos/pearson.png", alt: "Pearson" },
  { src: "/logos/un.png", alt: "United Nations" },
];

const HERO_CRED_CHIPS = [
  "Four patents held by the creator",
  "Published in the Mensa Research Journal",
  "Founder & CIO, TetraNoodle Technologies",
];

/* Block 04: one broadly relevant ADHD loop, told in short lines. */
const RECOGNITION_LINES = [
  "The cursor blinks.",
  "The work matters.",
  "You may even know exactly how to do it.",
  "Then something smaller asks for your attention.",
  "A message.",
  "A new tab.",
  "A quick search.",
  "A smaller task that suddenly feels easier to finish.",
];

const RECOGNITION_AFTER = [
  "The important task remains open.",
  "The day moves.",
  "The deadline gets closer.",
  "Eventually the pressure becomes impossible to ignore.",
  "Now you move.",
  "You focus.",
  "You finish.",
  "Sometimes you produce excellent work.",
  "And because the work gets done, urgency receives the credit.",
];

/* Block 05 */
const ISOLATED_EVENTS = [
  "A late task.",
  "A forgotten detail.",
  "A burst of last-minute focus.",
  "A system abandoned after a few days.",
];

const REFLECT_ITEMS = [
  "what keeps happening;",
  "what you do next;",
  "what the experience may have come to mean;",
  "how the same conclusion may keep being reinforced.",
];

/* Block 06: the five stages of the Pattern-to-Belief Map. */
const MAP_STAGES = [
  {
    title: "The Repeated Moment",
    body: (
      <>
        <p>What keeps happening?</p>
        <p>Not:</p>
        <blockquote>&ldquo;My whole life is disorganized.&rdquo;</blockquote>
        <p>Something more specific:</p>
        <blockquote>
          &ldquo;Important work remains untouched until pressure becomes
          intense.&rdquo;
        </blockquote>
      </>
    ),
  },
  {
    title: "The Meaning",
    body: (
      <>
        <p>What may the repeated experience have taught you to believe?</p>
        <p>For example:</p>
        <blockquote>
          &ldquo;I cannot rely on myself without an emergency.&rdquo;
        </blockquote>
        <p>This is a possible interpretation. Not a verdict.</p>
      </>
    ),
  },
  {
    title: "The Reinforcing Loop",
    body: (
      <>
        <p>How might the sequence keep proving the same belief?</p>
        <p className="loop-chain">
          waiting
          <span aria-hidden> → </span>pressure
          <span aria-hidden> → </span>intense action
          <span aria-hidden> → </span>completion
          <span aria-hidden> → </span>pressure receives the credit
        </p>
      </>
    ),
  },
  {
    title: "The Moment to Watch",
    body: (
      <>
        <p>Where does the familiar pattern begin?</p>
        <p>
          Not the entire day. Not your whole personality. One moment you can
          learn to recognize.
        </p>
      </>
    ),
  },
  {
    title: "The Next Evidence",
    body: (
      <>
        <p>
          What visible action would suggest that another response is available?
        </p>
        <p>For example:</p>
        <blockquote>
          Completing one meaningful step before the deadline becomes urgent.
        </blockquote>
      </>
    ),
  },
];

/* Block 07: process demonstration steps. */
const PROCESS_STEPS = [
  {
    title: "Your Words",
    body: (
      <blockquote>
        &ldquo;I keep putting off important work even when I know exactly what
        to do. Once the deadline is close, I suddenly become
        productive.&rdquo;
      </blockquote>
    ),
  },
  {
    title: "The Repeated Moment",
    body: (
      <p>Important work remains untouched until the pressure becomes intense.</p>
    ),
  },
  {
    title: "A Possible Belief",
    body: (
      <blockquote>
        &ldquo;I cannot rely on myself without an emergency.&rdquo;
      </blockquote>
    ),
  },
  {
    title: "The Reinforcing Loop",
    body: (
      <p>
        Waiting creates pressure. Pressure creates movement. Movement gives
        urgency the credit.
      </p>
    ),
  },
  {
    title: "The Moment to Watch",
    body: (
      <p>
        The first moment attention moves away from the task while there still
        appears to be plenty of time.
      </p>
    ),
  },
  {
    title: "The Next Evidence",
    body: (
      <p>Complete one meaningful step before the deadline becomes urgent.</p>
    ),
  },
];

/* Block 07: the example result panel, styled like a product result. */
const EXAMPLE_RESULT = [
  {
    label: "Your Recurring Pattern",
    body: (
      <p>Important work remains untouched until the pressure becomes intense.</p>
    ),
  },
  {
    label: "A Possible Belief Underneath",
    body: (
      <blockquote className="text-title">
        &ldquo;I cannot rely on myself without an emergency.&rdquo;
      </blockquote>
    ),
  },
  {
    label: "How the Pattern May Keep Proving Itself",
    body: (
      <p>
        The task waits. Pressure grows. The deadline becomes louder. Urgency
        creates movement. The task gets finished. The mind records:
        &ldquo;Pressure worked.&rdquo; The next task waits again.
      </p>
    ),
  },
  {
    label: "The Moment to Watch",
    body: (
      <p>
        The first moment you move away from the task while telling yourself
        there is still time.
      </p>
    ),
  },
  {
    label: "What Different Evidence Could Look Like",
    body: (
      <p>
        Opening the task and completing one meaningful step before urgency
        takes control.
      </p>
    ),
  },
];

/* Block 09: compact credential list. */
const CREDENTIALS = [
  "Founder and CIO, TetraNoodle Technologies",
  "Creator of AI Merge",
  "Holder of four patents",
  "Published in the Mensa Research Journal",
];

/* Block 10: exact approved participant language only. Do not rewrite. */
const PARTICIPANT_PROOF = [
  {
    quote: "There’s a stress part of my brain that has gone silent.",
    name: "Nick H.",
    detail: "Video Producer · ADHD",
  },
  {
    quote:
      "It shifted something within. It’s something I’m going to be reading over and over again.",
    name: "Oliver",
    detail: "Real Estate",
  },
];

/* Block 12: the four process steps. */
const HOW_STEPS = [
  {
    title: "Choose One Pattern",
    body: "Focus on one ADHD situation that matters now. Not your entire life.",
  },
  {
    title: "Describe What Happens",
    body: "Complete a short guided reflection in your own words. There is no perfect wording. Messy answers are allowed.",
  },
  {
    title: "Receive Your Pattern-to-Belief Map",
    body: "See the repeated moment, a possible belief, the reinforcing loop, the moment to watch, and the next evidence.",
  },
  {
    title: "Decide What Fits",
    body: "Keep what feels accurate. Question, correct, refine, or reject what does not.",
  },
];

const MAP_DELIVERABLES = [
  "the repeated moment;",
  "a possible belief;",
  "the reinforcing loop;",
  "the moment to watch;",
  "the next evidence.",
];

function ChapterMark({ children }: { children: React.ReactNode }) {
  return (
    <p className="chapter text-eyebrow">
      <span className="chapter-dot" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/** Primary CTA + the reassurance line the doc requires beneath it. */
function CtaBlock({
  location,
  label = "Get Your Free ADHD Belief Score",
  microcopy = "Free · Personalized · No credit card · Not a diagnosis",
  className = "",
}: {
  location: CtaLocation;
  label?: string;
  microcopy?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <ScorecardCta
        variant="signal"
        size="lg"
        location={location}
        className="w-full min-h-11 sm:w-auto"
      >
        {label}
      </ScorecardCta>
      <p className="text-center text-sm text-faint">{microcopy}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <LandingAnalytics />
      <main id="main" className="flex-1">
        {/* ================= Block 01 · Hero ================= */}
        <section id="hero" className="relative overflow-hidden">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-16 pt-12 text-center sm:px-8 sm:pt-16">
            <Reveal>
              <p className="cred-chip">AI Merge · Free ADHD Belief Score</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-display mt-7">
                You may understand your ADHD.{" "}
                <span className="text-emphasis">
                  But what has the same repeated pattern taught you to believe
                  about yourself?
                </span>
              </h1>
            </Reveal>
          </div>

          <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
            <Reveal delay={160}>
              <VslPlayer />
            </Reveal>
            <Reveal delay={220}>
              <CtaBlock location="hero" className="mt-8" />
            </Reveal>
            <Reveal delay={280}>
              <p className="mt-3 text-center text-sm text-faint">
                Built from your own words · Based on the published AI Merge
                methodology
              </p>
            </Reveal>
          </div>

          <Reveal delay={320}>
            <ul className="mx-auto mt-10 flex w-full max-w-4xl list-none flex-wrap items-center justify-center gap-3 px-5 pb-16 sm:px-8">
              {HERO_CRED_CHIPS.map((chip) => (
                <li key={chip} className="cred-chip">
                  {chip}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ================= Block 02 · Early proof strip ================= */}
        <section className="border-y border-line bg-surface">
          <div className="mx-auto w-full max-w-3xl px-5 py-14 text-center sm:px-8">
            <Reveal>
              <h2 className="text-title">
                A Personalized Reflection Built from the Pattern You Describe
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="mt-4 text-sm text-faint">
                Published AI Merge methodology · Four patents held by the
                creator · Built from real participant language
              </p>
            </Reveal>
            {/* Awaiting an exact, approved participant statement about pattern
                recognition before a proof quote ships here. */}
            <Reveal delay={120}>
              <figure className="mx-auto mt-8 max-w-2xl">
                <div className="overflow-hidden rounded-2xl border border-line shadow-lg">
                  <Image
                    src="/take/reportsummary.png"
                    alt="A real AI Merge result screen showing an overall score with four scored dimensions and a peer benchmark"
                    width={1792}
                    height={815}
                    className="w-full"
                    sizes="(min-width: 768px) 672px, 100vw"
                  />
                </div>
                <figcaption className="mt-3 text-sm text-faint">
                  A real result screen from the live AI Merge assessment.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* ================= Block 03 · Silent skepticism ================= */}
        <section className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <ChapterMark>Before you scroll past</ChapterMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-headline mt-5">You May Already Be Thinking:</h2>
          </Reveal>
          <div className="text-body-lg mt-8 space-y-5 text-muted">
            <Reveal>
              <blockquote className="border-l-2 border-line pl-5 text-fg">
                &ldquo;I know I have ADHD. I already understand this
                pattern.&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={40}>
              <p>Or:</p>
            </Reveal>
            <Reveal delay={60}>
              <blockquote className="border-l-2 border-line pl-5 text-fg">
                &ldquo;My problem is practical. I do not need another
                explanation.&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={100}>
              <p>That may be true.</p>
            </Reveal>
            <Reveal delay={120}>
              <p>
                The ADHD Belief Score is not asking you to accept another label.
                It asks you to examine one additional question:
              </p>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="text-headline mt-9">
              <span className="text-emphasis">
                What has the repeated experience come to mean about you?
              </span>
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-body-lg mt-9 text-muted">
              You do not have to agree with the result. You only have to decide
              whether the pattern it reflects feels worth examining.
            </p>
          </Reveal>
        </section>

        {/* ============ Block 04 · Recognition and revelation ============ */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <ChapterMark>Sound familiar</ChapterMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-5">
                The Task Is Open. You Know What Needs to Happen.
              </h2>
            </Reveal>

            <div className="text-body-lg mt-9 space-y-4 text-muted">
              {RECOGNITION_LINES.map((line, i) => (
                <Reveal key={line} delay={i * 30}>
                  <p>{line}</p>
                </Reveal>
              ))}
              <Reveal delay={120}>
                <p>You tell yourself:</p>
              </Reveal>
              <Reveal delay={140}>
                <blockquote className="border-l-2 border-line pl-5 text-fg">
                  &ldquo;I still have time.&rdquo;
                </blockquote>
              </Reveal>
              {RECOGNITION_AFTER.map((line, i) => (
                <Reveal key={line} delay={i * 30}>
                  <p>{line}</p>
                </Reveal>
              ))}
              <Reveal delay={100}>
                <p>Your mind records:</p>
              </Reveal>
              <Reveal delay={120}>
                <blockquote className="border-l-2 border-line pl-5 text-fg">
                  &ldquo;Pressure is what makes me perform.&rdquo;
                </blockquote>
              </Reveal>
              <Reveal delay={140}>
                <p>So the next task waits for pressure again.</p>
              </Reveal>
            </div>

            <Reveal delay={100}>
              <p className="text-headline mt-12">
                The deadline may not only be forcing action.{" "}
                <span className="text-emphasis">
                  It may be teaching you that urgency is the only version of
                  you that can be trusted.
                </span>
              </p>
            </Reveal>

            <div className="text-body-lg mt-10 space-y-4 text-muted">
              <Reveal>
                <p>That does not mean you are lazy.</p>
              </Reveal>
              <Reveal delay={40}>
                <p>
                  It does not mean you lack intelligence, motivation, or
                  ambition.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <p>
                  It may mean that one repeated ADHD experience has gradually
                  become a belief about who you are and how you work.
                </p>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <CtaBlock location="recognition" className="mt-12" />
            </Reveal>
          </div>
        </section>

        {/* ============ Block 05 · Why this is possible now ============ */}
        <section className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <ChapterMark>Why now</ChapterMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-headline mt-5">
              Patterns That Were Hard to See Can Now Be Examined More Clearly
            </h2>
          </Reveal>
          <div className="text-body-lg mt-9 space-y-4 text-muted">
            <Reveal>
              <p>Repeated experiences are often remembered separately.</p>
            </Reveal>
            {ISOLATED_EVENTS.map((line, i) => (
              <Reveal key={line} delay={i * 40}>
                <p className="text-fg">{line}</p>
              </Reveal>
            ))}
            <Reveal delay={80}>
              <p>Each event may feel isolated.</p>
            </Reveal>
            <Reveal delay={100}>
              <p>
                But when the language, sequence, response, and conclusion are
                viewed together, a larger pattern may become visible.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p>
                Technology can now help organize those connections with more
                consistency and precision. Not to tell you who you are. Not to
                replace your judgment. To help reflect:
              </p>
            </Reveal>
          </div>
          <ul className="mt-6 grid list-none gap-3">
            {REFLECT_ITEMS.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 40}>
                <div className="flex items-start gap-3">
                  <span className="chapter-dot mt-2.5 shrink-0" aria-hidden />
                  <span className="text-body-lg text-muted">{item}</span>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={140}>
            <p className="text-title mt-10 leading-relaxed">
              The technology helps reveal the pattern.{" "}
              <span className="text-emphasis">You decide what it means.</span>{" "}
              Your actions create the evidence that matters.
            </p>
          </Reveal>
        </section>

        {/* ============ Block 06 · The Pattern-to-Belief Map ============ */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <Reveal>
                <ChapterMark>The mechanism</ChapterMark>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="text-headline mt-5">
                  Your ADHD Belief Score Creates a Pattern-to-Belief Map
                </h2>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-body-lg mt-6 text-muted">
                  Instead of giving you another general ADHD profile, the score
                  focuses on one pattern that matters now.
                </p>
              </Reveal>
            </div>

            <ol className="mt-14 grid list-none gap-5 md:grid-cols-2 xl:grid-cols-5">
              {MAP_STAGES.map((stage, i) => (
                <Reveal as="li" key={stage.title} delay={i * 60}>
                  <div className="liftable flex h-full flex-col rounded-2xl border border-line bg-card p-7">
                    <span className="text-eyebrow text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-title mt-3">{stage.title}</h3>
                    <div className="map-stage-body mt-4 space-y-3 text-sm leading-relaxed text-muted">
                      {stage.body}
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={120}>
              <CtaBlock
                location="score_definition"
                microcopy="Short guided reflection · Personalized result · No credit card"
                className="mt-14"
              />
            </Reveal>
          </div>
        </section>

        {/* ====== Block 07 · Process demonstration + example result ====== */}
        <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <ChapterMark>From your words to your map</ChapterMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-5">
                See How the ADHD Belief Score Works
              </h2>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <figure className="mx-auto mt-12 max-w-4xl">
              <div className="overflow-hidden rounded-2xl border border-line shadow-lg">
                <Image
                  src="/take/question.png"
                  alt="The guided reflection interface: a question asking you to describe a specific situation in your own words, with a free-text answer box"
                  width={1888}
                  height={906}
                  className="w-full"
                  sizes="(min-width: 1024px) 896px, 100vw"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm text-faint">
                The guided reflection from the live assessment: you answer in
                your own words.
              </figcaption>
            </figure>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Process: your language becomes the map, step by step. */}
            <ol className="relative list-none space-y-0">
              {PROCESS_STEPS.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 50}>
                  <div className="relative flex gap-5 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-card text-xs font-semibold text-signal">
                        {i + 1}
                      </span>
                      {i < PROCESS_STEPS.length - 1 && (
                        <span
                          className="mt-1 w-px flex-1 bg-line"
                          aria-hidden
                        />
                      )}
                    </div>
                    <div className="min-w-0 pb-1">
                      <h3 className="text-title">{step.title}</h3>
                      <div className="map-stage-body mt-2 space-y-2 leading-relaxed text-muted">
                        {step.body}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/* Example result panel, shaped like the live product result.
                (Real interface screenshots appear in the early-proof strip
                and above; this panel stays illustrative because its copy is
                the doc's worked ADHD example.) */}
            <Reveal delay={100}>
              <div className="relative rounded-2xl border border-line bg-card p-7 sm:p-9">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-title">
                    Example ADHD Belief Score Result
                  </h3>
                  <span className="cred-chip shrink-0">
                    Illustrative example
                  </span>
                </div>
                <dl className="mt-7 space-y-6">
                  {EXAMPLE_RESULT.map((row) => (
                    <div
                      key={row.label}
                      className="border-t border-line pt-5 first:border-t-0 first:pt-0"
                    >
                      <dt className="text-eyebrow text-signal">{row.label}</dt>
                      <dd className="map-stage-body mt-2 leading-relaxed text-muted">
                        {row.body}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>

          <div className="mx-auto mt-14 max-w-2xl text-center">
            <Reveal>
              <p className="text-title">
                Your result will be created from your own words.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <p className="text-body-lg mt-4 text-muted">
                This example does not predict what your score will say. Your
                result is a reflection for you to examine, refine, accept, or
                reject.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <CtaBlock location="sample_result" className="mt-10" />
            </Reveal>
          </div>
        </section>

        {/* ============== Block 08 · Identity transition ============== */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <ChapterMark>What actually changes</ChapterMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-5">
                The Goal Is Not to Become a Different Person
              </h2>
            </Reveal>
            <div className="text-body-lg mt-9 space-y-4 text-muted">
              <Reveal>
                <p>
                  ADHD does not have to disappear for the moment to unfold
                  differently.
                </p>
              </Reveal>
              <Reveal delay={40}>
                <p>
                  The task can still matter. The pull toward something easier
                  can still appear. The familiar sentence may still arrive:
                </p>
              </Reveal>
              <Reveal delay={80}>
                <blockquote className="border-l-2 border-line pl-5 text-fg">
                  &ldquo;I will do it later.&rdquo;
                </blockquote>
              </Reveal>
              <Reveal delay={120}>
                <p>
                  The change is not perfection. It is recognizing the moment
                  before the old conclusion takes over. It is completing one
                  meaningful action before panic becomes necessary. It is
                  beginning to collect evidence that:
                </p>
              </Reveal>
            </div>
            <Reveal delay={160}>
              <p className="text-headline mt-9">
                <span className="text-emphasis">
                  pressure is not the only state in which you can trust
                  yourself.
                </span>
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-body-lg mt-9 text-muted">
                One different action does not rewrite an identity. But it can
                interrupt the assumption that the old pattern is the only
                version of you available.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ========= Block 09 · Founder, credentials, and logos ========= */}
        <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-linear-to-t from-bg/60 via-transparent to-transparent"
                />
                <Image
                  src="/manuj/JHEMastermind-2.jpg"
                  alt="Manuj Aggarwal, creator of AI Merge"
                  width={3570}
                  height={5352}
                  className="h-96 w-full object-cover object-top lg:h-136"
                />
              </div>
            </Reveal>

            <div className="min-w-0">
              <Reveal>
                <ChapterMark>The person behind it</ChapterMark>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="text-headline mt-5">Why I Created AI Merge</h2>
              </Reveal>
              <Reveal delay={100}>
                <blockquote className="text-emphasis mt-7 text-xl leading-relaxed">
                  &ldquo;I understood the ADHD pattern. That did not always mean
                  I could change what the pattern had taught me to
                  believe.&rdquo;
                </blockquote>
              </Reveal>
              <div className="text-body-lg mt-7 space-y-4 text-muted">
                <Reveal>
                  <p>
                    I could see what was possible. I could create plans,
                    systems, strategies, and ideas. And I could still watch
                    something change when vision had to become consistent
                    action.
                  </p>
                </Reveal>
                <Reveal delay={40}>
                  <p>
                    The visible ADHD behavior was one part of the experience.
                    Underneath it were quieter questions: What did beginning
                    appear to say about me? What did finishing expose? What did
                    another delay seem to prove?
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <p>
                    Understanding ADHD gave me language for the pattern. It did
                    not automatically reveal the belief that had formed around
                    the pattern. That gap became part of the reason I created
                    AI Merge.
                  </p>
                </Reveal>
                <Reveal delay={120}>
                  <p>
                    The goal is not to ask technology to tell people who they
                    are. The goal is to help people see a connection they may
                    not have been able to see alone, and then let them decide
                    what is true.
                  </p>
                </Reveal>
              </div>
              <Reveal delay={140}>
                <p className="mt-6 font-medium text-fg">Manuj Aggarwal</p>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-10 rounded-2xl border border-line bg-card p-7">
                  <p className="text-eyebrow text-faint">About the Creator</p>
                  <ul className="mt-4 grid list-none gap-2.5 sm:grid-cols-2">
                    {CREDENTIALS.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="chapter-dot mt-1.5 shrink-0" aria-hidden />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-faint">
                    Manuj&rsquo;s work spans artificial intelligence, enterprise
                    technology, human performance, belief, identity, and
                    pattern-based transformation.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={100}>
            <div className="mt-16">
              <p className="text-eyebrow text-center text-faint">
                Professional Experience Behind AI Merge
              </p>
              <ul className="mt-8 flex list-none flex-wrap items-center justify-center gap-x-12 gap-y-6">
                {TRUST_LOGOS.map((logo) => (
                  <li
                    key={logo.alt}
                    className="relative h-9 w-24 opacity-60 grayscale sm:h-10 sm:w-28"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      fill
                      sizes="(min-width: 640px) 112px, 96px"
                      className="object-contain"
                    />
                  </li>
                ))}
              </ul>
              <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-faint">
                Organizations shown reflect prior professional work by Manuj
                Aggarwal and do not imply endorsement of the ADHD Belief Score,
                AI Merge, TetraNoodle Technologies, or this offer.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ============== Block 10 · Participant proof ============== */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <ChapterMark>In their words</ChapterMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-5">
                What Participants Have Noticed Through AI Merge
              </h2>
            </Reveal>
            <ul className="mt-12 grid list-none gap-5 sm:grid-cols-2">
              {PARTICIPANT_PROOF.map((item, i) => (
                <Reveal as="li" key={item.name} delay={i * 60}>
                  <figure className="liftable flex h-full flex-col justify-between rounded-2xl border border-line bg-card p-8">
                    <blockquote className="text-title">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 text-sm text-faint">
                      {item.name} · {item.detail}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={120}>
              <p className="mt-8 text-sm leading-relaxed text-faint">
                Individual experiences vary. These comments reflect personal
                experiences with AI Merge and do not guarantee that another
                participant will experience the same result.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ==== Block 11 · Existing ADHD support and differentiation ==== */}
        <section className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <ChapterMark>Keep what helps</ChapterMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-headline mt-5">
              This Is Not Another ADHD Productivity System
            </h2>
          </Reveal>
          <div className="text-body-lg mt-9 space-y-4 text-muted">
            <Reveal>
              <p>
                A planner can help you organize the task. A reminder can tell
                you what is late. Medication may support ADHD symptoms.
                Coaching may help with structure and follow-through. Therapy
                may support emotional history, wellbeing, and
                self-understanding. Accommodations, routines, accountability,
                and environmental support may all help.
              </p>
            </Reveal>
            <Reveal delay={40}>
              <p className="text-fg">Keep what helps.</p>
            </Reveal>
            <Reveal delay={80}>
              <p>The ADHD Belief Score examines a different question:</p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="text-headline mt-9">
              <span className="text-emphasis">
                What has this repeated ADHD moment taught you to believe about
                yourself?
              </span>
            </p>
          </Reveal>
          <div className="text-body-lg mt-9 space-y-4 text-muted">
            <Reveal>
              <p>
                It does not claim belief causes ADHD. It does not replace
                medication, therapy, coaching, diagnosis, or professional care.
                It examines how the meaning attached to a repeated ADHD
                experience may influence what happens when that moment appears
                again.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <p>
                Sometimes the next useful step is not another system. It is
                seeing the belief clearly enough to stop confusing it with your
                identity.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ===== Block 12 · How it works + essential questions ===== */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <Reveal>
                <ChapterMark>The process</ChapterMark>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="text-headline mt-5">
                  How the ADHD Belief Score Works
                </h2>
              </Reveal>
            </div>

            <ol className="mt-12 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_STEPS.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 60}>
                  <div className="liftable h-full rounded-2xl border border-line bg-card p-7">
                    <span className="text-eyebrow text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-title mt-3">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={100}>
              <p className="mx-auto mt-8 max-w-xl text-center text-body-lg text-muted">
                The ADHD Belief Score is a hypothesis for reflection, not an
                authority over your experience.
              </p>
            </Reveal>

            <Reveal delay={140}>
              <CtaBlock location="how_it_works" className="mt-10" />
            </Reveal>

            {/* Essential questions: closed by default, one open at a time
                (native exclusive accordion via the shared name attribute). */}
            <div className="mx-auto mt-20 max-w-2xl">
              <Reveal>
                <h2 className="text-headline text-center">
                  Essential Questions
                </h2>
              </Reveal>
              <Reveal delay={80}>
                <div className="mt-10">
                  <details className="faq-item" name="faq">
                    <summary>
                      Does the ADHD Belief Score claim belief causes ADHD?
                    </summary>
                    <div className="faq-body">
                      <p>No. ADHD is a real neurodevelopmental condition.</p>
                      <p>
                        The ADHD Belief Score examines whether a belief has
                        become attached to one repeated ADHD experience. It
                        does not claim that belief causes ADHD or explains
                        every ADHD difficulty.
                      </p>
                    </div>
                  </details>

                  <details className="faq-item" name="faq">
                    <summary>Is this an ADHD diagnosis?</summary>
                    <div className="faq-body">
                      <p>
                        No. The ADHD Belief Score does not determine whether
                        you have ADHD.
                      </p>
                      <p>
                        It is an educational and reflective tool. It does not
                        provide diagnosis, medical care, treatment,
                        psychotherapy, or crisis support.
                      </p>
                    </div>
                  </details>

                  <details className="faq-item" name="faq">
                    <summary>
                      Is technology deciding what is true about me?
                    </summary>
                    <div className="faq-body">
                      <p>
                        No. The technology helps organize patterns in the
                        information you choose to provide. It does not
                        independently know your history. It does not define who
                        you are.
                      </p>
                      <p>
                        The result is a possible interpretation for you to
                        examine. You remain the authority on what fits.
                      </p>
                    </div>
                  </details>

                  <details className="faq-item" name="faq">
                    <summary>
                      What if my ADHD Belief Score feels inaccurate?
                    </summary>
                    <div className="faq-body">
                      <p>
                        Treat it as a hypothesis. Keep what fits. Correct,
                        refine, or reject what does not.
                      </p>
                      <p>
                        The result is intended to support reflection, not
                        replace your judgment.
                      </p>
                    </div>
                  </details>

                  <details className="faq-item" name="faq">
                    <summary>
                      What happens with the information I provide?
                    </summary>
                    <div className="faq-body">
                      {/* TODO(launch): verify against current operating
                          practice, Privacy Policy, AI and Data Disclosure,
                          vendor configuration, retention and model-training
                          policy. */}
                      <p>
                        Your answers are used to generate your personalized
                        ADHD Belief Score. Selected team members may review
                        limited information for quality assurance, safety, or
                        support, according to the published Privacy Policy.
                      </p>
                      <p>Your information is not sold.</p>
                    </div>
                  </details>

                  <details className="faq-item" name="faq">
                    <summary>
                      Is the complete ADHD Belief Score really free?
                    </summary>
                    <div className="faq-body">
                      <p>
                        Yes. You receive your complete free ADHD Belief Score
                        before any paid offer is presented. No credit card is
                        required.
                      </p>
                      <p>
                        Afterward, you may be offered an optional paid next
                        step designed to help you work with the result more
                        deliberately. The paid next step is optional.
                      </p>
                    </div>
                  </details>

                  <details className="faq-item" name="faq">
                    <summary>
                      View research, privacy, technology, and safety details
                    </summary>
                    <div className="faq-body">
                      <h3 className="text-title">Research Foundation</h3>
                      <p>
                        Research across psychology, learning, expectations,
                        stress, identity, and performance suggests that beliefs
                        can influence what people notice, how they interpret
                        difficulty, what they avoid, how long they persist, and
                        what outcomes they begin to expect. That does not mean
                        belief causes ADHD.
                      </p>
                      {/* TODO(launch): insert approved research summary,
                          source register, methodology disclosure, exact
                          publication wording, and approved use of
                          "peer-reviewed" if applicable. */}
                      <p>
                        The AI Merge methodology combines established
                        scientific principles with a proprietary interpretive
                        framework. The ADHD Belief Score should be treated as a
                        reflective tool unless direct validation research
                        establishes stronger claims.
                      </p>

                      <h3 className="text-title">
                        How Technology Supports the Result
                      </h3>
                      <p>
                        The system uses the information you provide to help
                        organize what happened, what you did next, what the
                        repeated moment may have come to mean, what belief may
                        have formed around it, how the pattern may continue
                        reinforcing itself, and what a different response could
                        look like.
                      </p>
                      <p>
                        The system does not diagnose ADHD. It does not
                        independently access your social media, medical
                        records, or personal history.
                      </p>

                      <h3 className="text-title">Safety</h3>
                      <p>
                        The ADHD Belief Score is not a medical device, an ADHD
                        diagnostic test, medical advice, treatment,
                        psychotherapy, crisis care, an emergency service, or a
                        replacement for qualified healthcare.
                      </p>
                      <p>
                        Do not begin, stop, or change medication or treatment
                        based on the ADHD Belief Score.
                      </p>
                      <p>
                        If you are in immediate danger, experiencing a
                        mental-health emergency, or thinking about harming
                        yourself or another person, contact local emergency
                        services or an appropriate crisis-support service
                        immediately.
                      </p>
                    </div>
                  </details>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= Block 13 · Final CTA ================= */}
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-2xl px-5 py-24 text-center sm:px-8 sm:py-32">
            <Reveal>
              <h2 className="text-display">
                You already know what the ADHD pattern keeps doing.{" "}
                <span className="text-emphasis">
                  Now see what it may have taught you to believe.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-body-lg mt-8 text-muted">
                Choose one repeated ADHD pattern. Describe what happens in your
                own words. Receive your personalized Pattern-to-Belief Map
                showing:
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ul className="mx-auto mt-6 inline-grid list-none gap-2 text-left">
                {MAP_DELIVERABLES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="chapter-dot mt-2.5 shrink-0" aria-hidden />
                    <span className="text-body-lg text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={160}>
              <CtaBlock location="final" className="mt-10" />
            </Reveal>
            <Reveal delay={220}>
              <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-faint">
                Your result is a starting point for reflection. Not a final
                statement about who you are.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      {/* Block 14 lives in SiteFooter. */}
      <SiteFooter />
      <MobileStickyCta />
    </>
  );
}
