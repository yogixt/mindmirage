import { NextResponse } from "next/server";
import { runMigrations } from "@/lib/db";
import { sweepMissingPayments } from "@/lib/payments";
import { notify } from "@/lib/notify";

/* Daily unattended safety net — runs the same sweep as the admin portal's
   "Reconcile payments" button, but on a schedule, and only makes noise when
   it actually finds something. The two prior fixes for this exact class of
   bug (the webhook, and then the manual reconcile button) both quietly went
   inert without anyone noticing until a customer complained; this exists so
   a regression surfaces the same day instead of the Nth time someone pays
   and doesn't show up in Orders. A 7-day window rather than 1 so a single
   missed run (deploy, cold start, Vercel hiccup) can't let anything slip
   through the gap between runs. */

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ ok: false, error: "cron_not_configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  await runMigrations();
  const result = await sweepMissingPayments(7);
  if (!result) {
    return NextResponse.json({ ok: false, error: "razorpay_or_db_not_configured" }, { status: 503 });
  }

  if (result.newlyRecorded.length > 0) {
    const lines = result.newlyRecorded
      .map((p) => `₹${p.amountINR} · ${p.items} · ${p.email || "no email"} · ${p.paymentId}`)
      .join("\n");
    await notify({
      _kind: "Payment Alert",
      summary: `Daily reconcile found ${result.newlyRecorded.length} captured payment(s) missing from orders, now backfilled.`,
      payments: lines,
      windowDays: result.windowDays,
    }).catch((e) => console.error("[cron/reconcile] alert notify failed", e));
  }

  return NextResponse.json({ ok: true, ...result });
}
