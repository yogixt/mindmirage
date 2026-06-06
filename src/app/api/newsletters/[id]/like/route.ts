import { NextResponse } from "next/server";
import { canReadNewsletters, getSeekerUserId } from "@/lib/auth";
import { journalDb } from "@/lib/journal";

/* Toggle like — one per seeker per post. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = journalDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "newsletters_not_configured" },
      { status: 503 },
    );
  }

  const userId = await getSeekerUserId();
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "sign_in_required" },
      { status: 401 },
    );
  }
  if (!(await canReadNewsletters())) {
    return NextResponse.json(
      { ok: false, error: "enrolled_only" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) {
    return NextResponse.json({ ok: false, error: "invalid_id" }, { status: 400 });
  }

  const existing = await db.execute({
    sql: "SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?",
    args: [postId, userId],
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?",
      args: [postId, userId],
    });
  } else {
    await db.execute({
      sql: "INSERT OR IGNORE INTO post_likes (post_id, user_id) VALUES (?, ?)",
      args: [postId, userId],
    });
  }

  const count = await db.execute({
    sql: "SELECT COUNT(*) AS n FROM post_likes WHERE post_id = ?",
    args: [postId],
  });

  return NextResponse.json({
    ok: true,
    liked: existing.rows.length === 0,
    likes: Number(count.rows[0].n),
  });
}
