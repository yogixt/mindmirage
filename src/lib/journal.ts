import { createClient, type Client } from "@libsql/client";

/* ────────────  Journal Q&A · Turso  ────────────
   Seekers post questions; everyone reads; signed-in seekers
   like and comment. Tables: questions, comments, likes. */

let client: Client | null = null;

export function journalDb(): Client | null {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) return null;
  if (!client) client = createClient({ url, authToken });
  return client;
}

export type Question = {
  id: number;
  author: string;
  title: string;
  body: string;
  created_at: string;
  likes: number;
  comments: number;
  likedByMe: boolean;
};

export type Comment = {
  id: number;
  author: string;
  body: string;
  created_at: string;
};

export async function listQuestions(viewerId?: string | null): Promise<Question[]> {
  const db = journalDb();
  if (!db) return [];
  const rs = await db.execute({
    sql: `SELECT q.id, q.author, q.title, q.body, q.created_at,
            (SELECT COUNT(*) FROM likes l WHERE l.question_id = q.id) AS likes,
            (SELECT COUNT(*) FROM comments c WHERE c.question_id = q.id) AS comments,
            EXISTS(SELECT 1 FROM likes l2 WHERE l2.question_id = q.id AND l2.user_id = ?) AS likedByMe
          FROM questions q
          ORDER BY q.created_at DESC
          LIMIT 100`,
    args: [viewerId ?? ""],
  });
  return rs.rows.map(rowToQuestion);
}

export async function getQuestion(
  id: number,
  viewerId?: string | null,
): Promise<{ question: Question; comments: Comment[] } | null> {
  const db = journalDb();
  if (!db) return null;
  const q = await db.execute({
    sql: `SELECT q.id, q.author, q.title, q.body, q.created_at,
            (SELECT COUNT(*) FROM likes l WHERE l.question_id = q.id) AS likes,
            (SELECT COUNT(*) FROM comments c WHERE c.question_id = q.id) AS comments,
            EXISTS(SELECT 1 FROM likes l2 WHERE l2.question_id = q.id AND l2.user_id = ?) AS likedByMe
          FROM questions q WHERE q.id = ?`,
    args: [viewerId ?? "", id],
  });
  if (q.rows.length === 0) return null;
  const c = await db.execute({
    sql: `SELECT id, author, body, created_at FROM comments
          WHERE question_id = ? ORDER BY created_at ASC LIMIT 200`,
    args: [id],
  });
  return {
    question: rowToQuestion(q.rows[0]),
    comments: c.rows.map((r) => ({
      id: Number(r.id),
      author: String(r.author),
      body: String(r.body),
      created_at: String(r.created_at),
    })),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToQuestion(r: any): Question {
  return {
    id: Number(r.id),
    author: String(r.author),
    title: String(r.title),
    body: String(r.body),
    created_at: String(r.created_at),
    likes: Number(r.likes),
    comments: Number(r.comments),
    likedByMe: Boolean(Number(r.likedByMe)),
  };
}

/* ────────────  Official Updates (posted by Team / Guruji)  ──────────── */

export const POST_CATEGORIES = [
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
  created_at: string;
};

export async function listPosts(): Promise<Post[]> {
  const db = journalDb();
  if (!db) return [];
  const rs = await db.execute(
    "SELECT id, author, category, title, body, link, created_at FROM posts ORDER BY created_at DESC LIMIT 100",
  );
  return rs.rows.map((r) => ({
    id: Number(r.id),
    author: String(r.author),
    category: String(r.category),
    title: String(r.title),
    body: String(r.body),
    link: String(r.link),
    created_at: String(r.created_at),
  }));
}
