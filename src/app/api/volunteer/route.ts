import { NextResponse } from "next/server";
import { z } from "zod";
import { buildResponse, notify } from "@/lib/notify";
import { journalDb } from "@/lib/journal";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  whatsapp: z.string().min(5).max(40),
  country: z.string().min(2).max(80),
  role: z.string().min(2).max(120),
  hours: z.string().min(1).max(40),
  motivation: z.string().min(2).max(4000),
});

export async function POST(req: Request) {
  let body;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid volunteer data" }, { status: 400 });
  }
  // Keep a copy for the admin portal.
  try {
    const db = journalDb();
    if (db) {
      await db.execute({
        sql: "INSERT INTO form_entries (kind, name, email, whatsapp, payload) VALUES (?, ?, ?, ?, ?)",
        args: ["volunteer", body.name ?? null, body.email ?? null, body.whatsapp ?? null, JSON.stringify(body)],
      });
    }
  } catch (e) {
    console.error("[volunteer] record failed", e);
  }

  const result = await notify({ _kind: "Volunteer", ...body });
  return NextResponse.json(buildResponse("volunteer", result));
}
