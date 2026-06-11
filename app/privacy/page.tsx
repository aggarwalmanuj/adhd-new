import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AIMERGE collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <h1 className="text-headline">Privacy Policy</h1>
        <p className="mt-2 text-sm text-faint">Last updated: June 11, 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted [&_h2]:text-fg">
          <section>
            <h2 className="text-title">What we collect</h2>
            <p className="mt-3">
              When you join the waitlist we collect the information you provide:
              your name, business name, email address, optional phone number,
              and your answers to the application questions. We also record how
              you found us (referring page, UTM campaign parameters, and ad
              click identifiers) so we know which channels are working.
            </p>
          </section>
          <section>
            <h2 className="text-title">Analytics &amp; cookies</h2>
            <p className="mt-3">
              We use PostHog for product analytics and session replay (with
              keyboard input masked) and the Meta Pixel for advertising
              measurement. These tools use cookies and local storage to
              distinguish visitors. We use this data to improve the site and
              measure campaigns, never to sell your information.
            </p>
          </section>
          <section>
            <h2 className="text-title">Where your data lives</h2>
            <p className="mt-3">
              Waitlist entries are stored in Microsoft Azure Cosmos DB.
              Bookings are handled by Calendly under their own privacy policy.
              We retain waitlist data until you ask us to delete it.
            </p>
          </section>
          <section>
            <h2 className="text-title">Your rights</h2>
            <p className="mt-3">
              You can request a copy of your data, correction, or deletion at
              any time by emailing{" "}
              <a className="font-medium text-fg underline underline-offset-4" href="mailto:hello@aimerge.ai">
                hello@aimerge.ai
              </a>
              . We respond within 30 days.
            </p>
          </section>
          <section>
            <h2 className="text-title">Changes</h2>
            <p className="mt-3">
              If this policy changes materially we will note it here and, where
              appropriate, email the waitlist.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
