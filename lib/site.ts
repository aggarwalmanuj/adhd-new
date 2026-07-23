// Canonical public origin for the deployed site. Single source of truth for
// robots.ts, sitemap.ts, the root layout's metadataBase, and the JSON-LD
// entity graph — so the crawlable hostname is defined in exactly one place.
//
// Hardcoded to the deployed subdomain rather than NEXT_PUBLIC_SITE_URL because
// that env var currently points at aimerge.live, which is not the domain we
// want crawlers to index.
export const SITE_URL = "https://adhd.aimerge.live";
