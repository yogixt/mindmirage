import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import VideoHero from "@/components/VideoHero";
import FooterHero from "@/components/FooterHero";
import SanskritVerse from "@/components/SanskritVerse";
import Reveal from "@/components/Reveal";
import LineageTree from "@/components/LineageTree";
import Divider from "@/components/Divider";
import { SANSKRIT, THREE_PATHS } from "@/lib/constants";

export default function HomePage() {
  return (
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

          <p className="animate-fade-rise-delay-3 opacity-0 mt-5 text-xs uppercase tracking-[0.25em] text-ink-faint">
            ↓ scroll
          </p>
        </div>
      </section>

      {/* ──────────  2. MANGALĀCHĀRANA  ────────── */}
      <section className="bg-paper-deep py-6 px-6 sm:py-5">
        <div className="mx-auto max-w-7xl text-center">
          <p className="eyebrow">Mangalāchārana · invocation</p>
          <div className="mt-2 animate-fade-rise opacity-0">
            <p
              className="deva animate-om-glow whitespace-pre-line text-2xl font-bold text-black sm:text-4xl lg:text-5xl"
              style={{ letterSpacing: "0.04em", lineHeight: 1.7 }}
            >
              {SANSKRIT.guruStotram.deva}
            </p>
          </div>
        </div>
      </section>

      {/* ──────────  3. LINEAGE  ────────── */}
      <section className="bg-paper-warm py-5 px-6 sm:py-5">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Paramparā · the unbroken line</p>
            <h2
              className="display mt-3 text-4xl text-ink sm:text-5xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              From Adi Shankarācārya to <span className="italic text-ink-soft">you,</span>
              <br />a single thread.
            </h2>
            <p className="mt-4 text-base text-ink-soft leading-relaxed">
              {SANSKRIT.shankara.deva}
              <br />
              <span className="sanskrit-italic">— {SANSKRIT.shankara.en}</span>
            </p>
          </div>
          <div className="mt-4 rounded-2xl border border-ink/10 bg-paper-warm py-6 px-6">
            <LineageTree />
          </div>
        </div>
      </section>

      {/* ──────────  4. THREE PATHS  ────────── */}
      <section className="bg-paper py-5 px-6 sm:py-5">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Three paths · one journey</p>
            <h2
              className="display mt-3 text-4xl text-ink sm:text-5xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Choose the rhythm <span className="italic text-ink-soft">that finds you.</span>
            </h2>
          </div>

          <div className="mt-3 grid gap-4 md:grid-cols-3">
            {THREE_PATHS.map((p, i) => (
              <Reveal key={p.iast} delay={i * 0.08} className="flex">
                <Link
                  href={p.href}
                  className="group flex w-full flex-col rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]"
                >
                  <p className="eyebrow">Path {String(i + 1).padStart(2, "0")}</p>
                  <p className="deva mt-4 text-2xl text-ink">{p.deva}</p>
                  <p className="sanskrit-italic mt-1 text-lg text-ink-soft">{p.iast}</p>
                  <h3 className="display mt-5 text-2xl text-ink">{p.en}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft flex-1">{p.description}</p>
                  <p className="mt-6 text-sm text-ink display group-hover:translate-x-0.5 transition-transform">
                    Step in →
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────  5. ACHARYA JI · full-bleed banner  ────────── */}
      <section className="relative w-full overflow-hidden bg-paper-warm">
        {/* Photo — stacked on top for mobile; bleeds in from the right on desktop */}
        <div className="relative h-[420px] w-full sm:h-[480px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[62%]">
          <Image
            src="/acharya-ji.jpg"
            alt="Acharya Bhagyashree Joshi Ji by the Ganga in Rishikesh"
            fill
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="object-cover object-[30%_center]"
          />
          {/* Blend: desktop-only — soft wash where the text sits */}
          <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-paper-warm via-paper-warm/20 via-30% to-transparent to-45%" />
        </div>

        {/* Content — below the photo on mobile, left column over the blend on desktop */}
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="max-w-xl py-6 sm:py-8 lg:max-w-md lg:py-24 xl:max-w-lg">
            <p className="deva text-2xl text-ink sm:text-3xl">
              आचार्य भाग्यश्री जोशी जी
            </p>
            <h2
              className="display mt-3 text-5xl text-ink sm:text-6xl lg:text-5xl xl:text-6xl"
              style={{ lineHeight: "1.0", letterSpacing: "-0.02em" }}
            >
              Acharya
              <br />
              <span className="italic">Bhagyashree Joshi Ji</span>
            </h2>
            {/* Brush-stroke underline */}
            <svg
              viewBox="0 0 300 12"
              className="mt-4 h-3 w-56 text-ink/80 sm:w-72"
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
            <p className="mt-5 text-base text-ink-soft leading-relaxed sm:text-lg">
              A teacher in the Advaita lineage of Adi Shankarācārya —
              weaving Yoga, Vedānta, and Sanskrit into the contemporary
              sādhak&apos;s life, in the warmth of the Guru-Śiṣya Paramparā.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link
                href="/our-team"
                className="rounded-full bg-saffron px-8 py-3.5 text-sm text-paper transition-transform hover:scale-[1.03]"
              >
                Know more
              </Link>
              <Link
                href="/sit-with-guruji"
                className="rounded-full border border-ink/20 px-8 py-3.5 text-sm text-ink transition-colors hover:border-ink"
              >
                Sit with her
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────  8. TAITTIRĪYA QUOTE  ────────── */}
      <section className="bg-paper-deep py-6 px-6 sm:py-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">From the Taittirīya Upaniṣad</p>
          <div className="mt-2">
            <SanskritVerse
              deva={SANSKRIT.taittiriya.deva}
              en={SANSKRIT.taittiriya.en}
              citation={SANSKRIT.taittiriya.ref}
              size="sm"
            />
          </div>
          <p className="mt-2 text-sm text-[#1A1A1A] leading-relaxed">
            Knowledge does not arrive whole from any one direction. It comes
            slowly — from the teacher, from your own clarity, from the friends
            who walk beside you, and from time itself.
          </p>
        </div>
      </section>

      {/* ──────────  9. VIDEO-BG FOOTER (CTA + link grid all-in-one)  ────────── */}
      <FooterHero />
    </main>
  );
}
