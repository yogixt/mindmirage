"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/constants";
import RegionPrice from "./RegionPrice";
import {
  Heart,
  Trash2,
  Plus,
  Minus,
  BookOpen,
  Video,
  X,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export default function CartDrawer() {
  const {
    open,
    setOpen,
    courses,
    items,
    total,
    remove,
    count,
    setQuantity,
    toggleFavorite,
    isFavorite,
  } = useCart();

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
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-ink/20 backdrop-blur-md transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 h-full w-full sm:w-[460px] bg-paper shadow-[0_0_80px_-20px_rgba(0,0,0,0.25)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-ink/[0.06] px-7 py-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              पात्र · Your basket
            </p>
            {count > 0 && (
              <p className="mt-1 text-sm text-ink-soft">
                {count} program{count > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close basket"
            onClick={() => setOpen(false)}
            className="rounded-xl p-2.5 text-ink-soft transition-all hover:bg-paper-deep hover:text-ink"
          >
            <X strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {courses.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-paper-warm">
                <ShoppingBag strokeWidth={1.2} className="h-7 w-7 text-ink-faint" />
              </div>
              <p className="deva mt-6 text-2xl text-ink-soft">शून्य</p>
              <p className="display mt-2 text-xl text-ink">Your basket is empty</p>
              <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-ink-soft">
                Browse our offerings and add courses that call to you. Pay once when
                you&apos;re ready.
              </p>
              <Link
                href="/programs"
                onClick={() => setOpen(false)}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
              >
                Browse offerings
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {courses.map((c) => {
                const item = items.find((i) => i.slug === c.slug);
                const quantity = item ? item.quantity : 1;
                const isFav = isFavorite(c.slug);
                const isBook = c.slug.startsWith("booklist");
                const isSession = c.slug.startsWith("1on1");

                return (
                  <li
                    key={c.slug}
                    className="group relative flex gap-4 rounded-2xl border border-ink/[0.05] bg-paper-warm/30 p-4 transition-all duration-300 hover:border-saffron/10 hover:bg-paper-warm/60"
                  >
                    {/* Thumbnail */}
                    <div className="flex shrink-0 items-start">
                      <div className="grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-xl border border-ink/[0.04] bg-gradient-to-br from-saffron/[0.08] via-gold/[0.04] to-saffron/[0.08]">
                        {isBook ? (
                          <BookOpen strokeWidth={1.5} className="h-5 w-5 text-saffron/70" />
                        ) : isSession ? (
                          <Video strokeWidth={1.5} className="h-5 w-5 text-saffron/70" />
                        ) : (
                          <span className="deva text-2xl font-bold text-saffron/70">
                            {c.deva ? c.deva.charAt(0) : "ॐ"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-faint">
                          {c.tradition}
                        </p>
                        <h3 className="display mt-1 text-base font-semibold text-ink">
                          {c.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-ink-faint">{c.duration}</p>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleFavorite(c.slug)}
                            className={`inline-flex items-center gap-1 text-[11px] transition-colors ${
                              isFav ? "text-saffron" : "text-ink-faint hover:text-saffron"
                            }`}
                          >
                            <Heart
                              strokeWidth={1.5}
                              className={`h-3.5 w-3.5 ${isFav ? "fill-saffron" : ""}`}
                            />
                            {isFav ? "Saved" : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(c.slug)}
                            className="inline-flex items-center gap-1 text-[11px] text-ink-faint transition-colors hover:text-red-500"
                          >
                            <Trash2 strokeWidth={1.5} className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>

                        {/* Price */}
                        <span className="display text-base text-ink">
                          <RegionPrice inr={c.priceINR} foreignInr={c.priceForeignINR} />
                        </span>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-ink/[0.05] bg-paper px-1 py-1.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(c.slug, quantity - 1)}
                        disabled={quantity <= 1}
                        className="rounded-lg p-1 text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink disabled:opacity-25"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[1.25rem] text-center text-xs font-bold text-ink">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(c.slug, quantity + 1)}
                        className="rounded-lg p-1 text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {courses.length > 0 && (
          <footer className="border-t border-ink/[0.06] bg-paper-warm/20 px-7 py-6">
            {/* Subtotal row */}
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-soft">Subtotal</span>
              <span className="display text-2xl text-ink">{formatINR(total)}</span>
            </div>

            <p className="mt-1 text-right text-[11px] text-ink-faint">
              Taxes included · Shipping not applicable
            </p>

            {/* CTA buttons */}
            <div className="mt-5 grid grid-cols-[1fr_1.4fr] gap-3">
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl border border-ink/10 px-4 py-3 text-sm font-semibold text-ink transition-all hover:border-ink/20 hover:bg-paper"
              >
                View basket
              </Link>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-saffron px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-clay hover:shadow-lg hover:shadow-saffron/20"
              >
                Proceed to checkout
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="mt-4 text-center text-[11px] tracking-wide text-ink-faint">
              Secure payment via Razorpay · UPI · Cards · Net banking
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}
