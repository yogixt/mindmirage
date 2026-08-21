import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { mindMirageDb, runMigrations } from "@/lib/db";
import { recordCapturedPayment } from "@/lib/payments";

/* Sweeps Razorpay's own payment history against our `orders` table and
   backfills anything the webhook (and before it, the client-side /verify
   calls) never recorded — belt-and-suspenders for webhook delivery gaps,
   and the tool that surfaced the original silent-payment incident. Money
   already captured by Razorpay is the ground truth here; our DB either
   already reflects it or it doesn't, and this makes it catch up.

   Protected by a shared secret rather than a user session because it's
   called server-to-server from the admin app, which has no session or
   Razorpay credentials of its own. */

const Body = z.object({
  days: z.number().int().min(1).max(180).optional().default(30),
});

function timingSafeEqualStr(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  return aBuf.length === bBuf.length && timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: Request) {
  const expectedKey = process.env.RECONCILE_API_KEY;
  if (!expectedKey) {
    return NextResponse.json({ ok: false, error: "reconcile_not_configured" }, { status: 503 });
  }
  const providedKey = req.headers.get("x-reconcile-key") ?? "";
  if (!timingSafeEqualStr(providedKey, expectedKey)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ ok: false, error: "razorpay_not_configured" }, { status: 503 });
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine — defaults apply */
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const { days } = parsed.data;

  await runMigrations();
  const db = mindMirageDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });
  }

  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const from = Math.floor(Date.now() / 1000) - days * 86400;

  const missing: { paymentId: string; email: string; amountINR: number; items: string }[] = [];
  let checked = 0;
  let skip = 0;
  const count = 100;

  for (;;) {
    const page = await rzp.payments.all({ from, count, skip });
    if (page.items.length === 0) break;

    for (const payment of page.items) {
      if (payment.status !== "captured") continue;
      checked += 1;

      // "Already recorded" has to mean fully recorded — the orders row and
      // the enrollment_grants rows are two separate tables, and a payment
      // that landed in orders before enrollment_grants existed (or before a
      // webhook delivery completed the grant step) still needs this sweep
      // to run for it. Contributions never write enrollment_grants (they
      // don't grant a course), so orders is the right check for those.
      const notes = (payment.notes ?? {}) as Record<string, string>;
      const checkTable = notes.kind === "contribution" ? "orders" : "enrollment_grants";
      const existing = await db.execute({
        sql: `SELECT 1 FROM ${checkTable} WHERE payment_id = ?`,
        args: [payment.id],
      });
      if (existing.rows.length > 0) continue;

      const result = await recordCapturedPayment({
        id: payment.id,
        order_id: payment.order_id ?? null,
        amount: Number(payment.amount),
        email: payment.email,
        notes: payment.notes as Record<string, string> | undefined,
      }).catch((e) => {
        console.error("[razorpay/reconcile] record failed", payment.id, e);
        return null;
      });

      // The skip check above already ensures we only get here for a payment
      // that was missing its order row, its enrollment_grants rows, or both
      // — so any non-null result here is genuinely new backfill work, not
      // just recordCapturedPayment's own internal "did I just insert the
      // payment_events row" signal (which stays false for a payment whose
      // order existed but whose grants didn't).
      if (result) {
        missing.push({
          paymentId: payment.id,
          email: result.email,
          amountINR: result.amountINR,
          items: result.items,
        });
      }
    }

    if (page.items.length < count) break;
    skip += count;
  }

  return NextResponse.json({
    ok: true,
    windowDays: days,
    capturedPaymentsChecked: checked,
    newlyRecorded: missing,
  });
}
