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
import { priceFor } from "@/lib/region";
import { useRegion } from "@/lib/useRegion";

const STORAGE_KEY = "mindmirage:cart:v1";
const FAVORITES_KEY = "mindmirage:favorites:v1";

export type CartItem = {
  slug: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  courses: Course[];
  count: number;
  total: number;
  has: (slug: string) => boolean;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  // Favorites management
  favorites: string[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .filter((i) => i && typeof i.slug === "string")
              .map((i) => ({
                slug: i.slug,
                quantity: typeof i.quantity === "number" ? i.quantity : 1,
              }))
          );
        }
      }
    } catch {}

    try {
      const rawFavs = localStorage.getItem(FAVORITES_KEY);
      if (rawFavs) {
        const parsed = JSON.parse(rawFavs) as string[];
        if (Array.isArray(parsed)) {
          setFavorites(parsed.filter((f) => typeof f === "string"));
        }
      }
    } catch {}

    setHydrated(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites, hydrated]);

  const add = useCallback((slug: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { slug, quantity }];
    });
    setOpen(true);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.slug === slug ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items],
  );

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((f) => f !== slug) : [...prev, slug]
    );
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites],
  );

  const courses = useMemo(
    () =>
      items
        .map((i) => CATALOG.find((c) => c.slug === i.slug))
        .filter((c): c is Course => !!c),
    [items],
  );

  const region = useRegion();
  const total = useMemo(
    () =>
      courses.reduce((sum, c) => {
        const item = items.find((i) => i.slug === c.slug);
        return sum + priceFor(c, region) * (item?.quantity ?? 1);
      }, 0),
    [courses, items, region],
  );

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    courses,
    count,
    total,
    has,
    add,
    setQuantity,
    remove,
    clear,
    open,
    setOpen,
    favorites,
    isFavorite,
    toggleFavorite,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
