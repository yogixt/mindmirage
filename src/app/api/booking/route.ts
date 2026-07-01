import { NextResponse } from "next/server";
import { z } from "zod";
import { buildResponse, notify } from "@/lib/notify";
import { mindMirageDb } from "@/lib/db";
import { getSeeker } from "@/lib/auth";
import { GUIDANCE_SUBJECTS } from "@/lib/constants";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  whatsapp: z.string().min(5).max(40),
  subject: z.string().min(2).max(80),
  slot: z.string().min(1).max(80),
  preferredDates: z.array(z.string()).min(1).max(5),
  message: z.string().max(2000).optional().default(""),
});

export async function POST(req: Request) {
  let body;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
  }

  // Business rule: slots are booked by signed-in sadhaks; priced classes
  // require the matching course to be purchased first.
  const seeker = await getSeeker();
  if (!seeker) {
    return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  }
  const subject = GUIDANCE_SUBJECTS.find((s) => s.slug === body.subject);
  if (subject && subject.priceINR > 0) {
    const courseSlug = `1on1-${subject.slug}`;
    const enrolled = (seeker.metadata.enrolledPrograms ?? []).includes(courseSlug);
    if (!enrolled) {
      return NextResponse.json({ error: "not_enrolled" }, { status: 403 });
    }
  }
  // Keep a copy for the admin portal — even if outward notification fails.
  try {
    const db = mindMirageDb();
    if (db) {
      await db.execute({
        sql: `INSERT INTO bookings (name, email, whatsapp, subject, slot, preferred_dates, message, user_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          body.name,
          body.email,
          body.whatsapp,
          body.subject,
          body.slot,
          body.preferredDates.join(", "),
          body.message,
          seeker.userId,
        ],
      });
    }
  } catch (e) {
    console.error("[booking] record failed", e);
  }

  const result = await notify({
    _kind: "Booking",
    ...body,
    preferredDates: body.preferredDates.join(", "),
  });
  return NextResponse.json(buildResponse("booking", result));
}
