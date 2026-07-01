import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { z } from "zod";
import { enrollCurrentSeeker, getSeeker } from "@/lib/auth";
import { mindMirageDb, runMigrations } from "@/lib/db";
import { notify } from "@/lib/notify";

const BodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  slugs: z.array(z.string()).min(1),
  bookingId: z.number().int().optional(),
});

export async function POST(req: Request) {
  await runMigrations();
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, slugs, bookingId } =
    parsed.data;

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
          sql: `INSERT INTO payment_events (status, payment_id, order_id, user_name, email, reason)
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

  const enrolled: string[] = [];
  for (const slug of slugs) {
    const ok = await enrollCurrentSeeker(slug);
    if (ok) enrolled.push(slug);
  }

  // For slot-first bookings, mark the pending booking as paid and confirmed.
  if (bookingId) {
    try {
      const db = mindMirageDb();
      if (db) {
        await db.execute({
          sql: `UPDATE bookings
                SET status = 'new', paid = 1, payment_id = ?
                WHERE id = ?`,
          args: [razorpay_payment_id, bookingId],
        });
      }
    } catch (e) {
      console.error("[verify] booking update failed", e);
    }
  }

  // Record the purchase for the admin portal — amount and coupon read back
  // from Razorpay itself, never from the client.
  try {
    const db = mindMirageDb();
    if (db) {
      const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      let amountINR = 0;
      let coupon: string | null = null;
      let titles = slugs.join(", ");
      if (keyId) {
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const order = await rzp.orders.fetch(razorpay_order_id);
        amountINR = Math.round(Number(order.amount) / 100);
        const notes = (order.notes ?? {}) as Record<string, string>;
        coupon = notes.coupon ?? null;
        titles = notes.titles ?? titles;
      }
      const seeker = await getSeeker();
      await db.execute({
        sql: `INSERT OR IGNORE INTO orders (payment_id, order_id, user_id, user_name, email, items, amount_inr, coupon)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          razorpay_payment_id,
          razorpay_order_id,
          seeker?.userId ?? null,
          seeker?.fullName ?? null,
          seeker?.email ?? null,
          titles,
          amountINR,
          coupon,
        ],
      });
    }
  } catch (e) {
    // Recording must never break a successful payment.
    console.error("[verify] order record failed", e);
  }

  // Email the team about the sale — best effort.
  try {
    const seeker = await getSeeker();
    const db = mindMirageDb();
    if (db) {
      await db.execute({
        sql: `INSERT INTO payment_events (status, payment_id, order_id, user_name, email)
              VALUES ('success', ?, ?, ?, ?)`,
        args: [razorpay_payment_id, razorpay_order_id, seeker?.fullName ?? null, seeker?.email ?? null],
      });
    }
    await notify({
      _kind: "Order",
      sadhak: seeker?.fullName ?? "Unknown",
      email: seeker?.email ?? "",
      courses: slugs.join(", "),
      paymentId: razorpay_payment_id,
    });
  } catch (e) {
    console.error("[verify] order notify failed", e);
  }

  return NextResponse.json({
    ok: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    enrolled,
  });
}
