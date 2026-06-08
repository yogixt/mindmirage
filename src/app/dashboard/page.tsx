import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSeeker } from "@/lib/auth";
import ProfileForm from "./ProfileForm";
import SadhanaTracker from "./SadhanaTracker";
import AssignmentsPanel from "./AssignmentsPanel";
import UpcomingClasses from "./UpcomingClasses";
import MyBookings from "./MyBookings";
import Notifications from "./Notifications";
import ProfileCard from "./ProfileCard";

export const metadata: Metadata = {
  title: "Sādhak Dashboard",
};

export const dynamic = "force-dynamic";

const QUICK_LINKS = [
  {
    href: "/vageshwari",
    title: "Vageshwari",
    deva: "वागेश्वरी",
    text: "Notes and news from the kuṭīr.",
  },
  {
    href: "/programs",
    title: "Offerings",
    deva: "अनुष्ठान",
    text: "Live and self-paced studies.",
  },
  {
    href: "/consultation",
    title: "Book a class",
    deva: "संयोग",
    text: "Pick dates on the calendar.",
  },
];

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

export default async function DashboardPage() {
  const seeker = await getSeeker();
  if (!seeker) redirect("/sign-in");

  const first = seeker.firstName?.trim() || "sādhak";
  const hasEnrolments = seeker.enrolledCourses.length > 0;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
            <p className="deva animate-fade-rise opacity-0 text-lg text-saffron sm:text-xl">
              नमस्ते
            </p>
            <h1 className="display animate-fade-rise-delay opacity-0 mt-2 text-[2.6rem] leading-[1.05] text-ink sm:text-[3.4rem]">
              {first},
              <br />
              <span className="italic text-ink-soft">welcome home.</span>
            </h1>
            <div className="mt-5 flex items-center gap-3 animate-fade-rise-delay-2 opacity-0">
              <div className="h-px w-8 bg-saffron/40" />
              <p className="text-xs tracking-wide text-ink-faint">{today}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
          {/* ── Left column ── */}
          <div className="min-w-0 space-y-12">
            {/* Your programs */}
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <SectionMarker number="01" en="Your studies" sa="स्वाध्याय" />
                  <SectionTitle>Your programs</SectionTitle>
                </div>
                <Link
                  href="/programs"
                  className="group mb-1 inline-flex items-center gap-1.5 text-xs text-ink-soft transition-colors hover:text-saffron"
                >
                  Browse all
                  <svg viewBox="0 0 24 24" className="size-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {hasEnrolments ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {seeker.enrolledCourses.map((course) => (
                    <Link
                      key={course.slug}
                      href={`/programs/${course.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper transition-all duration-500 hover:-translate-y-1.5 hover:border-saffron/15 hover:shadow-[0_24px_80px_-32px_rgba(192,83,31,0.14)]"
                    >
                      <div className="h-1 w-full bg-gradient-to-r from-saffron via-gold to-saffron opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="p-5">
                        <p className="deva text-[13px] text-saffron">{course.deva}</p>
                        <h3 className="display mt-1 text-xl text-ink transition-colors group-hover:text-saffron">
                          {course.title}
                        </h3>
                        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-ink-faint">
                          {course.tradition}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
                          <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
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
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-2xl border border-dashed border-ink/10 bg-paper-warm/30 px-8 py-10 text-center">
                  <p className="deva text-2xl text-saffron">अथ</p>
                  <p className="display mt-2 text-2xl text-ink">Begin where you stand.</p>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
                    Choose a course to begin your journey. A confirmation email follows every
                    enrolment — the team handles the rest.
                  </p>
                  <Link
                    href="/programs"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-saffron px-8 py-3 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-saffron/20"
                  >
                    Choose a course
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </section>

            {/* Notifications */}
            <Notifications />

            {/* Upcoming live classes */}
            <UpcomingClasses />

            {/* Slot requests */}
            <MyBookings />

            {/* Assignments */}
            <AssignmentsPanel />

            {/* Quick links */}
            <section>
              <SectionMarker number="06" en="Quick access" sa="मार्ग" />
              <SectionTitle>Paths forward</SectionTitle>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {QUICK_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group relative overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper p-5 transition-all duration-500 hover:-translate-y-1 hover:border-saffron/15 hover:shadow-[0_20px_60px_-24px_rgba(192,83,31,0.12)]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="deva text-[11px] text-saffron">{l.deva}</p>
                        <h3 className="display mt-1 text-lg text-ink transition-colors group-hover:text-saffron">
                          {l.title}
                        </h3>
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
                <ProfileCard
                  name={seeker.fullName}
                  email={seeker.email ?? ""}
                  fallbackImage={seeker.imageUrl}
                />
                <div className="rounded-2xl border border-ink/[0.06] bg-paper-warm/40 p-5 sm:p-6">
                  <ProfileForm metadata={seeker.metadata} />
                </div>
              </div>
            </section>
          </div>

          {/* ── Right column: sticky ── */}
          <div className="max-lg:order-first space-y-8 lg:sticky lg:top-24 lg:self-start">
            <SadhanaTracker />

            {/* Mini wellness card */}
            <div className="rounded-2xl border border-ink/[0.06] bg-paper p-6">
              <p className="deva text-[11px] text-saffron">प्रज्ञा</p>
              <p className="display mt-1 text-lg text-ink">Daily wisdom</p>
              <blockquote className="mt-3 border-l-2 border-gold pl-4 text-sm italic leading-relaxed text-ink-soft">
                &ldquo;The self is not attained by the weak, nor by the careless, nor by misdirected
                austerity.&rdquo;
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
