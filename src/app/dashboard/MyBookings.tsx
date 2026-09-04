"use client";

import { useEffect, useState } from "react";

type Booking = {
  subject: string;
  slot: string;
  dates: string;
  status: string;
  approvedDates: string[];
};

function niceDay(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

const STATUS_META: Record<string, { label: string; className: string }> = {
  approved: {
    label: "Confirmed",
    className:
      "rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-200",
  },
  declined: {
    label: "Declined",
    className:
      "rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-red-200",
  },
  pending: {
    label: "Awaiting confirmation",
    className:
      "rounded-full bg-gold/[0.08] px-3 py-1 text-[11px] font-semibold text-ink ring-1 ring-gold/20",
  },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/booking/mine")
      .then((r) => r.json())
      .then((d) => d.ok && setBookings(d.bookings))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || bookings.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-baseline gap-3">
            <span className="eyebrow text-saffron">§ 04</span>
            <span className="text-[11px] tracking-wide text-ink-faint">
              Appointments <span className="deva ml-1 text-saffron">· संयोग</span>
            </span>
          </div>
          <h2 className="display text-[1.65rem] leading-[1.1] text-ink sm:text-[1.85rem]">
            My bookings
          </h2>
        </div>
      </div>
      <ul className="space-y-3">
        {bookings.map((b, i) => {
          const status = STATUS_META[b.status] ?? STATUS_META.pending;
          return (
            <li
              key={i}
              className="rounded-2xl border border-ink/[0.06] bg-paper p-5 transition-all duration-300 hover:border-saffron/15 hover:shadow-[0_12px_40px_-20px_rgba(192,83,31,0.1)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full bg-paper-warm">
                    <svg viewBox="0 0 24 24" className="size-3.5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  <p className="text-sm font-semibold text-ink">{b.subject}</p>
                </div>
                <span className={status.className}>{status.label}</span>
              </div>

              {b.status === "approved" && b.approvedDates.length > 0 ? (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {b.approvedDates.map((d) => (
                      <span
                        key={d}
                        className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-800 ring-1 ring-green-200"
                      >
                        {niceDay(d)}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink-soft">
                    {b.slot}, Zoom links follow by email.
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-ink-soft">
                  {b.slot} · requested: {b.dates}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
