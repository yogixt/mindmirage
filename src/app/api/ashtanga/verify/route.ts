import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { notify } from "@/lib/notify";
import { recordCapturedPayment } from "@/lib/payments";

/* Verifies the Razorpay signature for a guest Ashtanga Hridayam booking, then
   defers to the same recordCapturedPayment the webhook and reconcile sweep
   use (fetched fresh from Razorpay, never trusted from the client) so the
   booking gets marked paid AND an orders/enrollment_grants row is written.
   Previously this route only flipped the booking's paid flag and emailed the
   team — it never touched orders, so every Ashtanga guest payment was
   invisible in the admin portal even on the happy path. */

const Body = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  bookingId: z.number().int().nullable().optional(),
  name: z.string().max(120).optional().default(""),
  email: z.string().max(160).optional().default(""),
  phone: z.string().max(40).optional().default(""),
  mode: z.string().max(20).optional().default(""),
});

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ ok: false, error: "razorpay_not_configured" }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = parsed.data;

  const expected = createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(razorpay_signature, "utf8");
  const matches =
    expectedBuf.length === receivedBuf.length && timingSafeEqual(expectedBuf, receivedBuf);

  if (!matches) {
    return NextResponse.json({ ok: false, error: "signature_mismatch" }, { status: 400 });
  }

  // Record the payment — marks the booking paid, writes orders/payment_events,
  // and grants course access. Best effort: the webhook/reconcile sweep will
  // pick this up if this in-request write fails; don't fail the payment for
  // the paying seeker over it.
  if (bookingId) {
    try {
      const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (keyId) {
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const payment = await rzp.payments.fetch(razorpay_payment_id);
        await recordCapturedPayment({
          id: payment.id,
          order_id: payment.order_id ?? null,
          amount: Number(payment.amount),
          email: payment.email,
          notes: payment.notes as Record<string, string> | undefined,
        });
      }
    } catch (e) {
      console.error("[ashtanga/verify] record failed", e);
    }
  }

  // Email the team — best effort.
  try {
    const { name, email, phone, mode } = parsed.data;
    await notify({
      _kind: "Booking",
      course: "Ashtanga Hridayam · Sutrasthana",
      sadhak: name || "Guest",
      email,
      phone,
      mode,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (e) {
    console.error("[ashtanga/verify] notify failed", e);
  }

  return NextResponse.json({
    ok: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
}
