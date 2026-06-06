"use client";

import { useState } from "react";
import { GUIDANCE_SUBJECTS, SLOTS } from "@/lib/constants";
import { Field, Select, SubmitButton, TextArea, type SubmitState } from "./FormField";

export default function BookingForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const dates = SLOTS.flatMap((s) => [s.id]); // unused, just to satisfy TS
    void dates;
    const data: Record<string, unknown> = {
      ...Object.fromEntries(fd.entries()),
      preferredDates: [
        fd.get("date1"),
        fd.get("date2"),
        fd.get("date3"),
        fd.get("date4"),
        fd.get("date5"),
      ].filter(Boolean),
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
      <div className="border border-gold/30 bg-paper-warm px-8 py-8 text-center">
        <p className="display text-3xl text-ink">नमस्ते</p>
        <p className="mt-3 text-base text-ink-soft">
          Acharya Ji will confirm your dates within 24 hours and share Zoom links for
          each class.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label="Full name" required autoComplete="name" />
      <Field name="email" type="email" label="Email" required autoComplete="email" />
      <Field name="whatsapp" label="WhatsApp number" required placeholder="+91 …" />
      <Field name="timezone" label="Timezone" required placeholder="e.g. IST, GMT, ET" />
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
        label="Time slot"
        required
        options={SLOTS.map((s) => ({
          value: s.id,
          label: `${s.label} · ${s.ist} IST`,
        }))}
      />
      <div className="sm:col-span-2">
        <p className="eyebrow mb-3">Preferred dates for your first classes · Acharya Ji confirms or proposes alternatives</p>
        <div className="grid gap-3 sm:grid-cols-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <input
              key={n}
              name={`date${n}`}
              type="date"
              required={n <= 3}
              className="rounded-lg border border-ink/15 bg-paper px-3 py-3 text-sm text-ink focus:border-ink focus:outline-none"
            />
          ))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <TextArea
          name="message"
          label="Anything Acharya Ji should know in advance? (optional)"
          rows={4}
        />
      </div>
      {error && <p className="sm:col-span-2 text-xs text-saffron">{error}</p>}
      <div className="sm:col-span-2 flex justify-center">
        <SubmitButton state={state}>Request class</SubmitButton>
      </div>
    </form>
  );
}
