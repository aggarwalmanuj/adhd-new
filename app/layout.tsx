import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ApplyModalLazy } from "@/components/apply-modal-lazy";
import { CookieConsent } from "@/components/cookie-consent";
import { FacebookPixel } from "@/components/facebook-pixel";
import { StructuredData } from "@/components/structured-data";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Inter: all UI, body, buttons, eyebrows, labels.
//
// `adjustFontFallback` synthesises a size-adjusted local fallback so the
// fallback and the real face occupy nearly the same box. Paired with
// `display: optional` below, that is what holds this page's CLS at 0.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  // "optional", not "swap".
  //
  // Measured on a throttled 4G profile: FCP lands at ~1.7s but the font files
  // do not finish until 2.2-2.8s. With `swap`, every block of text repaints in
  // the real face AFTER first paint, and on this page that reflow pushed the
  // hero video down — 0.216 cumulative layout shift, almost all of it from one
  // swap. `optional` gives the font a very short window: if it makes that
  // window the page uses it, and if it does not the fallback is kept for this
  // visit and the font is cached for the next one. No swap means no shift.
  //
  // The trade is deliberate: a first-time visitor on a slow connection may see
  // the fallback stack instead of Inter/Fraunces. That is a far smaller cost
  // than the page visibly rearranging itself under their thumb, on traffic
  // that is already leaving before the page settles.
  display: "optional",
  adjustFontFallback: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

// Fraunces: editorial display headlines (400) + italic emphasis (300 italic).
//
// `SOFT` is deliberately NOT in this axes list (matching Parents): no rule in
// globals.css or any component declares `font-variation-settings`, so every
// byte of that axis was downloaded and never rendered. Each extra axis
// enlarges the variable font file, and this font sits on the critical path for
// the hero <h1> — which is the LCP element — so dropping it is straight LCP
// savings for no visual change. Re-add an axis only alongside a rule using it.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  // See the note on Inter above: `optional` is what removes the page's
  // layout shift. Georgia is the closest widely-installed serif to Fraunces'
  // proportions, so the fallback headline occupies close to the same box.
  display: "optional",
  adjustFontFallback: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Do NOT set maximumScale/userScalable=no: blocking pinch-zoom is an
  // accessibility failure and hurts the Lighthouse a11y score.
  themeColor: "#0a232e",
};

export const metadata: Metadata = {
  // Canonical origin for the deployed site. Canonical/OG/Twitter URLs below
  // resolve against this, so it must match the domain we want indexed.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free ADHD Belief Score · AI Merge",
    template: "%s · AI Merge",
  },
  description:
    "You may understand your ADHD. But what has the repeated pattern taught you to believe about yourself? Get your free, personalized ADHD Belief Score. No credit card. Not a diagnosis.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Free ADHD Belief Score · AI Merge",
    description:
      "See what one repeated ADHD pattern may have taught you to believe about yourself. Free, personalized, built from your own words. Not a diagnosis.",
    type: "website",
    url: "/",
    siteName: "AI Merge",
    images: [
      {
        url: "/video/vsl-poster.jpg",
        width: 1280,
        height: 720,
        alt: "Manuj Aggarwal introducing the free ADHD Belief Score",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ADHD Belief Score · AI Merge",
    description:
      "See what one repeated ADHD pattern may have taught you to believe about yourself. Free, personalized, built from your own words. Not a diagnosis.",
    images: ["/video/vsl-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Marine is THE brand theme (deep navy + one teal accent). The 12-palette
      // switcher is retired; tokens live in globals.css.
      data-palette="marine"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StructuredData />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <ApplyModalLazy />
        {/* Consent-gated: the pixel script is injected only after Accept.
            The old <noscript> pixel fallback is gone on purpose: it cannot
            be consent-gated, which GDPR requires. */}
        <FacebookPixel />
        <CookieConsent />
        {/* Vercel Analytics is cookieless, so it runs without consent. */}
        <Analytics />
      </body>
    </html>
  );
}
