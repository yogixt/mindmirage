import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { enrollCurrentSeeker } from "@/lib/auth";

const BodySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  slugs: z.array(z.string()).min(1),
});

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { ok: false, error: "razorpay_not_configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, slugs } =
    parsed.data;

  const expected = createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(razorpay_signature, "utf8");
  const matches =
    expectedBuf.length === receivedBuf.length &&
    timingSafeEqual(expectedBuf, receivedBuf);

  if (!matches) {
    return NextResponse.json(
      { ok: false, error: "signature_mismatch" },
      { status: 400 },
    );
  }

  const enrolled: string[] = [];
  for (const slug of slugs) {
    const ok = await enrollCurrentSeeker(slug);
    if (ok) enrolled.push(slug);
  }

  return NextResponse.json({
    ok: true,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    enrolled,
  });
}
