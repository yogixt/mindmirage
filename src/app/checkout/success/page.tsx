import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isClerkConfigured } from "@/lib/auth";

type SearchParams = Promise<{ payment?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { payment } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <PageHero
          deva="स्वागतम्"
          eyebrow="Enrolment confirmed"
          title="Welcome, seeker."
          description="Your payment has reached us. A confirmation email is on its way — with your live-class joining link or first lesson. The team handles the rest."
        />

        <section className="mx-auto max-w-2xl px-6 pb-5">
          <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-6 sm:p-8 text-center">
            <p className="deva text-2xl text-ink">गुरुर्ब्रह्मा गुरुर्विष्णुः</p>
            <p className="mt-4 text-base text-ink-soft leading-relaxed">
              May this study bear fruit in clarity, in stillness, and in the
              steady recognition of the Self.
            </p>

            {payment && (
              <p className="mt-6 inline-block rounded-lg border border-ink/15 bg-paper px-4 py-2 text-xs uppercase tracking-widest text-ink-faint">
                Payment id · {payment}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {isClerkConfigured() && (
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-saffron px-7 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
                >
                  Open my dashboard
                </Link>
              )}
              <Link
                href="/programs"
                className="rounded-lg border border-ink/15 px-7 py-3 text-sm text-ink hover:bg-ink/5 transition-colors"
              >
                Explore more programs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
