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
const DAY_DEVA = ["र", "सो", "मं", "बु", "गु", "शु", "श"];

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
  const progressPct = Math.round((doneToday / PRACTICES.length) * 100);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Warm wood-inspired frame — organic, not industrial */}
      <div className="rounded-2xl border-[5px] border-clay/20 bg-clay/5 shadow-[0_20px_50px_-20px_rgba(156,85,48,0.2)]">
        {/* Paper surface */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-white to-paper-warm p-5 sm:p-6">
          {/* Subtle warm glow */}
          <div
            className="pointer-events-none absolute -right-12 -top-16 h-56 w-32 rotate-[25deg] bg-gradient-to-b from-saffron/[0.04] via-gold/[0.02] to-transparent"
            aria-hidden
          />

          {/* Decorative corner marks */}
          <span className="absolute left-3 top-3 size-2 rounded-full bg-saffron/30" aria-hidden />
          <span className="absolute right-3 top-3 size-2 rounded-full bg-gold/40" aria-hidden />

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="handwritten text-2xl font-bold text-ink sm:text-3xl">
                  Today&apos;s sādhanā
                </h3>
                <span className="deva text-sm text-saffron">साधना</span>
              </div>
              {/* Marker underline */}
              <svg viewBox="0 0 200 8" className="h-2 w-36 text-saffron/70" aria-hidden>
                <path
                  d="M3 5 C 50 2, 120 6, 197 3"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-right">
              <p className="handwritten text-lg text-ink-soft">
                <span className={`font-bold ${doneToday === PRACTICES.length ? "text-green-700" : "text-ink"}`}>
                  {doneToday}
                </span>
                <span className="text-ink-faint">/{PRACTICES.length}</span>
              </p>
              {/* Mini progress bar */}
              <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron to-gold transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Day letters with Devanagari */}
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_repeat(6,1.4rem)_2.5rem] items-center sm:grid-cols-[minmax(0,1fr)_repeat(6,1.7rem)_2.75rem]">
            <span />
            {days.map((d) => {
              const idx = new Date(`${d}T00:00:00`).getDay();
              const isToday = d === today;
              return (
                <span
                  key={d}
                  className={`text-center ${
                    isToday
                      ? "text-[11px] font-bold text-saffron"
                      : "text-[10px] text-ink-faint"
                  }`}
                >
                  {isToday ? (
                    <span className="handwritten">today</span>
                  ) : (
                    <span>
                      <span className="handwritten">{DAY_LETTERS[idx]}</span>
                      <span className="deva ml-0.5 text-[8px] opacity-60">{DAY_DEVA[idx]}</span>
                    </span>
                  )}
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

      {/* Chalk/marker tray — warm tones */}
      <div className="mx-auto -mt-0.5 flex h-4 w-40 items-center justify-center gap-3 rounded-b-xl bg-clay/15 px-3">
        <span className="h-1.5 w-9 rounded-full bg-green-600/70" aria-hidden />
        <span className="h-1.5 w-9 rounded-full bg-saffron/70" aria-hidden />
        <span className="h-2 w-5 rounded-[2px] bg-ink/15" aria-hidden />
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
      <span className="flex min-w-0 items-baseline gap-1.5 border-b border-dashed border-ink/10 py-1.5 pr-1">
        <span className="deva shrink-0 text-[10px] leading-none text-saffron sm:text-[11px]">{practice.deva}</span>
        <span className="handwritten whitespace-nowrap text-sm text-ink sm:text-[15px]">{practice.en}</span>
      </span>
      {days.map((d) => {
        const done = checks.has(`${d}:${practice.id}`);
        const isToday = d === today;
        if (!isToday) {
          return (
            <span key={d} className="grid h-full place-items-center border-b border-dashed border-ink/10">
              <span
                className={`size-[7px] rounded-full transition-colors ${
                  done ? "bg-saffron" : "bg-ink/[0.08]"
                }`}
              />
            </span>
          );
        }
        return (
          <span key={d} className="grid h-full place-items-center border-b border-dashed border-ink/10">
            <button
              type="button"
              onClick={onToggle}
              aria-pressed={done}
              aria-label={`${practice.en}, ${done ? "done" : "not done"} today`}
              className={`grid size-6 place-items-center rounded-full border-2 transition-all duration-300 ${
                done
                  ? "border-saffron bg-saffron text-white shadow-sm shadow-saffron/20"
                  : "border-ink/20 bg-transparent text-transparent hover:border-saffron/60"
              }`}
              style={{ borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%" }}
            >
              <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </span>
        );
      })}
    </>
  );
}
