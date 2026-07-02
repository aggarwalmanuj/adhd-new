import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ApplyModal } from "@/components/apply-modal";
import { CookieConsent } from "@/components/cookie-consent";
import { FacebookPixel } from "@/components/facebook-pixel";
import { StructuredData } from "@/components/structured-data";
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
  metadataBase: new URL("https://adhd.aimerge.live"),
  title: {
    default: "AIMERGE: ADHD Coaching for Founders & Entrepreneurs",
    template: "%s · AIMERGE",
  },
  description:
    "A private program for executives, founders, and operators with ADHD-style brains. Systems built for your wiring, a room that gets it, and relief in four weeks.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AIMERGE: find relief from ADHD in four weeks",
    description:
      "Your ADHD brain knows exactly what it's capable of. Something keeps stopping it right before it lands. Get your Belief Score.",
    type: "website",
    url: "/",
    siteName: "AIMERGE",
    images: [
      {
        url: "/images/HeroSection.jpg",
        width: 1600,
        height: 1138,
        alt: "AIMERGE. ADHD coaching for founders and executives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIMERGE: find relief from ADHD in four weeks",
    description:
      "Your ADHD brain knows exactly what it's capable of. Something keeps stopping it right before it lands. Get your Belief Score.",
    images: ["/images/HeroSection.jpg"],
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
