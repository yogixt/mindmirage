import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import AddToCartButton from "@/components/AddToCartButton";
import { BOOK_SETS, formatINR } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Booklist — Primary Texts from the Ashram",
  description:
    "The ashram's booklist in three sets — Beginner, Intermediate, and Advanced. Bought through checkout; shipped by the team.",
};

export default function BooksPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Booklist · ग्रन्थ"
        deva="ग्रन्थसूची"
        title={
          <>
            The <span className="italic text-ink-soft">booklist.</span>
          </>
        }
        description={
          <>
            Three sets, by stage of study. Purchase from here — our team will
            contact you.
          </>
        }
      />

      <section className="px-6 pb-4">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {BOOK_SETS.map((b, i) => (
            <Reveal key={b.slug} delay={i * 0.08} className="flex">
              <div className="flex w-full flex-col rounded-xl border border-ink/8 bg-paper-cream p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
                <p className="deva text-base text-saffron">{b.deva}</p>
                <h2 className="display mt-0.5 text-xl text-ink">
                  {b.title.split("· ")[1]}
                </h2>
                <p className="display mt-4 flex-1 text-3xl text-ink">
                  {formatINR(b.priceINR)}
                </p>
                <AddToCartButton slug={b.slug} className="mt-3 w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
