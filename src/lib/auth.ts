import { auth } from "@/auth";
import { mindMirageDb, runMigrations } from "./db";
import { COURSES, CATALOG } from "./constants";

/**
 * Sadhak identity — Auth.js (Google) for sign-in, Turso for the record.
 * Profile fields and enrolments live in the `users` table; sessions are
 * signed JWT cookies. No third-party auth vendor.
 */

export type SeekerProfile = {
  city?: string;
  preferredPath?:
    | "ashtanga-yoga"
    | "bhakti-yoga"
    | "jnana-yoga"
    | "advaita-vedanta"
    | "all"
    | "";
  whyISeek?: string;
  phone?: string;
};

export type SeekerMetadata = SeekerProfile & {
  enrolledPrograms?: string[];
};

export type SeekerSummary = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  email: string | null;
  imageUrl: string | null;
  metadata: SeekerMetadata;
  enrolledCourses: typeof COURSES;
};

/* Auth.js is configured when a secret and Google credentials exist. */
export function isAuthConfigured() {
  return !!(
    process.env.AUTH_SECRET &&
    process.env.AUTH_GOOGLE_ID &&
    process.env.AUTH_GOOGLE_SECRET
  );
}

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  enrolled: string[];
  city: string;
  preferredPath: string;
  whyISeek: string;
  phone: string;
};

async function currentUserRow(): Promise<UserRow | null> {
  const session = await auth().catch(() => null);
  const id = (session?.user as { id?: string } | undefined)?.id;
  if (!session?.user || !id) return null;

  const db = mindMirageDb();
  let row: UserRow = {
    id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    image: session.user.image ?? null,
    enrolled: [],
    city: "",
    preferredPath: "",
    whyISeek: "",
    phone: "",
  };
  if (db) {
    try {
      const rs = await db.execute({
        sql: "SELECT email, name, image, enrolled_programs, city, preferred_path, why_i_seek, phone FROM users WHERE id = ?",
        args: [id],
      });
      if (rs.rows.length) {
        const r = rs.rows[0];
        let enrolled: string[] = [];
        try {
          enrolled = JSON.parse(String(r.enrolled_programs ?? "[]"));
        } catch {
          enrolled = [];
        }
        row = {
          id,
          email: String(r.email ?? row.email),
          name: r.name ? String(r.name) : row.name,
          image: r.image ? String(r.image) : row.image,
          enrolled,
          city: r.city ? String(r.city) : "",
          preferredPath: r.preferred_path ? String(r.preferred_path) : "",
          whyISeek: r.why_i_seek ? String(r.why_i_seek) : "",
          phone: r.phone ? String(r.phone) : "",
        };
      }
    } catch (e) {
      console.error("[auth] user read failed", e);
    }
  }
  return row;
}

/* Placeholder emails minted for accounts created without one (see
   api/account/signup) — treat them as "no email" for display purposes. */
function realEmail(email: string): string {
  return email.endsWith("@no-email.mindmirage") ? "" : email;
}

export async function getSeeker(): Promise<SeekerSummary | null> {
  const row = await currentUserRow();
  if (!row) return null;
  const email = realEmail(row.email);
  const fullName = row.name || email || "Sādhak";
  const [firstName, ...rest] = fullName.split(" ");
  return {
    userId: row.id,
    firstName: firstName || null,
    lastName: rest.join(" ") || null,
    fullName,
    email: email || null,
    imageUrl: row.image,
    metadata: {
      enrolledPrograms: row.enrolled,
      city: row.city,
      preferredPath: (row.preferredPath || "") as SeekerProfile["preferredPath"],
      whyISeek: row.whyISeek,
      phone: row.phone,
    },
    enrolledCourses: COURSES.filter((c) =>
      row.enrolled.includes(c.slug),
    ) as unknown as typeof COURSES,
  };
}

export async function getSeekerUserId(): Promise<string | null> {
  const session = await auth().catch(() => null);
  return (session?.user as { id?: string } | undefined)?.id ?? null;
}

export async function enrollCurrentSeeker(slug: string): Promise<boolean> {
  if (!CATALOG.some((c) => c.slug === slug)) return false;
  const row = await currentUserRow();
  const db = mindMirageDb();
  if (!row || !db) return false;
  if (row.enrolled.includes(slug)) return true;
  const next = [...row.enrolled, slug];
  await db.execute({
    sql: "UPDATE users SET enrolled_programs = ? WHERE id = ?",
    args: [JSON.stringify(next), row.id],
  });
  return true;
}

/* Session-independent enrolment — used by the Razorpay webhook, which runs
   server-to-server with no browser session to read enrollCurrentSeeker's
   identity from. */
export async function enrollUserById(userId: string, slug: string): Promise<boolean> {
  if (!CATALOG.some((c) => c.slug === slug)) return false;
  const db = mindMirageDb();
  if (!db) return false;
  const rs = await db.execute({
    sql: "SELECT enrolled_programs FROM users WHERE id = ?",
    args: [userId],
  });
  if (!rs.rows.length) return false;
  let enrolled: string[] = [];
  try {
    enrolled = JSON.parse(String(rs.rows[0].enrolled_programs ?? "[]"));
  } catch {
    enrolled = [];
  }
  if (enrolled.includes(slug)) return true;
  const next = [...enrolled, slug];
  await db.execute({
    sql: "UPDATE users SET enrolled_programs = ? WHERE id = ?",
    args: [JSON.stringify(next), userId],
  });
  return true;
}

export async function findUserIdByEmail(email: string): Promise<string | null> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return null;
  const db = mindMirageDb();
  if (!db) return null;
  const rs = await db.execute({
    sql: "SELECT id FROM users WHERE lower(email) = ? LIMIT 1",
    args: [trimmed],
  });
  return rs.rows.length ? String(rs.rows[0].id) : null;
}

/* Someone paid for a course before the beneficiary had an account — their
   enrollment_grants row sat with granted_user_id = NULL ("pending"). Called
   on every sign-in/sign-up so the moment that email shows up with an
   account, they get the access that was already paid for. */
export async function resolvePendingGrantsForEmail(email: string, userId: string): Promise<void> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return;
  await runMigrations();
  const db = mindMirageDb();
  if (!db) return;
  const rs = await db.execute({
    sql: "SELECT id, slug FROM enrollment_grants WHERE lower(for_email) = ? AND granted_user_id IS NULL",
    args: [trimmed],
  });
  for (const row of rs.rows) {
    const slug = String(row.slug);
    const ok = await enrollUserById(userId, slug);
    if (!ok) continue;
    await db.execute({
      sql: "UPDATE enrollment_grants SET granted_user_id = ?, granted_at = datetime('now') WHERE id = ?",
      args: [userId, row.id],
    });
  }
}

export async function updateSeekerProfile(profile: SeekerProfile) {
  await runMigrations();
  const row = await currentUserRow();
  const db = mindMirageDb();
  if (!row || !db) return false;
  await db.execute({
    sql: "UPDATE users SET city = ?, preferred_path = ?, why_i_seek = ?, phone = ? WHERE id = ?",
    args: [
      profile.city ?? "",
      profile.preferredPath ?? "",
      profile.whyISeek ?? "",
      profile.phone ?? "",
      row.id,
    ],
  });
  return true;
}

/* ── Roles ── */

function adminList() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth().catch(() => null);
  const email = session?.user?.email?.toLowerCase();
  return !!email && adminList().includes(email);
}

/* Enrolled sadhaks — have bought at least one course. */
export async function isEnrolledSeeker(): Promise<boolean> {
  const row = await currentUserRow();
  return !!row && row.enrolled.length > 0;
}

export async function canReadVageshwari(): Promise<boolean> {
  const row = await currentUserRow();
  if (!row) return false;
  if (row.enrolled.length > 0) return true;
  return adminList().includes(row.email.toLowerCase());
}
