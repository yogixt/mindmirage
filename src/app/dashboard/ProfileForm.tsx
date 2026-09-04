"use client";

import { useActionState, useEffect, useState } from "react";
import { Field, PHONE_PATTERN, Select, TextArea } from "@/components/FormField";
import { saveProfileAction, type ProfileFormState } from "./actions";
import type { SeekerMetadata } from "@/lib/auth";

const PATHS = [
  { value: "ashtanga-yoga", label: "Patañjali's Ashtanga Yoga" },
  { value: "bhakti-yoga", label: "Bhakti Yoga" },
  { value: "jnana-yoga", label: "Jnana Yoga" },
  { value: "advaita-vedanta", label: "Advaita Vedanta" },
  { value: "all", label: "All of the above" },
];

const PATH_LABEL: Record<string, string> = Object.fromEntries(
  PATHS.map((p) => [p.value, p.label]),
);

export default function ProfileForm({ metadata }: { metadata: SeekerMetadata }) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    saveProfileAction,
    { status: "idle" },
  );
  const hasDetails = !!(metadata.city || metadata.preferredPath || metadata.whyISeek || metadata.phone);
  const [mode, setMode] = useState<"view" | "edit">(hasDetails ? "view" : "edit");

  useEffect(() => {
    if (state.status === "ok") setMode("view");
  }, [state.status]);

  if (mode === "view") {
    return (
      <div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="eyebrow text-ink-faint">Phone</dt>
            <dd className="mt-1.5 text-sm text-ink">{metadata.phone || "Not set"}</dd>
          </div>
          <div>
            <dt className="eyebrow text-ink-faint">City</dt>
            <dd className="mt-1.5 text-sm text-ink">{metadata.city || "Not set"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="eyebrow text-ink-faint">Preferred path</dt>
            <dd className="mt-1.5 text-sm text-ink">
              {PATH_LABEL[metadata.preferredPath ?? ""] || "Not set"}
            </dd>
          </div>
          {metadata.whyISeek && (
            <div className="sm:col-span-2">
              <dt className="eyebrow text-ink-faint">Why I seek</dt>
              <dd className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {metadata.whyISeek}
              </dd>
            </div>
          )}
        </dl>
        <button
          type="button"
          onClick={() => setMode("edit")}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-ink/[0.1] px-5 py-2 text-xs font-medium text-ink transition-all hover:border-ink/30 hover:bg-paper"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit details
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <Field
        name="phone"
        type="tel"
        label="WhatsApp number"
        pattern={PHONE_PATTERN}
        defaultValue={metadata.phone ?? ""}
        placeholder="+91 …"
      />
      <Field
        name="city"
        label="City"
        defaultValue={metadata.city ?? ""}
        placeholder="Where you sit"
        autoComplete="address-level2"
      />
      <Select
        name="preferredPath"
        label="Preferred path"
        defaultValue={metadata.preferredPath ?? ""}
        options={PATHS}
      />
      <div className="sm:col-span-2">
        <TextArea
          name="whyISeek"
          label="Why I seek (optional)"
          defaultValue={metadata.whyISeek ?? ""}
          placeholder="A line or two for Acharya Ji 🙏"
          rows={4}
        />
      </div>
      <div className="sm:col-span-2 flex items-center justify-between">
        <span className="text-xs text-ink-faint">
          {state.status === "ok" && "Saved."}
          {state.status === "error" && (
            <span className="text-saffron">{state.message}</span>
          )}
        </span>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-saffron px-8 py-3 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-saffron/20 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
