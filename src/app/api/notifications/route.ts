import { NextResponse } from "next/server";
import { getSeeker } from "@/lib/auth";
import { mindMirageDb } from "@/lib/db";
import { CATALOG, GUIDANCE_SUBJECTS } from "@/lib/constants";

/* The sādhak's notification log — derived live from their data:
   booking confirmations, assignment reviews, and classes coming up. */

export async function GET() {
  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }
  const db = mindMirageDb();
  if (!db) return NextResponse.json({ ok: true, items: [] });

  const items: { kind: string; text: string; at: string }[] = [];

  // Booking confirmations / declines
  const bookings = await db.execute({
    sql: `SELECT subject, slot, status, approved_date, created_at FROM bookings
          WHERE user_id = ? AND status IN ('approved','declined') ORDER BY created_at DESC LIMIT 10`,
    args: [seeker.userId],
  });
  for (const r of bookings.rows) {
    const subject =
      GUIDANCE_SUBJECTS.find((s) => s.slug === String(r.subject))?.name ??
      String(r.subject);
    const slot = String(r.slot) === "morning-ist" ? "Morning IST" : "Evening IST";
    if (String(r.status) === "approved") {
      items.push({
        kind: "booking",
        text: `Classes confirmed — ${subject}, ${slot}: ${String(r.approved_date ?? "")}`,
        at: String(r.created_at),
      });
    } else {
      items.push({
        kind: "booking",
        text: `Booking for ${subject} could not be confirmed — the team will reach out.`,
        at: String(r.created_at),
      });
    }
  }

  // Assignment reviews
  const reviews = await db.execute({
    sql: `SELECT course_slug, lesson, status, marks, remarks, reviewed_at FROM assignment_submissions
          WHERE user_id = ? AND reviewed_at IS NOT NULL ORDER BY reviewed_at DESC LIMIT 10`,
    args: [seeker.userId],
  });
  for (const r of reviews.rows) {
    const course =
      CATALOG.find((c) => c.slug === String(r.course_slug))?.title ??
      String(r.course_slug);
    const marks = r.marks === null ? "" : ` · Marks ${Number(r.marks)}/100`;
    items.push({
      kind: "assignment",
      text:
        String(r.status) === "approved"
          ? `Lesson ${Number(r.lesson)} of ${course} approved${marks} — your next lesson is open.`
          : `Lesson ${Number(r.lesson)} of ${course} returned for redo${r.remarks ? ` — "${String(r.remarks)}"` : ""}.`,
      at: String(r.reviewed_at),
    });
  }

  // Upcoming classes (next 7 days) for enrolled courses
  const enrolled = (seeker.metadata.enrolledPrograms ?? []).filter(Boolean);
  if (enrolled.length > 0) {
    const ph = enrolled.map(() => "?").join(",");
    const classes = await db.execute({
      sql: `SELECT course_slug, on_date, at_time FROM class_schedule
            WHERE course_slug IN (${ph}) AND on_date >= date('now') AND on_date <= date('now', '+7 days')
            ORDER BY on_date ASC LIMIT 10`,
      args: enrolled,
    });
    for (const r of classes.rows) {
      const course =
        CATALOG.find((c) => c.slug === String(r.course_slug))?.title ??
        String(r.course_slug);
      items.push({
        kind: "class",
        text: `Upcoming class — ${course} on ${String(r.on_date)} at ${String(r.at_time)} IST.`,
        at: String(r.on_date),
      });
    }
  }

  items.sort((a, b) => (a.at < b.at ? 1 : -1));
  return NextResponse.json({ ok: true, items: items.slice(0, 15) });
}
