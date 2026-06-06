import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import Divider from "@/components/Divider";
import SanskritVerse from "@/components/SanskritVerse";
import Link from "next/link";
import { whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Live Q&A · Satsaṅga",
  description:
    "Live group satsang where seekers gather, listen, ask, and study together — in the spirit of the gurukulam.",
};

const MOVEMENTS = [
  {
    deva: "श्रवणम्",
    name: "Śravaṇa — listening",
    text: "Each satsang opens with a short reading from a primary text, taken slowly, in Sanskrit and in translation. Nothing is rushed; the verse is allowed to land.",
  },
  {
    deva: "मननम्",
    name: "Manana — asking",
    text: "Then the floor opens. Seekers bring their questions — from study, from practice, from life — and Acharya Ji takes each one as it comes, in the old gurukulam way.",
  },
  {
    deva: "निदिध्यासनम्",
    name: "Nididhyāsana — sitting",
    text: "The session closes in silence. A few minutes of sitting with what was heard, so the words can settle from the mind toward something quieter.",
  },
];

export default function LiveQAPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="सत्सङ्ग · Satsaṅga"
        deva="लाइव सत्र"
        title={
          <>
            In the <span className="italic text-ink-soft">company</span> of the good.
          </>
        }
        description={
          <>
            Live Q&amp;A and group satsang where seekers gather, listen, ask, and
            study together — held in the spirit of the gurukulam.
          </>
        }
      />

      <section className="px-6 pb-4 pt-2">
        <SanskritVerse
          deva={"सत्सङ्गत्वे निस्सङ्गत्वं निस्सङ्गत्वे निर्मोहत्वम्"}
          en="From the company of the good arises non-attachment; from non-attachment, freedom from delusion."
          citation="Bhaja Govindam 9"
          size="md"
        />
        <Divider />
      </section>

      <section className="px-6 pb-6">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
          {MOVEMENTS.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-ink/8 bg-paper-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
                <p className="deva text-lg text-saffron">{m.deva}</p>
                <p className="eyebrow mt-3">{m.name}</p>
                <p className="mt-4 text-sm text-ink-soft leading-relaxed">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-ink-faint">
          This is the shape every satsang follows — listening, asking, sitting.
        </p>
      </section>

      <section className="px-6 py-5 sm:py-5">
        <div className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center sm:p-10">
          <p className="eyebrow">Upcoming satsangs</p>
          <p className="display mt-4 text-2xl text-ink">
            The next dates are being set with Acharya Ji.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
            Satsangs are announced here and on WhatsApp first. If you would like to
            be told when the next satsang opens, send a quiet hello and we&apos;ll
            keep you in mind.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink("Namaste. Please let me know when the next Live Q&A is scheduled.")}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              Tell me when
            </a>
            <Link
              href="/blog"
              className="rounded-lg border border-ink/15 px-8 py-3 text-sm text-ink transition-colors hover:border-ink"
            >
              Read the Journal
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
