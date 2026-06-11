import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/server/admin-auth";
import {
  countWaitlistEntries,
  isCosmosConfigured,
  listWaitlistEntries,
} from "@/lib/server/cosmos-db";

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
  const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 25));

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const [page, total, last7Days] = await Promise.all([
      listWaitlistEntries(offset, limit),
      countWaitlistEntries(),
      countWaitlistEntries(sevenDaysAgo),
    ]);
    return NextResponse.json(
      { ok: true, ...page, total, last7Days },
      { headers: NO_STORE }
    );
  } catch (err) {
    console.error("admin list failed", err);
    return NextResponse.json({ ok: false }, { status: 500, headers: NO_STORE });
  }
}
