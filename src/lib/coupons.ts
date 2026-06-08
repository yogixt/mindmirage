import { COUPONS } from "./constants";
import { mindMirageDb } from "./db";

/* Coupon codes — managed from the admin portal (Turso). The hardcoded
   COUPONS in constants.ts are only a fallback when the DB is unreachable. */

export async function getCouponPercent(code: string): Promise<number | null> {
  const c = code.trim().toUpperCase();
  if (!c) return null;
  const db = mindMirageDb();
  if (db) {
    try {
      const rs = await db.execute({
        sql: "SELECT percent, active FROM coupons WHERE code = ?",
        args: [c],
      });
      if (rs.rows.length === 0) return null;
      return Number(rs.rows[0].active) === 1 ? Number(rs.rows[0].percent) : null;
    } catch {
      // fall through to constants
    }
  }
  return COUPONS[c] ?? null;
}

export function discountFor(totalINR: number, percent: number) {
  const discountINR = Math.round((totalINR * percent) / 100);
  return { percent, discountINR, finalINR: totalINR - discountINR };
}
