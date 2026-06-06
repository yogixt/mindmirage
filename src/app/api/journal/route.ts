import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeeker } from "@/lib/auth";
import { journalDb, listQuestions } from "@/lib/journal";
import { getSeekerUserId } from "@/lib/auth";

const BodySchema = z.object({
  title: z.string().min(5).max(200),
  body: z.string().max(4000).optional().default(""),
});

export async function GET() {
  const viewerId = await getSeekerUserId();
  const questions = await listQuestions(viewerId);
  return NextResponse.json({ ok: true, questions });
}

export async function POST(req: Request) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const author = seeker.fullName.trim() || "A seeker";
  const rs = await db.execute({
    sql: "INSERT INTO questions (user_id, author, title, body) VALUES (?, ?, ?, ?) RETURNING id",
    args: [seeker.userId, author, parsed.data.title.trim(), parsed.data.body.trim()],
  });

  return NextResponse.json({ ok: true, id: Number(rs.rows[0].id) });
}
