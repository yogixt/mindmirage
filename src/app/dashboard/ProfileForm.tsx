"use client";

import { useActionState, useEffect, useState } from "react";
import { Field, Select, TextArea } from "@/components/FormField";
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
  const hasDetails = !!(metadata.city || metadata.preferredPath || metadata.whyISeek);
  const [mode, setMode] = useState<"view" | "edit">(hasDetails ? "view" : "edit");

  // After a successful save, settle into the display view.
  useEffect(() => {
    if (state.status === "ok") setMode("view");
  }, [state.status]);

  if (mode === "view") {
    return (
      <div>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="eyebrow text-ink-faint">City</dt>
            <dd className="mt-1 text-sm text-ink">{metadata.city || "—"}</dd>
          </div>
          <div>
            <dt className="eyebrow text-ink-faint">Preferred path</dt>
            <dd className="mt-1 text-sm text-ink">
              {PATH_LABEL[metadata.preferredPath ?? ""] || "—"}
            </dd>
          </div>
          {metadata.whyISeek && (
            <div className="sm:col-span-2">
              <dt className="eyebrow text-ink-faint">Why I seek</dt>
              <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                {metadata.whyISeek}
              </dd>
            </div>
          )}
        </dl>
        <button
          type="button"
          onClick={() => setMode("edit")}
          className="mt-4 rounded-full border border-ink/15 px-5 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink"
        >
          Edit details
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
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
          placeholder="A line or two for Acharya Ji."
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
          className="rounded-2xl bg-saffron px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-clay disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
