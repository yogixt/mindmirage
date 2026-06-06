import { NextResponse } from "next/server";
import { z } from "zod";
import { buildResponse, notify } from "@/lib/notify";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  whatsapp: z.string().min(5).max(40),
  subject: z.string().min(2).max(80),
  slot: z.enum(["morning-ist", "evening-ist"]),
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
  const result = await notify({
    _kind: "Booking",
    ...body,
    preferredDates: body.preferredDates.join(", "),
  });
  return NextResponse.json(buildResponse("booking", result));
}
