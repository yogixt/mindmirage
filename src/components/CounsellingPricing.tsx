"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { CONSULTATION_SINGLE, CONSULTATION_6_PACK } from "@/lib/constants";

export default function CounsellingPricing() {
  const router = useRouter();
  const { has, add } = useCart();

  const handleBuy = (slug: string) => {
    if (!has(slug)) add(slug);
    router.push("/checkout");
  };

  return (
    <section className="bg-paper px-6 pb-6 pt-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Pricing</p>
        <h2 className="display mt-4 text-3xl text-ink sm:text-5xl" style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}>
          One-to-one with <span className="italic text-ink-soft">Guruji.</span>
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Single Session */}
          <div className="rounded-2xl border border-ink/10 bg-paper-warm px-6 py-8 text-left">
            <p className="text-sm font-semibold text-ink">Single Session</p>
            <p className="mt-2 text-4xl font-bold text-ink">
              ₹{CONSULTATION_SINGLE.priceINR.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-ink-soft">{CONSULTATION_SINGLE.duration}</p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleBuy("consultation-single")}
                className="w-full rounded-lg bg-saffron px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-clay"
              >
                Buy now
              </button>
              <button
                type="button"
                onClick={() => add("consultation-single")}
                className="w-full rounded-lg border border-ink/15 bg-transparent px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                {has("consultation-single") ? "In basket" : "Add to basket"}
              </button>
            </div>
          </div>

          {/* 6-Session Pack */}
          <div className="rounded-2xl border border-saffron/30 bg-saffron-soft/10 px-6 py-8 text-left ring-1 ring-saffron/20">
            <p className="text-sm font-semibold text-ink">6-Session Pack</p>
            <p className="mt-2 text-4xl font-bold text-ink">
              ₹{CONSULTATION_6_PACK.priceINR.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Save ₹{(CONSULTATION_SINGLE.priceINR * CONSULTATION_6_PACK.sessions - CONSULTATION_6_PACK.priceINR).toLocaleString("en-IN")}{" "}
              — ₹{(CONSULTATION_6_PACK.priceINR / CONSULTATION_6_PACK.sessions).toLocaleString("en-IN")}/session
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleBuy("consultation-6")}
                className="w-full rounded-lg bg-saffron px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-clay"
              >
                Buy pack
              </button>
              <button
                type="button"
                onClick={() => add("consultation-6")}
                className="w-full rounded-lg border border-ink/15 bg-transparent px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                {has("consultation-6") ? "In basket" : "Add to basket"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
