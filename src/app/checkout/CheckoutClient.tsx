"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useCart } from "@/lib/cart";
import { formatINR, SITE } from "@/lib/constants";
import { priceFor } from "@/lib/region";
import { useRegion } from "@/lib/useRegion";
import IndianAbroadNote from "@/components/IndianAbroadNote";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { BookOpen, Video } from "lucide-react";

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

type OrderResponse =
  | {
      ok: true;
      orderId: string;
      amount: number;
      currency: string;
      keyId: string;
      slugs: string[];
      titles: string[];
    }
  | { ok: false; error: string; message?: string };

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayPaymentFailed = {
  error?: { description?: string; reason?: string };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: RazorpayPaymentFailed) => void,
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CheckoutClient({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const { courses, items, total, count, clear } = useCart();
  const region = useRegion();
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "creating" | "opening" | "verifying" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponPercent, setCouponPercent] = useState<number | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [forSelf, setForSelf] = useState(true);
  const [forName, setForName] = useState("");
  const [forEmail, setForEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) setScriptReady(true);
  }, []);

  const discount =
    coupon && couponPercent !== null
      ? {
          percent: couponPercent,
          discountINR: Math.round((total * couponPercent) / 100),
          finalINR: total - Math.round((total * couponPercent) / 100),
        }
      : null;
  const payable = discount ? discount.finalINR : total;

  const handleApplyCoupon = async () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
      setCouponPercent(data.percent);
      setCoupon(code);
      setCouponInput("");
    } catch {
      setCouponError("That code is not valid.");
    }
  };

  const handlePay = async () => {
    if (count === 0) return;
    if (!forSelf && (!forName.trim() || !forEmail.trim())) {
      setErrorMessage("Add their name and email so we know who to enrol.");
      return;
    }
    setStatus("creating");
    setErrorMessage(null);

    let order: OrderResponse;
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slugs: items.flatMap((item) => Array(item.quantity).fill(item.slug)),
          coupon: coupon ?? "",
          forSelf,
          forName: forSelf ? "" : forName.trim(),
          forEmail: forSelf ? "" : forEmail.trim(),
        }),
      });
      order = (await res.json()) as OrderResponse;
      if (!order.ok) {
        setStatus("error");
        setErrorMessage(
          order.message ??
            (order.error === "sign_in_required"
              ? "Please sign in to complete your enrolment."
              : order.error === "razorpay_not_configured"
              ? "Checkout is not yet configured. Set RAZORPAY_KEY_SECRET in .env.local."
              : "Could not start checkout. Please try again."),
        );
        return;
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error while preparing your order.");
      return;
    }

    if (!window.Razorpay) {
      setStatus("error");
      setErrorMessage("Razorpay checkout did not load. Refresh and try again.");
      return;
    }

    setStatus("opening");

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: SITE.name,
      description: order.titles.join(" · "),
      order_id: order.orderId,
      theme: { color: "#C0531F" },
      notes: { slugs: order.slugs.join(",") },
      handler: async (response) => {
        setStatus("verifying");
        try {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              slugs: order.ok ? order.slugs : [],
            }),
          });
          const verify = (await verifyRes.json()) as {
            ok: boolean;
            error?: string;
            paymentId?: string;
          };
          if (!verify.ok) {
            setStatus("error");
            setErrorMessage(
              verify.error === "signature_mismatch"
                ? "Payment signature could not be verified."
                : "Payment received, but verification failed. We will reach out.",
            );
            return;
          }
          clear();
          router.push(
            `/checkout/success?payment=${encodeURIComponent(response.razorpay_payment_id)}`,
          );
        } catch {
          setStatus("error");
          setErrorMessage("Verification request failed. Please contact us.");
        }
      },
      modal: {
        ondismiss: () => {
          setStatus("idle");
          void fetch("/api/razorpay/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "cancelled",
              orderId: order.ok ? order.orderId : "",
              reason: "checkout closed before paying",
            }),
          }).catch(() => {});
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      void fetch("/api/razorpay/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "failed",
          orderId: order.ok ? order.orderId : "",
                    reason: response.error?.description ?? "payment failed",
        }),
      }).catch(() => {});
      setStatus("error");
      setErrorMessage(
        response.error?.description ??
          "Payment failed. No money was deducted — please try again.",
      );
    });

    rzp.open();
  };

  const busy =
    status === "creating" || status === "opening" || status === "verifying";

  return (
    <>
      <Script
        src={CHECKOUT_SCRIPT}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <Navbar />
      <main className="min-h-screen">
        <PageHero
          deva="संकल्प"
          eyebrow="Checkout"
          title="Set your intention"
          description="A one-time offering for the path ahead. Acharya Ji reviews every enrolment personally."
        />

        <section className="mx-auto max-w-3xl px-6 pb-4">
          {count === 0 ? (
            <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-8 text-center">
              <p className="display text-2xl text-ink">Your basket is empty.</p>
              <Link
                href="/programs"
                className="mt-4 inline-flex rounded-lg bg-saffron px-7 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
              >
                Browse programs
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-ink/10 bg-paper p-6 sm:p-7">
              <p className="eyebrow">Order summary</p>
              <ul className="mt-4 divide-y divide-ink/10">
                {courses.map((c) => {
                  const item = items.find((i) => i.slug === c.slug);
                  const quantity = item ? item.quantity : 1;
                  const unitPrice = priceFor(c, region);
                  const itemTotal = unitPrice * quantity;
                  const isBook = c.slug.startsWith("booklist");
                  const isSession = c.slug.startsWith("1on1");

                  return (
                    <li
                      key={c.slug}
                      className="flex gap-4 py-4 items-center"
                    >
                      {/* Left: Thumbnail image */}
                      <div className="relative w-14 h-14 rounded-xl border border-ink/5 bg-gradient-to-br from-saffron/10 via-gold/5 to-saffron/5 flex items-center justify-center overflow-hidden shrink-0">
                        {isBook ? (
                          <BookOpen className="w-5 h-5 text-saffron/80" />
                        ) : isSession ? (
                          <Video className="w-5 h-5 text-saffron/80" />
                        ) : (
                          <span className="font-deva text-lg font-bold bg-gradient-to-br from-saffron to-gold bg-clip-text text-transparent select-none">
                            {c.deva ? c.deva.charAt(0) : "ॐ"}
                          </span>
                        )}
                      </div>

                      {/* Center: Details */}
                      <div className="flex-1 min-w-0">
                        <p className="eyebrow text-[8px] text-ink-faint tracking-widest uppercase truncate">
                          {c.tradition}
                        </p>
                        <h3 className="display text-base font-bold text-ink mt-0.5 truncate">
                          {c.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-ink-soft font-medium">
                          <span>Qty: {quantity}</span>
                          <span className="text-ink-faint">·</span>
                          <span>{isBook ? "Shipped" : isSession ? "Zoom Live" : "Self-paced"}</span>
                        </div>
                      </div>

                      {/* Right: Pricing */}
                      <div className="text-right shrink-0">
                        <p className="display text-base font-bold text-ink whitespace-nowrap">
                          {formatINR(itemTotal)}
                        </p>
                        {quantity > 1 && (
                          <p className="text-[10px] text-ink-faint">
                            {formatINR(unitPrice)} each
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {!signedIn && (
                <div className="mt-4 rounded-xl border border-saffron/30 bg-saffron/5 px-4 py-3 text-center">
                  <p className="text-sm text-ink">
                    Sign in to complete your enrolment — your basket is saved.
                  </p>
                  <Link
                    href="/sign-in?redirect_url=%2Fcheckout"
                    className="mt-2 inline-flex rounded-lg bg-saffron px-6 py-2 text-sm text-paper transition-transform hover:scale-[1.03]"
                  >
                    Sign in to continue
                  </Link>
                </div>
              )}

              {/* Who is this for */}
              {signedIn && (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  <p className="text-sm font-semibold text-ink">Who is this for?</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForSelf(true)}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                        forSelf
                          ? "border-saffron bg-saffron/10 text-saffron"
                          : "border-ink/15 text-ink-soft hover:border-ink/30"
                      }`}
                    >
                      Myself
                    </button>
                    <button
                      type="button"
                      onClick={() => setForSelf(false)}
                      className={`flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                        !forSelf
                          ? "border-saffron bg-saffron/10 text-saffron"
                          : "border-ink/15 text-ink-soft hover:border-ink/30"
                      }`}
                    >
                      Someone else
                    </button>
                  </div>
                  {!forSelf && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <input
                        value={forName}
                        onChange={(e) => setForName(e.target.value)}
                        placeholder="Their full name"
                        className="min-w-0 rounded-lg border border-ink/15 bg-transparent px-3 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
                      />
                      <input
                        value={forEmail}
                        onChange={(e) => setForEmail(e.target.value)}
                        type="email"
                        placeholder="Their email"
                        className="min-w-0 rounded-lg border border-ink/15 bg-transparent px-3 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
                      />
                      <p className="text-xs text-ink-faint sm:col-span-2">
                        If they already have an account with this email, they&apos;re enrolled
                        instantly. If not, they get access the moment they sign up with it.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Coupon */}
              <div className="mt-4 border-t border-ink/10 pt-4">
                {coupon && discount ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">
                      Coupon <strong>{coupon}</strong> — {discount.percent}% off
                      <button
                        type="button"
                        onClick={() => { setCoupon(null); setCouponPercent(null); }}
                        className="ml-3 text-xs text-ink-faint underline underline-offset-2 hover:text-ink"
                      >
                        remove
                      </button>
                    </span>
                    <span className="font-semibold text-green-700">
                      −{formatINR(discount.discountINR)}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Coupon code"
                      className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-transparent px-3 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="rounded-lg border border-ink/15 px-5 py-2.5 text-sm text-ink transition-colors hover:border-ink"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-2 text-xs text-saffron">{couponError}</p>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-ink/15 pt-5">
                <span className="text-sm text-ink-soft">
                  Total · payable now
                </span>
                <span className="display text-3xl text-ink">
                  {formatINR(payable)}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePay}
                disabled={busy || !scriptReady || !signedIn}
                className="mt-4 block w-full rounded-lg bg-saffron px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.01] hover:bg-clay disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === "creating" && "Preparing your order…"}
                {status === "opening" && "Opening Razorpay…"}
                {status === "verifying" && "Verifying payment…"}
                {status === "idle" && `Pay ${formatINR(payable)} securely`}
                {status === "error" && `Try again — pay ${formatINR(payable)}`}
              </button>

              {errorMessage && (
                <p className="mt-4 border border-saffron/40 bg-saffron/5 px-4 py-3 text-center text-sm text-ink">
                  {errorMessage}
                </p>
              )}

              <p className="mt-4 text-center text-xs text-ink-faint">
                UPI · cards · net banking · wallets — Razorpay encrypts every
                transaction.
              </p>

              <IndianAbroadNote />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
