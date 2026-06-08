import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import FooterHero from "@/components/FooterHero";
import SanskritVerse from "@/components/SanskritVerse";
import LineageTree from "@/components/LineageTree";
import CourseCard from "@/components/CourseCard";
import Divider from "@/components/Divider";
import HeroCTA from "@/components/HeroCTA";
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
            <p className="eyebrow animate-fade-rise opacity-0 mt-4">
              Mind Mirage · Rishikesh · est. {new Date().getFullYear() - 4}
            </p>

            <p className="deva animate-fade-rise opacity-0 mt-6 text-3xl text-ink sm:text-4xl">
              {SANSKRIT.mahavakya.deva}
            </p>

            <h1
              className="display animate-fade-rise-delay opacity-0 mt-6 max-w-7xl text-5xl text-ink sm:text-7xl md:text-8xl"
              style={{ lineHeight: "0.95", letterSpacing: "-2.46px" }}
            >
              Beyond the mind,
              <br />
              <span className="italic text-saffron">the seer</span> remains.
            </h1>

            <div className="animate-fade-rise-delay-2 opacity-0 mt-6 mb-2">
              <Divider />
            </div>

            <HeroCTA />
          </div>
        </section>

        {/* ──────────  2. MANGALĀCHĀRANA  ────────── */}
        <section className="bg-paper-deep py-4 px-6">
          <div className="mx-auto max-w-7xl text-center">
            <p className="eyebrow">Mangalāchārana · invocation</p>
            <div className="mt-2 animate-fade-rise opacity-0">
              <p
                className="deva animate-om-glow whitespace-pre-line text-xl font-bold text-black sm:text-2xl lg:text-3xl"
                style={{ letterSpacing: "0.04em", lineHeight: 1.7 }}
              >
                {SANSKRIT.guruStotram.deva}
              </p>
            </div>
          </div>
        </section>

        {/* ──────────  3. LINEAGE  ────────── */}
        <section className="bg-paper-warm py-4 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Paramparā · the unbroken line</p>
              <h2
                className="display mt-2 text-3xl text-ink sm:text-4xl"
                style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
              >
                From Adi Shankarācārya to <span className="italic text-ink-soft">you,</span>
                <br />a single thread.
              </h2>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                {SANSKRIT.shankara.deva}
                <br />
                <span className="sanskrit-italic">— {SANSKRIT.shankara.en}</span>
              </p>
            </div>
            <div className="mt-3 rounded-2xl border border-ink/10 bg-paper-warm py-4 px-4">
              <LineageTree />
            </div>
          </div>
        </section>

        {/* ──────────  4. THREE PATHS  ────────── */}
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
        <section className="relative w-full overflow-hidden bg-paper">
          <div className="relative h-[360px] w-full sm:h-[400px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[62%]">
            <Image
              src="/acharya-ji.jpg"
              alt="Acharya Bhagyashree Joshi Ji — Vedanta teacher at Advaita Sadhana Kutir, Rishikesh"
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover object-[30%_center]"
              priority
            />
            <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-paper via-paper/20 via-30% to-transparent to-45%" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <div className="max-w-xl py-5 sm:py-6 lg:max-w-md lg:py-14 xl:max-w-lg">
              <p className="deva text-xl text-ink sm:text-2xl">
                आचार्य भाग्यश्री जोशी जी
              </p>
              <h2
                className="display mt-2 text-4xl text-ink sm:text-5xl lg:text-4xl xl:text-5xl"
                style={{ lineHeight: "1.0", letterSpacing: "-0.02em" }}
              >
                Acharya
                <br />
                <span className="italic">Bhagyashree Joshi Ji</span>
              </h2>
              <svg
                viewBox="0 0 300 12"
                className="mt-3 h-2.5 w-48 text-ink/80 sm:w-64"
                aria-hidden
              >
                <path
                  d="M3 8 C 60 2, 150 1, 297 6"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <p className="mt-4 text-sm text-ink-soft leading-relaxed sm:text-base">
                A teacher in the Advaita lineage of Adi Shankarācārya —
                weaving Yoga, Vedānta, and Sanskrit into the contemporary
                sādhak&apos;s life, in the warmth of the Guru-Śiṣya Paramparā.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/our-team"
                  className="rounded-full bg-saffron px-6 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03]"
                >
                  Know more
                </Link>
                <Link
                  href="/sit-with-guruji"
                  className="rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink transition-colors hover:border-ink"
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
