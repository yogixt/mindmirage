import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { getSeeker } from "@/lib/auth";
import { journalDb } from "@/lib/journal";
import { notify } from "@/lib/notify";

const BodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  name: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ ok: false, error: "razorpay_not_configured" }, { status: 503 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }); }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name } = parsed.data;

  const expected = createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(razorpay_signature, "utf8");
  const matches = expectedBuf.length === receivedBuf.length && timingSafeEqual(expectedBuf, receivedBuf);

  if (!matches) {
    return NextResponse.json({ ok: false, error: "signature_mismatch" }, { status: 400 });
  }

  let amountINR = 0;
  try {
    const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (keyId) {
      const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const order = await rzp.orders.fetch(razorpay_order_id);
      amountINR = Math.round(Number(order.amount) / 100);
    }
  } catch { /* best-effort */ }

  const seeker = await getSeeker();
  try {
    const db = journalDb();
    if (db) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO orders (payment_id, order_id, user_id, user_name, email, items, amount_inr)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [razorpay_payment_id, razorpay_order_id, seeker?.userId ?? null, seeker?.fullName ?? null, seeker?.email ?? null, `Contribution: ${name}`, amountINR],
      });
      await db.execute({
        sql: `INSERT INTO payment_events (status, payment_id, order_id, user_name, email)
              VALUES ('contribution', ?, ?, ?, ?)`,
        args: [razorpay_payment_id, razorpay_order_id, seeker?.fullName ?? null, seeker?.email ?? null],
      });
    }
  } catch { /* best-effort */ }

  await notify({
    _kind: "Order",
    sadhak: seeker?.fullName ?? "Unknown",
    email: seeker?.email ?? "",
    courses: `Contribution: ${name} · ₹${amountINR}`,
    paymentId: razorpay_payment_id,
  }).catch(() => {});

  return NextResponse.json({ ok: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id, amountINR });
}
