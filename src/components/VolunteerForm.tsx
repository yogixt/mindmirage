"use client";

import { useState } from "react";
import { Field, PHONE_PATTERN, Select, SubmitButton, TextArea, type SubmitState } from "./FormField";

const SEVA_ROLES = [
  "Technical support",
  "Community support",
  "WhatsApp group management",
  "Event coordination",
  "Translation (vernacular outreach)",
  "Social media seva",
  "Content and design",
  "Photography and video",
  "Many more — tell us your skill",
];

export default function VolunteerForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/volunteer", {
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
          Welcome to karma yoga. The team will write to you with the next step.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label="Full name" required autoComplete="name" />
      <Field name="email" type="email" label="Email" required autoComplete="email" />
      <Field name="whatsapp" type="tel" label="WhatsApp number" required pattern={PHONE_PATTERN} placeholder="+91 …" />
      <Field name="country" label="Country" required />
      <Select
        name="role"
        label="Karma yoga you would offer"
        required
        options={[
          ...SEVA_ROLES.map((r) => ({ value: r, label: r })),
        ]}
      />
      <Field
        name="hours"
        label="Hours per week"
        required
        placeholder="e.g. 4–6"
      />
      <div className="sm:col-span-2">
        <TextArea
          name="motivation"
          label="What draws you to karma yoga at Mind Mirage?"
          required
          rows={5}
        />
      </div>
      {error && <p className="sm:col-span-2 text-xs text-saffron">{error}</p>}
      <div className="sm:col-span-2 flex justify-center">
        <SubmitButton state={state}>Offer karma yoga</SubmitButton>
      </div>
    </form>
  );
}
