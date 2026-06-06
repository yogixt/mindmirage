import { NextResponse } from "next/server";
import { getSeeker } from "@/lib/auth";
import { journalDb } from "@/lib/journal";
import { CATALOG } from "@/lib/constants";

/* Upcoming live classes — only for courses this sādhak is enrolled in. */

export async function GET() {
  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }
  const db = journalDb();
  if (!db) return NextResponse.json({ ok: true, classes: [] });

  const enrolled = (seeker.metadata.enrolledPrograms ?? []).filter(Boolean);
  if (enrolled.length === 0) return NextResponse.json({ ok: true, classes: [] });

  const placeholders = enrolled.map(() => "?").join(",");
  const rs = await db.execute({
    sql: `SELECT course_slug, on_date, at_time, zoom_url, note FROM class_schedule
          WHERE on_date >= date('now') AND course_slug IN (${placeholders})
          ORDER BY on_date ASC, at_time ASC LIMIT 20`,
    args: enrolled,
  });
  return NextResponse.json({
    ok: true,
    classes: rs.rows.map((r) => ({
      course:
        CATALOG.find((c) => c.slug === String(r.course_slug))?.title ??
        String(r.course_slug),
      date: String(r.on_date),
      time: String(r.at_time),
      zoomUrl: r.zoom_url ? String(r.zoom_url) : null,
      note: r.note ? String(r.note) : null,
    })),
  });
}
