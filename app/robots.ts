import type { MetadataRoute } from "next";

// Canonical public origin. Hardcoded to the deployed subdomain rather than
// NEXT_PUBLIC_SITE_URL because that env var currently points at aimerge.live,
// which is not the domain we want crawlers to index.
const SITE_URL = "https://adhd.aimerge.live";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin UI and API routes have no SEO value and should not be crawled.
      disallow: ["/admin", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
