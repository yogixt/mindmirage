"use client";

import { useState } from "react";
import { Field, PHONE_PATTERN, Select, SubmitButton, TextArea, type SubmitState } from "./FormField";

const ROLES = [
  "Content research",
  "Sanskrit support",
  "Course material design",
  "Community moderation",
  "Technical support",
];

export default function InternshipForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/internship", {
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
          Your application has reached us. We will write back within a few days
          with the next step.
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
      <Field name="age" type="number" label="Age" required min={16} max={99} />
      <Select
        name="role"
        label="Preferred role"
        required
        options={[
          ...ROLES.map((r) => ({ value: r, label: r })),
        ]}
      />
      <div className="sm:col-span-2">
        <TextArea
          name="background"
          label="Brief background — studies, work, contemplative practice"
          required
          rows={4}
        />
      </div>
      <div className="sm:col-span-2">
        <TextArea
          name="motivation"
          label="Why do you wish to intern at Mind Mirage?"
          required
          rows={4}
        />
      </div>
      <Field name="hours" label="Hours per week you can offer" required placeholder="e.g. 12" />
      <Field name="start" type="date" label="Earliest start date" />
      {error && <p className="sm:col-span-2 text-xs text-saffron">{error}</p>}
      <div className="sm:col-span-2 flex justify-center">
        <SubmitButton state={state}>Submit application</SubmitButton>
      </div>
    </form>
  );
}
