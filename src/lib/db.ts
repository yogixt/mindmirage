import { createClient, type Client } from "@libsql/client";

/* ────────────  Turso client  ──────────── */

let client: Client | null = null;

export function mindMirageDb(): Client | null {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) return null;
  if (!client) client = createClient({ url, authToken });
  return client;
}

/* ────────────  Migrations  ──────────── */

let migrated = false;

export async function runMigrations() {
  if (migrated) return;
  const db = mindMirageDb();
  if (!db) return;
  try {
    await db.execute("ALTER TABLE users ADD COLUMN phone TEXT NOT NULL DEFAULT ''");
  } catch {
    /* column already exists */
  }

  /* Ensure the bookings table matches the shared schema. */
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      whatsapp TEXT,
      subject TEXT,
      slot TEXT,
      preferred_dates TEXT,
      message TEXT,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT,
      approved_date TEXT,
      paid INTEGER DEFAULT 0
    )`);
  } catch {
    /* table already exists */
  }

  /* Booking + payment linkage for the slot-first checkout wizard. */
  const bookingCols = [
    "order_id TEXT",
    "payment_id TEXT",
    "amount_inr INTEGER",
    "item_slug TEXT",
    "expires_at TEXT",
  ];
  for (const col of bookingCols) {
    try {
      await db.execute(`ALTER TABLE bookings ADD COLUMN ${col}`);
    } catch {
      /* column already exists */
    }
  }

  /* Calendar blocking + live class schedule shared with the admin portal. */
  try {
    await db.execute(`CREATE TABLE blocked_dates (
      date TEXT PRIMARY KEY,
      reason TEXT
    )`);
  } catch { /* exists */ }

  try {
    await db.execute(`CREATE TABLE class_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_slug TEXT NOT NULL,
      on_date TEXT NOT NULL,
      at_time TEXT,
      zoom_url TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  } catch { /* exists */ }

  /* WhatsApp-contact clicks from event pages (leads), shared with admin. */
  try {
    await db.execute(`CREATE TABLE whatsapp_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program TEXT,
      name TEXT,
      email TEXT,
      phone TEXT,
      context TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  } catch { /* exists */ }

  migrated = true;
}

/* ────────────  Brahmavadini (posted by Team / Guruji)  ────────────
   Team posts blogs, photos, links, news; signed-in seekers read,
   like, and comment. */

export const POST_CATEGORIES = [
  { value: "blog", label: "Blog" },
  { value: "news", label: "News" },
  { value: "update", label: "Update" },
  { value: "announcement", label: "Announcement" },
  { value: "guidance", label: "Guidance" },
  { value: "conference", label: "Conference" },
  { value: "collaboration", label: "Collaboration" },
] as const;

export type Post = {
  id: number;
  author: string;
  category: string;
  title: string;
  body: string;
  link: string;
  image: string;
  created_at: string;
  likes: number;
  comments: number;
  likedByMe: boolean;
};

export type PostComment = {
  id: number;
  author: string;
  body: string;
  created_at: string;
};

export async function listPosts(viewerId?: string | null): Promise<Post[]> {
  const db = mindMirageDb();
  if (!db) return [];
  const rs = await db.execute({
    sql: `SELECT p.id, p.author, p.category, p.title, p.body, p.link, p.image, p.created_at,
            COALESCE(l.cnt, 0) AS likes,
            COALESCE(c.cnt, 0) AS comments,
            EXISTS(SELECT 1 FROM post_likes l2 WHERE l2.post_id = p.id AND l2.user_id = ?) AS likedByMe
          FROM posts p
          LEFT JOIN (SELECT post_id, COUNT(*) AS cnt FROM post_likes GROUP BY post_id) l ON l.post_id = p.id
          LEFT JOIN (SELECT post_id, COUNT(*) AS cnt FROM post_comments GROUP BY post_id) c ON c.post_id = p.id
          ORDER BY p.created_at DESC
          LIMIT 100`,
    args: [viewerId ?? ""],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rs.rows.map((r: any) => ({
    id: Number(r.id),
    author: String(r.author),
    category: String(r.category),
    title: String(r.title),
    body: String(r.body),
    link: String(r.link),
    image: String(r.image),
    created_at: String(r.created_at),
    likes: Number(r.likes),
    comments: Number(r.comments),
    likedByMe: Boolean(Number(r.likedByMe)),
  }));
}

export async function listPostComments(postId: number): Promise<PostComment[]> {
  const db = mindMirageDb();
  if (!db) return [];
  const rs = await db.execute({
    sql: "SELECT id, author, body, created_at FROM post_comments WHERE post_id = ? ORDER BY created_at ASC LIMIT 200",
    args: [postId],
  });
  return rs.rows.map((r) => ({
    id: Number(r.id),
    author: String(r.author),
    body: String(r.body),
    created_at: String(r.created_at),
  }));
}
