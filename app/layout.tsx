import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ApplyModal } from "@/components/apply-modal";
import { CookieConsent } from "@/components/cookie-consent";
import { FacebookPixel } from "@/components/facebook-pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      "Your ADHD brain knows exactly what it's capable of. Something keeps stopping it right before it lands. Join the waitlist.",
    type: "website",
    url: "/",
    siteName: "AIMERGE",
    images: [
      {
        url: "/images/HeroSection.jpg",
        width: 1600,
        height: 1138,
        alt: "AIMERGE — ADHD coaching for founders and executives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIMERGE: find relief from ADHD in four weeks",
    description:
      "Your ADHD brain knows exactly what it's capable of. Something keeps stopping it right before it lands. Join the waitlist.",
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
      // Brand palette is fixed for launch; the switcher is parked in
      // components/palette-switcher.tsx if theming ever comes back.
      data-palette="lavender"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <ApplyModal />
        {/* Consent-gated: the pixel script is injected only after Accept.
            The old <noscript> pixel fallback is gone on purpose — it cannot
            be consent-gated, which GDPR requires. */}
        <FacebookPixel />
        <CookieConsent />
        {/* Vercel Analytics is cookieless, so it runs without consent. */}
        <Analytics />
      </body>
    </html>
  );
}
