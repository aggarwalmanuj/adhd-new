import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/server/admin-auth";
import { dedupeWaitlistEntries, isCosmosConfigured } from "@/lib/server/cosmos-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ ok: false }, { status: 401, headers: NO_STORE });
  }
  if (!isCosmosConfigured()) {
    return NextResponse.json(
      { ok: false, error: "notConfigured" },
      { status: 503, headers: NO_STORE }
    );
  }

  try {
    const result = await dedupeWaitlistEntries();
    return NextResponse.json({ ok: true, ...result }, { headers: NO_STORE });
  } catch (err) {
    console.error("admin dedupe failed", err);
    return NextResponse.json({ ok: false }, { status: 500, headers: NO_STORE });
  }
}
