import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // The homepage genuinely changes with most deploys, so a build-time date is
  // an honest freshness signal. The legal pages are pinned to their real
  // "Last updated" dates instead of new Date() — otherwise every deploy would
  // falsely report them as freshly edited, which Google reads as noise.
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/ai-data-disclosure`,
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/medical-disclaimer`,
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/accessibility`,
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
