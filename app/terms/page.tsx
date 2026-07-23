import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the AIMERGE website.",
  // Self-referencing canonical. Without this the page inherits the root
  // layout's canonical ("/") and tells Google this page IS the homepage.
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <h1 className="text-headline">Terms of Service</h1>
        <p className="mt-2 text-sm text-faint">Last updated: June 11, 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted [&_h2]:text-fg">
          <section>
            <h2 className="text-title">The waitlist</h2>
            <p className="mt-3">
              Joining the waitlist is free and creates no obligation on either
              side. A spot on the waitlist is not a guarantee of admission to
              the program; cohorts are curated and seats are limited.
            </p>
          </section>
          <section>
            <h2 className="text-title">Paid clarity calls</h2>
            <p className="mt-3">
              Clarity calls are scheduled and paid through Calendly and its
              payment partners under their own terms. If you need to reschedule,
              use the link in your confirmation email at least 24 hours before
              the call.
            </p>
          </section>
          <section>
            <h2 className="text-title">No professional advice</h2>
            <p className="mt-3">
              AIMERGE provides educational and reflective tools. Nothing on
              this site is medical, legal, or financial advice, and nothing here
              diagnoses or treats ADHD or any other condition. Talk to a
              qualified professional for that.
            </p>
          </section>
          <section>
            <h2 className="text-title">Acceptable use</h2>
            <p className="mt-3">
              Don&apos;t abuse the site: no scraping, no automated submissions,
              no attempts to access other people&apos;s data. We may remove
              entries that look fraudulent.
            </p>
          </section>
          <section>
            <h2 className="text-title">Liability</h2>
            <p className="mt-3">
              The site is provided as-is. To the maximum extent permitted by
              law, our total liability for any claim related to the site is
              limited to the amount you paid us in the preceding 12 months.
            </p>
          </section>
          <section>
            <h2 className="text-title">Contact</h2>
            <p className="mt-3">
              Questions? Email{" "}
              <a className="font-medium text-fg underline underline-offset-4" href="mailto:hello@aimerge.ai">
                hello@aimerge.ai
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
