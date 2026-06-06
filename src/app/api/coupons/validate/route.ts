import { NextResponse } from "next/server";
import { z } from "zod";
import { getCouponPercent } from "@/lib/coupons";

/* Checkout asks here whether a code is valid — the percent comes back,
   the final amount is still computed server-side at order time. */

const Body = z.object({ code: z.string().min(1).max(40) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }
  const percent = await getCouponPercent(parsed.data.code);
  if (percent === null) {
    return NextResponse.json({ ok: false, error: "invalid_coupon" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, percent });
}
