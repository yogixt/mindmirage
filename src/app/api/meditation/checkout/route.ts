import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { mindMirageDb, runMigrations } from "@/lib/db";

/* Guest checkout for the Meditation · Level 01 course — no sign-in required.
   Price is derived server-side from residency; the client can never set it. */

const Body = z.object({
  residency: z.enum(["india", "abroad"]),
  mode: z.enum(["offline", "online"]),
  slot: z.enum(["morning", "evening"]),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
});

const PRICE_INR: Record<"india" | "abroad", number> = {
  india: 8000,
  abroad: 12000,
};

const ITEM_SLUG = "meditation-l1";
const TITLE = "Meditation · Level 01";
const COURSE_DATES = "05–12 July 2026";

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

  const { residency, mode, slot, name, email, phone } = parsed.data;
  const amountINR = PRICE_INR[residency];
  const slotLabel = `${mode === "offline" ? "Offline · Ashram" : "Online · Live"} · ${
    slot === "morning" ? "Morning" : "Evening"
  }`;

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
    console.error("[meditation/checkout] booking insert failed", e);
  }

  try {
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: amountINR * 100,
      currency: "INR",
      receipt: bookingId ? `mm_med_${bookingId}` : `mm_med_${Date.now()}`,
      notes: {
        itemSlug: ITEM_SLUG,
        title: TITLE,
        residency,
        mode,
        slot,
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
        console.error("[meditation/checkout] order_id update failed", e);
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
