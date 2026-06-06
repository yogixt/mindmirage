import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { mailtoLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Publications, recommended bibliography, and research collaboration with Mind Mirage.",
};

const SECTIONS = [
  {
    id: "publications",
    title: "Mind Mirage Publications",
    note: "Acharya Ji's papers, essays, and translations are being prepared for publication and will appear here as each one is released.",
    items: [],
  },
  {
    id: "bibliography",
    title: "Recommended Bibliography",
    items: [
      "Vivekacūḍāmaṇi — Adi Shankarācārya",
      "Brahma Sūtra Śāṅkara Bhāṣya",
      "Yoga Sūtras of Patañjali with classical commentaries",
      "Bhagavad Gītā Bhāṣya — Shankarācārya",
      "Upadeśa Sāhasrī — Shankarācārya",
      "Sānkhya Kārikā — Īśvarakṛṣṇa",
    ],
  },
  {
    id: "external",
    title: "External Resources",
    items: [
      "JSTOR · Indian Philosophy",
      "Sanskrit Library — primary texts",
      "Wisdom Library — translations and commentaries",
    ],
  },
];

export default function ResearchPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Research · अनुसन्धान"
        deva="शोध"
        title={
          <>
            Reading rooted in the <span className="italic text-ink-soft">tradition.</span>
          </>
        }
        description={
          <>
            Mind Mirage holds an active interest in primary-source scholarship of the
            Indian Knowledge System. Below — our publications, the bibliography we
            return to, and the doors that open onto further study.
          </>
        }
      />

      <section className="px-6 py-5 sm:py-5">
        <div className="mx-auto max-w-3xl space-y-10">
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-24">
              <p className="eyebrow">{s.title}</p>
              {"note" in s && s.note && (
                <p className="mt-6 border-l-2 border-gold/60 pl-4 text-base italic leading-relaxed text-ink-soft">
                  {s.note}
                </p>
              )}
              {s.items.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {s.items.map((it) => (
                    <li key={it} className="text-base text-ink leading-relaxed border-b border-ink/8 pb-3">
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="collaborate" className="scroll-mt-24 px-6 py-5 sm:py-5 bg-paper-warm">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Collaborate</p>
          <h2
            className="display mt-4 text-3xl text-ink sm:text-5xl"
            style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
          >
            Working on something <span className="italic text-ink-soft">adjacent?</span>
          </h2>
          <p className="mt-6 text-base text-ink-soft leading-relaxed">
            We welcome research collaborations, joint publications, and seminar
            invitations. Write to Acharya Ji with what you are working on.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={mailtoLink("Research collaboration")}
              className="rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              Write to Acharya Ji
            </a>
            <Link
              href="/contact"
              className="rounded-lg border border-ink/15 px-8 py-3 text-sm text-ink transition-colors hover:border-ink"
            >
              Use the form
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
