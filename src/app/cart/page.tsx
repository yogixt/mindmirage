"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart";
import { formatINR, type Course } from "@/lib/constants";
import { priceFor } from "@/lib/region";
import { useRegion } from "@/lib/useRegion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { 
  Heart, 
  Trash2, 
  Plus, 
  Minus, 
  BookOpen, 
  Video, 
  Award,
  Check
} from "lucide-react";

export default function CartPage() {
  const { 
    courses, 
    items, 
    total, 
    remove, 
    count, 
    setQuantity, 
    toggleFavorite,
    isFavorite
  } = useCart();
  const region = useRegion();

  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: "",
    show: false,
  });

  const showToast = (message: string) => {
    setToast({ message, show: true });
  };

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast.show]);

  const handleToggleFavorite = (course: Course) => {
    toggleFavorite(course.slug);
    const fav = isFavorite(course.slug);
    showToast(fav ? `Removed from favourites` : `Added "${course.title}" to favourites`);
  };

  const handleRemove = (course: Course) => {
    remove(course.slug);
    showToast(`Removed "${course.title}" from basket`);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-paper pb-16">
        <PageHero
          deva="पात्र"
          eyebrow="Basket"
          title="Your basket"
          description={
            count === 0
              ? "Nothing here yet. Browse programs and add what calls to you."
              : `${count} program${count > 1 ? "s" : ""} ready for the door.`
          }
        />

        <section className="mx-auto max-w-3xl px-6">
          {courses.length === 0 ? (
            <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-12 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
              <p className="deva text-3xl text-ink-soft">शून्य</p>
              <p className="mt-3 display text-2xl text-ink">Begin with one.</p>
              <p className="mt-2 text-sm text-ink-soft max-w-md mx-auto">
                Discover courses on Yoga Sutras, Bhagavad Gita, and Advaita Vedanta. Add a program to begin.
              </p>
              <Link
                href="/programs"
                className="mt-6 inline-flex rounded-lg bg-saffron px-7 py-3 text-sm text-paper font-semibold transition-all hover:scale-[1.03] hover:bg-clay shadow-sm"
              >
                Browse programs
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              <ul className="space-y-4">
                {courses.map((c) => {
                  const item = items.find((i) => i.slug === c.slug);
                  const quantity = item ? item.quantity : 1;
                  const unitPrice = priceFor(c, region);
                  const originalPrice = Math.round(unitPrice * 1.25);
                  const isFav = isFavorite(c.slug);
                  const isBook = c.slug.startsWith("booklist");
                  const isSession = c.slug.startsWith("1on1");

                  return (
                    <li
                      key={c.slug}
                      className="relative flex flex-col sm:flex-row items-stretch gap-4 p-4 sm:p-5 rounded-2xl border border-ink/10 bg-paper hover:border-ink/20 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]"
                    >
                      {/* Left: Thumbnail */}
                      <div className="flex items-center shrink-0">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-ink/5 bg-gradient-to-br from-saffron/10 via-gold/5 to-saffron/5 flex items-center justify-center overflow-hidden">
                          {isBook ? (
                            <BookOpen className="w-8 h-8 text-saffron/80" />
                          ) : isSession ? (
                            <Video className="w-8 h-8 text-saffron/80" />
                          ) : (
                            <span className="font-deva text-3xl font-bold bg-gradient-to-br from-saffron to-gold bg-clip-text text-transparent select-none">
                              {c.deva ? c.deva.charAt(0) : "ॐ"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Center: Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
                        <div>
                          <p className="eyebrow text-[9px] text-ink-faint tracking-widest uppercase">
                            {c.tradition}
                          </p>
                          <Link
                            href={`/programs/${c.slug}`}
                            className="display mt-1.5 block text-lg sm:text-xl font-bold text-ink hover:text-saffron transition-colors truncate"
                          >
                            {c.title}
                          </Link>

                          {/* Price & Original Price */}
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-base font-bold text-ink">
                              {formatINR(unitPrice)}
                            </span>
                            <span className="text-xs text-ink-faint line-through">
                              {formatINR(originalPrice)}
                            </span>
                            <span className="text-[9px] font-medium text-green-700 bg-green-50 border border-green-200/55 rounded-full px-2 py-0.5">
                              20% off
                            </span>
                          </div>

                          {/* Badges / Attributes */}
                          <div className="mt-3.5 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] text-ink-soft bg-paper-deep border border-ink/5 rounded px-2 py-0.5 font-medium">
                              {isBook ? "Shipped booklist" : isSession ? "Zoom live cohort" : "Self-paced"}
                            </span>
                            <span className="text-[10px] text-ink-soft bg-paper-deep border border-ink/5 rounded px-2 py-0.5 font-medium flex items-center gap-1">
                              <Award className="w-3 h-3 text-gold" />
                              {isBook ? "Ashram verified" : "Lifetime Access"}
                            </span>
                          </div>
                        </div>

                        {/* Action Links */}
                        <div className="mt-4 flex items-center gap-5 text-xs text-ink-soft border-t border-ink/5 pt-3">
                          <button
                            type="button"
                            onClick={() => handleToggleFavorite(c)}
                            className={`inline-flex items-center gap-1.5 font-medium transition-colors hover:text-saffron ${
                              isFav ? "text-saffron" : "text-ink-soft"
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 transition-transform duration-300 active:scale-125 ${isFav ? "fill-saffron text-saffron" : ""}`} />
                            {isFav ? "Favourited" : "Save to Favourites"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(c)}
                            className="inline-flex items-center gap-1.5 font-medium text-ink-soft hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Right: Quantity Selector */}
                      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 sm:gap-3 bg-paper-warm border border-ink/5 rounded-xl px-4 py-2 sm:py-3 sm:px-2 w-full sm:w-11 shrink-0 mt-3 sm:mt-0">
                        <button
                          type="button"
                          onClick={() => setQuantity(c.slug, quantity - 1)}
                          disabled={quantity <= 1}
                          className="p-1.5 text-ink-soft hover:text-saffron hover:bg-ink/5 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold text-ink select-none w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(c.slug, quantity + 1)}
                          className="p-1.5 text-ink-soft hover:text-saffron hover:bg-ink/5 rounded-lg transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Checkout Summary Card */}
              <div className="rounded-2xl border border-ink/10 bg-paper p-5 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all">
                <h3 className="display text-xl text-ink mb-4">Summary</h3>
                <div className="space-y-3 border-b border-ink/10 pb-4 text-sm">
                  <div className="flex justify-between text-ink-soft">
                    <span>Total items</span>
                    <span>{count}</span>
                  </div>
                  <div className="flex justify-between text-ink-soft">
                    <span>Subtotal</span>
                    <span>{formatINR(total)}</span>
                  </div>
                  <div className="flex justify-between text-ink-soft">
                    <span>Delivery</span>
                    <span className="text-green-700 font-medium">Free</span>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm font-medium text-ink-soft">Total</span>
                  <span className="display text-3xl text-green-700 font-bold">
                    {formatINR(total)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 block w-full text-center rounded-lg bg-saffron px-6 py-4 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] hover:bg-clay hover:shadow-lg active:scale-95"
                >
                  Proceed to checkout
                </Link>
                <p className="mt-3.5 text-center text-xs text-ink-faint">
                  Secure payment via Razorpay · UPI, credit/debit cards, net banking
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Elegant glassmorphic Toast notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-ink/95 text-paper px-4 py-3 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-rise border border-paper/10 backdrop-blur-md">
          <Check className="w-4 h-4 text-green-400" />
          {toast.message}
        </div>
      )}

      <Footer />
    </>
  );
}
