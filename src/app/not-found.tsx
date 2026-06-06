import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-10">
        <div className="max-w-xl text-center">
          <p className="deva text-2xl text-saffron">नेति नेति</p>
          <h1 className="display mt-6 text-4xl text-ink sm:text-5xl">
            Not this, not this.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            The page you are looking for is not here. Perhaps it has moved on,
            or perhaps it never was.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              Return home
            </Link>
            <Link
              href="/programs"
              className="rounded-lg border border-ink/15 px-8 py-3 text-sm text-ink transition-colors hover:border-ink"
            >
              Browse programs
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
