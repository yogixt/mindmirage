import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { mindMirageDb } from "@/lib/db";
import { notify } from "@/lib/notify";

/* Verifies the Razorpay signature for a guest Ashtanga Hridayam booking, marks
   the booking paid, and emails the team. Amount is never trusted from the client. */

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

  // Mark the booking paid — best effort.
  if (bookingId) {
    try {
      const db = mindMirageDb();
      await db?.execute({
        sql: "UPDATE bookings SET status = 'new', paid = 1, payment_id = ? WHERE id = ?",
        args: [razorpay_payment_id, bookingId],
      });
    } catch (e) {
      console.error("[ashtanga/verify] booking update failed", e);
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
