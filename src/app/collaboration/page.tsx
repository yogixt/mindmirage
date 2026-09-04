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
    "Collaborate with Mind Mirage, co author a work, write an article, or join a research paper on Yoga, Vedānta, and Indian knowledge systems.",
};

const WAYS = [
  {
    deva: "सह-लेखन",
    name: "Co-author",
    text: "Write a work together, books and long form studies in Yoga and Vedānta.",
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

      {/* ──────────  THREE WAYS  ────────── */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="eyebrow">Three ways to collaborate</p>
            <h2
              className="display mt-3 text-3xl text-ink sm:text-4xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Write, research,{" "}
              <span className="italic text-saffron">co-create.</span>
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {WAYS.map((w, i) => (
              <Reveal key={w.name} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper transition-all duration-500 hover:-translate-y-2 hover:border-saffron/20 hover:shadow-[0_24px_80px_-32px_rgba(192,83,31,0.15)]">
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-saffron via-gold to-saffron opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="p-6 sm:p-7">
                    <p className="deva bg-gradient-to-r from-saffron via-gold to-saffron bg-clip-text text-2xl text-transparent">
                      {w.deva}
                    </p>
                    <p className="display mt-2 text-xl text-ink">{w.name}</p>
                    <p className="mt-3 text-base leading-relaxed text-ink-soft">
                      {w.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────  FORM  ────────── */}
      <section className="bg-paper-warm border-t border-ink/[0.04] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="eyebrow">Propose a collaboration</p>
            <h2
              className="display mt-3 text-2xl text-ink sm:text-3xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Begin the <span className="italic text-saffron">conversation.</span>
            </h2>
          </div>
          <FormCard subtitle="Tell us what brings you">
            <CollaborationForm />
          </FormCard>
        </div>
      </section>

      <Footer />
    </main>
  );
}
