"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

/* ────────────  Ask a question  ──────────── */

export function AskForm({ signedIn }: { signedIn: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper-warm p-5 text-center">
        <p className="text-sm text-ink-soft">
          Sign in to ask the satsang a question.
        </p>
        <Link
          href="/sign-in"
          className="mt-3 inline-flex rounded-lg bg-saffron px-6 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03]"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!data.ok) {
        throw new Error(
          data.error === "invalid_body"
            ? "The question needs at least 5 characters."
            : "Could not post. Please try again.",
        );
      }
      setTitle("");
      setBody("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-ink/15 bg-paper px-5 py-4 text-left text-sm text-ink-faint transition-colors hover:border-ink/40"
      >
        What is your question, seeker?
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 rounded-2xl border border-ink/15 bg-paper p-5"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        minLength={5}
        maxLength={200}
        placeholder="Your question — one clear line"
        className="rounded-lg border border-ink/15 bg-transparent px-3 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        maxLength={4000}
        placeholder="Add context if it helps (optional)"
        className="resize-none rounded-lg border border-ink/15 bg-transparent px-3 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
      />
      {error && <p className="text-xs text-saffron">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-saffron px-6 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03] disabled:opacity-60"
        >
          {sending ? "Posting…" : "Post question"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-ink/15 px-6 py-2.5 text-sm text-ink transition-colors hover:border-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ────────────  Like button  ──────────── */

export function LikeButton({
  questionId,
  likes,
  liked,
  signedIn,
}: {
  questionId: number;
  likes: number;
  liked: boolean;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState({ likes, liked });
  const [busy, setBusy] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!signedIn) {
      router.push("/sign-in");
      return;
    }
    if (busy) return;
    setBusy(true);
    // optimistic
    setState((s) => ({ likes: s.likes + (s.liked ? -1 : 1), liked: !s.liked }));
    try {
      const res = await fetch(`/api/journal/${questionId}/like`, { method: "POST" });
      const data = await res.json();
      if (data.ok) setState({ likes: data.likes, liked: data.liked });
    } catch {
      setState({ likes, liked }); // revert
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={state.liked}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
        state.liked
          ? "border-saffron/40 bg-saffron/10 text-saffron"
          : "border-ink/15 text-ink-soft hover:border-ink/40"
      }`}
    >
      <svg viewBox="0 0 24 24" width="13" height="13" fill={state.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {state.likes}
    </button>
  );
}

/* ────────────  Comment form  ──────────── */

export function CommentForm({
  questionId,
  signedIn,
}: {
  questionId: number;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <p className="text-sm text-ink-soft">
        <Link href="/sign-in" className="text-saffron underline underline-offset-2">
          Sign in
        </Link>{" "}
        to join the conversation.
      </p>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch(`/api/journal/${questionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error("Could not post. Please try again.");
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        minLength={2}
        maxLength={2000}
        rows={3}
        placeholder="Offer your reflection…"
        className="resize-none rounded-lg border border-ink/15 bg-transparent px-3 py-2.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink"
      />
      {error && <p className="text-xs text-saffron">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-fit rounded-lg bg-saffron px-6 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03] disabled:opacity-60"
      >
        {sending ? "Posting…" : "Post reflection"}
      </button>
    </form>
  );
}
