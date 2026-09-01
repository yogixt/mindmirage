import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import { runMigrations } from "@/lib/db";
import { sweepMissingPayments } from "@/lib/payments";

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

  await runMigrations();
  const result = await sweepMissingPayments(parsed.data.days);
  if (!result) {
    return NextResponse.json({ ok: false, error: "razorpay_or_db_not_configured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, ...result });
}
