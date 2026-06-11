import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Authorize admin requests via the X-Admin-Password header.
 * Fails closed: if ADMIN_API_PASSWORD is unset, everything is unauthorized.
 */
export function isAdminAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_API_PASSWORD;
  if (!expected) return false;
  const provided = req.headers.get("x-admin-password");
  if (!provided) return false;
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
