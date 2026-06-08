"use client";

import { useCart } from "@/lib/cart";
import { ShoppingBag } from "lucide-react";

export default function CartButton({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { count, setOpen } = useCart();

  const textColor = tone === "light" ? "text-paper" : "text-ink";
  const hoverBg = tone === "light" ? "hover:bg-paper/10" : "hover:bg-ink/5";

  return (
    <button
      type="button"
      aria-label={`Open basket${count ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
      onClick={() => setOpen(true)}
      className={`relative inline-flex items-center justify-center rounded-xl p-2.5 transition-all ${textColor} ${hoverBg}`}
    >
      <ShoppingBag strokeWidth={1.5} className="w-[22px] h-[22px]" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-saffron px-1 text-[10px] font-bold text-white ring-2 ring-paper">
          {count}
        </span>
      )}
    </button>
  );
}
