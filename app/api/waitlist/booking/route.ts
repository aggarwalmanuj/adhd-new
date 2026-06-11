import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/waitlist-shared";
import { isCosmosConfigured, markPaidCallBooked } from "@/lib/server/cosmos-db";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const { ok } = rateLimit(`booking:${clientIp(req)}`, 10);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: NO_STORE }
    );
  }

  let parsed;
  try {
    parsed = bookingSchema.safeParse(await req.json());
  } catch {
    parsed = null;
  }
  if (!parsed?.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid booking payload" },
      { status: 400, headers: NO_STORE }
    );
  }

  if (!isCosmosConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Storage not configured" },
      { status: 503, headers: NO_STORE }
    );
  }

  try {
    const { email, name, eventUri, inviteeUri } = parsed.data;
    await markPaidCallBooked(email, { eventUri, inviteeUri }, name);
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (err) {
    console.error("booking save failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not record booking" },
      { status: 500, headers: NO_STORE }
    );
  }
}
