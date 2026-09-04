"use client";

import { useEffect, useMemo, useState } from "react";
import { GUIDANCE_SUBJECTS, scheduleForSubject } from "@/lib/constants";
import { Field, PHONE_PATTERN, TextArea, type SubmitState } from "./FormField";
import SlotCalendar from "./SlotCalendar";

/* Booking, step by step — class, time, dates, details. No jargon. */

function StepLabel({ n, text }: { n: number; text: string }) {
  return (
    <p className="flex items-center gap-2.5 text-sm font-semibold text-ink">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-saffron text-xs font-bold text-white">
        {n}
      </span>
      {text}
    </p>
  );
}

function niceDay(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function BookingForm({
  signedIn = true,
  enrolled = [],
}: {
  signedIn?: boolean;
  enrolled?: string[];
}) {
  const [subjectSlug, setSubjectSlug] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState("");

  const subject = useMemo(
    () => GUIDANCE_SUBJECTS.find((s) => s.slug === subjectSlug),
    [subjectSlug],
  );
  const schedule = useMemo(() => scheduleForSubject(subjectSlug), [subjectSlug]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!subjectSlug) {
      setError("Please choose a class (step 1).");
      return;
    }
    if (dates.length === 0) {
      setError("Please pick at least one date on the calendar (step 2).");
      return;
    }
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const message = String(fd.get("message") ?? "");
    const fullMessage = preferredTime.trim()
      ? message
        ? `${message}\n\nPreferred IST time slot: ${preferredTime.trim()}`
        : `Preferred IST time slot: ${preferredTime.trim()}`
      : message;
    fd.set("message", fullMessage);
    const data: Record<string, unknown> = {
      ...Object.fromEntries(fd.entries()),
      subject: subjectSlug,
      slot: schedule.id,
      preferredDates: dates,
    };
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setState("ok");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went still.");
      setState("error");
    }
  };

  const isCounsellingSubject = subjectSlug.startsWith("counselling-");
  const isMonthlyLive = subjectSlug === "bhagavad-gita-live";

  function isEnrolledFor(slug: string) {
    if (enrolled.includes(slug)) return true;
    if (enrolled.includes(`1on1-${slug}`)) return true;
    return false;
  }

  const hasCounsellingActive =
    isEnrolledFor(subjectSlug) ||
    enrolled.includes("consultation-single") ||
    enrolled.includes("consultation-6") ||
    enrolled.includes("counselling-all");

  const needsEnrolment = !!(
    subject &&
    subject.priceINR > 0 &&
    (isCounsellingSubject
      ? !hasCounsellingActive
      : !isEnrolledFor(subjectSlug))
  );

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-warm px-8 py-6 text-center">
        <p className="display text-2xl text-ink">Sign in to book your classes.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Slots are reserved for enrolled sadhaks — sign in, enrol in a class,
          and your booking opens here.
        </p>
        <a
          href="/sign-in?redirect_url=%2Fconsultation"
          className="mt-4 inline-flex rounded-full bg-saffron px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-clay"
        >
          Sign in
        </a>
      </div>
    );
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-paper-warm px-8 py-6 text-center">
        <p className="display text-3xl text-ink">नमस्ते</p>
        <p className="mt-3 text-base text-ink-soft">
          Your dates are with the team — confirmation and Zoom links follow by
          email within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* ── 1 · Class ── */}
      <div>
        <StepLabel n={1} text="Which class would you like?" />
        <select
          name="subject"
          required
          value={subjectSlug}
          onChange={(e) => {
            setSubjectSlug(e.target.value);
            setDates([]);
          }}
          className="mt-2.5 w-full rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink"
        >
          <option value="" disabled>
            Choose a class…
          </option>
          {GUIDANCE_SUBJECTS.map((s) => {
            const isCounselling = s.slug.startsWith("counselling-");
            const owned = isCounselling
              ? (isEnrolledFor(s.slug) ||
                  enrolled.includes("counselling-all") ||
                  enrolled.includes("consultation-single") ||
                  enrolled.includes("consultation-6"))
              : (s.priceINR === 0 || isEnrolledFor(s.slug));
            return (
              <option key={s.slug} value={s.slug}>
                {s.name}
                {owned
                  ? s.priceINR
                    ? " · enrolled"
                    : " · application based"
                  : isCounselling
                    ? " · buy sessions to book"
                    : s.priceINR
                      ? ` · ₹${s.priceINR.toLocaleString("en-IN")}/class, enrol first`
                      : ", enrol first"}
              </option>
            );
          })},
        </select>

        {needsEnrolment && (
          <p className="mt-2 rounded-xl bg-gold-soft/30 px-4 py-2.5 text-xs leading-relaxed text-ink ring-1 ring-gold/30">
            {isCounsellingSubject ? (
              <>
                Please purchase a session first.{" "}
                <a
                  href="/consultation"
                  className="font-semibold text-saffron underline underline-offset-2"
                >
                  Buy session
                </a>
                {" "}— after payment, your slot booking opens here automatically.
              </>
            ) : (
              <>
                This is a paid course of eight classes. Please{" "}
                <a
                  href={`/programs/1on1-${subjectSlug}`}
                  className="font-semibold text-saffron underline underline-offset-2"
                >
                  enrol first
                </a>
                {" "}— after payment, your slot booking opens here automatically.
              </>
            )}
          </p>
        )}
      </div>

      {/* ── 2 · Time ── */}
      {subjectSlug && (
        <div>
          <StepLabel n={2} text="Your time slot" />
          <div className="mt-2.5 rounded-2xl border border-ink/8 bg-paper-cream p-4">
            {schedule.flexible ? (
              <p className="text-sm text-ink-soft">
                <span className="font-semibold text-ink">{schedule.label}</span>
                {" — "}{schedule.ist}. The team will coordinate the exact time with you after booking.
              </p>
            ) : (
              <>
                <p className="text-sm font-semibold text-ink">{schedule.label}</p>
                <p className="mt-1 text-2xl font-light text-ink">{schedule.ist}</p>
                {schedule.days && (
                  <p className="mt-2 text-xs text-ink-soft">
                    Available on{" "}
                    <span className="font-medium text-ink">
                      {schedule.days.map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ")}
                    </span>
                    {" "}only.
                  </p>
                )}
                {schedule.allowPreference && (
                  <div className="mt-4">
                    <label htmlFor="preferred-time" className="block text-xs font-semibold text-ink-soft">
                      Your preferred IST time slot (optional)
                    </label>
                    <input
                      id="preferred-time"
                      type="text"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      placeholder="e.g. 6:30 – 7:30 PM IST"
                      className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink"
                    />
                    <p className="mt-1 text-[11px] text-ink-faint">
                      Default is {schedule.ist}. Share your preference and the team will try to accommodate.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── 3 · Dates ── */}
      {subjectSlug && (
        <div>
          <StepLabel n={3} text="Pick your preferred dates" />
          <div className="mt-2.5">
            <SlotCalendar
              allowedDaysOfWeek={schedule.days}
              selected={dates}
              maxSelect={5}
              onSelect={setDates}
            />
            {dates.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {dates.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800 ring-1 ring-green-200"
                  >
                    {niceDay(d)}
                    <button
                      type="button"
                      onClick={() => setDates(dates.filter((x) => x !== d))}
                      aria-label={`Remove ${d}`}
                      className="grid size-4 place-items-center rounded-full text-green-700 hover:bg-red-100 hover:text-red-700"
                    >
                      <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 4 · Details ── */}
      <div>
        <StepLabel n={4} text="Your details" />
        <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
          <Field name="name" label="Full name" required autoComplete="name" />
          <Field name="email" type="email" label="Email" required autoComplete="email" />
          <Field name="whatsapp" type="tel" label="WhatsApp number" required pattern={PHONE_PATTERN} placeholder="+91 …" />
          <div className="sm:col-span-1">
            <TextArea
              name="message"
              label="Anything for the team? (optional)"
              rows={1}
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending" || needsEnrolment}
        className="w-full rounded-2xl bg-saffron py-3.5 text-sm font-semibold text-white transition-colors hover:bg-clay disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Request my classes"}
      </button>
    </form>
  );
}
