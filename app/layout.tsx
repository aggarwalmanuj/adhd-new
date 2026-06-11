import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { ApplyModal } from "@/components/apply-modal";
import { FacebookPixelTracker } from "@/components/facebook-pixel";
import { FB_PIXEL_ID, isValidPixelId } from "@/lib/fbpixel";
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
  metadataBase: new URL("https://www.aimerge.ai"),
  title: {
    default: "AIMERGE: find relief from ADHD in four weeks",
    template: "%s · AIMERGE",
  },
  description:
    "A private program for executives, founders, and operators with ADHD-style brains. Systems built for your wiring, a room that gets it, and relief in four weeks.",
  openGraph: {
    title: "AIMERGE: find relief from ADHD in four weeks",
    description:
      "Your ADHD brain knows exactly what it's capable of. Something keeps stopping it right before it lands. Join the waitlist.",
    type: "website",
  },
};

const pixelEnabled = isValidPixelId(FB_PIXEL_ID);

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
        {pixelEnabled ? (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
            <Suspense fallback={null}>
              <FacebookPixelTracker />
            </Suspense>
          </>
        ) : null}
      </body>
    </html>
  );
}
