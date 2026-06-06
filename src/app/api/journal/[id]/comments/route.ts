import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeeker } from "@/lib/auth";
import { journalDb } from "@/lib/journal";

const BodySchema = z.object({
  body: z.string().min(2).max(2000),
});

export async function POST(
  req: Request,
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  const exists = await db.execute({
    sql: "SELECT 1 FROM questions WHERE id = ?",
    args: [questionId],
  });
  if (exists.rows.length === 0) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  const author = seeker.fullName.trim() || "A seeker";
  await db.execute({
    sql: "INSERT INTO comments (question_id, user_id, author, body) VALUES (?, ?, ?, ?)",
    args: [questionId, seeker.userId, author, parsed.data.body.trim()],
  });

  return NextResponse.json({ ok: true });
}
