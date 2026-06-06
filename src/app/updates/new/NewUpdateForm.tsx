"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { POST_CATEGORIES } from "@/lib/journal";

export default function NewUpdateForm() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    "w-full rounded-lg border border-ink/15 bg-transparent px-3 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(fd.get("title") ?? ""),
          category: String(fd.get("category") ?? "announcement"),
          body: String(fd.get("body") ?? ""),
          link: String(fd.get("link") ?? ""),
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(
          data.error === "invalid_body"
            ? "Check the fields — title needs 5+ characters; link must be a full URL."
            : "Could not post. Please try again.",
        );
      }
      router.push("/updates");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post.");
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="eyebrow block">Category</label>
        <select name="category" className={`${inputCls} mt-2`} defaultValue="announcement">
          {POST_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="eyebrow block">Title</label>
        <input
          name="title"
          required
          minLength={5}
          maxLength={200}
          placeholder="One clear line"
          className={`${inputCls} mt-2`}
        />
      </div>
      <div>
        <label className="eyebrow block">Details (optional)</label>
        <textarea
          name="body"
          rows={6}
          maxLength={8000}
          placeholder="Dates, venues, who it is for, how to join…"
          className={`${inputCls} mt-2 resize-none`}
        />
      </div>
      <div>
        <label className="eyebrow block">Link (optional)</label>
        <input
          name="link"
          type="url"
          placeholder="https://…"
          className={`${inputCls} mt-2`}
        />
      </div>
      {error && <p className="text-xs text-saffron">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-fit rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03] disabled:opacity-60"
      >
        {sending ? "Posting…" : "Post update"}
      </button>
    </form>
  );
}
