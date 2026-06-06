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
      <div className="border-b border-ink/10 pb-2">
        <h2 className="display text-xl text-ink sm:text-2xl">My bookings</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Your slot requests — the team confirms one of your dates.
        </p>
      </div>
      <ul className="mt-3 space-y-2.5">
        {bookings.map((b, i) => (
          <li
            key={i}
            className="rounded-xl border border-ink/10 bg-paper-warm/40 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">{b.subject}</p>
              {b.status === "approved" ? (
                <span className="rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold text-white">
                  Confirmed
                </span>
              ) : b.status === "declined" ? (
                <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
                  Could not confirm — the team will reach out
                </span>
              ) : (
                <span className="rounded-full bg-gold-soft/40 px-3 py-1 text-[11px] font-semibold text-ink">
                  Awaiting confirmation
                </span>
              )}
            </div>
            {b.status === "approved" && b.approvedDates.length > 0 ? (
              <div className="mt-2">
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
                <p className="mt-1.5 text-xs text-ink-soft">
                  {b.slot} — Zoom links follow by email.
                </p>
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-ink-soft">
                {b.slot} · requested: {b.dates}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
