import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeeker, isAdmin } from "@/lib/auth";
import { journalDb, listPosts, POST_CATEGORIES } from "@/lib/journal";

const BodySchema = z.object({
  title: z.string().min(5).max(200),
  category: z.enum(
    POST_CATEGORIES.map((c) => c.value) as [string, ...string[]],
  ),
  body: z.string().max(8000).optional().default(""),
  link: z.string().url().max(500).optional().or(z.literal("")).default(""),
});

export async function GET() {
  const posts = await listPosts();
  return NextResponse.json({ ok: true, posts });
}

export async function POST(req: Request) {
  const db = journalDb();
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "updates_not_configured" },
      { status: 503 },
    );
  }

  if (!(await isAdmin())) {
    return NextResponse.json(
      { ok: false, error: "admin_only" },
      { status: 403 },
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

  const seeker = await getSeeker();
  const author = seeker?.fullName?.trim() || "Mind Mirage Team";
  await db.execute({
    sql: "INSERT INTO posts (author, category, title, body, link) VALUES (?, ?, ?, ?, ?)",
    args: [
      author,
      parsed.data.category,
      parsed.data.title.trim(),
      parsed.data.body.trim(),
      parsed.data.link.trim(),
    ],
  });

  return NextResponse.json({ ok: true });
}
