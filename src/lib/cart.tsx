"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CATALOG, type Course } from "@/lib/constants";

const STORAGE_KEY = "mindmirage:cart:v1";

type CartItem = { slug: string };

type CartContextValue = {
  items: CartItem[];
  courses: Course[];
  count: number;
  total: number;
  has: (slug: string) => boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((i) => i && typeof i.slug === "string"));
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback((slug: string) => {
    setItems((prev) =>
      prev.some((i) => i.slug === slug) ? prev : [...prev, { slug }],
    );
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items],
  );

  const courses = useMemo(
    () =>
      items
        .map((i) => CATALOG.find((c) => c.slug === i.slug))
        .filter((c): c is Course => !!c),
    [items],
  );

  const total = useMemo(
    () => courses.reduce((sum, c) => sum + c.priceINR, 0),
    [courses],
  );

  const value: CartContextValue = {
    items,
    courses,
    count: items.length,
    total,
    has,
    add,
    remove,
    clear,
    open,
    setOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
