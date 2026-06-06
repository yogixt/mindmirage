import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeeker } from "@/lib/auth";
import { journalDb } from "@/lib/journal";

/* Client-reported payment outcomes (failed / cancelled). Successes are
   written server-side at verification. Sign-in required — checkout is
   sign-in-gated anyway. */

const Body = z.object({
  status: z.enum(["failed", "cancelled"]),
  orderId: z.string().max(120).optional().default(""),
  paymentId: z.string().max(120).optional().default(""),
  reason: z.string().max(400).optional().default(""),
});

export async function POST(req: Request) {
  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = journalDb();
  if (!db) return NextResponse.json({ ok: true });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { status, orderId, paymentId, reason } = parsed.data;
  await db.execute({
    sql: `INSERT INTO payment_events (status, payment_id, order_id, user_name, email, reason)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [status, paymentId || null, orderId || null, seeker.fullName, seeker.email, reason || null],
  });
  return NextResponse.json({ ok: true });
}
