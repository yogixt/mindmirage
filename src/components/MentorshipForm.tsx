"use client";

import { useState } from "react";
import { Field, SubmitButton, TextArea, type SubmitState } from "./FormField";

export default function MentorshipForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    const data = {
      ...Object.fromEntries(new FormData(e.currentTarget).entries()),
      subject: "Mentorship",
    };
    try {
      const res = await fetch("/api/inquiry", {
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
          Acharya Ji reads every mentorship application personally. You will hear back.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label="Full name" required autoComplete="name" />
      <Field name="email" type="email" label="Email" required autoComplete="email" />
      <Field name="whatsapp" label="WhatsApp number" required />
      <Field name="country" label="Country" required />
      <div className="sm:col-span-2">
        <TextArea
          name="message"
          label="Tell Acharya Ji about your sādhanā so far and what you seek"
          required
          rows={6}
          placeholder="What you have studied, what stirs you, what is unanswered."
        />
      </div>
      {error && <p className="sm:col-span-2 text-xs text-saffron">{error}</p>}
      <div className="sm:col-span-2 flex justify-center">
        <SubmitButton state={state}>Apply for mentorship</SubmitButton>
      </div>
    </form>
  );
}
