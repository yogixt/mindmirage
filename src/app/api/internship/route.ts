import { NextResponse } from "next/server";
import { z } from "zod";
import { buildResponse, notify } from "@/lib/notify";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  whatsapp: z.string().min(5).max(40),
  country: z.string().min(2).max(80),
  age: z.coerce.number().int().min(16).max(99),
  role: z.string().min(2).max(120),
  background: z.string().min(2).max(4000),
  motivation: z.string().min(2).max(4000),
  hours: z.string().min(1).max(40),
  start: z.string().optional().default(""),
});

export async function POST(req: Request) {
  let body;
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid internship data" }, { status: 400 });
  }
  const result = await notify({ _kind: "Internship", ...body });
  return NextResponse.json(buildResponse("internship", result));
}
