import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeeker } from "@/lib/auth";
import { journalDb } from "@/lib/journal";
import { COURSES } from "@/lib/constants";

/* Self-paced assignment flow.
   After each video lesson the sādhak submits a handwritten assignment
   (photo). The team reviews it in the admin portal; approval unlocks the
   next lesson. Current lesson = approved submissions + 1. */

export async function GET() {
  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }
  const db = journalDb();
  if (!db) return NextResponse.json({ ok: true, courses: [] });

  // Assignments apply to the eight main (self-paced) courses only.
  const eligible = seeker.enrolledCourses.filter((c) =>
    COURSES.some((m) => m.slug === c.slug),
  );
  if (eligible.length === 0) {
    return NextResponse.json({ ok: true, courses: [] });
  }

  const courses = [];
  for (const c of eligible) {
    const approved = await db.execute({
      sql: "SELECT COUNT(*) AS n FROM assignment_submissions WHERE user_id = ? AND course_slug = ? AND status = 'approved'",
      args: [seeker.userId, c.slug],
    });
    const currentLesson = Number(approved.rows[0].n) + 1;

    // Personal assignment for this sadhak wins over the general one.
    const q = await db.execute({
      sql: `SELECT questions, file, file_name, video_url FROM assignment_questions
            WHERE course_slug = ? AND lesson = ? AND user_id IN (?, '')
            ORDER BY (user_id = ?) DESC LIMIT 1`,
      args: [c.slug, currentLesson, seeker.userId, seeker.userId],
    });

    const sub = await db.execute({
      sql: "SELECT status, marks, remarks FROM assignment_submissions WHERE user_id = ? AND course_slug = ? AND lesson = ?",
      args: [seeker.userId, c.slug, currentLesson],
    });

    // Most recent reviewed lesson — marks and remarks from the team.
    const last = await db.execute({
      sql: `SELECT lesson, status, marks, remarks FROM assignment_submissions
            WHERE user_id = ? AND course_slug = ? AND status IN ('approved','returned')
            ORDER BY lesson DESC LIMIT 1`,
      args: [seeker.userId, c.slug],
    });

    courses.push({
      slug: c.slug,
      title: c.title,
      deva: c.deva,
      currentLesson,
      questions:
        q.rows.length && String(q.rows[0].questions).trim()
          ? String(q.rows[0].questions)
          : null,
      file: q.rows.length && q.rows[0].file ? String(q.rows[0].file) : null,
      fileName:
        q.rows.length && q.rows[0].file_name ? String(q.rows[0].file_name) : null,
      videoUrl:
        q.rows.length && q.rows[0].video_url ? String(q.rows[0].video_url) : null,
      submissionStatus: sub.rows.length ? String(sub.rows[0].status) : null,
      currentRemarks:
        sub.rows.length && sub.rows[0].remarks ? String(sub.rows[0].remarks) : null,
      lastReview: last.rows.length
        ? {
            lesson: Number(last.rows[0].lesson),
            status: String(last.rows[0].status),
            marks: last.rows[0].marks === null ? null : Number(last.rows[0].marks),
            remarks: last.rows[0].remarks ? String(last.rows[0].remarks) : null,
          }
        : null,
    });
  }

  return NextResponse.json({ ok: true, courses });
}

const SubmitSchema = z.object({
  courseSlug: z.string().min(1).max(80),
  lesson: z.number().int().min(1).max(500),
  // Resized JPEG data URL from the client (~well under 1.5 MB).
  image: z
    .string()
    .startsWith("data:image/")
    .max(1_800_000),
});

export async function POST(req: Request) {
  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }
  const db = journalDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const { courseSlug, lesson, image } = parsed.data;

  // Must be enrolled in this course.
  if (!seeker.enrolledCourses.some((c) => c.slug === courseSlug)) {
    return NextResponse.json({ ok: false, error: "not_enrolled" }, { status: 403 });
  }

  // Only the current lesson may be submitted.
  const approved = await db.execute({
    sql: "SELECT COUNT(*) AS n FROM assignment_submissions WHERE user_id = ? AND course_slug = ? AND status = 'approved'",
    args: [seeker.userId, courseSlug],
  });
  const currentLesson = Number(approved.rows[0].n) + 1;
  if (lesson !== currentLesson) {
    return NextResponse.json({ ok: false, error: "wrong_lesson" }, { status: 400 });
  }

  // Insert or replace (covers re-submission after a return).
  await db.execute({
    sql: `INSERT INTO assignment_submissions (user_id, user_name, course_slug, lesson, image, status, submitted_at, reviewed_at)
          VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'), NULL)
          ON CONFLICT (user_id, course_slug, lesson)
          DO UPDATE SET image = excluded.image, status = 'pending', submitted_at = datetime('now'), reviewed_at = NULL`,
    args: [seeker.userId, seeker.fullName, courseSlug, lesson, image],
  });

  return NextResponse.json({ ok: true, status: "pending" });
}
