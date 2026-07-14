import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "AI and Data Disclosure",
  description:
    "How artificial intelligence is used in the ADHD Belief Score, what information it processes, and the limits of what it can tell you.",
};

export default function AiDataDisclosurePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <h1 className="text-headline">AI and Data Disclosure</h1>
        <p className="mt-2 text-sm text-faint">Last updated: July 14, 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted [&_h2]:text-fg">
          <section>
            <h2 className="text-title">Where AI is used</h2>
            <p className="mt-3">
              The ADHD Belief Score uses artificial intelligence to help
              organize the information you choose to provide during the guided
              reflection. The system helps connect what you describe: what
              happened, what you did next, what the repeated moment may have
              come to mean, and how the pattern may keep reinforcing itself.
              The result you receive is generated with the assistance of AI
              based on your own words.
            </p>
          </section>
          <section>
            <h2 className="text-title">What the AI does not do</h2>
            <p className="mt-3">
              The system does not diagnose ADHD or any other condition. It
              does not independently access your social media, medical
              records, browsing history, or any personal information beyond
              what you type or say into the assessment. It does not decide who
              you are: the result is a possible interpretation offered for
              your reflection, and you remain the authority on what fits.
            </p>
          </section>
          <section>
            <h2 className="text-title">Limitations of AI-generated content</h2>
            <p className="mt-3">
              AI-generated reflections can be incomplete, imprecise, or simply
              wrong. Treat your result as a hypothesis to examine, refine,
              accept, or reject, not as a factual statement about you. Do not
              make medical, legal, or financial decisions based on it. See the{" "}
              <Link
                href="/medical-disclaimer"
                className="font-medium text-fg underline underline-offset-4"
              >
                Medical Disclaimer
              </Link>{" "}
              for health-related limits.
            </p>
          </section>
          <section>
            <h2 className="text-title">How your information is handled</h2>
            <p className="mt-3">
              The answers you provide are used to generate your personalized
              result. Selected team members may review limited information for
              quality assurance, safety, or support. Your information is not
              sold. Third-party AI and infrastructure providers process data
              on our behalf under contractual confidentiality obligations. For
              collection, retention, and your rights (including access and
              deletion requests), see the{" "}
              <Link
                href="/privacy"
                className="font-medium text-fg underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>
          <section>
            <h2 className="text-title">Human oversight</h2>
            <p className="mt-3">
              AI output in this product is subject to human oversight
              processes, and the experience is designed so that you, the
              participant, make the final judgment about what is true for you.
              If a result ever feels harmful or clearly wrong, contact us at{" "}
              <a
                className="font-medium text-fg underline underline-offset-4"
                href="mailto:feedback@tetranoodle.com"
              >
                feedback@tetranoodle.com
              </a>{" "}
              so we can review it.
            </p>
          </section>
          <section>
            <h2 className="text-title">Changes</h2>
            <p className="mt-3">
              If how we use AI or handle data changes materially, we will
              update this page and revise the date above.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
