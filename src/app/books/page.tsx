import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { BOOKS, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Booklist — Primary Texts from the Ashram",
  description:
    "Purchase the primary texts of the Indian Knowledge System from Advaita Sādhanā Kuṭīr, Rishikesh — Vivekacūḍāmaṇi, Bhagavad Gītā, Yoga Sūtras, and more. Order on WhatsApp; payment on confirmation.",
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
            The texts we <span className="italic text-ink-soft">return to.</span>
          </>
        }
        description={
          <>
            The kuṭīr keeps a small stock of the primary texts, in editions
            Acharya Ji trusts. Order on WhatsApp — we confirm availability and
            shipping, and payment follows on confirmation.
          </>
        }
      />

      <section className="px-6 pb-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKS.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 0.08} className="flex">
              <div className="flex w-full flex-col rounded-2xl border border-ink/8 bg-paper-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
                {b.deva && <p className="deva text-lg text-saffron">{b.deva}</p>}
                <h2 className="display mt-1 text-xl text-ink">{b.title}</h2>
                <p className="eyebrow mt-2">{b.author}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {b.note}
                </p>
                <a
                  href={whatsappLink(
                    `Namaste. I would like to order the book "${b.title}" from the kutir booklist. Please share availability and price.`,
                  )}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-5 inline-flex w-fit rounded-lg bg-saffron px-5 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03]"
                >
                  Order on WhatsApp
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-ink-faint">
          Prices vary by edition and are confirmed before payment. Shipping
          within India; international seekers, write to us first.
        </p>
      </section>
      <Footer />
    </main>
  );
}
