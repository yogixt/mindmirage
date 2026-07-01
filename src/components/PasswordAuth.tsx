"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { passwordStrength } from "@/lib/password-strength";

/* Name/nick + password sign-in and sign-up. Email is optional (sign-up only).
   Works alongside Google sign-in. */

const BAR_COLORS = ["#E0D6BC", "#DC6B4F", "#E0A83E", "#8C9E7C", "#3F8F5B"];

export default function PasswordAuth({ mode }: { mode: "signin" | "signup" }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (session) {
    router.push("/dashboard");
    return null;
  }

  const strength = passwordStrength(password);
  const isSignup = mode === "signup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name = handle.trim();
    if (name.length < 2) {
      setError("Please enter your name or nickname.");
      return;
    }
    if (isSignup && !strength.ok) {
      setError("Please choose a password of at least 6 characters.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setBusy(true);
    try {
      if (isSignup) {
        const res = await fetch("/api/account/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle: name, password, email: email.trim() }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(
            data.error === "handle_taken"
              ? "That name/nick is already taken — try another."
              : data.error === "invalid_handle"
                ? "Name/nick can use letters, numbers, spaces, . _ -"
                : "Could not create the account. Please try again.",
          );
          setBusy(false);
          return;
        }
      }

      const r = await signIn("credentials", { handle: name, password, redirect: false });
      if (!r || r.error) {
        setError(
          isSignup
            ? "Account created, but sign-in failed — try signing in."
            : "Wrong name/nick or password.",
        );
        setBusy(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
        Name or nickname
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="e.g. Aarav or aarav_yoga"
          autoComplete="username"
          className="rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-saffron"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignup ? "Choose a password" : "Your password"}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-saffron"
        />
      </label>

      {isSignup && password.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-1.5 flex-1 rounded-full transition-colors"
                style={{ background: i <= strength.score ? BAR_COLORS[strength.score] : "#EDE6D4" }}
              />
            ))}
          </div>
          {strength.label && (
            <span className="text-xs font-medium" style={{ color: BAR_COLORS[strength.score] }}>
              {strength.label} password
            </span>
          )}
        </div>
      )}

      {isSignup && (
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
          Email <span className="font-normal text-ink-faint">(optional)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            className="rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-ink outline-none transition-colors focus:border-saffron"
          />
        </label>
      )}

      {error && (
        <p className="rounded-lg bg-maroon/5 px-3 py-2 text-sm text-maroon">{error}</p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-1 rounded-xl bg-saffron px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-saffron hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/sign-up" className="font-semibold text-saffron hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
