"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { type Course, MONTHLY_LIVE, ANNUAL_MEMBERSHIP } from "@/lib/constants";
import { CheckIcon } from "./Icon";
import RegionPrice from "./RegionPrice";

export default function CourseCta({
  course,
  initialLevel,
}: {
  course: Course;
  initialLevel?: string;
}) {
  const router = useRouter();
  const { has, add } = useCart();

  const liveVariant = MONTHLY_LIVE.find((l) => l.parentSlug === course.slug);
  const membershipVariant = ANNUAL_MEMBERSHIP.find((m) => m.parentSlug === course.slug);

  const handleAdd = (slug: string) => {
    if (!has(slug)) add(slug);
    router.push("/checkout");
  };

  const useBookingFlow =
    course.slug.startsWith("1on1-") ||
    course.slug.startsWith("consultation-") ||
    course.slug.startsWith("counselling-") ||
    course.slug === "bhagavad-gita-live" ||
    course.slug === "lalita-for-women";

  if (course.levels && course.levels.length > 0) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-5">
        <p className="eyebrow">Enrol level by level</p>
        <p className="mt-1 text-sm text-ink-soft">
          Each level is taken and paid for on its own. Begin at Level 1 and
          progress at your own pace.
        </p>
        <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
          {course.levels.map((lv, i) => {
            const levelInCart = has(lv.slug);
            const isSelected = lv.slug === initialLevel;
            return (
              <div
                key={lv.slug}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-paper p-4 shadow-[0_4px_16px_-8px_rgba(70,45,20,0.2)] transition-all duration-300 ${
                  isSelected
                    ? "border-saffron shadow-[0_16px_36px_-16px_rgba(192,83,31,0.5)]"
                    : "border-ink/[0.07] hover:border-saffron/30 hover:shadow-[0_16px_32px_-16px_rgba(192,83,31,0.35)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-gold text-[13px] font-bold text-white shadow-[0_4px_12px_-3px_rgba(192,83,31,0.65)]">
                    {i + 1}
                  </span>
                  {isSelected && (
                    <span className="rounded-full bg-saffron px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Selected
                    </span>
                  )}
                </div>
                <p className="eyebrow mt-3 text-saffron">{lv.label}</p>
                {lv.note && (
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-ink-soft">{lv.note}</p>
                )}
                <button
                  type="button"
                  onClick={() => handleAdd(lv.slug)}
                  className="mt-3 w-full rounded-lg bg-gradient-to-br from-saffron to-clay px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_16px_-6px_rgba(192,83,31,0.6)] transition-all hover:scale-[1.02] hover:shadow-[0_10px_22px_-8px_rgba(192,83,31,0.7)]"
                >
                  {levelInCart ? "In basket, checkout" : "Enrol"}
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-ink-faint">
          Every enrolment is confirmed by email. The team handles the rest.
        </p>
      </div>
    );
  }

  if (liveVariant) {
    const recordedInCart = has(course.slug);

    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Recorded option */}
          <div className="rounded-xl border border-saffron/20 bg-paper p-5">
            <p className="eyebrow text-saffron">Full Recorded Access</p>
            <p className="mt-2 text-xs text-ink-soft">
              One time payment · {course.recordedAccess ?? "lifetime"} access with Zoom storage
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
              {recordedInCart ? "In basket, go to checkout" : "Enrol · recorded"}
            </button>
          </div>

          {/* Live monthly option */}
          <div className="rounded-xl border border-ink/10 bg-paper p-5">
            <p className="eyebrow">Monthly Live Classes</p>
            <p className="mt-2 text-xs text-ink-soft">
              No long term commitment
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
            <Link
              href={`/book/${liveVariant.slug}`}
              className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-saffron bg-saffron/5 px-4 py-3 text-sm font-semibold text-saffron shadow-sm transition-all hover:scale-[1.02] hover:bg-saffron/10"
            >
              Join live monthly classes
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Every enrolment is confirmed by email. The team handles the rest.
        </p>
      </div>
    );
  }

  if (membershipVariant) {
    const membershipInCart = has(membershipVariant.slug);

    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-5">
        <div className="mx-auto max-w-sm">
          <div className="rounded-xl border border-saffron/20 bg-paper p-5">
            <p className="eyebrow text-saffron">The Year Long Sādhanā</p>
            <p className="mt-2 text-xs text-ink-soft">
              A full year in the company of Acharya Ji, live
            </p>
            <ul className="mt-4 space-y-2 text-xs text-ink-soft">
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>Live satsang with Acharya Ji through the year</span>
              </li>
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>Every recording kept for you, to revisit as the inquiry deepens</span>
              </li>
              <li className="flex gap-2">
                <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
                <span>One offering for the whole year, nothing further to arrange</span>
              </li>
            </ul>
            <p className="mt-4 text-lg font-semibold text-ink">
              <RegionPrice inr={membershipVariant.priceINR} foreignInr={membershipVariant.priceForeignINR} />
            </p>
            <button
              type="button"
              onClick={() => handleAdd(membershipVariant.slug)}
              className="mt-3 w-full rounded-lg bg-saffron px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-clay"
            >
              {membershipInCart ? "Continue to enrolment" : "Begin the year long sādhanā"}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-faint">
          Every enrolment is confirmed by email, and the team carries the rest with care.
        </p>
      </div>
    );
  }

  const inCart = has(course.slug);

  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-5">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="eyebrow">One time enrolment</p>
          <p className="mt-2 text-sm text-ink-soft">
            One time enrolment · no recurring fees
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
          <span>Live class joining link or first lesson by email</span>
        </li>
        <li className="flex gap-3">
          <CheckIcon width={18} height={18} className="text-gold mt-0.5 shrink-0" />
          <span>UPI · cards · net banking, secured by Razorpay</span>
        </li>
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {useBookingFlow ? (
          <Link
            href={`/book/${course.slug}`}
            className="flex-1 rounded-lg bg-saffron px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-clay"
          >
            Enrol now
          </Link>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleAdd(course.slug)}
              className="flex-1 rounded-lg bg-saffron px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] hover:bg-clay"
            >
              Enrol now
            </button>
            {inCart ? (
              <Link
                href="/cart"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-saffron bg-saffron/5 px-6 py-3.5 text-sm font-semibold text-saffron transition-transform hover:scale-[1.02]"
              >
                <CheckIcon width={16} height={16} />
                In basket, view
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
          </>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-ink-faint">
        Every enrolment is confirmed by email. The team handles the rest.
      </p>
    </div>
  );
}
