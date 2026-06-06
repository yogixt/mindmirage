import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import Divider from "@/components/Divider";
import { whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Events & Retreats",
  description:
    "Retreats, workshops, and in-person Rishikesh programs offered by Mind Mirage.",
};

const RHYTHM = [
  {
    time: "Before dawn",
    deva: "ध्यानम्",
    name: "Meditation by the Ganga",
    text: "The day begins in the dark, with sitting practice as the river wakes.",
  },
  {
    time: "Morning",
    deva: "स्वाध्यायः",
    name: "Text study with Acharya Ji",
    text: "A text taken slowly — Sanskrit, translation, commentary, questions.",
  },
  {
    time: "Afternoon",
    deva: "सेवा",
    name: "Seva and rest",
    text: "Simple work around the kuṭīr, a walk, or nothing at all. The pace is unhurried.",
  },
  {
    time: "Evening",
    deva: "आरती",
    name: "Ganga ārati and satsang",
    text: "Lamps on the water, then an open sitting — asking, listening, silence.",
  },
];

export default function EventsPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Events · आयोजन"
        deva="शिविर"
        title={
          <>
            Retreats and gatherings <span className="italic text-ink-soft">in Rishikesh.</span>
          </>
        }
        description={
          <>
            From time to time, Mind Mirage hosts in-person retreats and workshops at
            the Advaita Sādhanā Kuṭīr. Numbers are kept small.
          </>
        }
      />

      <section className="px-6 pb-6 pt-2">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-center">The rhythm of a day at the kuṭīr</p>
          <Divider />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RHYTHM.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-ink/8 bg-paper-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
                  <p className="eyebrow text-ink-faint">{r.time}</p>
                  <p className="deva mt-3 text-lg text-saffron">{r.deva}</p>
                  <p className="display mt-2 text-lg text-ink">{r.name}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-ink-faint">
            Every retreat follows this shape; the texts and themes change with the season.
          </p>
        </div>
      </section>

      <section className="px-6 py-5 sm:py-5">
        <div className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center sm:p-10">
          <p className="eyebrow">No public events scheduled today</p>
          <p className="display mt-4 text-2xl text-ink">
            The next gathering will be posted here.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
            Retreats are announced to the seekers&apos; list before anywhere else.
            If you would like to be invited when the next one opens, write to us on
            WhatsApp and we&apos;ll keep your name on it.
          </p>
          <a
            href={whatsappLink("Namaste. Please add me to the retreats list.")}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
          >
            Keep me informed
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
