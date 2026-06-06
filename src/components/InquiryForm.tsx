"use client";

import { useState } from "react";
import { INQUIRY_SUBJECTS } from "@/lib/constants";
import { Field, Select, SubmitButton, TextArea, type SubmitState } from "./FormField";

export default function InquiryForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
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
          Your message has reached us. Acharya Ji or our team will reply within a day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field name="name" label="Full name" required autoComplete="name" />
      <Field name="email" type="email" label="Email" required autoComplete="email" />
      <Field name="whatsapp" label="WhatsApp number" placeholder="optional" />
      <Field name="country" label="Country" required autoComplete="country-name" />
      <div className="sm:col-span-2">
        <Select
          name="subject"
          label="Subject"
          required
          options={[
            { value: "", label: "Choose a subject…" },
            ...INQUIRY_SUBJECTS.map((s) => ({ value: s, label: s })),
          ]}
        />
      </div>
      <div className="sm:col-span-2">
        <TextArea
          name="message"
          label="Your message"
          required
          rows={6}
          placeholder="Take your time. Speak as you would in a quiet room."
        />
      </div>
      {error && <p className="sm:col-span-2 text-xs text-saffron">{error}</p>}
      <div className="sm:col-span-2 flex justify-center">
        <SubmitButton state={state}>Send inquiry</SubmitButton>
      </div>
    </form>
  );
}
