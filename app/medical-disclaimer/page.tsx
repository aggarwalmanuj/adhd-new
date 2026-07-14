import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Medical Disclaimer",
  description:
    "The ADHD Belief Score is an educational, reflective tool. It is not medical advice, diagnosis, treatment, or crisis support.",
};

export default function MedicalDisclaimerPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8">
        <h1 className="text-headline">Medical Disclaimer</h1>
        <p className="mt-2 text-sm text-faint">Last updated: July 14, 2026</p>

        <div className="mt-10 space-y-8 leading-relaxed text-muted [&_h2]:text-fg">
          <section>
            <h2 className="text-title">Educational use only</h2>
            <p className="mt-3">
              The ADHD Belief Score, AI Merge, and all content on this website
              are provided for educational and reflective purposes only. They
              are not, and are not a substitute for, professional medical
              advice, diagnosis, or treatment. ADHD is a real
              neurodevelopmental condition; this tool does not evaluate,
              confirm, or rule out ADHD or any other condition.
            </p>
          </section>
          <section>
            <h2 className="text-title">Not a medical device or service</h2>
            <p className="mt-3">
              The ADHD Belief Score is not a medical device, an ADHD
              diagnostic test, medical advice, treatment, psychotherapy,
              crisis care, or an emergency service. It has not been evaluated
              by the U.S. Food and Drug Administration, Health Canada, or any
              other regulatory body. Using this website or the assessment does
              not create a doctor-patient, therapist-client, or any other
              professional care relationship.
            </p>
          </section>
          <section>
            <h2 className="text-title">Always consult a professional</h2>
            <p className="mt-3">
              Always seek the advice of your physician, psychiatrist,
              psychologist, or other qualified health provider with any
              questions you may have about ADHD, a medical condition, or your
              mental health. Never disregard professional advice or delay
              seeking it because of something you have read here or received
              in your result. Do not begin, stop, or change any medication or
              treatment based on the ADHD Belief Score.
            </p>
          </section>
          <section>
            <h2 className="text-title">If you need help now</h2>
            <p className="mt-3">
              If you are in immediate danger, experiencing a mental-health
              emergency, or thinking about harming yourself or another person,
              contact local emergency services immediately. In the United
              States and Canada, call or text 988 (Suicide and Crisis
              Lifeline) or dial 911. Outside North America, contact your local
              emergency number or a crisis-support service in your country.
            </p>
          </section>
          <section>
            <h2 className="text-title">Individual results vary</h2>
            <p className="mt-3">
              Participant experiences shared on this site are individual
              accounts. They are not promises or guarantees of any outcome,
              and they are not evidence that the tool treats, cures, or
              improves any medical or mental-health condition.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
