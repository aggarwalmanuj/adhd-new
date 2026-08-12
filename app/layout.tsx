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
// `adjustFontFallback` (on by default for next/font/google) synthesises a
// size-adjusted local fallback so the swap from fallback to webfont does not
// change the text's metrics. It is named explicitly here because it is the
// single thing holding CLS down on this page: measured with real 4G
// throttling, font swap alone accounted for 0.161 of layout shift — the hero
// headline reflowing and shoving the video down the page.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
  display: "swap",
  // Georgia is the closest widely-installed serif to Fraunces' proportions, so
  // the pre-swap headline occupies close to the same box. See the note above.
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
