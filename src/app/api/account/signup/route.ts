import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import { mindMirageDb, runMigrations } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { resolvePendingGrantsForEmail } from "@/lib/auth";
import { MIN_PASSWORD_LENGTH } from "@/lib/password-strength";

/* Create a name/nick + password account. Email is optional.
   Passwords are scrypt-hashed; the plain password is never stored. */

const Body = z.object({
  handle: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[\p{L}0-9 ._-]+$/u, "invalid_handle"),
  password: z.string().min(MIN_PASSWORD_LENGTH).max(200),
  email: z.string().email().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message;
    return NextResponse.json(
      { ok: false, error: msg === "invalid_handle" ? "invalid_handle" : "invalid_body" },
      { status: 400 },
    );
  }

  const { handle, password } = parsed.data;
  const email = parsed.data.email || "";
  const handleKey = handle.toLowerCase();

  // The users.email column is UNIQUE NOT NULL (shared with Google sign-in).
  // For accounts created without an email, store a per-account synthetic
  // placeholder so multiple email-less sadhaks don't collide on "".
  const NO_EMAIL_HOST = "@no-email.mindmirage";

  await runMigrations();
  const db = mindMirageDb();
  if (!db) return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });

  // Case-insensitive uniqueness on the login handle.
  try {
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE handle = ? LIMIT 1",
      args: [handleKey],
    });
    if (existing.rows.length) {
      return NextResponse.json({ ok: false, error: "handle_taken" }, { status: 409 });
    }
  } catch (e) {
    console.error("[account/signup] uniqueness check failed", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  const id = `c_${randomBytes(9).toString("hex")}`;
  const emailToStore = email || `${id}${NO_EMAIL_HOST}`;
  try {
    await db.execute({
      sql: `INSERT INTO users (id, email, name, handle, password_hash, enrolled_programs)
            VALUES (?, ?, ?, ?, ?, '[]')`,
      args: [id, emailToStore, handle, handleKey, hashPassword(password)],
    });
  } catch (e) {
    console.error("[account/signup] insert failed", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  if (email) {
    await resolvePendingGrantsForEmail(email, id).catch((e) =>
      console.error("[account/signup] pending grant resolve failed", e),
    );
  }

  return NextResponse.json({ ok: true, id });
}
