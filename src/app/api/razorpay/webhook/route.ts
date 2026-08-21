import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { mindMirageDb, runMigrations } from "@/lib/db";
import { recordCapturedPayment, type RazorpayPaymentEntity } from "@/lib/payments";

/* Server-to-server backstop for every checkout flow (cart, contributions,
   guest bookings, the slot-first wizard).

   The client-side /verify routes are the fast path: they run the instant
   Razorpay's in-browser handler fires, so a paying seeker sees "paid" without
   delay. But that handler only runs if the browser is still open and online
   after the charge — close the tab, lose signal, or have the UPI app fail to
   hand back focus, and Razorpay has captured money while our DB never hears
   about it. This webhook is Razorpay telling us directly, so it's what makes
   every payment eventually land regardless of what the browser did. The
   actual recording logic lives in lib/payments.ts, shared with the
   /razorpay/reconcile sweep so both paths can never drift apart. */

type RazorpayFailedPaymentEntity = RazorpayPaymentEntity & {
  error_description?: string | null;
};

type RazorpayWebhookBody = {
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayFailedPaymentEntity };
  };
};

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[razorpay/webhook] RAZORPAY_WEBHOOK_SECRET not configured");
    return NextResponse.json({ ok: false, error: "webhook_not_configured" }, { status: 503 });
  }

  // Signature is computed over the exact raw bytes, so it must be read
  // before any JSON parsing touches the body.
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(signature, "utf8");
  const matches =
    expectedBuf.length === receivedBuf.length && timingSafeEqual(expectedBuf, receivedBuf);
  if (!matches) {
    return NextResponse.json({ ok: false, error: "signature_mismatch" }, { status: 400 });
  }

  let body: RazorpayWebhookBody;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const event = body.event ?? "";
  const payment = body.payload?.payment?.entity;

  await runMigrations();
  const db = mindMirageDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "db_not_configured" }, { status: 503 });
  }

  if (event === "payment.failed" && payment) {
    try {
      await db.execute({
        sql: `INSERT OR IGNORE INTO payment_events (status, payment_id, order_id, email, reason)
              VALUES ('failed', ?, ?, ?, ?)`,
        args: [
          payment.id,
          payment.order_id ?? "",
          payment.email ?? null,
          payment.error_description ?? "payment_failed",
        ],
      });
    } catch (e) {
      console.error("[razorpay/webhook] failed-event log failed", e);
    }
    return NextResponse.json({ ok: true });
  }

  if (event !== "payment.captured" || !payment) {
    // Acknowledge and skip events we don't act on (refunds, order.paid, etc.)
    // — a non-2xx here would make Razorpay retry forever for nothing.
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    await recordCapturedPayment(payment);
  } catch (e) {
    console.error("[razorpay/webhook] processing failed", e);
    // 500 so Razorpay retries with backoff — we want at-least-once delivery.
    return NextResponse.json({ ok: false, error: "processing_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
