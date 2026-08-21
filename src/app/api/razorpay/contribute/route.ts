import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { getSeekerUserId } from "@/lib/auth";

const BodySchema = z.object({
  amount: z.number().min(10).max(500000),
  name: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ ok: false, error: "razorpay_not_configured" }, { status: 503 });
  }

  const userId = await getSeekerUserId();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "sign_in_required" }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }); }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { amount, name } = parsed.data;
  const amountPaise = Math.round(amount * 100);

  if (amountPaise < 100) {
    return NextResponse.json({ ok: false, error: "amount_too_small" }, { status: 400 });
  }

  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `contrib_${Date.now()}`,
      notes: { kind: "contribution", name, userId },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    const message = err && typeof err === "object" && "message" in err
      ? String((err as { message: unknown }).message)
      : "unknown_error";
    return NextResponse.json({ ok: false, error: "razorpay_error", message }, { status: 502 });
  }
}
