import { NextResponse } from "next/server";
import { z } from "zod";
import { buildResponse, notify } from "@/lib/notify";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  whatsapp: z.string().max(40).optional().default(""),
  country: z.string().min(2).max(80),
  subject: z.string().min(2).max(120),
  message: z.string().min(2).max(4000),
});

export async function POST(req: Request) {
  let body;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid inquiry data" }, { status: 400 });
  }
  const result = await notify({ _kind: "Inquiry", ...body });
  return NextResponse.json(buildResponse("inquiry", result));
}
