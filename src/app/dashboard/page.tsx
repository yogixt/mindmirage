import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSeeker, isClerkConfigured } from "@/lib/auth";
import ProfileForm from "./ProfileForm";

export const metadata: Metadata = {
  title: "Seeker Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isClerkConfigured()) redirect("/sign-in");
  const seeker = await getSeeker();
  if (!seeker) redirect("/sign-in");

  const first = seeker.firstName?.trim() || "seeker";
  const hasEnrolments = seeker.enrolledCourses.length > 0;

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />

      <section className="pt-24 pb-8 px-6 sm:pt-24">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow animate-fade-rise opacity-0">
            Seeker dashboard
          </p>
          <p className="deva animate-fade-rise opacity-0 mt-5 text-2xl text-ink">
            नमस्ते
          </p>
          <h1 className="display animate-fade-rise-delay opacity-0 mt-4 text-4xl text-ink sm:text-6xl">
            {first}, <span className="italic text-ink-soft">welcome home.</span>
          </h1>
          <p className="animate-fade-rise-delay-2 opacity-0 mt-6 max-w-2xl text-base text-ink-soft sm:text-lg leading-relaxed">
            Your courses, sessions, and contemplative notes — gathered in one
            quiet place. The pace stays yours.
          </p>
        </div>
      </section>

      {/* ──────────  Enrolled programs  ────────── */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between border-b border-ink/10 pb-4">
            <h2 className="display text-2xl text-ink sm:text-3xl">
              Your programs
            </h2>
            <Link
              href="/programs"
              className="text-sm text-ink-soft hover:text-ink transition-colors"
            >
              Browse all →
            </Link>
          </div>

          {hasEnrolments ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {seeker.enrolledCourses.map((course) => (
                <Link
                  key={course.slug}
                  href={`/programs/${course.slug}`}
                  className="group rounded-2xl border border-ink/10 bg-paper-warm/40 p-5 transition-colors hover:border-ink/30"
                >
                  <p className="deva text-lg text-ink-soft">{course.deva}</p>
                  <h3 className="display mt-2 text-2xl text-ink group-hover:italic">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-widest text-ink-faint">
                    {course.tradition}
                  </p>
                  <p className="mt-4 text-sm text-ink-soft line-clamp-3">
                    {course.excerpt}
                  </p>
                  <p className="mt-5 text-xs text-ink-faint">
                    {course.duration}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-dashed border-ink/15 bg-paper-warm/30 px-8 py-8 text-center">
              <p className="deva text-xl text-ink-soft">अथ</p>
              <p className="mt-3 display text-2xl text-ink">
                Begin where you stand.
              </p>
              <p className="mt-3 max-w-md mx-auto text-sm text-ink-soft">
                Choose a program to begin. Each enrolment is reviewed by
                Acharya Ji personally — no automated unlock.
              </p>
              <Link
                href="/programs"
                className="mt-6 inline-flex rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
              >
                Choose a program
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ──────────  Profile  ────────── */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-14">
            <div>
              <h2 className="display text-2xl text-ink sm:text-3xl">
                Your profile
              </h2>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                Tell Acharya Ji a little about where you sit and what draws you
                here. This stays between you and the kuṭīr.
              </p>
              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="eyebrow text-ink-faint">Name</dt>
                  <dd className="mt-1 text-ink">{seeker.fullName}</dd>
                </div>
                {seeker.email && (
                  <div>
                    <dt className="eyebrow text-ink-faint">Email</dt>
                    <dd className="mt-1 text-ink">{seeker.email}</dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="rounded-2xl border border-ink/10 bg-paper-warm/40 p-6">
              <ProfileForm metadata={seeker.metadata} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
