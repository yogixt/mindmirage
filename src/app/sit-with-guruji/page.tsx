import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Sit with Guruji — Mentorship & Consultation",
  description:
    "Two ways to sit with Acharya Bhagyashree Joshi Ji one-to-one — long-form mentorship and consultation on Zoom from Rishikesh.",
};

const WAYS = [
  {
    href: "/mentorship",
    deva: "गुरुकुलम्",
    name: "Mentorship",
    text: "A long-form relationship in the gurukulam rhythm — study, assignments, and Acharya Ji's personal attention over months, not minutes.",
    cta: "Apply for mentorship",
  },
  {
    href: "/consultation",
    deva: "मार्गदर्शन",
    name: "Consultation",
    text: "Live classes and one-to-one guidance on Zoom — every subject taken with care, in the warmth of the Guru-Śiṣya Paramparā.",
    cta: "Book a consultation",
  },
];

export default function SitWithGurujiPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="गुरुमुख · Guru-Mukha"
        deva="गुरुजी के साथ"
        title={
          <>
            Sit with <span className="italic text-ink-soft">Guruji.</span>
          </>
        }
        description={
          <>
            Three ways to sit with Acharya Ji one-to-one — each in the warmth and
            attention of the traditional Guru-Śiṣya Paramparā.
          </>
        }
      />

      <section className="px-6 pb-4">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {WAYS.map((w, i) => (
            <Reveal key={w.href} delay={i * 0.08} className="flex">
              <Link
                href={w.href}
                className="group flex w-full flex-col rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]"
              >
                <p className="deva text-xl text-saffron">{w.deva}</p>
                <h2 className="display mt-2 text-2xl text-ink">{w.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {w.text}
                </p>
                <p className="display mt-4 text-sm text-ink transition-transform group-hover:translate-x-0.5">
                  {w.cta} →
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
