"use client";

import { useState } from "react";
import { GUIDANCE_SUBJECTS } from "@/lib/constants";
import { Field, Select, SubmitButton, TextArea, type SubmitState } from "./FormField";
import AvailabilityCalendar, { useBlockedDates } from "./AvailabilityCalendar";

const TIME_SLOTS = [
  { id: "morning-ist", label: "Morning · IST" },
  { id: "evening-ist", label: "Evening · IST" },
];

export default function BookingForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [blocked] = useBlockedDates();
  const [dates, setDates] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (dates.length === 0) {
      setError("Pick at least one available (green) date on the calendar.");
      return;
    }
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      ...Object.fromEntries(fd.entries()),
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

  if (state === "ok") {
    return (
      <div className="border border-gold/30 bg-paper-warm px-8 py-5 text-center">
        <p className="display text-3xl text-ink">नमस्ते</p>
        <p className="mt-3 text-base text-ink-soft">
          Your dates are with the team — confirmation and Zoom links follow by
          email within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label="Full name" required autoComplete="name" />
      <Field name="email" type="email" label="Email" required autoComplete="email" />
      <Field name="whatsapp" label="WhatsApp number" required placeholder="+91 …" />
      <Select
        name="subject"
        label="Subject"
        required
        options={GUIDANCE_SUBJECTS.map((s) => ({
          value: s.slug,
          label: `${s.name}${s.priceINR ? ` · ₹${s.priceINR.toLocaleString("en-IN")}/class` : " · application-based"}`,
        }))}
      />
      <Select
        name="slot"
        label="Time slot (IST)"
        required
        options={TIME_SLOTS.map((s) => ({ value: s.id, label: s.label }))}
      />
      <div className="sm:col-span-2">
        <p className="eyebrow mb-3">
          Pick your dates · green is available, red is blocked
        </p>
        <div className="flex justify-center sm:justify-start">
        <AvailabilityCalendar
          mode="select"
          blocked={blocked}
          selected={dates}
          maxSelect={5}
          onSelect={setDates}
        />
        </div>
        {dates.length > 0 && (
          <p className="mt-2 text-xs text-ink-soft">
            Chosen: {dates.join(" · ")}
          </p>
        )}
      </div>
      <div className="sm:col-span-2">
        <TextArea
          name="message"
          label="Anything the team should know in advance? (optional)"
          rows={3}
        />
      </div>
      {error && <p className="sm:col-span-2 text-xs text-saffron">{error}</p>}
      <div className="sm:col-span-2 flex justify-center">
        <SubmitButton state={state}>Request class</SubmitButton>
      </div>
    </form>
  );
}
