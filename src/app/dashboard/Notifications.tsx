"use client";

import { useEffect, useState } from "react";

type Item = { kind: string; text: string; at: string };

const DOT: Record<string, string> = {
  booking: "bg-green-600",
  assignment: "bg-saffron",
  class: "bg-gold",
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
      <div className="border-b border-ink/10 pb-2">
        <h2 className="display text-xl text-ink sm:text-2xl">Updates</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Confirmations, reviews, and classes coming up.
        </p>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink-soft"
          >
            <span
              className={`mt-1.5 size-2 shrink-0 rounded-full ${DOT[it.kind] ?? "bg-ink/40"}`}
              aria-hidden
            />
            <span className="leading-relaxed">{it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
