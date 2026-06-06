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
        className={`inline-flex items-center justify-center gap-2 rounded-lg border border-green-600 bg-green-50 px-5 py-2.5 text-sm font-medium text-green-700 transition-transform hover:scale-[1.02] ${className}`}
      >
        <CheckIcon width={16} height={16} />
        In basket
        <ArrowRightIcon width={16} height={16} />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(slug)}
      className={`inline-flex items-center justify-center text-sm font-medium transition-all hover:scale-[1.02] ${
        variant === "primary"
          ? "rounded-lg bg-green-600 px-7 py-3 text-white shadow-sm hover:bg-green-700"
          : "rounded-lg border border-green-600 px-5 py-2.5 text-green-700 hover:bg-green-50"
      } ${className}`}
    >
      Add to basket
    </button>
  );
}
