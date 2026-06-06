import { NextResponse } from "next/server";
import { getSeeker } from "@/lib/auth";
import { journalDb } from "@/lib/journal";

/* Toggle like — one per seeker per question. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = journalDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "journal_not_configured" },
      { status: 503 },
    );
  }

  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json(
      { ok: false, error: "sign_in_required" },
      { status: 401 },
    );
  }

  const { id } = await params;
  const questionId = Number(id);
  if (!Number.isInteger(questionId) || questionId <= 0) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const existing = await db.execute({
    sql: "SELECT 1 FROM likes WHERE question_id = ? AND user_id = ?",
    args: [questionId, seeker.userId],
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: "DELETE FROM likes WHERE question_id = ? AND user_id = ?",
      args: [questionId, seeker.userId],
    });
  } else {
    await db.execute({
      sql: "INSERT OR IGNORE INTO likes (question_id, user_id) VALUES (?, ?)",
      args: [questionId, seeker.userId],
    });
  }

  const count = await db.execute({
    sql: "SELECT COUNT(*) AS n FROM likes WHERE question_id = ?",
    args: [questionId],
  });

  return NextResponse.json({
    ok: true,
    liked: existing.rows.length === 0,
    likes: Number(count.rows[0].n),
  });
}
