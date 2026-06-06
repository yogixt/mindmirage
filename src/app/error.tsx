"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-paper">
      <section className="flex min-h-[80vh] items-center justify-center px-6 py-6">
        <div className="max-w-xl text-center">
          <p className="deva text-2xl text-saffron">क्षम्यताम्</p>
          <h1 className="display mt-6 text-4xl text-ink sm:text-5xl">
            Something went quiet.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            An unexpected error interrupted the page. Nothing is lost — you can
            try again, or return to stiller ground.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-lg border border-ink/15 px-8 py-3 text-sm text-ink transition-colors hover:border-ink"
            >
              Return home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
