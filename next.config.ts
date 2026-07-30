import type { NextConfig } from "next";

/* ==========================================================================
   Content-Security-Policy
   --------------------------------------------------------------------------
   Deliberately a STATIC allowlist policy, not a per-request nonce policy.

   Next.js can only inject a nonce during server-side rendering, so a nonce
   CSP requires every page to be dynamically rendered (see the Next 16 CSP
   guide: "you must use dynamic rendering to add nonces"). This site is 100%
   prerendered — all 13 routes are static, and the crawl measured a 0.061 s
   TTFB. Trading that away for a nonce would cost more than it buys.

   What the static policy still enforces:
     - frame-ancestors 'none'  → real clickjacking protection (stronger than
                                 X-Frame-Options, which is kept for old UAs)
     - object-src 'none'       → no Flash/plugin injection vectors
     - base-uri 'self'         → blocks <base> tag hijacking of relative URLs
     - script-src allowlist    → an injected <script src="evil.com"> is blocked

   The limitation: 'unsafe-inline' is required for scripts because Next's
   bootstrap, the JSON-LD blocks, and the Meta Pixel loader are all inline,
   so this policy does NOT stop a reflected-XSS inline payload. The app has
   no user-generated HTML sink today, which is what makes that acceptable.
   If one is ever added, move to a nonce policy and accept dynamic rendering.
========================================================================== */
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' — see the note above. connect.facebook.net = Meta Pixel,
  // va.vercel-scripts.com = Vercel Analytics.
  "script-src 'self' 'unsafe-inline' https://connect.facebook.net https://va.vercel-scripts.com",
  // Tailwind/React write inline style attributes (e.g. the score dial's --score).
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.facebook.com https://*.posthog.com",
  "font-src 'self' data:",
  // PostHog is reverse-proxied through /ingest (same origin); the direct hosts
  // stay listed because the SDK falls back to them for some endpoints.
  "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://api.calendly.com https://www.facebook.com https://vitals.vercel-insights.com",
  // Calendly booking iframe in the apply modal.
  "frame-src 'self' https://calendly.com https://www.facebook.com",
  "media-src 'self' blob:",
  // PostHog session replay compresses payloads in a blob worker.
  "worker-src 'self' blob:",
  "form-action 'self' https://calendly.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** Applied to every response. Fixes the 100%-of-URLs header gaps in the crawl. */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // Redundant with frame-ancestors, but browsers that predate CSP Level 2
  // only honour this one.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Keeps the full referrer on same-origin navigation (so PostHog and the
  // scorecard hand-off still attribute correctly) while sending only the
  // origin cross-site and nothing at all on an HTTPS→HTTP downgrade.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // 2 years + preload-eligible. Vercel already serves HTTPS-only.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Dev-only: lets the ngrok tunnel load dev assets (ignored by next build/start).
  // Wildcard because free ngrok rotates the subdomain on every session.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"],
  // PostHog endpoints require trailing slashes; Next's automatic redirect
  // breaks them. No app route depends on trailing-slash redirects.
  skipTrailingSlashRedirect: true,
  // Removes the x-powered-by: Next.js fingerprint from every response.
  poweredByHeader: false,

  images: {
    // AVIF first (~20% smaller than WebP), WebP fallback, then the original
    // for browsers that support neither. Order matters: first Accept match wins.
    formats: ["image/avif", "image/webp"],
    // Next 16 requires an explicit allowlist; 75 is the default we render at.
    qualities: [75],
    // Optimised derivatives are content-addressed by the source file, so a
    // long TTL is safe and keeps repeat optimisation cost near zero.
    minimumCacheTTL: 2678400, // 31 days
  },

  // NOTE: experimental.inlineCss was evaluated and deliberately NOT enabled.
  // Measured on the homepage of this build:
  //   inlineCss: false → 27,998 B gzip HTML + 11,599 B gzip CSS = 39.6 kB / 2 req
  //   inlineCss: true  → 64,064 B gzip HTML                     = 64.1 kB / 1 req
  // Inlining costs +24.5 kB gzip (+62%) to save a single round-trip against an
  // origin already answering in 61 ms over HTTP/2, and it stops the stylesheet
  // being cached across the six pages. The docs recommend it for first-load
  // Tailwind sites, but on this build the numbers go the other way.

  async headers() {
    return [
      {
        // Every route, including /_next/* and public files.
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        // Static media in /public is fingerprint-free, so it cannot be
        // immutable — but these assets change only on redeploy, so a long
        // max-age with revalidation beats the default no-cache behaviour.
        source: "/:dir(logos|take|manuj|video|icon|images)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Crawler-facing plain-text files: let AI crawlers and SEO tools
        // re-fetch daily rather than serve a stale copy from cache.
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // More specific rule first.
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
