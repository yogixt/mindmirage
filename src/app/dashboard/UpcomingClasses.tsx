"use client";

import { useEffect, useState } from "react";

type Slot = {
  course: string;
  date: string;
  time: string;
  zoomUrl: string | null;
  note: string | null;
};

function niceDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/* Convert an IST date+time to the viewer's local clock. */
function localTime(date: string, time: string) {
  const iso = `${date}T${time}:00+05:30`;
  const d = new Date(iso);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return null;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function niceTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function UpcomingClasses() {
  const [classes, setClasses] = useState<Slot[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => d.ok && setClasses(d.classes))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || classes.length === 0) return null;

  return (
    <section>
      <div className="border-b border-ink/10 pb-2">
        <h2 className="display text-xl text-ink sm:text-2xl">Upcoming classes</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Your live classes on Zoom — times in IST.
        </p>
      </div>
      <ul className="mt-3 space-y-2.5">
        {classes.map((c, i) => (
          <li
            key={i}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-paper-warm/40 p-3"
          >
            <span className="grid min-w-[4.5rem] shrink-0 place-items-center rounded-lg bg-paper px-3 py-2 text-center text-xs font-bold text-ink shadow-sm">
              {niceDate(c.date)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{c.course}</p>
              <p className="text-xs text-ink-faint">
                {niceTime(c.time)} IST
                {localTime(c.date, c.time) && ` (${localTime(c.date, c.time)} your time)`}
                {c.note ? ` · ${c.note}` : ""}
              </p>
            </div>
            {c.zoomUrl && (
              <a
                href={c.zoomUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="shrink-0 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700"
              >
                Join on Zoom
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
