"use client";

import { useEffect, useMemo, useState } from "react";
import { tithiForDate } from "@/lib/panchanga";

/* Two-month calendar for consultation slot booking.
   - availability comes from /api/availability (blocked dates).
   - allowedDaysOfWeek restricts selectable days (e.g., Gītā = Tue/Thu).
   - maxSelect lets seekers pick several preferred dates. */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ymd(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function monthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const list: (string | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    list.push(ymd(new Date(year, month, d)));
  }
  return list;
}

function monthName(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

type Props = {
  allowedDaysOfWeek?: number[];
  selected: string[];
  maxSelect?: number;
  onSelect: (dates: string[]) => void;
};

export default function SlotCalendar({
  allowedDaysOfWeek,
  selected,
  maxSelect = 5,
  onSelect,
}: Props) {
  const [blocked, setBlocked] = useState<string[]>([]);
  const [baseMonth, setBaseMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d) => d.ok && setBlocked(d.blocked))
      .catch(() => {});
  }, []);

  const blockedSet = useMemo(() => new Set(blocked), [blocked]);
  const todayStr = ymd(new Date());

  const allowedSet = useMemo(
    () => (allowedDaysOfWeek ? new Set(allowedDaysOfWeek) : null),
    [allowedDaysOfWeek],
  );

  const isSelectable = (date: string) => {
    if (date < todayStr) return false;
    if (blockedSet.has(date)) return false;
    if (allowedSet) {
      const day = new Date(`${date}T00:00:00`).getDay();
      if (!allowedSet.has(day)) return false;
    }
    return true;
  };

  const click = (date: string) => {
    if (!isSelectable(date)) return;
    const isSelected = selected.includes(date);
    if (isSelected) {
      onSelect(selected.filter((d) => d !== date));
    } else if (selected.length < maxSelect) {
      onSelect([...selected, date].sort());
    }
  };

  const months = [
    { year: baseMonth.getFullYear(), month: baseMonth.getMonth() },
    {
      year: baseMonth.getFullYear() + Math.floor((baseMonth.getMonth() + 1) / 12),
      month: (baseMonth.getMonth() + 1) % 12,
    },
  ];

  const shift = (delta: number) => {
    setBaseMonth(new Date(baseMonth.getFullYear(), baseMonth.getMonth() + delta, 1));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
          aria-label="Previous months"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <p className="text-sm font-semibold tracking-wide text-ink">
          Pick your preferred dates
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          className="grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
          aria-label="Next months"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* Two months */}
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        {months.map(({ year, month }) => (
          <div
            key={`${year}-${month}`}
            className="rounded-2xl border border-ink/8 bg-paper-cream p-4 shadow-sm"
          >
            <p className="mb-3 text-center text-sm font-semibold text-ink">
              <span className="text-saffron">{monthName(year, month)}</span>
            </p>
            <div className="grid grid-cols-7 text-center">
              {WEEKDAYS.map((w) => (
                <span key={w} className="py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                  {w}
                </span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-y-1">
              {monthGrid(year, month).map((date, i) => {
                if (!date) return <span key={`x${i}`} className="size-9" />;
                const past = date < todayStr;
                const blockedDate = blockedSet.has(date);
                const selectable = isSelectable(date);
                const isSelected = selected.includes(date);
                const day = Number(date.slice(8, 10));
                const tithi = tithiForDate(date);

                let cls =
                  "relative mx-auto grid size-9 place-items-center rounded-xl text-[13px] font-medium transition-all ";
                if (past || !selectable) {
                  cls += blockedDate
                    ? "text-red-300 line-through cursor-not-allowed"
                    : "text-ink-faint/40 cursor-not-allowed";
                } else if (isSelected) {
                  cls += "bg-saffron text-white shadow-md cursor-pointer";
                } else {
                  cls += "text-ink cursor-pointer hover:bg-paper-deep";
                }

                return (
                  <button
                    key={date}
                    type="button"
                    disabled={!selectable}
                    onClick={() => click(date)}
                    className={cls}
                    aria-pressed={isSelected}
                    title={tithi.name}
                  >
                    {day}
                    {(tithi.isPurnima || tithi.isAmavasya || tithi.isEkadashi) && (
                      <span
                        aria-hidden
                        className={`absolute bottom-1 left-1/2 size-[4px] -translate-x-1/2 rounded-full ${
                          isSelected
                            ? "bg-white"
                            : tithi.isPurnima
                              ? "bg-gold"
                              : tithi.isAmavasya
                                ? "bg-ink"
                                : "bg-saffron"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-md bg-saffron" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-md bg-paper-cream ring-1 ring-ink/10" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-md text-red-300 line-through">12</span> Blocked
        </span>
      </div>
    </div>
  );
}
