"use client";

import { useState } from "react";
import { Field, PHONE_PATTERN, Select, SubmitButton, TextArea, type SubmitState } from "./FormField";

const COLLAB_TYPES = ["Co-author", "Article", "Research paper"];

export default function CollaborationForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setState("sending");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      country: String(fd.get("country") ?? ""),
      subject: `Collaboration, ${String(fd.get("type") ?? "")}`,
      message: String(fd.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setState("ok");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
      setState("error");
    }
  };

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-paper-warm px-6 py-4 text-center">
        <p className="display text-2xl text-ink">नमस्ते</p>
        <p className="mt-2 text-sm text-ink-soft">
          Your proposal has reached us, the team will write back soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field name="name" label="Full name" required minLength={2} autoComplete="name" />
      <Field name="email" type="email" label="Email" required autoComplete="email" />
      <Field name="whatsapp" type="tel" label="WhatsApp number" required pattern={PHONE_PATTERN} placeholder="+91 …" />
      <Field name="country" label="Country" required minLength={2} autoComplete="country-name" />
      <div className="sm:col-span-2">
        <Select
          name="type"
          label="Collaboration type"
          required
          options={COLLAB_TYPES.map((t) => ({ value: t, label: t }))}
        />
      </div>
      <div className="sm:col-span-2">
        <TextArea
          name="message"
          label="Your proposal"
          required
          minLength={2}
          rows={4}
          placeholder="The idea, the field of study, and where you see us together in it."
        />
      </div>
      {error && <p className="sm:col-span-2 text-xs text-saffron">{error}</p>}
      <div className="sm:col-span-2">
        <SubmitButton state={state}>Send proposal</SubmitButton>
      </div>
    </form>
  );
}
