// CSV serialization for waitlist entries. Shared by the bulk export API
// route and the per-entry download in the admin panel (client side).
import type { WaitlistEntry } from "@/lib/waitlist-shared";

/** RFC-4180 quoting. */
function csvCell(value: unknown): string {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const COLUMNS: { header: string; get: (e: WaitlistEntry) => unknown }[] = [
  { header: "Email", get: (e) => e.email },
  { header: "First name", get: (e) => e.firstName },
  { header: "Business", get: (e) => e.businessName },
  { header: "Phone", get: (e) => e.phone },
  { header: "Budget", get: (e) => e.budget },
  { header: "Urgency", get: (e) => e.urgency },
  { header: "Revenue range", get: (e) => e.revenueRange },
  { header: "Biggest problem", get: (e) => e.biggestProblem },
  { header: "Tried so far", get: (e) => e.triedSoFar?.join("; ") },
  { header: "Stage", get: (e) => e.stage },
  { header: "Last step", get: (e) => e.lastStep },
  { header: "Paid call booked", get: (e) => (e.paidCallBooked ? "yes" : "") },
  { header: "Calendly event", get: (e) => e.calendlyEventUri },
  { header: "Source", get: (e) => e.source },
  { header: "UTM source", get: (e) => e.attribution?.utmSource },
  { header: "UTM medium", get: (e) => e.attribution?.utmMedium },
  { header: "UTM campaign", get: (e) => e.attribution?.utmCampaign },
  { header: "UTM term", get: (e) => e.attribution?.utmTerm },
  { header: "UTM content", get: (e) => e.attribution?.utmContent },
  { header: "Referrer", get: (e) => e.attribution?.referrer },
  { header: "Landing page", get: (e) => e.attribution?.landingPage },
  { header: "fbclid", get: (e) => e.attribution?.fbclid },
  { header: "gclid", get: (e) => e.attribution?.gclid },
  { header: "PostHog session", get: (e) => e.attribution?.posthogSessionId },
  { header: "PostHog distinct id", get: (e) => e.attribution?.posthogDistinctId },
  { header: "Created at", get: (e) => e.createdAt },
  { header: "Updated at", get: (e) => e.updatedAt },
];

/** Header row + one row per entry, with a UTF-8 BOM so Excel opens it right. */
export function entriesToCsv(entries: WaitlistEntry[]): string {
  const rows = [
    COLUMNS.map((c) => csvCell(c.header)).join(","),
    ...entries.map((e) => COLUMNS.map((c) => csvCell(c.get(e))).join(",")),
  ];
  return "﻿" + rows.join("\r\n");
}
