"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatINR, type Course, MONTHLY_LIVE } from "@/lib/constants";
import { CheckIcon } from "./Icon";

export default function CourseCta({ course }: { course: Course }) {
  const router = useRouter();
  const { has, add } = useCart();

  const liveVariant = MONTHLY_LIVE.find((l) => l.parentSlug === course.slug);

  const handleAdd = (slug: string) => {
    if (!has(slug)) add(slug);
    router.push("/checkout");
  };

  if (liveVariant) {
    const recordedInCart = has(course.slug);
    const liveInCart = has(liveVariant.slug);

    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Recorded option */}
          <div className="rounded-xl border border-saffron/20 bg-paper p-5">
            <p className="eyebrow text-saffron">Full Recorded Access</p>
            <p className="display mt-2 text-3xl text-ink sm:text-4xl">
              {formatINR(course.priceINR)}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              One-time · {course.recordedAccess ?? "lifetime"} access with Zoom storage
            </p>
            <ul className="mt-4 space-y-2 text-xs text-ink-soft">
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>All recordings, your pace</span>
              </li>
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>Handwritten assignments with personal replies</span>
              </li>
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>No recurring fees</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => handleAdd(course.slug)}
              className="mt-5 w-full rounded-lg bg-saffron px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-clay"
            >
              {recordedInCart ? "In basket — go to checkout" : "Buy recorded access"}
            </button>
          </div>

          {/* Live monthly option */}
          <div className="rounded-xl border border-ink/10 bg-paper p-5">
            <p className="eyebrow">Monthly Live Classes</p>
            <p className="display mt-2 text-3xl text-ink sm:text-4xl">
              {formatINR(liveVariant.priceINR)}
              <span className="text-base text-ink-soft">/month</span>
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              No long-term commitment
            </p>
            <ul className="mt-4 space-y-2 text-xs text-ink-soft">
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>Live on Zoom with the teacher</span>
              </li>
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>Study alongside fellow sādhaks</span>
              </li>
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>Cancel anytime</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => handleAdd(liveVariant.slug)}
              className="mt-5 w-full rounded-lg border border-saffron bg-saffron/5 px-4 py-3 text-sm font-semibold text-saffron shadow-sm transition-all hover:scale-[1.02] hover:bg-saffron/10"
            >
              {liveInCart ? "In basket — go to checkout" : "Join live · ₹800/month"}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Every enrolment is confirmed by email — the team handles the rest.
        </p>
      </div>
    );
  }

  const inCart = has(course.slug);

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="eyebrow">One-time enrolment</p>
          <p className="display mt-2 text-4xl text-ink sm:text-5xl">
            {formatINR(course.priceINR)}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            One-time enrolment · no recurring fees
          </p>
        </div>
      </div>

      <ul className="mt-7 space-y-2.5 text-sm text-ink-soft">
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>Confirmation email after enrolment</span>
        </li>
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>The team handles everything from there</span>
        </li>
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>Live-class joining link or first lesson by email</span>
        </li>
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>UPI · cards · net banking — secured by Razorpay</span>
        </li>
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => handleAdd(course.slug)}
          className="flex-1 rounded-lg bg-saffron px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-clay"
        >
          Buy now
        </button>
        {inCart ? (
          <Link
            href="/cart"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-saffron bg-saffron/5 px-6 py-3.5 text-sm font-semibold text-saffron transition-transform hover:scale-[1.02]"
          >
            <CheckIcon width={16} height={16} />
            In basket — view
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => handleAdd(course.slug)}
            className="flex-1 rounded-lg border border-ink/15 bg-transparent px-6 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:scale-[1.02] hover:bg-paper-warm"
          >
            Add to basket
          </button>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-ink-faint">
        Every enrolment is confirmed by email — the team handles the rest.
      </p>
    </div>
  );
}
