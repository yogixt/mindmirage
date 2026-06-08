import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeekerUserId } from "@/lib/auth";
import { mindMirageDb } from "@/lib/db";
import { PRACTICE_IDS } from "@/lib/sadhana";

/* Daily sādhanā tracker — each sādhak's own checks, last 7 days. */

const DATE_RX = /^\d{4}-\d{2}-\d{2}$/;

function lastSevenDays(today: string) {
  const [y, m, d] = today.split("-").map(Number);
  const base = new Date(y, m - 1, d);
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const dt = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i);
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    days.push(`${dt.getFullYear()}-${mm}-${dd}`);
  }
  return days;
}

export async function GET(req: Request) {
  const userId = await getSeekerUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }
  const db = mindMirageDb();
  if (!db) return NextResponse.json({ ok: true, checks: [] });

  const today = new URL(req.url).searchParams.get("today") ?? "";
  if (!DATE_RX.test(today)) {
    return NextResponse.json({ ok: false, error: "invalid_date" }, { status: 400 });
  }
  const days = lastSevenDays(today);
  const rs = await db.execute({
    sql: `SELECT date, practice FROM sadhana_checks WHERE user_id = ? AND date >= ? AND date <= ?`,
    args: [userId, days[0], days[6]],
  });
  return NextResponse.json({
    ok: true,
    checks: rs.rows.map((r) => ({ date: String(r.date), practice: String(r.practice) })),
  });
}

const BodySchema = z.object({
  date: z.string().regex(DATE_RX),
  practice: z.enum(PRACTICE_IDS),
  done: z.boolean(),
});

export async function POST(req: Request) {
  const userId = await getSeekerUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }
  const db = mindMirageDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { date, practice, done } = parsed.data;
  if (done) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO sadhana_checks (user_id, date, practice) VALUES (?, ?, ?)",
      args: [userId, date, practice],
    });
  } else {
    await db.execute({
      sql: "DELETE FROM sadhana_checks WHERE user_id = ? AND date = ? AND practice = ?",
      args: [userId, date, practice],
    });
  }
  return NextResponse.json({ ok: true });
}
