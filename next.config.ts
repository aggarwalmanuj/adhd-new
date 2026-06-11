import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: lets the ngrok tunnel load dev assets (ignored by next build/start).
  // Wildcard because free ngrok rotates the subdomain on every session.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"],
  // PostHog endpoints require trailing slashes; Next's automatic redirect
  // breaks them. No app route depends on trailing-slash redirects.
  skipTrailingSlashRedirect: true,
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
