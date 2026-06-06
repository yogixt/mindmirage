"use client";

import { useEffect, useMemo, useState } from "react";

/* Month calendar — blocked dates red, available green.
   mode="select": seekers pick available dates (up to maxSelect).
   mode="manage": the team clicks any date to toggle blocked/available. */

type Props = {
  mode: "select" | "manage";
  blocked: string[];
  selected?: string[];
  maxSelect?: number;
  onSelect?: (dates: string[]) => void;
  onToggle?: (date: string, blocked: boolean) => void;
};

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function ymd(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function AvailabilityCalendar({
  mode,
  blocked,
  selected = [],
  maxSelect = 5,
  onSelect,
  onToggle,
}: Props) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const todayStr = ymd(new Date());

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0,
    ).getDate();
    const list: (string | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(ymd(new Date(month.getFullYear(), month.getMonth(), d)));
    }
    return list;
  }, [month]);

  const monthLabel = month.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const click = (date: string) => {
    if (date < todayStr) return;
    if (mode === "manage") {
      onToggle?.(date, !blockedSet.has(date));
      return;
    }
    if (blockedSet.has(date)) return;
    const isSelected = selected.includes(date);
    if (isSelected) {
      onSelect?.(selected.filter((d) => d !== date));
    } else if (selected.length < maxSelect) {
      onSelect?.([...selected, date].sort());
    }
  };

  return (
    <div className="w-full max-w-[320px] rounded-xl border border-ink/10 bg-paper p-3">
      {/* Month header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
          className="grid size-7 place-items-center rounded-md border border-ink/15 text-sm text-ink transition-colors hover:border-ink"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="display text-base text-ink">{monthLabel}</p>
        <button
          type="button"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
          className="grid size-7 place-items-center rounded-md border border-ink/15 text-sm text-ink transition-colors hover:border-ink"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Weekdays */}
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">
            {w}
          </span>
        ))}
      </div>

      {/* Days */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, i) => {
          if (!date) return <span key={`x${i}`} />;
          const past = date < todayStr;
          const isBlocked = blockedSet.has(date);
          const isSelected = selected.includes(date);
          const day = Number(date.slice(8, 10));

          let cls =
            "h-8 rounded-md text-[11px] font-medium transition-all grid place-items-center ";
          if (past) {
            cls += "text-ink-faint/50 cursor-not-allowed";
          } else if (isBlocked) {
            cls +=
              "bg-red-100 text-red-700 border border-red-200" +
              (mode === "manage" ? " hover:bg-red-200 cursor-pointer" : " cursor-not-allowed");
          } else if (isSelected) {
            cls += "bg-green-600 text-white shadow-sm cursor-pointer";
          } else {
            cls +=
              "bg-green-50 text-green-800 border border-green-200 hover:bg-green-100 cursor-pointer";
          }

          return (
            <button
              key={date}
              type="button"
              disabled={past || (mode === "select" && isBlocked)}
              onClick={() => click(date)}
              className={cls}
              aria-pressed={mode === "select" ? isSelected : isBlocked}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-green-200 bg-green-50" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded border border-red-200 bg-red-100" /> Blocked
        </span>
        {mode === "select" && (
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-green-600" /> Your pick
          </span>
        )}
      </div>
    </div>
  );
}

/* Fetch helper shared by both consumers. */
export function useBlockedDates() {
  const [blocked, setBlocked] = useState<string[]>([]);
  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d) => d.ok && setBlocked(d.blocked))
      .catch(() => {});
  }, []);
  return [blocked, setBlocked] as const;
}
