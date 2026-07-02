import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { ScorecardCta } from "@/components/scorecard-cta";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const WEEK_PARAGRAPHS = [
  "It is Monday morning. You have a list. You know exactly what needs to happen. You sit down, and two hours later you have reorganised your desktop, watched three YouTube videos about productivity, and the list is untouched.",
  "You are not lazy. You have never been lazy. You can hyperfocus for eight hours straight on the right thing. The problem is getting to the right thing.",
  "You tell yourself: I just need a better system. A better routine. More accountability.",
  "You have tried the systems. You have read the books. You can diagnose your own patterns perfectly. And something still keeps pulling you off track at exactly the wrong moment.",
];

const EXPERIENCES = [
  {
    quote: "There's a stress part of my brain that has gone silent.",
    name: "Nick H.",
    detail: "Video Producer, ADHD",
  },
  {
    quote: "My heart was just light. I realised I'm actually blessed and that I love myself.",
    name: "Vivian",
    detail: "Entrepreneur, Marbella",
  },
  {
    quote: "I feel the change since last night. I feel enormous gratitude.",
    name: "Fatima",
    detail: "Entrepreneur, Marbella",
  },
  {
    quote: "My mind started picking the right foods unconsciously, my habits aligned without force, and I found myself feeling calm in situations that would normally shake me.",
    name: "Bansari R.",
    detail: "Entrepreneur, Goa",
  },
];

const CHANGES = [
  "The internal noise gets quieter. Not gone, but quieter.",
  "The gap between knowing and doing starts to close.",
  "Sleep improves.",
  "Less preoccupied with what others think.",
  "People around them begin responding differently, without any explanation.",
];

const FIT_YES = [
  "You know you are capable of more and something keeps getting in the way",
  "You are willing to be honest about your patterns",
  "You can commit to the process. It is not demanding, but it requires consistency",
];

const FIT_NO = [
  "You are looking for a quick hack",
  "You are in acute mental health crisis. Please seek clinical support first",
  "You already know your story and are not ready to look at it differently",
];

function ChapterMark({
  numeral,
  children,
}: {
  numeral: string;
  children: React.ReactNode;
}) {
  return (
    <p className="chapter text-eyebrow">
      <span className="chapter-dot" aria-hidden />
      <span>
        {numeral} · {children}
      </span>
    </p>
  );
}

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="mt-0.5 shrink-0 text-signal">
      <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Reassurance shown directly beneath every primary CTA: the Belief Score is
// free, and there is no pricing or payment on this page.
function FreeMicro({ className = "" }: { className?: string }) {
  return (
    <p className={`text-base ${className}`}>
      <span className="font-semibold text-signal">The Belief Score is 100% free.</span>{" "}
      <span className="text-faint">No credit card required · Under 10 minutes.</span>
    </p>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-32">
            <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
              <Reveal>
                <p className="chapter text-eyebrow">
                  <span className="chapter-dot" aria-hidden />
                  <span>AI Merge · The Belief Score</span>
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-display mt-6 break-words">
                  Your ADHD brain knows exactly what it&apos;s capable of.{" "}
                  <span className="text-emphasis">
                    Something keeps stopping it right before it lands.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="text-body-lg mt-7 max-w-xl text-muted">
                  The answer has been in your own voice all along. You just
                  haven&apos;t heard it clearly yet.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:justify-start">
                  <ScorecardCta variant="signal" size="lg">
                    Get your Belief Score
                  </ScorecardCta>
                  <a href="#what" className="btn btn-ghost">
                    What is AI Merge
                  </a>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <FreeMicro className="mt-6" />
              </Reveal>
            </div>
            <Reveal delay={200} className="relative">
              <div className="hero-glow" aria-hidden />
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-linear-to-t from-bg/70 via-transparent to-transparent"
                />
                <Image
                  src="/images/HeroSection.jpg"
                  alt="A founder working with deep focus"
                  width={920}
                  height={1100}
                  priority
                  className="ken-burns h-64 w-full object-cover sm:h-80 lg:h-136"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Does this sound like your week? */}
        <section id="week" className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-32">
            <Reveal>
              <ChapterMark numeral="I">Sound familiar</ChapterMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-5">Does this sound like your week?</h2>
            </Reveal>
            <div className="text-body-lg mt-8 space-y-5 text-muted">
              {WEEK_PARAGRAPHS.map((para, i) => (
                <Reveal key={i} delay={i * 40}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <figure className="mt-10 border-l-2 border-signal pl-6">
                <blockquote className="text-title">
                  &ldquo;It shifted something within. It&apos;s something I&apos;m
                  going to be reading over and over again.&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-faint">
                  Oliver · Real Estate, Marbella
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        {/* What you are actually looking for */}
        <section className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-32">
          <Reveal>
            <ChapterMark numeral="II">What you want</ChapterMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-headline mt-5">What you are actually looking for</h2>
          </Reveal>
          <div className="text-body-lg mt-8 space-y-5 text-muted">
            <Reveal>
              <p>
                Not another system. Not another app. Not someone telling you to
                try harder.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <p>
                Something that helps you understand why the gap keeps appearing
                between what you know you can do and what actually happens. And
                something that closes it, not by adding more to your plate, but
                by showing you what has been running underneath it all along.
              </p>
            </Reveal>
          </div>
        </section>

        {/* What AI Merge is */}
        <section id="what" className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-32">
            <Reveal>
              <ChapterMark numeral="III">The mechanism</ChapterMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-5">What AI Merge is</h2>
            </Reveal>
            <div className="text-body-lg mt-8 space-y-5 text-muted">
              <Reveal>
                <p>
                  Not a coaching programme. Not a course. Not an accountability
                  group.
                </p>
              </Reveal>
              <Reveal delay={60}>
                <p>
                  AI Merge works at the level of the story running underneath
                  your patterns. The one that was installed before you had words
                  for it. The one that has been quietly shaping every decision,
                  every half-finished project, every moment where you knew what
                  to do and did something else instead.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p>
                  We find that story. We give it back to you in the most
                  powerful sound in the universe for any human being.
                </p>
              </Reveal>
            </div>
            <Reveal delay={160}>
              <p className="text-display mt-8">
                Your own <span className="text-emphasis">voice.</span>
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-body-lg mt-8 text-muted">
                What happens after that is something we reveal only once you
                begin. What we can tell you: once you understand what we mean,
                you will see immediately why nothing else has worked the way this
                does.
              </p>
            </Reveal>
          </div>
        </section>

        {/* What people experienced */}
        <section id="experiences" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-32">
          <Reveal>
            <ChapterMark numeral="IV">Real words</ChapterMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-headline mt-5 max-w-2xl">What people experienced</h2>
          </Reveal>
          <ul className="mt-12 grid list-none gap-5 sm:grid-cols-2">
            {EXPERIENCES.map((item, i) => (
              <Reveal as="li" key={item.name} delay={i * 50}>
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
        </section>

        {/* What changes */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-32">
            <Reveal>
              <ChapterMark numeral="V">What changes</ChapterMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-5">What changes</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-body-lg mt-6 text-muted">
                We do not make clinical claims. Every person&apos;s experience is
                different.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-8 text-eyebrow text-faint">
                What people consistently report
              </p>
            </Reveal>
            <ul className="mt-6 grid list-none gap-4">
              {CHANGES.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 40}>
                  <div className="flex items-start gap-3">
                    <Check />
                    <span className="leading-relaxed text-muted">{item}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* How to start */}
        <section className="border-y border-line">
          <div className="mx-auto w-full max-w-2xl px-5 py-20 text-center sm:px-8 sm:py-32">
            <Reveal>
              <h2 className="text-headline">Get your free Belief Score</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-body-lg mx-auto mt-5 max-w-xl text-muted">
                Five questions. Under ten minutes. Your score appears instantly.
                Absolutely free.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-10 flex justify-center">
                <ScorecardCta variant="signal" size="lg">
                  Get your Belief Score
                </ScorecardCta>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <FreeMicro className="mt-5" />
            </Reveal>
          </div>
        </section>

        {/* Teams */}
        <section className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-32">
          <Reveal>
            <ChapterMark numeral="VI">For teams</ChapterMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-headline mt-5">
              Also available for teams and organisations
            </h2>
          </Reveal>
          <div className="text-body-lg mt-8 space-y-5 text-muted">
            <Reveal>
              <p>
                AI Merge works for teams too. When the people on a team can
                finally see themselves and each other clearly, without the
                invisible stories shaping every conflict, every misalignment,
                every conversation that goes sideways, everything changes.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <p>
                The team edition uses the same mechanism. Different lens. Same
                results.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-emphasis text-lg">
                Choose individual or team when you click below.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Is this for you? */}
        <section id="for-you" className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-32">
            <Reveal>
              <ChapterMark numeral="VII">Honest fit</ChapterMark>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-5">Is this for you?</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-line bg-card p-8">
                  <h3 className="text-title">Yes, if</h3>
                  <ul className="mt-6 grid list-none gap-4">
                    {FIT_YES.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check />
                        <span className="leading-relaxed text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="h-full rounded-2xl border border-line bg-card p-8">
                  <h3 className="text-title">Not for you if</h3>
                  <ul className="mt-6 grid list-none gap-4">
                    {FIT_NO.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="mt-0.5 shrink-0 text-faint">
                          <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                        </svg>
                        <span className="leading-relaxed text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Your data is safe */}
        <section className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-32">
          <Reveal>
            <ChapterMark numeral="VIII">Your data</ChapterMark>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-headline mt-5">Your data is safe</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-body-lg mt-6 leading-relaxed text-muted">
              Your information passes through our private systems. Selected team
              members may review your narratives for quality assurance. Your data
              is never shared or sold. Anonymised option available. Just ask.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <a
              href="mailto:feedback@tetranoodle.com"
              className="mt-5 inline-block font-medium text-fg underline decoration-signal underline-offset-4 transition-colors hover:text-signal"
            >
              feedback@tetranoodle.com
            </a>
          </Reveal>
        </section>

        {/* Final CTA */}
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
            <Reveal>
              <h2 className="text-display">
                See yourself clearly.{" "}
                <span className="text-emphasis">Build from that belief.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-10 flex justify-center">
                <ScorecardCta variant="signal" size="lg">
                  Get your Belief Score
                </ScorecardCta>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <FreeMicro className="mt-6" />
            </Reveal>
            <Reveal delay={220}>
              <p className="mx-auto mt-12 max-w-xl text-xs leading-relaxed text-faint">
                © Manuj Aggarwal &amp; TetraNoodle Technologies · Mensa Research
                Journal, Vol. 56, No. 2, 2025
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
