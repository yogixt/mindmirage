import { NextResponse } from "next/server";
import { z } from "zod";
import { mindMirageDb, runMigrations } from "@/lib/db";
import { notify } from "@/lib/notify";

/* Yoga Asana Classes — reservation only (no online payment). Records the
   reservation and emails the team, who follow up with fee/payment details. */

const Body = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  mode: z.enum(["offline", "online"]),
  experience: z.enum(["new", "some", "regular"]),
});

const EXP_LABEL: Record<"new" | "some" | "regular", string> = {
  new: "New to yoga",
  some: "Some experience",
  regular: "Regular practice",
};

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { name, email, phone, mode, experience } = parsed.data;
  const modeLabel = mode === "offline" ? "Offline · Ashram" : "Online · Live";
  const expLabel = EXP_LABEL[experience];

  // Best-effort reservation record.
  try {
    await runMigrations();
    const db = mindMirageDb();
    if (db) {
      await db.execute({
        sql: `INSERT INTO bookings
              (user_id, name, email, whatsapp, subject, slot, preferred_dates, message, status, item_slug)
              VALUES (NULL, ?, ?, ?, 'Yoga Asana Classes', ?, '05 July 2026 · 2–4 PM', ?, 'new', 'yoga-asana')`,
        args: [name, email, phone, modeLabel, `Experience: ${expLabel}`],
      });
    }
  } catch (e) {
    console.error("[yoga/reserve] insert failed", e);
  }

  // Email the team — best effort.
  try {
    await notify({
      _kind: "Booking",
      course: "Yoga Asana Classes",
      sadhak: name,
      email,
      phone,
      mode: modeLabel,
      experience: expLabel,
      startsOn: "05 July 2026 · 2–4 PM",
    });
  } catch (e) {
    console.error("[yoga/reserve] notify failed", e);
  }

  return NextResponse.json({ ok: true });
}
