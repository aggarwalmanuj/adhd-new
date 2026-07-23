import type { Metadata } from "next";

// The admin panel is a private, single-operator tool with no search value.
// app/admin/page.tsx is a client component, so it can't export metadata itself
// — this server-component layout carries the noindex signal for the segment.
//
// Note: /admin is also disallowed in robots.ts. The disallow saves crawl budget
// and the page is unlinked, so it won't be discovered in practice. This noindex
// is defense-in-depth. If an /admin URL ever does get stuck in the index, remove
// the /admin disallow from robots.ts so crawlers can actually read this tag —
// robots.txt blocks crawling, not indexing.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
