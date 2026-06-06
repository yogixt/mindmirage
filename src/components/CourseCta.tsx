"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatINR, type Course } from "@/lib/constants";
import { CheckIcon } from "./Icon";

export default function CourseCta({ course }: { course: Course }) {
  const router = useRouter();
  const { has, add } = useCart();
  const inCart = has(course.slug);

  const handleBuyNow = () => {
    if (!inCart) add(course.slug);
    router.push("/checkout");
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="eyebrow">One-time enrolment</p>
          <p className="display mt-2 text-4xl text-ink sm:text-5xl">
            {formatINR(course.priceINR)}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Lifetime access · personal feedback from Acharya Ji
          </p>
        </div>
      </div>

      <ul className="mt-7 space-y-2.5 text-sm text-ink-soft">
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>Lessons delivered at your pace</span>
        </li>
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>Handwritten assignments reviewed personally</span>
        </li>
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>WhatsApp + email access to Acharya Ji</span>
        </li>
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>UPI · cards · net banking — secured by Razorpay</span>
        </li>
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 rounded-lg bg-red-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-red-700"
        >
          Buy now
        </button>
        {inCart ? (
          <Link
            href="/cart"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-green-600 bg-green-50 px-6 py-3.5 text-sm font-medium text-green-700 transition-transform hover:scale-[1.02]"
          >
            <CheckIcon width={16} height={16} />
            In basket — view
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => add(course.slug)}
            className="flex-1 rounded-lg bg-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-green-700"
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
