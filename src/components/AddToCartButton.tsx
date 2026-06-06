"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { CheckIcon, ArrowRightIcon } from "./Icon";

export default function AddToCartButton({
  slug,
  variant = "primary",
  className = "",
}: {
  slug: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const { has, add } = useCart();
  const inCart = has(slug);

  if (inCart) {
    return (
      <Link
        href="/cart"
        className={`inline-flex items-center justify-center gap-2 bg-gold text-ink px-7 py-3 text-sm transition-transform hover:scale-[1.02] ${className}`}
      >
        <CheckIcon width={16} height={16} />
        In your basket — view
        <ArrowRightIcon width={16} height={16} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(slug)}
      className={`inline-flex items-center justify-center px-7 py-3 text-sm transition-transform hover:scale-[1.02] ${
        variant === "primary"
          ? "rounded-lg bg-saffron text-paper"
          : "rounded-lg border border-ink/15 text-ink hover:bg-ink/5"
      } ${className}`}
    >
      Add to basket
    </button>
  );
}
