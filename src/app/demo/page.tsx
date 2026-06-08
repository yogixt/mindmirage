import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Platform Demo · Mind Mirage",
  robots: { index: false, follow: false },
};

const ENROLLED = [
  {
    slug: "bhagavad-gita",
    deva: "भगवद्गीता",
    title: "Bhagavad Gītā",
    tradition: "Vedanta",
    duration: "18 chapters · 12 weeks",
  },
  {
    slug: "yoga-sutras",
    deva: "योगसूत्र",
    title: "Yoga Sūtras",
    tradition: "Patañjali",
    duration: "196 sūtras · 10 weeks",
  },
];

const NOTIFICATIONS = [
  { kind: "booking", text: "Your consultation on June 12 has been confirmed.", at: "2 hours ago" },
  { kind: "assignment", text: "Yoga Sūtras Lesson 2 approved — marks: 88/100.", at: "Yesterday" },
  { kind: "class", text: "Live class on Bhagavad Gītā Chapter 3 starts in 2 hours.", at: "Today" },
];

const CLASSES = [
  { course: "Bhagavad Gītā", date: "2026-06-10", time: "18:00", zoomUrl: "#", note: "Chapter 3 — Karma Yoga" },
  { course: "Yoga Sūtras", date: "2026-06-12", time: "07:00", zoomUrl: "#", note: "Sūtra 1.12–1.16" },
];

const BOOKINGS = [
  { subject: "Personal Guidance", slot: "30 min", dates: "Jun 10, Jun 12", status: "approved", approvedDates: ["2026-06-12"] },
  { subject: "Doubt Clearing", slot: "15 min", dates: "Jun 15", status: "pending", approvedDates: [] },
];

const ASSIGNMENTS = [
  {
    slug: "bhagavad-gita",
    title: "Bhagavad Gītā",
    deva: "भगवद्गीता",
    currentLesson: 3,
    questions: "1. Explain the doctrine of Karma Yoga as described in Chapter 3.\n2. What is the significance of the phrase 'योगः कर्मसु कौशलम्'?\n3. Describe the relationship between action and detachment.",
    file: null,
    fileName: null,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    submissionStatus: null as "pending" | "approved" | "returned" | null,
    currentRemarks: null,
    lastReview: { lesson: 2, status: "approved", marks: 92, remarks: "Excellent grasp of the concept. Work on Sanskrit pronunciation." },
  },
];

const PRACTICES = [
  { id: "yama", deva: "यम", en: "Yama" },
  { id: "niyama", deva: "नियम", en: "Niyama" },
  { id: "daily-puja", deva: "नित्य पूजा", en: "Daily Puja" },
  { id: "naam-japa", deva: "नाम जप", en: "Naam Japa" },
  { id: "asana", deva: "आसन", en: "Āsana" },
  { id: "pranayama", deva: "प्राणायाम", en: "Prāṇāyāma" },
  { id: "meditation", deva: "ध्यान", en: "Meditation" },
  { id: "mindful-eating", deva: "मिताहार", en: "Mindful Eating" },
  { id: "journaling", deva: "लेखन", en: "Journaling" },
  { id: "rest", deva: "विश्राम", en: "Rest" },
];

const DAYS = ["M", "T", "W", "T", "F", "S", "today"];
const DAY_DEVA = ["सो", "मं", "बु", "गु", "शु", "श", "र"];

function SectionMarker({ number, en, sa }: { number: string; en: string; sa: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span className="eyebrow text-saffron">§ {number}</span>
      <span className="text-[11px] tracking-wide text-ink-faint">
        {en} <span className="deva ml-1 text-saffron">· {sa}</span>
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="display text-[1.65rem] leading-[1.1] text-ink sm:text-[1.85rem]">
      {children}
    </h2>
  );
}

function niceDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });
}

function niceTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function DemoPage() {
  const doneToday = 6;
  const progressPct = 60;

  return (
    <main className="min-h-screen bg-paper">
      <Navbar variant="solid" />

      {/* ── Cinematic greeting ── */}
      <section className="relative overflow-hidden border-b border-ink/[0.06] bg-paper-warm/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-saffron/[0.03] blur-3xl" />
          <div className="absolute left-0 bottom-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 rounded-full bg-gold/[0.03] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-10 sm:pt-32 sm:pb-14">
          <div className="max-w-2xl">
            <p className="deva text-lg text-saffron sm:text-xl">नमस्ते</p>
            <h1 className="display mt-2 text-[2.6rem] leading-[1.05] text-ink sm:text-[3.4rem]">
              Arjun,
              <br />
              <span className="italic text-ink-soft">welcome home.</span>
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-px w-8 bg-saffron/40" />
              <p className="text-xs tracking-wide text-ink-faint">Monday, 8 June 2026</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
          {/* ── Left column ── */}
          <div className="min-w-0 space-y-12">
            {/* Programs */}
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <SectionMarker number="01" en="Your studies" sa="स्वाध्याय" />
                  <SectionTitle>Your programs</SectionTitle>
                </div>
                <span className="mb-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
                  Browse all
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {ENROLLED.map((course) => (
                  <div
                    key={course.slug}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper transition-all duration-500 hover:-translate-y-1.5 hover:border-saffron/15 hover:shadow-[0_24px_80px_-32px_rgba(192,83,31,0.14)]"
                  >
                    <div className="h-1 w-full bg-gradient-to-r from-saffron via-gold to-saffron opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="p-5">
                      <p className="deva text-[13px] text-saffron">{course.deva}</p>
                      <h3 className="display mt-1 text-xl text-ink transition-colors group-hover:text-saffron">{course.title}</h3>
                      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint">{course.tradition}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
                        <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        {course.duration}
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-1.5 px-5 pb-5 text-xs font-medium text-saffron opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Continue
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Notifications */}
            <section>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="eyebrow text-saffron">§ 02</span>
                    <span className="text-[11px] tracking-wide text-ink-faint">Updates <span className="deva ml-1 text-saffron">· सूचना</span></span>
                  </div>
                  <SectionTitle>Notifications</SectionTitle>
                </div>
              </div>
              <ul className="space-y-2">
                {NOTIFICATIONS.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl border border-ink/[0.04] bg-paper-warm/40 px-4 py-3 transition-colors hover:border-ink/[0.08]">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-ink/[0.06] text-ink-faint">
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-ink-soft">{it.text}</p>
                      <p className="mt-1 text-[11px] text-ink-faint">{it.at}</p>
                    </div>
                    <span className={`mt-2 size-2 shrink-0 rounded-full ${it.kind === "booking" ? "bg-green-600" : it.kind === "assignment" ? "bg-saffron" : "bg-gold"}`} aria-hidden />
                  </li>
                ))}
              </ul>
            </section>

            {/* Upcoming classes */}
            <section>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="eyebrow text-saffron">§ 03</span>
                    <span className="text-[11px] tracking-wide text-ink-faint">Schedule <span className="deva ml-1 text-saffron">· काल</span></span>
                  </div>
                  <SectionTitle>Upcoming classes</SectionTitle>
                </div>
              </div>
              <ul className="space-y-3">
                {CLASSES.map((c, i) => (
                  <li key={i} className="group flex items-center gap-4 rounded-2xl border border-ink/[0.06] bg-paper p-4 transition-all duration-300 hover:border-saffron/15 hover:shadow-[0_12px_40px_-20px_rgba(192,83,31,0.1)]">
                    <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-paper-warm px-3.5 py-2.5 text-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-saffron">{niceDate(c.date)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{c.course}</p>
                      <p className="mt-0.5 text-xs text-ink-faint">{niceTime(c.time)} IST · {c.note}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-saffron px-5 py-2 text-xs font-medium text-white">Join</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Bookings */}
            <section>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="eyebrow text-saffron">§ 04</span>
                    <span className="text-[11px] tracking-wide text-ink-faint">Appointments <span className="deva ml-1 text-saffron">· संयोग</span></span>
                  </div>
                  <SectionTitle>My bookings</SectionTitle>
                </div>
              </div>
              <ul className="space-y-3">
                {BOOKINGS.map((b, i) => (
                  <li key={i} className="rounded-2xl border border-ink/[0.06] bg-paper p-5 transition-all duration-300 hover:border-saffron/15 hover:shadow-[0_12px_40px_-20px_rgba(192,83,31,0.1)]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-full bg-paper-warm">
                          <svg viewBox="0 0 24 24" className="size-3.5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </span>
                        <p className="text-sm font-semibold text-ink">{b.subject}</p>
                      </div>
                      <span className={b.status === "approved"
                        ? "rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-200"
                        : "rounded-full bg-gold/[0.08] px-3 py-1 text-[11px] font-semibold text-ink ring-1 ring-gold/20"}>
                        {b.status === "approved" ? "Confirmed" : "Awaiting confirmation"}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-ink-soft">{b.slot} · requested: {b.dates}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Assignments */}
            <section>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="eyebrow text-saffron">§ 05</span>
                    <span className="text-[11px] tracking-wide text-ink-faint">Practice <span className="deva ml-1 text-saffron">· अभ्यास</span></span>
                  </div>
                  <SectionTitle>Assignments</SectionTitle>
                </div>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-ink-soft">
                After each video lesson, submit your handwritten assignment — the next lesson unlocks once the team reviews it.
              </p>
              {ASSIGNMENTS.map((course) => (
                <div key={course.slug} className="overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper transition-all duration-300 hover:border-saffron/15 hover:shadow-[0_12px_40px_-20px_rgba(192,83,31,0.1)]">
                  <div className="h-1 w-full bg-gradient-to-r from-saffron via-gold to-saffron opacity-40" />
                  <div className="p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-full bg-paper-warm">
                          <svg viewBox="0 0 24 24" className="size-3.5 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                          </svg>
                        </span>
                        <p className="display text-base text-ink">{course.title}</p>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron">Lesson {course.currentLesson}</span>
                    </div>

                    {/* Approved previous lesson */}
                    <div className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-xs text-green-800 ring-1 ring-green-200">
                      <span className="font-semibold">Lesson {course.lastReview.lesson} approved · Marks: {course.lastReview.marks}/100</span>
                      <p className="mt-1 italic">&ldquo;{course.lastReview.remarks}&rdquo;</p>
                    </div>

                    {/* Questions */}
                    <div className="mt-3 rounded-xl bg-paper-warm/60 px-4 py-3">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{course.questions}</p>
                    </div>

                    {/* Upload button */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-xs font-medium text-white">
                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                        </svg>
                        Upload handwritten assignment
                      </span>
                      <span className="text-[11px] text-ink-faint">JPG or PNG — a clear photo of your pages</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Quick links */}
            <section>
              <SectionMarker number="06" en="Quick access" sa="मार्ग" />
              <SectionTitle>Paths forward</SectionTitle>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { href: "/vageshwari", title: "Vageshwari", deva: "वागेश्वरी", text: "Notes and news from the kuṭīr." },
                  { href: "/programs", title: "Offerings", deva: "अनुष्ठान", text: "Live and self-paced studies." },
                  { href: "/consultation", title: "Book a class", deva: "संयोग", text: "Pick dates on the calendar." },
                ].map((l) => (
                  <Link key={l.href} href={l.href} className="group relative overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper p-5 transition-all duration-500 hover:-translate-y-1 hover:border-saffron/15 hover:shadow-[0_20px_60px_-24px_rgba(192,83,31,0.12)]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="deva text-[11px] text-saffron">{l.deva}</p>
                        <h3 className="display mt-1 text-lg text-ink transition-colors group-hover:text-saffron">{l.title}</h3>
                      </div>
                      <span className="grid size-8 place-items-center rounded-full border border-ink/[0.08] text-ink-faint transition-all group-hover:border-saffron/30 group-hover:text-saffron">
                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ink-soft">{l.text}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Profile */}
            <section>
              <SectionMarker number="07" en="Your identity" sa="आत्मन्" />
              <SectionTitle>Your profile</SectionTitle>
              <div className="mt-5 space-y-4">
                {/* Profile card */}
                <div className="overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper transition-all duration-300 hover:border-saffron/15 hover:shadow-[0_12px_40px_-20px_rgba(192,83,31,0.1)]">
                  <div className="relative h-32 w-full sm:h-40">
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-saffron/[0.08] via-gold/[0.06] to-paper-warm" />
                  </div>
                  <div className="px-6 pb-6">
                    <div className="-mt-10 flex items-end justify-between">
                      <div className="relative">
                        <span className="block size-[4.5rem] overflow-hidden rounded-full bg-paper-warm ring-[3px] ring-paper sm:size-20">
                          <span className="grid h-full w-full place-items-center text-xl font-bold text-saffron">A</span>
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/[0.1] px-5 py-2 text-xs font-medium text-ink">
                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit profile
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-ink">Arjun Sharma</h3>
                    <p className="text-xs text-ink-faint">arjun@example.com</p>
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                      A seeker on the path of Vedanta. Practicing daily sādhanā for three years. Interested in the synthesis of Jñāna and Bhakti.
                    </p>
                    <p className="mt-4 rounded-xl bg-saffron/[0.04] px-4 py-3 text-sm italic text-saffron ring-1 ring-saffron/10">
                      <span className="deva mr-1.5 not-italic">सङ्कल्प</span>
                      One chapter of the Gita, every day.
                    </p>
                  </div>
                </div>

                {/* Profile details */}
                <div className="rounded-2xl border border-ink/[0.06] bg-paper-warm/40 p-5 sm:p-6">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div><dt className="eyebrow text-ink-faint">Phone</dt><dd className="mt-1.5 text-sm text-ink">+91 98765 43210</dd></div>
                    <div><dt className="eyebrow text-ink-faint">City</dt><dd className="mt-1.5 text-sm text-ink">Varanasi</dd></div>
                    <div className="sm:col-span-2"><dt className="eyebrow text-ink-faint">Preferred path</dt><dd className="mt-1.5 text-sm text-ink">Advaita Vedanta</dd></div>
                    <div className="sm:col-span-2"><dt className="eyebrow text-ink-faint">Why I seek</dt><dd className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-ink-soft">To understand the true nature of the Self and to live with clarity and peace.</dd></div>
                  </dl>
                  <button type="button" className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-ink/[0.1] px-5 py-2 text-xs font-medium text-ink transition-all hover:border-ink/30 hover:bg-paper">
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit details
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right column ── */}
          <div className="max-lg:order-first space-y-8 lg:sticky lg:top-24 lg:self-start">
            {/* Sadhana tracker */}
            <div className="relative mx-auto w-full max-w-2xl">
              <div className="rounded-2xl border-[5px] border-clay/20 bg-clay/5 shadow-[0_20px_50px_-20px_rgba(156,85,48,0.2)]">
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white via-white to-paper-warm p-5 sm:p-6">
                  <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-32 rotate-[25deg] bg-gradient-to-b from-saffron/[0.04] via-gold/[0.02] to-transparent" aria-hidden />
                  <span className="absolute left-3 top-3 size-2 rounded-full bg-saffron/30" aria-hidden />
                  <span className="absolute right-3 top-3 size-2 rounded-full bg-gold/40" aria-hidden />

                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="handwritten text-2xl font-bold text-ink sm:text-3xl">Today&apos;s sādhanā</h3>
                        <span className="deva text-sm text-saffron">साधना</span>
                      </div>
                      <svg viewBox="0 0 200 8" className="h-2 w-36 text-saffron/70" aria-hidden>
                        <path d="M3 5 C 50 2, 120 6, 197 3" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <p className="handwritten text-lg text-ink-soft">
                        <span className="font-bold text-ink">{doneToday}</span>
                        <span className="text-ink-faint">/{PRACTICES.length}</span>
                      </p>
                      <div className="mt-1 h-1 w-20 overflow-hidden rounded-full bg-ink/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-saffron to-gold transition-all duration-700" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-[minmax(0,1fr)_repeat(6,1.4rem)_2.5rem] items-center sm:grid-cols-[minmax(0,1fr)_repeat(6,1.7rem)_2.75rem]">
                    <span />
                    {DAYS.map((d, idx) => (
                      <span key={idx} className={`text-center ${d === "today" ? "text-[11px] font-bold text-saffron" : "text-[10px] text-ink-faint"}`}>
                        {d === "today" ? <span className="handwritten">today</span> : <span><span className="handwritten">{d}</span><span className="deva ml-0.5 text-[8px] opacity-60">{DAY_DEVA[idx]}</span></span>}
                      </span>
                    ))}
                    {PRACTICES.map((p, pi) => (
                      <span key={p.id} className="contents">
                        <span className="flex min-w-0 items-baseline gap-1.5 border-b border-dashed border-ink/10 py-1.5 pr-1">
                          <span className="deva shrink-0 text-[10px] leading-none text-saffron sm:text-[11px]">{p.deva}</span>
                          <span className="handwritten whitespace-nowrap text-sm text-ink sm:text-[15px]">{p.en}</span>
                        </span>
                        {DAYS.map((d, di) => {
                          const done = di < 5 || (di === 6 && pi < 6);
                          const isToday = d === "today";
                          if (!isToday) {
                            return (
                              <span key={di} className="grid h-full place-items-center border-b border-dashed border-ink/10">
                                <span className={`size-[7px] rounded-full transition-colors ${done ? "bg-saffron" : "bg-ink/[0.08]"}`} />
                              </span>
                            );
                          }
                          return (
                            <span key={di} className="grid h-full place-items-center border-b border-dashed border-ink/10">
                              <span className={`grid size-6 place-items-center rounded-full border-2 transition-all duration-300 ${done ? "border-saffron bg-saffron text-white shadow-sm shadow-saffron/20" : "border-ink/20 bg-transparent text-transparent"}`} style={{ borderRadius: "55% 45% 50% 50% / 50% 55% 45% 50%" }}>
                                <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            </span>
                          );
                        })}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mx-auto -mt-0.5 flex h-4 w-40 items-center justify-center gap-3 rounded-b-xl bg-clay/15 px-3">
                <span className="h-1.5 w-9 rounded-full bg-green-600/70" aria-hidden />
                <span className="h-1.5 w-9 rounded-full bg-saffron/70" aria-hidden />
                <span className="h-2 w-5 rounded-[2px] bg-ink/15" aria-hidden />
              </div>
            </div>

            {/* Mini wisdom card */}
            <div className="rounded-2xl border border-ink/[0.06] bg-paper p-6">
              <p className="deva text-[11px] text-saffron">प्रज्ञा</p>
              <p className="display mt-1 text-lg text-ink">Daily wisdom</p>
              <blockquote className="mt-3 border-l-2 border-gold pl-4 text-sm italic leading-relaxed text-ink-soft">
                &ldquo;The self is not attained by the weak, nor by the careless, nor by misdirected austerity.&rdquo;
              </blockquote>
              <p className="mt-2 text-[11px] text-ink-faint">— Muṇḍaka Upaniṣad</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
