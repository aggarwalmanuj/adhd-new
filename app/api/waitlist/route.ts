import { NextResponse } from "next/server";
import { waitlistSubmissionSchema } from "@/lib/waitlist-shared";
import { isCosmosConfigured, saveWaitlistEntry } from "@/lib/server/cosmos-db";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };
const MAX_BODY_BYTES = 16 * 1024;
// One funnel pass makes up to 4 requests; leave headroom.
const LIMIT_PER_MINUTE = 15;

export async function POST(req: Request) {
  const { ok } = rateLimit(`waitlist:${clientIp(req)}`, LIMIT_PER_MINUTE);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: NO_STORE }
    );
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large" },
      { status: 413, headers: NO_STORE }
    );
  }

  let parsed;
  try {
    parsed = waitlistSubmissionSchema.safeParse(await req.json());
  } catch {
    parsed = null;
  }
  if (!parsed?.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid submission" },
      { status: 400, headers: NO_STORE }
    );
  }

  if (!isCosmosConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Waitlist storage is not configured yet" },
      { status: 503, headers: NO_STORE }
    );
  }

  const submission = parsed.data;
  // Server-side source fallback when the client didn't send one.
  if (!submission.source) {
    const referer = req.headers.get("referer");
    if (referer) submission.source = referer.slice(0, 500);
  }

  try {
    await saveWaitlistEntry(submission);
    // Duplicates get the same friendly 200 — never leak whether an email exists.
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch (err) {
    if (submission.stage === "partial") {
      // Partial saves are best-effort; a quiet 200 keeps the funnel moving.
      return NextResponse.json({ ok: true }, { headers: NO_STORE });
    }
    console.error("waitlist save failed", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500, headers: NO_STORE }
    );
  }
}
