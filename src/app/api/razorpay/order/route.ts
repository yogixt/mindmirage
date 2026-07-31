import { NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { CATALOG } from "@/lib/constants";
import { discountFor, getCouponPercent } from "@/lib/coupons";
import { getSeekerUserId } from "@/lib/auth";
import { priceFor, regionFromCountry } from "@/lib/region";

const BodySchema = z.object({
  slugs: z.array(z.string()).min(1),
  coupon: z.string().max(40).optional().default(""),
});

export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "razorpay_not_configured",
        message:
          "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local to enable checkout.",
      },
      { status: 503 },
    );
  }

  // Purchases require a signed-in seeker so the enrolment can be recorded.
  const userId = await getSeekerUserId();
  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "sign_in_required" },
      { status: 401 },
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

  const courses = parsed.data.slugs
    .map((slug) => CATALOG.find((c) => c.slug === slug))
    .filter((c): c is (typeof CATALOG)[number] => !!c);

  if (courses.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no_valid_items" },
      { status: 400 },
    );
  }

  // Region is derived from Vercel's edge geo header — never trusted from the
  // client — so the amount matches what the visitor was shown and can't be
  // swapped to the cheaper region from the browser.
  const region = regionFromCountry(req.headers.get("x-vercel-ip-country"));
  const baseINR = courses.reduce((sum, c) => sum + priceFor(c, region), 0);

  // Server-side coupon validation — the client never controls the amount.
  const couponCode = parsed.data.coupon.trim().toUpperCase();
  const couponPercent = couponCode ? await getCouponPercent(couponCode) : null;
  const couponResult =
    couponPercent !== null ? discountFor(baseINR, couponPercent) : null;
  if (couponCode && !couponResult) {
    return NextResponse.json(
      { ok: false, error: "invalid_coupon" },
      { status: 400 },
    );
  }

  const totalINR = couponResult ? couponResult.finalINR : baseINR;
  const amountPaise = totalINR * 100;

  // Razorpay rejects orders below 100 paise (₹1).
  if (amountPaise < 100) {
    return NextResponse.json(
      { ok: false, error: "amount_too_small" },
      { status: 400 },
    );
  }

  const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `mm_${Date.now()}`,
      notes: {
        slugs: courses.map((c) => c.slug).join(","),
        titles: courses.map((c) => c.title).join(" | "),
        ...(couponResult && {
          coupon: couponCode,
          discountINR: String(couponResult.discountINR),
        }),
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      slugs: courses.map((c) => c.slug),
      titles: courses.map((c) => c.title),
    });
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "unknown_error";
    return NextResponse.json(
      { ok: false, error: "razorpay_error", message },
      { status: 502 },
    );
  }
}
