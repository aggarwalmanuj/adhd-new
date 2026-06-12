import { isAdminAuthorized } from "@/lib/server/admin-auth";
import { fetchAllWaitlistEntries, isCosmosConfigured } from "@/lib/server/cosmos-db";
import { entriesToCsv } from "@/lib/waitlist-csv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return new Response(null, { status: 401, headers: NO_STORE });
  }
  if (!isCosmosConfigured()) {
    return new Response(null, { status: 503, headers: NO_STORE });
  }

  try {
    const entries = await fetchAllWaitlistEntries();
    const csv = entriesToCsv(entries);
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
