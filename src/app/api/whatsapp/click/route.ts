import { NextResponse } from "next/server";
import { z } from "zod";
import { mindMirageDb, runMigrations } from "@/lib/db";

/* Records a "clicked to contact us on WhatsApp" lead from an event page,
   so the team can see who reached out. Fire-and-forget (sendBeacon). */

const Body = z.object({
  program: z.string().max(40),
  name: z.string().max(120).optional().default(""),
  email: z.string().max(160).optional().default(""),
  phone: z.string().max(40).optional().default(""),
  context: z.string().max(60).optional().default(""),
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });

  const { program, name, email, phone, context } = parsed.data;
  try {
    await runMigrations();
    const db = mindMirageDb();
    await db?.execute({
      sql: `INSERT INTO whatsapp_clicks (program, name, email, phone, context)
            VALUES (?, ?, ?, ?, ?)`,
      args: [program, name, email, phone, context],
    });
  } catch (e) {
    console.error("[whatsapp/click] insert failed", e);
  }

  return NextResponse.json({ ok: true });
}
