import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ApplyModal } from "@/components/apply-modal";
import { CookieConsent } from "@/components/cookie-consent";
import { FacebookPixel } from "@/components/facebook-pixel";
import { StructuredData } from "@/components/structured-data";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Inter: all UI, body, buttons, eyebrows, labels.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Fraunces: editorial display headlines (400) + italic emphasis (300 italic).
// Loaded as a variable font with optical sizing + the SOFT axis.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Do NOT set maximumScale/userScalable=no: blocking pinch-zoom is an
  // accessibility failure and hurts the Lighthouse a11y score.
  themeColor: "#0f2c3b",
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
        <ApplyModal />
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
