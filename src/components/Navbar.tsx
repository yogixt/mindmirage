"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { NAV_PRIMARY, SITE } from "@/lib/constants";
import CartButton from "./CartButton";

type Variant = "transparent" | "solid";

export default function Navbar({ variant = "transparent" }: { variant?: Variant }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSolid = variant === "solid" || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        isSolid
          ? "bg-paper/85 backdrop-blur-lg border-b border-ink/5"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <Link
          href="/"
          className="display text-2xl tracking-tight text-ink sm:text-3xl"
          onClick={() => setOpen(false)}
        >
          {SITE.name}
          <sup className="ml-0.5 text-[10px] align-super text-ink-soft">®</sup>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-9 md:flex">
          {NAV_PRIMARY.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-medium transition-colors ${
                  active
                    ? "text-ink font-semibold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex md:items-center md:gap-3">
          <CartButton />
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-base font-medium text-ink-soft hover:text-ink transition-colors"
              >
                {session.user.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt=""
                    className="size-7 rounded-full object-cover"
                  />
                )}
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-lg border border-ink/15 px-5 py-2.5 text-base font-medium text-ink transition-colors hover:bg-ink/5"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => signIn("google")}
                className="rounded-lg border border-ink/15 px-5 py-2.5 text-base font-medium text-ink transition-colors hover:bg-ink/5 hover:border-ink/30"
              >
                Sign in
              </button>
              <Link
                href="/programs"
                className="rounded-lg bg-saffron px-6 py-2.5 text-base font-semibold text-paper transition-transform hover:scale-[1.03]"
              >
                Begin Journey
              </Link>
            </>
          )}
        </div>

                {/* Mobile right cluster */}
        <div className="md:hidden flex items-center gap-1">
          <CartButton />
          {session && (
            <button
              type="button"
              onClick={() => signOut()}
              className="text-xs text-ink-soft hover:text-ink transition-colors"
            >
              Sign out
            </button>
          )}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="p-2"
          >
            <span className="block h-px w-6 bg-ink" />
            <span className={`block h-px w-6 bg-ink mt-1.5 transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className="block h-px w-6 bg-ink mt-1.5" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-ink/5 bg-paper/95 backdrop-blur-lg">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4">
            {NAV_PRIMARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-ink"
              >
                {item.label}
              </Link>
            ))}
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-lg font-medium text-ink"
                >
                  {session.user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt=""
                      className="size-7 rounded-full object-cover"
                    />
                  )}
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="mt-3 inline-flex w-fit rounded-lg border border-ink/15 px-6 py-2.5 text-base font-semibold text-ink"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="mt-3 inline-flex w-fit rounded-lg border border-ink/15 px-6 py-2.5 text-base font-semibold text-ink hover:bg-ink/5"
                >
                  Sign in with Google
                </button>
                <Link
                  href="/programs"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-fit rounded-lg bg-saffron px-6 py-2.5 text-base font-semibold text-paper"
                >
                  Begin Journey
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
