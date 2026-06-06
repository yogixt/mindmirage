"use client";

import { useEffect, useMemo, useState } from "react";
import { PRACTICES } from "@/lib/sadhana";

/* Daily sādhanā to-do list + 7-day tracker.
   Rows are practices; columns are the last seven days.
   Today's circle is the toggle — past days are read-only. */

function ymd(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export default function SadhanaTracker() {
  const [checks, setChecks] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  const today = useMemo(() => ymd(new Date()), []);
  const days = useMemo(() => {
    const out: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      out.push(ymd(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)));
    }
    return out;
  }, []);

  useEffect(() => {
    fetch(`/api/sadhana?today=${today}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setChecks(new Set(d.checks.map((c: { date: string; practice: string }) => `${c.date}:${c.practice}`)));
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [today]);

  const toggle = async (practice: string) => {
    const key = `${today}:${practice}`;
    const done = !checks.has(key);
    // optimistic
    setChecks((prev) => {
      const next = new Set(prev);
      if (done) next.add(key);
      else next.delete(key);
      return next;
    });
    try {
      const res = await fetch("/api/sadhana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, practice, done }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
    } catch {
      // revert on failure
      setChecks((prev) => {
        const next = new Set(prev);
        if (done) next.delete(key);
        else next.add(key);
        return next;
      });
    }
  };

  const doneToday = PRACTICES.filter((p) => checks.has(`${today}:${p.id}`)).length;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* The whiteboard — aluminium frame */}
      <div className="rounded-xl border-[6px] border-zinc-300 bg-zinc-300 shadow-[0_22px_50px_-20px_rgba(0,0,0,0.35)]">
        {/* Glossy white surface */}
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-white via-white to-zinc-50 p-5 sm:p-6">
          {/* Glare streak */}
          <div
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-40 rotate-[25deg] bg-gradient-to-b from-white via-zinc-100/60 to-transparent opacity-70"
            aria-hidden
          />

          {/* Magnets */}
          <span className="absolute left-3 top-3 size-3 rounded-full bg-saffron shadow-[inset_0_-1px_2px_rgba(0,0,0,0.3)]" aria-hidden />
          <span className="absolute right-3 top-3 size-3 rounded-full bg-green-600 shadow-[inset_0_-1px_2px_rgba(0,0,0,0.3)]" aria-hidden />

          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="handwritten text-3xl font-bold text-ink">
                Today&apos;s to-do
              </h3>
              {/* Marker underline */}
              <svg viewBox="0 0 200 8" className="h-2 w-40 text-saffron" aria-hidden>
                <path
                  d="M3 5 C 50 2, 120 6, 197 3"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <p className="handwritten mt-1 text-lg text-green-700">
                live like a yogi!
              </p>
            </div>
            <p className="handwritten text-lg text-ink-soft">
              today:{" "}
              <span className={`font-bold ${doneToday === PRACTICES.length ? "text-green-700" : "text-ink"}`}>
                {doneToday}/{PRACTICES.length}
              </span>
            </p>
          </div>

          {/* Day letters */}
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_repeat(6,1.4rem)_2.5rem] items-center sm:grid-cols-[minmax(0,1fr)_repeat(6,1.7rem)_2.75rem]">
            <span />
            {days.map((d) => {
              const letter = DAY_LETTERS[new Date(`${d}T00:00:00`).getDay()];
              return (
                <span
                  key={d}
                  className={`handwritten text-center ${
                    d === today
                      ? "text-[11px] font-bold text-saffron"
                      : "text-[11px] text-ink-faint"
                  }`}
                >
                  {d === today ? "today" : letter}
                </span>
              );
            })}

            {/* Practice rows */}
            {PRACTICES.map((p) => (
              <Row
                key={p.id}
                practice={p}
                days={days}
                today={today}
                checks={checks}
                onToggle={() => toggle(p.id)}
              />
            ))}
          </div>

          {!loaded && (
            <p className="handwritten mt-3 text-sm text-ink-faint">
              loading your week…
            </p>
          )}
        </div>
      </div>

      {/* Marker tray */}
      <div className="mx-auto -mt-0.5 flex h-4 w-44 items-center justify-center gap-3 rounded-b-lg bg-zinc-300 px-3 shadow-sm">
        <span className="h-1.5 w-10 rounded-full bg-green-600" aria-hidden />
        <span className="h-1.5 w-10 rounded-full bg-saffron" aria-hidden />
        <span className="h-2 w-6 rounded-[2px] bg-zinc-400" aria-hidden />
      </div>
    </div>
  );
}

function Row({
  practice,
  days,
  today,
  checks,
  onToggle,
}: {
  practice: (typeof PRACTICES)[number];
  days: string[];
  today: string;
  checks: Set<string>;
  onToggle: () => void;
}) {
  return (
    <>
      <span className="flex min-w-0 items-baseline gap-1.5 border-b border-dashed border-ink/15 py-1.5 pr-1">
        <span className="deva shrink-0 text-[11px] leading-none text-saffron sm:text-xs">{practice.deva}</span>
        <span className="handwritten whitespace-nowrap text-sm text-ink sm:text-[15px]">{practice.en}</span>
      </span>
      {days.map((d) => {
        const done = checks.has(`${d}:${practice.id}`);
        const isToday = d === today;
        if (!isToday) {
          return (
            <span key={d} className="grid h-full place-items-center border-b border-dashed border-ink/15">
              <span
                className={`size-2 rounded-full ${
                  done ? "bg-green-600" : "bg-ink/10"
                }`}
              />
            </span>
          );
        }
        return (
          <span key={d} className="grid h-full place-items-center border-b border-dashed border-ink/15">
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={done}
              aria-label={`${practice.en} — ${done ? "done" : "not done"} today`}
              className={`grid size-6 place-items-center rounded-full border-2 transition-all ${
                done
                  ? "border-green-700 bg-green-600 text-white"
                  : "border-ink/30 bg-transparent text-transparent hover:border-green-700"
              }`}
              style={{ borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%" }}
            >
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </span>
        );
      })}
    </>
  );
}
