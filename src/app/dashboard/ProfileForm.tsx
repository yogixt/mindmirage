"use client";

import { useActionState } from "react";
import { Field, Select, TextArea } from "@/components/FormField";
import { saveProfileAction, type ProfileFormState } from "./actions";
import type { SeekerMetadata } from "@/lib/auth";

const PATHS = [
  { value: "", label: "Choose a path…" },
  { value: "yoga", label: "Yoga · Aṣṭāṅga" },
  { value: "vedanta", label: "Vedānta · the non-dual root" },
  { value: "both", label: "Both — let them weave" },
];

export default function ProfileForm({ metadata }: { metadata: SeekerMetadata }) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    saveProfileAction,
    { status: "idle" },
  );

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
          className="rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
