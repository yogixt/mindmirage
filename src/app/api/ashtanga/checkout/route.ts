import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { mindMirageDb, runMigrations } from "@/lib/db";

/* Guest checkout for the Ashtanga Hridayam (Sutrasthana) course — no sign-in
   required. The fee is fixed server-side; the client can never set it. */

const Body = z.object({
  mode: z.enum(["offline", "online"]),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
});

const FEE_INR = 8000;
const ITEM_SLUG = "ashtanga-hridayam";
const TITLE = "Ashtanga Hridayam · Sutrasthana";
const COURSE_DATES = "Starts 15 July 2026 · 2 months";

function minutesFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
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

  const { mode, name, email, phone } = parsed.data;
  const amountINR = FEE_INR;
  const slotLabel = mode === "offline" ? "Offline · Rishikesh" : "Online · Zoom";

  // Best-effort booking record (guests have no user_id).
  let bookingId: number | null = null;
  try {
    await runMigrations();
    const db = mindMirageDb();
    if (db) {
      const insert = await db.execute({
        sql: `INSERT INTO bookings
              (user_id, name, email, whatsapp, subject, slot, preferred_dates, message, status, item_slug, amount_inr, expires_at)
              VALUES (NULL, ?, ?, ?, ?, ?, ?, '', 'pending_payment', ?, ?, ?)`,
        args: [name, email, phone, TITLE, slotLabel, COURSE_DATES, ITEM_SLUG, amountINR, minutesFromNow(30)],
      });
      bookingId = Number(insert.lastInsertRowid);
    }
  } catch (e) {
    console.error("[ashtanga/checkout] booking insert failed", e);
  }

  try {
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: amountINR * 100,
      currency: "INR",
      receipt: bookingId ? `mm_ah_${bookingId}` : `mm_ah_${Date.now()}`,
      notes: {
        itemSlug: ITEM_SLUG,
        title: TITLE,
        mode,
        name,
        email,
        phone,
        ...(bookingId ? { bookingId: String(bookingId) } : {}),
      },
    });

    if (bookingId) {
      try {
        const db = mindMirageDb();
        await db?.execute({
          sql: "UPDATE bookings SET order_id = ? WHERE id = ?",
          args: [order.id, bookingId],
        });
      } catch (e) {
        console.error("[ashtanga/checkout] order_id update failed", e);
      }
    }

    return NextResponse.json({
      ok: true,
      bookingId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      amountINR,
      title: TITLE,
    });
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "unknown_error";
    return NextResponse.json({ ok: false, error: "razorpay_error", message }, { status: 502 });
  }
}
