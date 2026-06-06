import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import FormCard from "@/components/FormCard";
import CollaborationForm from "@/components/CollaborationForm";

export const metadata: Metadata = {
  title: "Collaboration",
  description:
    "Collaborate with Mind Mirage — co-author a work, write an article, or join a research paper on Yoga, Vedānta, and Indian knowledge systems.",
};

const WAYS = [
  {
    deva: "सह-लेखन",
    name: "Co-author",
    text: "Write a work together — books and long-form studies in Yoga and Vedānta.",
  },
  {
    deva: "लेख",
    name: "Article",
    text: "Contribute or commission articles for publications and journals.",
  },
  {
    deva: "शोध पत्र",
    name: "Research paper",
    text: "Joint research on Indian knowledge systems, with proper attribution.",
  },
];

export default function CollaborationPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Collaboration · सहयोग"
        deva="सहयोग"
        title={
          <>
            Let&apos;s write <span className="italic text-ink-soft">together.</span>
          </>
        }
        description="Co-author a work, contribute an article, or join a research paper."
      />

      <section className="px-6 pb-4">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {WAYS.map((w, i) => (
            <Reveal key={w.name} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
                <p className="deva bg-gradient-to-r from-saffron via-gold to-saffron bg-clip-text text-lg text-transparent">
                  {w.deva}
                </p>
                <p className="display mt-2 text-lg text-ink">{w.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-paper-warm px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <FormCard subtitle="Propose a collaboration">
            <CollaborationForm />
          </FormCard>
        </div>
      </section>

      <Footer />
    </main>
  );
}
