import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LineageTree from "@/components/LineageTree";
import SanskritVerse from "@/components/SanskritVerse";
import Divider from "@/components/Divider";
import { SANSKRIT, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Mind Mirage, Advaita Sadhana Kutir, Rishikesh",
  description:
    "Mind Mirage is a contemplative learning space at Advaita Sadhana Kutir, Rishikesh, teaching Advaita Vedanta, Yoga Sutras, Bhagavad Gita & Sanskrit in the living Guru Shishya tradition of Adi Shankaracharya.",
  keywords: [
    "Advaita Sadhana Kutir",
    "Rishikesh ashram",
    "Adi Shankaracharya lineage",
    "Acharya Bhagyashree Joshi",
    "Vedanta teacher Rishikesh",
    "Yoga philosophy India",
    "Guru Shishya Parampara",
  ],
  alternates: { canonical: "https://mindmirageindia.com/about-us" },
  openGraph: {
    title: "About Mind Mirage, Advaita Sadhana Kutir, Rishikesh",
    description: "A contemplative learning space rooted in the Advaita tradition of Adi Shankaracharya.",
    url: "https://mindmirageindia.com/about-us",
    siteName: "Mind Mirage",
    type: "website",
    images: [{ url: "https://mindmirageindia.com/og-about.jpg", width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="About · हमारे विषय में"
        deva="मन का दर्पण"
        title={
          <>
            A doorway, <span className="italic text-ink-soft">not a catalogue.</span>
          </>
        }
        description={
          <>
            Mind Mirage is a contemplative learning space engaging the Indian
            Knowledge System through Yoga, inquiry, training, research, publications,
            and reflective study, rooted in the gurukulam tradition and the living
            stream of Advaita Paramparā.
          </>
        }
      />

      {/* ──────────  MISSION  ────────── */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-saffron" />
            <p className="eyebrow text-saffron">Mission</p>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-ink sm:text-xl">
            To offer the timeless teaching of Advaita, the nondual recognition at
            the root of the Indian philosophical tradition, in a way that meets the
            contemporary sādhak without diluting the depth, the language, or the
            human relationship at its heart.
          </p>
        </div>
      </section>

      <Divider />

      {/* ──────────  TRADITION  ────────── */}
      <section className="bg-paper-warm px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-saffron" />
            <p className="eyebrow text-saffron">Tradition</p>
          </div>
          <div className="mt-6">
            <SanskritVerse
              deva={SANSKRIT.shankara.deva}
              en={SANSKRIT.shankara.en}
              citation={SANSKRIT.shankara.ref}
              align="left"
            />
          </div>
          <p className="mt-6 text-base leading-relaxed text-ink sm:text-lg">
            {SITE.tradition}.
          </p>
        </div>
      </section>

      <Divider />

      {/* ──────────  LOCATION  ────────── */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-saffron" />
            <p className="eyebrow text-saffron">Location</p>
          </div>
          <p className="mt-6 text-base leading-relaxed text-ink sm:text-lg">
            {SITE.location}
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Founded by {SITE.founder}.
          </p>
        </div>
      </section>

      {/* ──────────  PARAMPARĀ  ────────── */}
      <section className="bg-paper-warm border-y border-ink/[0.04] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Paramparā · the unbroken line</p>
          <h2
            className="display mt-4 text-3xl text-ink sm:text-5xl lg:text-6xl"
            style={{ lineHeight: "1.0", letterSpacing: "-0.02em" }}
          >
            How the teaching reaches{" "}
            <span className="italic text-ink-soft">you.</span>
          </h2>
        </div>
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-ink/10 bg-paper p-6 sm:p-8">
          <LineageTree />
        </div>
      </section>

      <Footer />
    </main>
  );
}
