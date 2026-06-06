"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export default function CartPage() {
  const { courses, total, remove, count } = useCart();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
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

        <section className="mx-auto max-w-3xl px-6 pb-4">
          {courses.length === 0 ? (
            <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-8 text-center">
              <p className="deva text-2xl text-ink-soft">शून्य</p>
              <p className="mt-3 display text-2xl text-ink">Begin with one.</p>
              <Link
                href="/programs"
                className="mt-4 inline-flex rounded-lg bg-saffron px-7 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
              >
                Browse programs
              </Link>
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {courses.map((c) => (
                  <li
                    key={c.slug}
                    className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-5"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <p className="deva text-base text-ink-soft">{c.deva}</p>
                        <Link
                          href={`/programs/${c.slug}`}
                          className="display mt-1 block text-xl text-ink hover:text-saffron transition-colors"
                        >
                          {c.title}
                        </Link>
                        <p className="mt-1 text-xs uppercase tracking-widest text-ink-faint">
                          {c.tradition}
                        </p>
                        <p className="mt-3 text-sm text-ink-soft">
                          {c.duration}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="display text-2xl text-ink whitespace-nowrap">
                          {formatINR(c.priceINR)}
                        </p>
                        <button
                          type="button"
                          onClick={() => remove(c.slug)}
                          className="mt-3 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-2xl border border-ink/10 bg-paper p-5 sm:p-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink-soft">Total</span>
                  <span className="display text-3xl text-green-700">                    {formatINR(total)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-4 block w-full text-center rounded-lg bg-green-600 px-6 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.01] hover:bg-green-700"
                >
                  Proceed to checkout
                </Link>
                <p className="mt-3 text-center text-xs text-ink-faint">
                  Secure payment via Razorpay · UPI, cards, net banking
                </p>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
