import "server-only";

// Per-IP fixed-window in-memory rate limiter. Good enough for a single
// instance funnel; swap for Redis if this ever runs multi-region.

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();
const WINDOW_MS = 60_000;
const MAX_BUCKETS = 10_000;

export function rateLimit(
  key: string,
  limit: number
): { ok: boolean; remaining: number } {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, w] of buckets) {
      if (w.resetAt < now) buckets.delete(k);
    }
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: limit - 1 };
  }
  bucket.count++;
  return { ok: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count) };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
