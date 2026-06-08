"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { Check, ArrowRight, ShoppingBag } from "lucide-react";

export default function AddToCartButton({
  slug,
  variant = "primary",
  className = "",
}: {
  slug: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const { has, add } = useCart();
  const inCart = has(slug);

  if (inCart) {
    return (
      <Link
        href="/cart"
        className={`inline-flex items-center justify-center gap-2 rounded-xl border border-saffron/30 bg-saffron/5 px-6 py-3 text-sm font-semibold text-saffron transition-all hover:bg-saffron/10 ${className}`}
      >
        <Check strokeWidth={2} className="h-4 w-4" />
        In basket
        <ArrowRight strokeWidth={2} className="h-3.5 w-3.5" />
      </Link>
    );
  }

  const base =
    variant === "primary"
      ? "rounded-xl bg-saffron px-7 py-3 text-white shadow-sm hover:bg-clay hover:shadow-md hover:shadow-saffron/15"
      : variant === "secondary"
        ? "rounded-xl border border-ink/10 px-6 py-3 text-ink hover:border-saffron/30 hover:text-saffron hover:bg-saffron/[0.03]"
        : "rounded-xl px-5 py-2.5 text-ink-soft hover:text-ink hover:bg-ink/5";

  return (
    <button
      type="button"
      onClick={() => add(slug)}
      className={`inline-flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${base} ${className}`}
    >
      <ShoppingBag strokeWidth={1.5} className="h-4 w-4" />
      Add to basket
    </button>
  );
}
