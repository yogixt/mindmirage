import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { getSeekerUserId } from "@/lib/auth";
import { mindMirageDb, runMigrations } from "@/lib/db";
import { CATALOG, GUIDANCE_SUBJECTS, scheduleForSubject } from "@/lib/constants";
import { priceFor, regionFromCountry } from "@/lib/region";

const Body = z.object({
  itemSlug: z.string().min(1),
  subject: z.string().min(1),
  slot: z.string().min(1),
  preferredDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1).max(10),
  preferredTime: z.string().max(80).optional().default(""),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  whatsapp: z.string().min(5).max(40),
  message: z.string().max(2000).optional().default(""),
  // False when the signed-in payer is booking this for someone else — in
  // that case name/email/whatsapp above are the beneficiary's own contact
  // details, not the payer's.
  forSelf: z.boolean().optional().default(true),
});

function minutesFromNow(minutes: number) {
  const d = new Date(Date.now() + minutes * 60_000);
  return d.toISOString();
}

export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { ok: false, error: "razorpay_not_configured" },
      { status: 503 },
    );
  }

  const userId = await getSeekerUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  await runMigrations();
  const db = mindMirageDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });
  }

  const { itemSlug, subject, slot, preferredDates, preferredTime, name, email, whatsapp, message, forSelf } =
    parsed.data;

  const catalogItem = CATALOG.find((c) => c.slug === itemSlug);
  const guidanceItem = GUIDANCE_SUBJECTS.find((s) => s.slug === itemSlug);
  // Region from the edge geo header (never client-trusted) so the booking is
  // charged the same figure the visitor was shown.
  const region = regionFromCountry(req.headers.get("x-vercel-ip-country"));
  const amountINR = catalogItem
    ? priceFor(catalogItem, region)
    : (guidanceItem?.priceINR ?? 0);
  if (amountINR <= 0) {
    return NextResponse.json({ ok: false, error: "item_not_priced" }, { status: 400 });
  }

  const schedule = scheduleForSubject(subject);
  const slotLabel = schedule.label;
  const preferred = preferredTime
    ? `${preferredDates.join(", ")} (${preferredTime})`
    : preferredDates.join(", ");

  const insert = await db.execute({
    sql: `INSERT INTO bookings
          (user_id, name, email, whatsapp, subject, slot, preferred_dates, message, status, item_slug, amount_inr, expires_at, for_self)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending_payment', ?, ?, ?, ?)`,
    args: [userId, name, email, whatsapp, subject, slotLabel, preferred, message, itemSlug, amountINR, minutesFromNow(30), forSelf ? 1 : 0],
  });
  const bookingId = Number(insert.lastInsertRowid);

  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
  try {
    const order = await rzp.orders.create({
      amount: amountINR * 100,
      currency: "INR",
      receipt: `mm_booking_${bookingId}`,
      notes: {
        bookingId: String(bookingId),
        itemSlug,
        subject,
        title: catalogItem?.title ?? guidanceItem?.name ?? itemSlug,
      },
    });

    await db.execute({
      sql: "UPDATE bookings SET order_id = ? WHERE id = ?",
      args: [order.id, bookingId],
    });

    return NextResponse.json({
      ok: true,
      bookingId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      itemSlug,
      title: catalogItem?.title ?? guidanceItem?.name ?? itemSlug,
    });
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "unknown_error";
    return NextResponse.json({ ok: false, error: "razorpay_error", message }, { status: 502 });
  }
}
