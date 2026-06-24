import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WaitlistCta } from "@/components/waitlist-cta";

const LOGOS = [
  { src: "/logos/ibm.png", alt: "IBM" },
  { src: "/logos/microsoft.png", alt: "Microsoft" },
  { src: "/logos/pearson.png", alt: "Pearson" },
  { src: "/logos/tmobile.png", alt: "T-Mobile" },
  { src: "/logos/un.png", alt: "United Nations" },
];

const SYMPTOMS = [
  {
    title: "47 open tabs, zero closed loops",
    body: "You start brilliantly. Then a newer, shinier idea walks in and the half-built thing joins the graveyard.",
  },
  {
    title: "Hyperfocus you can't aim",
    body: "When it locks in, you do a week's work in a day. The problem is you can't choose when, or on what.",
  },
  {
    title: "Systems that fit someone else's brain",
    body: "Every planner, framework, and morning routine was designed for linear thinkers. You're not one.",
  },
  {
    title: "Smart enough to know better",
    body: "You've read the books. You can diagnose your own patterns perfectly. Insight was never the missing piece.",
  },
];

const PILLARS = [
  {
    step: "01",
    title: "Systems built for dopamine",
    body: "Operating rhythms designed around interest-driven attention, not against it. Short loops, visible wins, friction removed before it stalls you.",
  },
  {
    step: "02",
    title: "A room that gets it",
    body: "A vetted circle of founders with the same wiring. No explaining yourself, no masking. Just people who finish each other's chaos.",
  },
  {
    step: "03",
    title: "Accountability that sticks",
    body: "Weekly working sprints, body-doubling sessions, and check-ins that catch the drift in days, not quarters.",
  },
  {
    step: "04",
    title: "AI as your external brain",
    body: "Manuj's specialty: AI workflows that hold the boring parts (follow-ups, pipelines, admin) so your attention goes where it compounds.",
  },
];

const FAQS = [
  {
    q: "Do I need an ADHD diagnosis to join?",
    a: "No. If the patterns on this page feel like your daily reality, you're who this is for. We care about how your brain works, not your paperwork.",
  },
  {
    q: "Is this a course?",
    a: "No, and that's deliberate. You've finished 4% of every course you've bought. This is a working program: live sprints, real accountability, and systems installed into your actual business.",
  },
  {
    q: "What stage should my business be at?",
    a: "Members are people who are growing — or who want to grow but feel something keeps getting in the way. What they share is the ability to invest $2,500–$10,000 in solving their ADHD situation, and the readiness to actually do the work. The application asks a few questions so we can place you in the right track.",
  },
  {
    q: "How much does it cost?",
    a: "Pricing is shared with the waitlist before each cohort opens. Joining the waitlist is free and carries zero obligation.",
  },
  {
    q: "What's the paid clarity call?",
    a: "An optional 1:1 session with Manuj for people who don't want to wait: one hour, your single biggest bottleneck, and a working plan you can execute that week.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Reveal>
                <p className="text-eyebrow text-faint">
                  For executives, founders, and operators with ADHD-style brains
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="text-display mt-5">
                  Your ADHD brain knows exactly what it&apos;s capable of.
                </h1>
              </Reveal>
              <Reveal delay={90}>
                <p className="text-display mt-3 text-muted">
                  Something keeps stopping it right before it lands.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p className="text-title mt-6 text-accent">
                  Find relief from ADHD in four weeks.
                </p>
              </Reveal>
              <Reveal delay={180}>
                <p className="mt-5 max-w-xl leading-relaxed text-muted">
                  Research from the University of California San Francisco
                  found 29% of entrepreneurs self-report ADHD. Six times the
                  general population. You did not end up here by accident;
                  every system you have been handed was simply built for a
                  different brain.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <WaitlistCta size="lg">Join the waitlist</WaitlistCta>
                  <a
                    href="#program"
                    className="pressable inline-flex min-h-13 items-center rounded-full px-5 font-medium text-muted transition-colors hover:text-fg"
                  >
                    See how it works ↓
                  </a>
                </div>
              </Reveal>
              <Reveal delay={300}>
                <p className="mt-5 text-sm text-faint">
                  Applications reviewed by hand. Limited cohort seats.
                </p>
              </Reveal>
            </div>
            <Reveal delay={200} className="relative hidden lg:block">
              <div className="overflow-hidden rounded-2xl border border-line shadow-lg">
                <Image
                  src="/images/HeroSection.jpg"
                  alt="A founder working with deep focus"
                  width={920}
                  height={1100}
                  priority
                  className="h-130 w-full object-cover"
                />
              </div>
              <div
                aria-hidden
                className="absolute -bottom-8 left-1/2 -z-10 h-40 w-2/3 -translate-x-1/2 rounded-full bg-accent opacity-20 blur-3xl"
              />
            </Reveal>
          </div>
          <Reveal delay={120} className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-8 lg:hidden">
            <div className="overflow-hidden rounded-2xl border border-line shadow-lg">
              <Image
                src="/images/HeroSection.jpg"
                alt="A founder working with deep focus"
                width={1600}
                height={900}
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
          </Reveal>
        </section>

        {/* Logo strip */}
        <section aria-label="Experience" className="border-y border-line py-10">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <Reveal>
              <p className="text-eyebrow text-center text-faint">
                Led by a founder who has shipped with
              </p>
            </Reveal>
            <div className="marquee mt-7 overflow-hidden" aria-hidden>
              {/* The animation slides -50%; both halves must be identical and
                  each half wider than any viewport, so repeat the set 4× per half. */}
              <div className="marquee-track flex w-max items-center gap-16 pr-16">
                {Array.from({ length: 8 }, () => LOGOS).flat().map((logo, i) => (
                  <Image
                    key={`${logo.alt}-${i}`}
                    src={logo.src}
                    alt=""
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain opacity-60 grayscale transition-opacity duration-200 hover:opacity-100"
                  />
                ))}
              </div>
            </div>
            <ul className="sr-only">
              {LOGOS.map((logo) => (
                <li key={logo.alt}>{logo.alt}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why / problem */}
        <section id="why" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="text-eyebrow text-faint">Sound familiar?</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="text-headline mt-4 max-w-2xl">
              You don&apos;t have a discipline problem. You have a design
              problem.
            </h2>
          </Reveal>
          <ul className="mt-12 grid list-none gap-5 sm:grid-cols-2">
            {SYMPTOMS.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 50}>
                <div className="liftable h-full rounded-2xl border border-line bg-surface p-7">
                  <h3 className="text-title">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* Program */}
        <section id="program" className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="text-eyebrow text-faint">The program</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-4 max-w-2xl">
                Stop renting other people&apos;s systems. Install your own.
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="text-body-lg mt-5 max-w-2xl text-muted">
                This is ADHD coaching rebuilt around how your brain actually
                works. You already know exactly what you&apos;re capable of —
                these four pillars make that capability show up in the work,
                week after week.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {PILLARS.map((pillar, i) => (
                <Reveal key={pillar.step} delay={i * 50}>
                  <div className="liftable h-full rounded-2xl border border-line bg-bg p-7">
                    <span className="font-mono text-sm text-accent" aria-hidden>
                      {pillar.step}
                    </span>
                    <h3 className="text-title mt-3">{pillar.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{pillar.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <div className="mt-12 overflow-hidden rounded-2xl border border-line">
                <Image
                  src="/images/Meeting.jpg"
                  alt="Founders working together in a session"
                  width={1600}
                  height={700}
                  className="h-64 w-full object-cover sm:h-80"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Founder */}
        <section id="founder" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-line shadow-md">
                <Image
                  src="/manuj/b76742c9-4955-439c-8a3e-e66d1b07fd3b.jpg"
                  alt="Manuj Aggarwal"
                  width={800}
                  height={960}
                  className="aspect-5/6 w-full object-cover"
                />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="text-eyebrow text-faint">Your guide</p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="text-headline mt-4">Manuj Aggarwal</h2>
              </Reveal>
              <Reveal delay={120}>
                <div className="text-body-lg mt-6 space-y-5 text-muted">
                  <p>
                    Manuj built a 25-year career in technology with a brain
                    that never sat still: from factory floor at minimum wage to
                    shipping AI systems alongside teams at IBM, Microsoft,
                    Pearson, T-Mobile, and the United Nations.
                  </p>
                  <p>
                    Along the way he learned the lesson this whole program is
                    built on: a fast, non-linear mind doesn&apos;t need more
                    discipline. It needs infrastructure. The right scaffolding
                    turns scattered into unstoppable.
                  </p>
                  <p>
                    AIMERGE is that scaffolding, productized: the systems, the
                    room, and the cadence he wishes existed twenty years ago.
                  </p>
                  <p>
                    <a
                      href="https://manujaggarwal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-accent underline-offset-4 hover:underline"
                    >
                      More on Manuj&apos;s work at TetraNoodle →
                    </a>
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-line">
          <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
            <Reveal>
              <p className="text-eyebrow text-faint">FAQ</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-headline mt-4">Fair questions</h2>
            </Reveal>
            <div className="mt-10 divide-y divide-line">
              {FAQS.map((faq, i) => (
                <Reveal key={faq.q} delay={i * 40}>
                  <details className="group py-2">
                    <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-3 font-medium [&::-webkit-details-marker]:hidden">
                      {faq.q}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        aria-hidden
                        className="shrink-0 text-faint transition-transform duration-200 group-open:rotate-45"
                      >
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                      </svg>
                    </summary>
                    <p className="pb-5 leading-relaxed text-muted">{faq.a}</p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-28">
            <Reveal>
              <h2 className="text-headline mx-auto max-w-2xl">
                The next cohort is forming. Your brain is already fast enough.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-body-lg mx-auto mt-5 max-w-xl text-muted">
                Join the waitlist in under two minutes. We read every
                application ourselves.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-9">
                <WaitlistCta size="lg">Join the waitlist</WaitlistCta>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
