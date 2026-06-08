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

function niceDay(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
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
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-baseline gap-3">
            <span className="eyebrow text-saffron">§ 03</span>
            <span className="text-[11px] tracking-wide text-ink-faint">
              Schedule <span className="deva ml-1 text-saffron">· काल</span>
            </span>
          </div>
          <h2 className="display text-[1.65rem] leading-[1.1] text-ink sm:text-[1.85rem]">
            Upcoming classes
          </h2>
        </div>
      </div>
      <ul className="space-y-3">
        {classes.map((c, i) => (
          <li
            key={i}
            className="group flex items-center gap-4 rounded-2xl border border-ink/[0.06] bg-paper p-4 transition-all duration-300 hover:border-saffron/15 hover:shadow-[0_12px_40px_-20px_rgba(192,83,31,0.1)]"
          >
            {/* Date pill */}
            <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-paper-warm px-3.5 py-2.5 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-saffron">
                {niceDate(c.date)}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{c.course}</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {niceDay(c.date)} · {niceTime(c.time)} IST
                {localTime(c.date, c.time) && (
                  <span className="text-ink-faint/70"> · {localTime(c.date, c.time)} your time</span>
                )}
                {c.note ? <span className="text-ink-faint/70"> · {c.note}</span> : ""}
              </p>
            </div>

            {c.zoomUrl && (
              <a
                href={c.zoomUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="shrink-0 rounded-full bg-saffron px-5 py-2 text-xs font-medium text-white transition-all hover:scale-[1.03] hover:shadow-md hover:shadow-saffron/20"
              >
                Join
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
