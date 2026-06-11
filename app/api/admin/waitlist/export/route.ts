import { isAdminAuthorized } from "@/lib/server/admin-auth";
import { fetchAllWaitlistEntries, isCosmosConfigured } from "@/lib/server/cosmos-db";
import type { WaitlistEntry } from "@/lib/waitlist-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

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

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return new Response(null, { status: 401, headers: NO_STORE });
  }
  if (!isCosmosConfigured()) {
    return new Response(null, { status: 503, headers: NO_STORE });
  }

  try {
    const entries = await fetchAllWaitlistEntries();
    const rows = [
      COLUMNS.map((c) => csvCell(c.header)).join(","),
      ...entries.map((e) => COLUMNS.map((c) => csvCell(c.get(e))).join(",")),
    ];
    // UTF-8 BOM so Excel opens it with the right encoding.
    const csv = "﻿" + rows.join("\r\n");
    return new Response(csv, {
      headers: {
        ...NO_STORE,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="waitlist-export.csv"`,
      },
    });
  } catch (err) {
    console.error("admin export failed", err);
    return new Response(null, { status: 500, headers: NO_STORE });
  }
}
