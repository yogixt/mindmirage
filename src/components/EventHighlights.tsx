import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   Homepage event highlights — two wide cards in the
   adiveda-social style: a left title + rule + description,
   then two landscape cards (Meditation, Yoga) with a Devanagari
   watermark and a "Watch now →"-style call to action.
   ──────────────────────────────────────────────────────────── */

type EventCard = {
  href: string;
  eyebrow: string;
  deva: string;
  title: string;
  blurb: string;
  cta: string;
  theme: "warm" | "green";
};

const EVENTS: EventCard[] = [
  {
    href: "/meditation",
    eyebrow: "Course · Level 01 · 8 days",
    deva: "ध्यान",
    title: "Meditation",
    blurb: "A 10-hour guided course — five-element balancing, yoga nidra, mantra and more. Online or at the ashram.",
    cta: "Reserve your seat",
    theme: "warm",
  },
  {
    href: "/yoga",
    eyebrow: "Classes · Starts 05 July · 2–4 PM",
    deva: "योग",
    title: "Yoga",
    blurb: "Āsana, prāṇāyāma and the eight limbs — a living practice rooted in Patañjali's Yoga Sūtras.",
    cta: "Reserve your spot",
    theme: "green",
  },
];

const THEME = {
  warm: {
    bg: "linear-gradient(135deg, #F4EAD0 0%, #EBD3AE 55%, #E4C39A 100%)",
    text: "#46453E",
    soft: "rgba(70,69,62,0.72)",
    accent: "#C0531F",
    cta: "#46453E",
    watermark: "rgba(192,83,31,0.12)",
  },
  green: {
    bg: "linear-gradient(135deg, #EDF1E7 0%, #DFE8D4 55%, #D0DCC1 100%)",
    text: "#33402C",
    soft: "rgba(51,64,44,0.70)",
    accent: "#C0531F",
    cta: "#4A5A3E",
    watermark: "rgba(110,139,91,0.16)",
  },
} as const;

export default function EventHighlights() {
  return (
    <section className="bg-paper-warm px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header — title · rule · description */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
          <h2
            className="display shrink-0 text-4xl leading-[0.95] text-ink sm:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Begin your
            <br />
            <span className="italic text-saffron">practice.</span>
          </h2>
          <div className="hidden w-px self-stretch bg-ink/15 sm:block" />
          <p className="max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
            Two ways to start right now — a guided meditation course and an ongoing
            yoga sādhanā, online or at our Rishikesh ashram. Choose one and reserve
            your place.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {EVENTS.map((ev) => {
            const t = THEME[ev.theme];
            return (
              <Link
                key={ev.title}
                href={ev.href}
                className="group relative flex aspect-[16/11] overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(70,69,62,0.6)] sm:aspect-[16/9]"
                style={{ background: t.bg }}
              >
                {/* Devanagari watermark */}
                <span
                  className="pointer-events-none absolute -bottom-6 -right-2 select-none leading-none"
                  style={{
                    fontFamily: "var(--font-noto-deva)",
                    fontSize: "clamp(140px, 26vw, 260px)",
                    color: t.watermark,
                  }}
                  aria-hidden
                >
                  {ev.deva}
                </span>

                {/* Content */}
                <div className="relative z-10 flex w-full flex-col justify-between p-7 sm:p-9">
                  <div
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: t.accent }}
                  >
                    {ev.eyebrow}
                  </div>

                  <div>
                    <p className="deva text-2xl sm:text-3xl" style={{ color: t.accent }}>
                      {ev.deva}
                    </p>
                    <h3
                      className="display mt-1 text-5xl sm:text-6xl"
                      style={{ color: t.text, letterSpacing: "-0.02em" }}
                    >
                      {ev.title}
                    </h3>
                    <p
                      className="mt-3 max-w-md text-sm leading-relaxed sm:text-base"
                      style={{ color: t.soft }}
                    >
                      {ev.blurb}
                    </p>
                    <span
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold sm:text-base"
                      style={{ color: t.cta }}
                    >
                      {ev.cta}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
