import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import FooterHero from "@/components/FooterHero";
import SanskritVerse from "@/components/SanskritVerse";
import EventHighlights from "@/components/EventHighlights";
import CourseCard from "@/components/CourseCard";
import Divider from "@/components/Divider";

import EditorialHeader from "@/components/EditorialHeader";
import { SANSKRIT, THREE_PATHS, COURSES } from "@/lib/constants";
import { JsonLd } from "@/components/JsonLd";

export const metadata = {
  title: "Mind Mirage — Advaita Vedanta, Yoga & Indian Philosophy Courses | Rishikesh",
  description:
    "Study Advaita Vedanta, Yoga Sutras, Bhagavad Gita, Meditation & Sanskrit with Acharya Bhagyashree Joshi Ji at Advaita Sadhana Kutir, Rishikesh. Self-paced & live Zoom courses in the gurukulam tradition.",
  keywords: [
    "Advaita Vedanta courses",
    "Yoga Sutras online course",
    "Bhagavad Gita classes",
    "Meditation course Rishikesh",
    "Sanskrit learning online",
    "Indian philosophy courses",
    "Adi Shankaracharya lineage",
    "Vedanta teacher Rishikesh",
    "spiritual courses India",
    "Guru Shishya Parampara",
    "Self realization course",
    "Jnana Yoga",
    "Karma Yoga",
    "Bhakti Yoga",
    "Jyotish course",
    "Lalita Sahasranama",
    "Buddhism course online",
    "Sankhya philosophy",
    "Yoga teacher training India",
    "ashram courses Rishikesh",
  ],
  alternates: { canonical: "https://mindmirageindia.com" },
  openGraph: {
    title: "Mind Mirage — Step out of the Mind Matrix",
    description:
      "Advaita Vedanta, Yoga Sutras, Bhagavad Gita & Meditation courses from Rishikesh — taught in the living Guru-Shishya tradition.",
    url: "https://mindmirageindia.com",
    siteName: "Mind Mirage",
    locale: "en_IN",
    type: "website",
    images: [{ url: "https://mindmirageindia.com/og-home.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mind Mirage — Advaita Vedanta & Yoga Courses | Rishikesh",
    description: "Study Indian philosophy in the Guru-Shishya tradition. Self-paced & live courses.",
    images: ["https://mindmirageindia.com/og-home.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <main className="overflow-hidden">
        <Navbar />

        {/* ──────────  1. CINEMATIC HERO  ────────── */}
        <section className="relative min-h-screen w-full overflow-hidden bg-paper">
          <VideoHero fullBleed poster="/hero-poster.jpg" />
          <div
            className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
            style={{ paddingTop: "8rem", paddingBottom: "6rem" }}
          >
            <p className="eyebrow animate-fade-rise mt-4">
              Mind Mirage · Rishikesh · est. {new Date().getFullYear() - 4}
            </p>

            <p className="deva animate-fade-rise mt-6 text-3xl text-ink sm:text-4xl">
              {SANSKRIT.mahavakya.deva}
            </p>

            <h1
              className="display animate-fade-rise-delay mt-6 max-w-7xl text-5xl text-ink sm:text-7xl md:text-8xl"
              style={{ lineHeight: "0.95", letterSpacing: "-2.46px" }}
            >
              Beyond the mind,
              <br />
              <span className="italic text-saffron">the seer</span> remains.
            </h1>

            <div className="animate-fade-rise-delay-2 mt-6 mb-2">
              <Divider />
            </div>

            <div className="animate-fade-rise-delay-3 mt-5">
              <Link
                href="#offerings"
                className="text-xs uppercase tracking-[0.25em] text-ink-faint transition-colors hover:text-ink"
              >
                ↓ scroll
              </Link>
            </div>
          </div>
        </section>

        {/* ──────────  2. EVENT HIGHLIGHTS  ────────── */}
        <EventHighlights />

        {/* ──────────  3. THREE PATHS  ────────── */}
        <section className="relative overflow-hidden bg-paper py-10 px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <EditorialHeader
              eyebrow="§ 01 · Three paths · one journey"
              title={
                <>
                  Choose the rhythm{" "}
                  <span className="italic text-saffron">that finds you.</span>
                </>
              }
              subtitle="Each path — Yoga, Vedānta, Sanskrit — is held in the gurukulam rhythm: one lesson at a time, an assignment by hand."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {THREE_PATHS.map((p, i) => (
                <Link
                  key={p.iast}
                  href={p.href}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper p-6 transition-all duration-500 hover:-translate-y-2 hover:border-saffron/20 hover:shadow-[0_24px_80px_-32px_rgba(192,83,31,0.12)]"
                >
                  {/* Numbered marker */}
                  <div className="flex items-center justify-between">
                    <span className="display text-4xl text-ink/[0.06] transition-colors duration-300 group-hover:text-saffron/15">
                      0{i + 1}
                    </span>
                    <span className="rounded-full bg-paper-warm px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                      Path {i + 1}
                    </span>
                  </div>

                  <p className="deva mt-6 text-2xl text-ink">{p.deva}</p>
                  <p className="sanskrit-italic mt-1 text-base text-ink-soft">{p.iast}</p>
                  <h3 className="display mt-4 text-xl text-ink">{p.en}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {p.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-saffron transition-transform duration-300 group-hover:translate-x-1">
                    Begin this path
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────  5. OFFERINGS  ────────── */}
        <section id="offerings" className="relative overflow-hidden bg-paper-warm py-10 px-6 sm:py-14">
          <div className="relative mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <EditorialHeader
                eyebrow="§ 02 · Offerings"
                title={
                  <>
                    Every tradition,{" "}
                    <span className="italic text-saffron">one teacher.</span>
                  </>
                }
                subtitle="From Patañjali's Yoga Sūtras to Nāgārjuna's Madhyamaka — each course is held in the gurukulam rhythm."
              />
              <Link
                href="/programs"
                className="shrink-0 rounded-full bg-saffron px-6 py-2.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
              >
                View all →
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COURSES.slice(0, 6).map((c, i) => (
                <CourseCard key={c.slug} course={c} index={i} showPrice={false} />
              ))}
            </div>
          </div>
        </section>

        {/* ──────────  6. ACHARYA JI  ────────── */}
        <section className="relative w-full overflow-hidden bg-paper lg:min-h-[820px]">
          {/* Background image container — stacks vertically on mobile, full-bleed on desktop */}
          <div className="relative h-[400px] w-full sm:h-[500px] lg:absolute lg:inset-0 lg:h-full">
            <Image
              src="/acharya-ji.jpg"
              alt="Acharya Bhagyashree Joshi Ji — Vedanta teacher at Advaita Sadhana Kutir, Rishikesh"
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "28% 15%" }}
              priority
            />
            {/* Smooth desktop gradient — fades from white on the right (text side) to transparent on the left (subject side) */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background:
                  "linear-gradient(to left, #FFFFFF 0%, #FFFFFF 30%, rgba(255,255,255,0.85) 38%, rgba(255,255,255,0.5) 48%, rgba(255,255,255,0.15) 56%, transparent 64%)",
              }}
            />
          </div>

          {/* Text content — stacks below image on mobile, overlays and aligns to the right on desktop */}
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-center px-6 py-12 sm:py-16 lg:absolute lg:inset-0 lg:items-end lg:py-0">
            <div className="max-w-lg sm:max-w-xl">
              {/* Devanagari — subtle offset above heading */}
              <p className="deva pl-16 text-xl text-ink/90 sm:pl-24 sm:text-2xl lg:pl-28 lg:text-[1.65rem]">
                आचार्य भाग्यश्री जोशी जी
              </p>

              <h2
                className="display mt-1 text-[3.5rem] leading-[0.88] text-ink sm:text-7xl lg:text-[5.5rem]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Acharya
                <br />
                <span className="italic text-saffron">Bhagyashree</span>
                <br />
                <span className="italic">Joshi Ji</span>
              </h2>

              {/* Brush stroke underline */}
              <svg
                viewBox="0 0 320 14"
                className="mt-4 h-3.5 w-64 text-saffron/70 sm:w-80"
                aria-hidden
              >
                <path
                  d="M2 10 Q 80 2, 160 4 T 318 7"
                  stroke="currentColor"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>

              <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg">
                A teacher in the Advaita lineage of Adi Shankarācārya —
                weaving Yoga, Vedānta, and Sanskrit into the contemporary
                sādhak&apos;s life, in the warmth of the Guru-Śiṣya Paramparā.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/our-team"
                  className="rounded-full bg-saffron px-8 py-3.5 text-sm font-medium text-paper transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-saffron/20"
                >
                  Know more
                </Link>
                <Link
                  href="/sit-with-guruji"
                  className="rounded-full border border-ink/20 bg-white/60 px-8 py-3.5 text-sm text-ink backdrop-blur-sm transition-all duration-300 hover:border-saffron hover:text-saffron"
                >
                  Sit with her
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────  7. VIDEO-BG FOOTER  ────────── */}
        <FooterHero />
      </main>
    </>
  );
}
