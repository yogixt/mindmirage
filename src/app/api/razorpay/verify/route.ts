import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { getSeeker } from "@/lib/auth";
import { mindMirageDb, runMigrations } from "@/lib/db";
import { recordCapturedPayment } from "@/lib/payments";

/* Fast path for the browser — verifies the signature the instant Razorpay's
   handler fires, then defers to the same recordCapturedPayment the webhook
   and reconcile sweep use, fetched fresh from Razorpay (never trusting the
   client for amount, notes, or who paid). That single shared function is
   what reads notes.bookingId / notes.slugs / notes.forSelf and decides who
   gets enrolled — this route doesn't duplicate any of that logic, so the
   fast path and the backstop can never drift apart. */

const BodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  // Legacy fields kept accepted-but-ignored for older cached client bundles;
  // the notes on the Razorpay order are the source of truth now.
  slugs: z.array(z.string()).optional(),
  bookingId: z.number().int().optional(),
});

export async function POST(req: Request) {
  await runMigrations();
  const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { ok: false, error: "razorpay_not_configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const expected = createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(razorpay_signature, "utf8");
  const matches =
    expectedBuf.length === receivedBuf.length &&
    timingSafeEqual(expectedBuf, receivedBuf);

  if (!matches) {
    try {
      const db = mindMirageDb();
      const seeker = await getSeeker();
      if (db) {
        await db.execute({
          sql: `INSERT OR IGNORE INTO payment_events (status, payment_id, order_id, user_name, email, reason)
                VALUES ('failed', ?, ?, ?, ?, 'signature_mismatch')`,
          args: [razorpay_payment_id, razorpay_order_id, seeker?.fullName ?? null, seeker?.email ?? null],
        });
      }
    } catch (e) {
      console.error("[verify] failure log failed", e);
    }
    return NextResponse.json(
      { ok: false, error: "signature_mismatch" },
      { status: 400 },
    );
  }

  try {
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const payment = await rzp.payments.fetch(razorpay_payment_id);
    await recordCapturedPayment({
      id: payment.id,
      order_id: payment.order_id ?? null,
      amount: Number(payment.amount),
      email: payment.email,
      notes: payment.notes as Record<string, string> | undefined,
    });
  } catch (e) {
    console.error("[verify] record failed", e);
    // The signature already checked out — the webhook/reconcile sweep will
    // pick this up if this in-request write failed. Don't fail the payment
    // for the paying seeker over a logging problem.
  }

  return NextResponse.json({
    ok: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
}
