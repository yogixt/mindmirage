"use client";

import { useEffect, useState } from "react";
import { GUIDANCE_SUBJECTS } from "@/lib/constants";
import { Field, PHONE_PATTERN, TextArea, type SubmitState } from "./FormField";
import AvailabilityCalendar, { useBlockedDates } from "./AvailabilityCalendar";

/* Booking, step by step — class, time, dates, details. No jargon. */

/* IST slot windows shown in the seeker's own timezone. */
function localWindow(istStartHour: number, istEndHour: number) {
  const fmt = (h: number) => {
    const d = new Date();
    const utc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h - 5, -30);
    return new Date(utc).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };
  return `${fmt(istStartHour)} – ${fmt(istEndHour)}`;
}

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
  const [blocked] = useBlockedDates();
  const [dates, setDates] = useState<string[]>([]);
  const [slot, setSlot] = useState<"morning-ist" | "evening-ist" | "">("");
  const [abroad, setAbroad] = useState(false);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz !== "Asia/Kolkata" && tz !== "Asia/Calcutta") setAbroad(true);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!slot) {
      setError("Please choose Morning or Evening (step 2).");
      return;
    }
    if (dates.length === 0) {
      setError("Please tap at least one date on the calendar (step 3).");
      return;
    }
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      ...Object.fromEntries(fd.entries()),
      slot,
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

  const chosen = GUIDANCE_SUBJECTS.find((s) => s.slug === subjectSlug);
  const isCounsellingSubject = subjectSlug.startsWith("counselling-");
  const hasCounsellingActive =
    enrolled.includes(`1on1-${subjectSlug}`) ||
    enrolled.includes("consultation-single") ||
    enrolled.includes("consultation-6") ||
    enrolled.includes("counselling-all");

  const needsEnrolment = !!(
    chosen &&
    chosen.priceINR > 0 &&
    (isCounsellingSubject
      ? !hasCounsellingActive
      : !enrolled.includes(`1on1-${chosen.slug}`))
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
          onChange={(e) => setSubjectSlug(e.target.value)}
          className="mt-2.5 w-full rounded-xl border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink"
        >
          <option value="" disabled>
            Choose a class…
          </option>
          {GUIDANCE_SUBJECTS.map((s) => {
            const isCounselling = s.slug.startsWith("counselling-");
            const owned = isCounselling
              ? (enrolled.includes(`1on1-${s.slug}`) || enrolled.includes("counselling-all") || enrolled.includes("consultation-single") || enrolled.includes("consultation-6"))
              : (s.priceINR === 0 || enrolled.includes(`1on1-${s.slug}`));
            return (
              <option key={s.slug} value={s.slug}>
                {s.name}
                {owned
                  ? s.priceINR
                    ? " · enrolled"
                    : " · application-based"
                  : isCounselling
                    ? " · buy sessions to book"
                    : ` · ₹${s.priceINR.toLocaleString("en-IN")}/class — enrol first`}
              </option>
            );
          })}
        </select>

        {needsEnrolment && (
          <p className="mt-2 rounded-xl bg-gold-soft/30 px-4 py-2.5 text-xs leading-relaxed text-ink ring-1 ring-gold/30">
            {isCounsellingSubject ? (
              <>
                Please purchase a counselling session first.{" "}
                <a
                  href="/counselling"
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
      <div>
        <StepLabel n={2} text="Morning or evening?" />
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          {(
            [
              { id: "morning-ist", title: "Morning", ist: "7 – 11 am IST", win: [7, 11] },
              { id: "evening-ist", title: "Evening", ist: "5 – 9 pm IST", win: [17, 21] },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSlot(s.id)}
              className={`rounded-2xl border-2 px-4 py-4 text-left transition-all ${
                slot === s.id
                  ? "border-green-600 bg-green-50"
                  : "border-ink/10 bg-paper hover:border-ink/30"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold text-ink">
                {s.id === "morning-ist" ? (
                  <svg viewBox="0 0 24 24" className="size-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="size-4 text-saffron" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                  </svg>
                )}
                {s.title}
                {slot === s.id && (
                  <svg viewBox="0 0 24 24" className="ml-auto size-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="mt-1 block text-xs text-ink-soft">{s.ist}</span>
              {abroad && (
                <span className="mt-0.5 block text-[11px] text-ink-faint">
                  = {localWindow(s.win[0], s.win[1])} your time
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3 · Dates ── */}
      <div>
        <StepLabel n={3} text="Tap the dates that suit you (up to 5)" />
        <div className="mt-2.5 flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-6">
          <AvailabilityCalendar
            mode="select"
            blocked={blocked}
            selected={dates}
            maxSelect={5}
            onSelect={setDates}
          />
          <div className="w-full sm:flex-1">
            {dates.length === 0 ? (
              <p className="text-xs leading-relaxed text-ink-faint">
                Green days are open. Red days are unavailable. Tap a day to
                pick it — tap again to remove.
              </p>
            ) : (
              <>
                <p className="text-xs font-semibold text-ink">
                  Your dates ({dates.length}/5):
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
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
              </>
            )}
          </div>
        </div>
      </div>

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
