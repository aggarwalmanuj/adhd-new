import type { MetadataRoute } from "next";

// Keep in sync with the SITE_URL in app/robots.ts.
const SITE_URL = "https://adhd.aimerge.live";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Public marketing routes only — /admin and /api are intentionally excluded.
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/ai-data-disclosure`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/medical-disclaimer`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/accessibility`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
