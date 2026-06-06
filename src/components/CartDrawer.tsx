"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/constants";
import { CloseIcon } from "./Icon";

export default function CartDrawer() {
  const { open, setOpen, courses, total, remove, count } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 h-full w-full sm:w-[440px] bg-paper shadow-2xl flex flex-col transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
          <div>
            <p className="deva text-sm text-ink-soft">पात्र</p>
            <h2 className="display text-2xl text-ink">
              Your basket
              {count > 0 && (
                <span className="ml-3 text-base text-ink-faint">
                  · {count} program{count > 1 ? "s" : ""}
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close basket"
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-ink/5 transition-colors"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {courses.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="deva text-2xl text-ink-soft">शून्य</p>
              <p className="mt-3 display text-xl text-ink">Nothing yet.</p>
              <p className="mt-2 text-sm text-ink-soft max-w-xs">
                Add a program to begin. You can browse and add as many as you
                like; pay once at the door.
              </p>
              <Link
                href="/programs"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex rounded-lg bg-saffron px-6 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03]"
              >
                Browse programs
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {courses.map((c) => (
                <li
                  key={c.slug}
                  className="rounded-xl border border-ink/10 bg-paper-warm/40 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="deva text-base text-ink-soft">{c.deva}</p>
                      <p className="display text-lg text-ink mt-1">{c.title}</p>
                      <p className="text-xs text-ink-faint mt-1.5 uppercase tracking-widest">
                        {c.tradition}
                      </p>
                    </div>
                    <p className="display text-lg text-ink whitespace-nowrap">
                      {formatINR(c.priceINR)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-ink-faint">
                    <span>
                      {c.duration.split("·")[0].trim()}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(c.slug)}
                      className="font-medium text-red-600 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {courses.length > 0 && (
          <footer className="px-6 py-5 border-t border-ink/10 bg-paper-warm/40">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="display text-2xl text-ink">
                {formatINR(total)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full text-center rounded-lg bg-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.01] hover:bg-green-700"
            >
              Proceed to checkout
            </Link>
            <p className="mt-3 text-center text-xs text-ink-faint">
              Secure payment via Razorpay · UPI, cards, net banking
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}
