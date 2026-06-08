"use client";

import { useEffect, useState } from "react";

type Item = { kind: string; text: string; at: string };

const KIND_META: Record<string, { icon: React.ReactNode; dot: string; bg: string }> = {
  booking: {
    icon: (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    dot: "bg-green-600",
    bg: "bg-green-50/60",
  },
  assignment: {
    icon: (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    dot: "bg-saffron",
    bg: "bg-saffron/[0.04]",
  },
  class: {
    icon: (
      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    dot: "bg-gold",
    bg: "bg-gold/[0.04]",
  },
};

export default function Notifications() {
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.items))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || items.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-2 flex items-baseline gap-3">
            <span className="eyebrow text-saffron">§ 02</span>
            <span className="text-[11px] tracking-wide text-ink-faint">
              Updates <span className="deva ml-1 text-saffron">· सूचना</span>
            </span>
          </div>
          <h2 className="display text-[1.65rem] leading-[1.1] text-ink sm:text-[1.85rem]">
            Notifications
          </h2>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => {
          const meta = KIND_META[it.kind] ?? {
            icon: (
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            ),
            dot: "bg-ink/40",
            bg: "bg-paper-warm/40",
          };
          return (
            <li
              key={i}
              className={`flex items-start gap-3 rounded-xl border border-ink/[0.04] ${meta.bg} px-4 py-3 transition-colors hover:border-ink/[0.08]`}
            >
              <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-ink/[0.06] text-ink-faint`}>
                {meta.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-relaxed text-ink-soft">{it.text}</p>
                <p className="mt-1 text-[11px] text-ink-faint">{it.at}</p>
              </div>
              <span className={`mt-2 size-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
