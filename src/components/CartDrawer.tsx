"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/constants";
import { CloseIcon } from "./Icon";
import { 
  Heart, 
  Trash2, 
  Plus, 
  Minus, 
  BookOpen, 
  Video 
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
    isFavorite 
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
      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 h-full w-full sm:w-[440px] bg-paper shadow-2xl flex flex-col transition-transform duration-300 ${
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
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors text-ink-soft hover:text-ink"
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
                className="mt-6 inline-flex rounded-lg bg-saffron px-6 py-2.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
              >
                Browse programs
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {courses.map((c) => {
                const item = items.find((i) => i.slug === c.slug);
                const quantity = item ? item.quantity : 1;
                const originalPrice = Math.round(c.priceINR * 1.25);
                const isFav = isFavorite(c.slug);
                const isBook = c.slug.startsWith("booklist");
                const isSession = c.slug.startsWith("1on1");

                return (
                  <li
                    key={c.slug}
                    className="flex gap-3 p-3.5 rounded-xl border border-ink/8 bg-paper-warm/40 items-stretch"
                  >
                    {/* Left: Thumbnail image */}
                    <div className="flex items-center shrink-0">
                      <div className="relative w-16 h-16 rounded-lg border border-ink/5 bg-gradient-to-br from-saffron/10 via-gold/5 to-saffron/5 flex items-center justify-center overflow-hidden">
                        {isBook ? (
                          <BookOpen className="w-6 h-6 text-saffron/80" />
                        ) : isSession ? (
                          <Video className="w-6 h-6 text-saffron/80" />
                        ) : (
                          <span className="font-deva text-xl font-bold bg-gradient-to-br from-saffron to-gold bg-clip-text text-transparent select-none">
                            {c.deva ? c.deva.charAt(0) : "ॐ"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Center: Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="eyebrow text-[8px] text-ink-faint tracking-widest uppercase truncate">
                          {c.tradition}
                        </p>
                        <h3 className="display text-base font-bold text-ink mt-0.5 truncate">
                          {c.title}
                        </h3>
                        {/* Price */}
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-sm font-semibold text-ink">
                            {formatINR(c.priceINR)}
                          </span>
                          <span className="text-[10px] text-ink-faint line-through">
                            {formatINR(originalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Action links */}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-ink-soft">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(c.slug)}
                          className={`inline-flex items-center gap-1 hover:text-saffron transition-colors ${
                            isFav ? "text-saffron" : ""
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-saffron text-saffron" : ""}`} />
                          {isFav ? "Saved" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(c.slug)}
                          className="inline-flex items-center gap-1 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Right: Quantity Selector */}
                    <div className="flex flex-col items-center justify-center gap-1.5 bg-paper border border-ink/5 rounded-lg py-1 px-0.5 w-8 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity(c.slug, quantity - 1)}
                        disabled={quantity <= 1}
                        className="p-0.5 text-ink-soft hover:text-saffron rounded transition-all disabled:opacity-20 disabled:hover:bg-transparent"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-ink select-none text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(c.slug, quantity + 1)}
                        className="p-0.5 text-ink-soft hover:text-saffron rounded transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                );
              })}
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
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="block text-center rounded-lg border border-ink/15 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper"
              >
                View basket
              </Link>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="block text-center rounded-lg bg-saffron px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.01] hover:bg-clay"
              >
                Checkout
              </Link>
            </div>
            <p className="mt-3 text-center text-xs text-ink-faint">
              Secure payment via Razorpay · UPI, cards, net banking
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}
