import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeeker } from "@/lib/auth";
import { journalDb } from "@/lib/journal";

/* Sādhak profile extras — bio, sankalpa (intention), avatar and cover
   photos. Images arrive as compressed JPEG data URLs from the client. */

export async function GET() {
  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }
  const db = journalDb();
  if (!db) return NextResponse.json({ ok: true, profile: {} });
  const rs = await db.execute({
    sql: "SELECT bio, intention, avatar, cover FROM sadhak_profiles WHERE user_id = ?",
    args: [seeker.userId],
  });
  const r = rs.rows[0];
  return NextResponse.json({
    ok: true,
    profile: r
      ? {
          bio: r.bio ? String(r.bio) : "",
          intention: r.intention ? String(r.intention) : "",
          avatar: r.avatar ? String(r.avatar) : null,
          cover: r.cover ? String(r.cover) : null,
        }
      : {},
  });
}

const Body = z.object({
  bio: z.string().max(600).optional(),
  intention: z.string().max(200).optional(),
  avatar: z.string().startsWith("data:image/").max(900_000).nullable().optional(),
  cover: z.string().startsWith("data:image/").max(1_500_000).nullable().optional(),
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
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const { bio, intention, avatar, cover } = parsed.data;

  // Upsert only the provided fields; COALESCE keeps the rest.
  await db.execute({
    sql: `INSERT INTO sadhak_profiles (user_id, bio, intention, avatar, cover, updated_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT (user_id) DO UPDATE SET
            bio = COALESCE(?, sadhak_profiles.bio),
            intention = COALESCE(?, sadhak_profiles.intention),
            avatar = CASE WHEN ? THEN ? ELSE sadhak_profiles.avatar END,
            cover = CASE WHEN ? THEN ? ELSE sadhak_profiles.cover END,
            updated_at = datetime('now')`,
    args: [
      seeker.userId,
      bio ?? null,
      intention ?? null,
      avatar ?? null,
      cover ?? null,
      bio ?? null,
      intention ?? null,
      avatar !== undefined ? 1 : 0,
      avatar ?? null,
      cover !== undefined ? 1 : 0,
      cover ?? null,
    ],
  });
  return NextResponse.json({ ok: true });
}
