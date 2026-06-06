import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSeeker, isClerkConfigured } from "@/lib/auth";
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
  { href: "/newsletters", title: "Newsletters", text: "Notes and news from the kuṭīr." },
  { href: "/programs", title: "Offerings", text: "Live and self-paced studies." },
  { href: "/consultation", title: "Book a class", text: "Pick dates on the calendar." },
];

export default async function DashboardPage() {
  if (!isClerkConfigured()) redirect("/sign-in");
  const seeker = await getSeeker();
  if (!seeker) redirect("/sign-in");

  const first = seeker.firstName?.trim() || "sādhak";
  const hasEnrolments = seeker.enrolledCourses.length > 0;

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />

      <div className="mx-auto max-w-6xl px-6 pt-24 pb-8">
        {/* Compact greeting */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="deva animate-fade-rise opacity-0 text-xl text-saffron">नमस्ते</p>
          <h1 className="display animate-fade-rise opacity-0 text-3xl text-ink sm:text-4xl">
            {first}, <span className="italic text-ink-soft">welcome home.</span>
          </h1>
        </div>

        {/* One-page grid: everything left, sticky note right */}
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-6">
          {/* ── Left column ── */}
          <div className="min-w-0 space-y-6">
            {/* Your programs */}
            <section>
              <div className="flex items-end justify-between border-b border-ink/10 pb-2">
                <h2 className="display text-xl text-ink sm:text-2xl">Your programs</h2>
                <Link
                  href="/programs"
                  className="text-xs text-ink-soft transition-colors hover:text-ink"
                >
                  Browse all →
                </Link>
              </div>

              {hasEnrolments ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {seeker.enrolledCourses.map((course) => (
                    <Link
                      key={course.slug}
                      href={`/programs/${course.slug}`}
                      className="group rounded-xl border border-ink/10 bg-paper-warm/40 p-4 transition-colors hover:border-ink/30"
                    >
                      <p className="deva text-sm text-ink-soft">{course.deva}</p>
                      <h3 className="display mt-1 text-lg text-ink group-hover:italic">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-ink-faint">
                        {course.tradition}
                      </p>
                      <p className="mt-2 text-xs text-ink-faint">{course.duration}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-ink/15 bg-paper-warm/30 px-6 py-4 text-center">
                  <p className="deva text-lg text-ink-soft">अथ</p>
                  <p className="display mt-1 text-xl text-ink">Begin where you stand.</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
                    Choose a course to begin. A confirmation email follows every
                    enrolment — the team handles the rest.
                  </p>
                  <Link
                    href="/programs"
                    className="mt-4 inline-flex rounded-full bg-saffron px-7 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03]"
                  >
                    Choose a course
                  </Link>
                </div>
              )}
            </section>

            {/* Notification log */}
            <Notifications />

            {/* Upcoming live classes */}
            <UpcomingClasses />

            {/* Slot requests and confirmations */}
            <MyBookings />

            {/* Assignments — self-paced flow */}
            <AssignmentsPanel />

            {/* Quick links */}
            <section className="grid gap-3 sm:grid-cols-3">
              {QUICK_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group rounded-xl border border-ink/8 bg-paper p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_14px_40px_-24px_rgba(0,0,0,0.35)]"
                >
                  <h3 className="display text-base text-ink">{l.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{l.text}</p>
                </Link>
              ))}
            </section>

            {/* Profile — Facebook style */}
            <section>
              <div className="border-b border-ink/10 pb-2">
                <h2 className="display text-xl text-ink sm:text-2xl">Your profile</h2>
              </div>
              <div className="mt-3">
                <ProfileCard
                  name={seeker.fullName}
                  email={seeker.email ?? ""}
                  fallbackImage={seeker.imageUrl}
                />
              </div>
              <div className="mt-3 rounded-xl border border-ink/10 bg-paper-warm/40 p-4 sm:p-5">
                <ProfileForm metadata={seeker.metadata} />
              </div>
            </section>
          </div>

          {/* ── Right column: the sticky note (first on mobile) ── */}
          <div className="max-lg:order-first lg:sticky lg:top-24 lg:self-start">
            <SadhanaTracker />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
