import { NextResponse } from "next/server";
import { getSeeker } from "@/lib/auth";
import { journalDb } from "@/lib/journal";
import { GUIDANCE_SUBJECTS } from "@/lib/constants";

/* The sādhak's own slot requests with their approval status. */

export async function GET() {
  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }
  const db = journalDb();
  if (!db) return NextResponse.json({ ok: true, bookings: [] });
  const rs = await db.execute({
    sql: `SELECT subject, slot, preferred_dates, status, approved_date, created_at
          FROM bookings WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
    args: [seeker.userId],
  });
  return NextResponse.json({
    ok: true,
    bookings: rs.rows.map((r) => ({
      subject:
        GUIDANCE_SUBJECTS.find((s) => s.slug === String(r.subject))?.name ??
        String(r.subject),
      slot: String(r.slot) === "morning-ist" ? "Morning · IST" : "Evening · IST",
      dates: String(r.preferred_dates),
      status: String(r.status),
      approvedDates: r.approved_date
        ? String(r.approved_date)
            .split(",")
            .map((d) => d.trim())
            .filter(Boolean)
        : [],
    })),
  });
}
