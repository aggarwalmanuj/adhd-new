import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/server/admin-auth";
import { isCosmosConfigured, searchWaitlistEntries } from "@/lib/server/cosmos-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ ok: false }, { status: 401, headers: NO_STORE });
  }
  if (!isCosmosConfigured()) {
    return NextResponse.json(
      { ok: false, error: "notConfigured" },
      { status: 503, headers: NO_STORE }
    );
  }

  const url = new URL(req.url);
  try {
    const entries = await searchWaitlistEntries({
      text: url.searchParams.get("q") || undefined,
      from: url.searchParams.get("from") || undefined,
      to: url.searchParams.get("to") || undefined,
    });
    return NextResponse.json({ ok: true, entries }, { headers: NO_STORE });
  } catch (err) {
    console.error("admin search failed", err);
    return NextResponse.json({ ok: false }, { status: 500, headers: NO_STORE });
  }
}
