"use client";

import { useMemo, useState } from "react";
import Script from "next/script";
import { type Course, GUIDANCE_SUBJECTS, scheduleForSubject } from "@/lib/constants";
import { priceFor } from "@/lib/region";
import { useRegion } from "@/lib/useRegion";
import { Field, PHONE_PATTERN, TextArea, type SubmitState } from "./FormField";
import SlotCalendar from "./SlotCalendar";
import IndianAbroadNote from "./IndianAbroadNote";

/* Slot-first checkout wizard for a single catalog item.
   1. Choose dates (and optional preferred time).
   2. Fill contact details.
   3. Pay via Razorpay.
   4. Booking lands in admin as paid + new. */

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
};

type RazorpayConstructor = new (options: RazorpayOptions) => { open: () => void };

type User = {
  name: string;
  email: string;
  phone: string;
};

function niceDay(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function subjectSlugFor(item: Course): string {
  if (item.slug.startsWith("1on1-")) return item.slug.replace("1on1-", "");
  if (item.slug === "consultation-single" || item.slug === "consultation-6") return "consultation";
  return item.slug;
}

export default function BookWizard({
  item,
  user,
  signedIn,
}: {
  item: Course;
  user: User | null;
  signedIn: boolean;
}) {
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const subjectSlug = useMemo(() => subjectSlugFor(item), [item]);
  const schedule = useMemo(() => scheduleForSubject(subjectSlug), [subjectSlug]);
  const region = useRegion();
  const priceINR = priceFor(item, region);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (dates.length === 0) {
      setError("Please pick at least one date on the calendar.");
      return;
    }
    setState("sending");

    const fd = new FormData(e.currentTarget);
    const payload = {
      itemSlug: item.slug,
      subject: subjectSlug,
      slot: schedule.id,
      preferredDates: dates,
      preferredTime: preferredTime.trim(),
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      whatsapp: String(fd.get("whatsapp") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    try {
      const initRes = await fetch("/api/booking/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const init = await initRes.json();
      if (!initRes.ok || !init.ok) {
        throw new Error(init.error ?? `HTTP ${initRes.status}`);
      }

      const { orderId, amount, currency, keyId, bookingId, title } = init;

      const win = window as typeof window & { Razorpay?: RazorpayConstructor };
      if (!win.Razorpay) {
        throw new Error("Razorpay checkout did not load. Please refresh and try again.");
      }

      const rp = new win.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "Mind Mirage",
        description: title,
        order_id: orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setState("sending");
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                slugs: [item.slug],
                bookingId,
              }),
            });
            const verify = await verifyRes.json();
            if (!verifyRes.ok || !verify.ok) {
              throw new Error(verify.error ?? "Payment verification failed");
            }
            setState("ok");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Verification failed. Our team will reach out.");
            setState("error");
          }
        },
        prefill: {
          name: payload.name,
          email: payload.email,
          contact: payload.whatsapp,
        },
        theme: { color: "#9c4b21" },
        modal: {
          ondismiss: () => {
            if (state === "sending") setState("idle");
          },
        },
      });
      rp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  };

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-warm px-8 py-10 text-center">
        <p className="display text-2xl text-ink">Sign in to book</p>
        <p className="mt-2 text-sm text-ink-soft">
          Choose your slot and complete payment securely once you&apos;re signed in.
        </p>
        <a
          href={`/sign-in?redirect_url=${encodeURIComponent(`/book/${item.slug}`)}`}
          className="mt-5 inline-flex rounded-full bg-saffron px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-clay"
        >
          Sign in
        </a>
      </div>
    );
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-paper-warm px-8 py-10 text-center">
        <p className="display text-3xl text-ink">नमस्ते</p>
        <p className="mt-3 text-base text-ink-soft">
          Your payment is received and your preferred dates are with the team.
          Confirmation and Zoom links follow by email within 24 hours.
        </p>
        <a
          href="/programs"
          className="mt-6 inline-flex rounded-full bg-saffron px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-clay"
        >
          Explore more offerings
        </a>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setRazorpayReady(true)}
        onError={() => setRazorpayReady(false)}
      />
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* Item summary */}
        <div className="rounded-2xl border border-ink/8 bg-paper-cream p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            You&apos;re booking
          </p>
          <h1 className="mt-1 display text-2xl text-ink">{item.title}</h1>
          {item.deva && <p className="text-sm text-ink-soft">{item.deva}</p>}
          <p className="mt-3 text-lg font-medium text-saffron">
            ₹{priceINR.toLocaleString("en-IN")}
            <span className="ml-2 text-sm font-normal text-ink-soft">{item.duration}</span>
          </p>
        </div>

        {/* Time slot */}
        <div>
          <p className="flex items-center gap-2.5 text-sm font-semibold text-ink">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-saffron text-xs font-bold text-white">1</span>
            Your time slot
          </p>
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
              </>
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
          </div>
        </div>

        {/* Dates */}
        <div>
          <p className="flex items-center gap-2.5 text-sm font-semibold text-ink">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-saffron text-xs font-bold text-white">2</span>
            Pick your preferred dates
          </p>
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

        {/* Details */}
        <div>
          <p className="flex items-center gap-2.5 text-sm font-semibold text-ink">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-saffron text-xs font-bold text-white">3</span>
            Your details
          </p>
          <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
            <Field id="book-name" name="name" label="Full name" required autoComplete="name" defaultValue={user?.name ?? ""} />
            <Field id="book-email" name="email" type="email" label="Email" required autoComplete="email" defaultValue={user?.email ?? ""} />
            <Field id="book-whatsapp" name="whatsapp" type="tel" label="WhatsApp number" required pattern={PHONE_PATTERN} placeholder="+91 …" defaultValue={user?.phone ?? ""} />
            <div className="sm:col-span-2">
              <TextArea name="message" label="Anything for the team? (optional)" rows={2} />
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
          disabled={state === "sending" || !razorpayReady}
          className="w-full rounded-2xl bg-saffron py-3.5 text-sm font-semibold text-white transition-colors hover:bg-clay disabled:opacity-60"
        >
          {state === "sending" ? "Please wait…" : `Pay ₹${priceINR.toLocaleString("en-IN")} & request booking`}
        </button>
        {!razorpayReady && state !== "sending" && (
          <p className="text-center text-xs text-ink-soft">Loading secure checkout…</p>
        )}
        <IndianAbroadNote context={item.title} />
      </form>
    </>
  );
}
