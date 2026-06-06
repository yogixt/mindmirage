"use client";

import { useCart } from "@/lib/cart";
import { CartIcon } from "./Icon";

export default function CartButton({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      aria-label={`Open basket${count ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
      onClick={() => setOpen(true)}
      className={`relative inline-flex items-center justify-center p-2.5 transition-colors ${
        tone === "light"
          ? "text-paper hover:bg-paper/10"
          : "text-ink hover:bg-ink/5"
      }`}
    >
      <CartIcon width={22} height={22} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-saffron text-paper text-[10px] font-medium flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
