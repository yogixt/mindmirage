"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";
import { useCart } from "@/lib/cart";
import { applyCoupon, formatINR, SITE } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

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

export default function CheckoutPage() {
  const router = useRouter();
  const { courses, total, count, clear } = useCart();
  const [scriptReady, setScriptReady] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "creating" | "opening" | "verifying" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) setScriptReady(true);
  }, []);

  const discount = coupon ? applyCoupon(total, coupon) : null;
  const payable = discount ? discount.finalINR : total;

  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (!applyCoupon(total, code)) {
      setCouponError("That code is not valid.");
      return;
    }
    setCoupon(code);
    setCouponInput("");
  };

  const handlePay = async () => {
    if (count === 0) return;
    setStatus("creating");
    setErrorMessage(null);

    let order: OrderResponse;
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slugs: courses.map((c) => c.slug),
          coupon: coupon ?? "",
        }),
      });
      order = (await res.json()) as OrderResponse;
      if (!order.ok) {
        setStatus("error");
        setErrorMessage(
          order.message ??
            (order.error === "razorpay_not_configured"
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
        },
      },
    });

    rzp.on("payment.failed", (response) => {
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

        <section className="mx-auto max-w-3xl px-6 pb-8">
          {count === 0 ? (
            <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-8 text-center">
              <p className="display text-2xl text-ink">Your basket is empty.</p>
              <Link
                href="/programs"
                className="mt-6 inline-flex rounded-lg bg-saffron px-7 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
              >
                Browse programs
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-ink/10 bg-paper p-6 sm:p-7">
              <p className="eyebrow">Order summary</p>
              <ul className="mt-5 divide-y divide-ink/10">
                {courses.map((c) => (
                  <li
                    key={c.slug}
                    className="flex items-baseline justify-between gap-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="deva text-sm text-ink-soft">{c.deva}</p>
                      <p className="display text-lg text-ink mt-1">
                        {c.title}
                      </p>
                    </div>
                    <p className="display text-lg text-ink whitespace-nowrap">
                      {formatINR(c.priceINR)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Coupon */}
              <div className="mt-4 border-t border-ink/10 pt-4">
                {coupon && discount ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">
                      Coupon <strong>{coupon}</strong> — {discount.percent}% off
                      <button
                        type="button"
                        onClick={() => setCoupon(null)}
                        className="ml-3 text-xs text-ink-faint underline underline-offset-2 hover:text-ink"
                      >
                        remove
                      </button>
                    </span>
                    <span className="text-ink">
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
                disabled={busy || !scriptReady}
                className="mt-6 block w-full rounded-lg bg-saffron px-6 py-4 text-sm text-paper transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
