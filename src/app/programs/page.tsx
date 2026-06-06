import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CourseCard from "@/components/CourseCard";
import { COURSES, SESSION_COURSES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Indian Philosophy Courses Online — Offerings",
  description:
    "Indian philosophy courses online from Rishikesh — Yoga Sūtras, Bhagavad Gītā, Advaita Vedānta, Meditation, Sānkhya, Buddhism, Lalitā, and Vedic astrology. Self-paced, with a traditional teacher.",
};

export default function ProgramsPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Offerings · स्वाध्याय"
        deva="कार्यक्रम"
        title={
          <>
            Our <span className="italic text-ink-soft">offerings.</span>
          </>
        }
        description={
          <>
            Each course is self-paced and held in the gurukulam rhythm: one lesson at
            a time, an assignment by hand, Acharya Ji&apos;s personal reading. No
            unlocking, no automation — just attention.
          </>
        }
      />
      {/* Live classes */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="eyebrow">Live classes · on Zoom</p>
            <h2 className="display mt-3 text-3xl text-ink sm:text-4xl">
              Studied <span className="italic text-ink-soft">together.</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
              These run as live cohorts on Zoom — and remain available
              self-paced if you prefer your own rhythm.
            </p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.filter((c) => c.formats).map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Self-paced classes */}
      <section className="bg-paper-warm px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="eyebrow">Self-paced · gurukulam rhythm</p>
            <h2 className="display mt-3 text-3xl text-ink sm:text-4xl">
              Studied at your <span className="italic text-ink-soft">own pace.</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
              One lesson at a time, an assignment by hand, Acharya Ji&apos;s
              personal reading between each.
            </p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COURSES.filter((c) => !c.formats).map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* One-to-one courses — taught live by Acharya Ji and the team */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="eyebrow">One-to-one · live on Zoom</p>
            <h2 className="display mt-3 text-3xl text-ink sm:text-4xl">
              Courses taught <span className="italic text-ink-soft">one-to-one.</span>
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
              Complete courses of eight live classes each, taught one-to-one by
              the Mind Mirage team. Timings are scheduled together after
              enrolment.
            </p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SESSION_COURSES.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </div>
          <p className="mt-5 text-center text-sm text-ink-soft">
            Looking for long-form mentorship?{" "}
            <Link href="/mentorship" className="text-saffron underline underline-offset-2">
              Apply here
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Booklist — part of the offerings */}
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-ink/10 bg-paper-warm p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Also in our offerings</p>
              <h2 className="display mt-2 text-2xl text-ink sm:text-3xl">
                The Booklist — primary texts from the ashram
              </h2>
              <p className="mt-2 max-w-xl text-sm text-ink-soft">
                The kuṭīr keeps a small stock of the primary texts in trusted
                editions. Ordered on WhatsApp; payment on confirmation.
              </p>
            </div>
            <Link
              href="/books"
              className="shrink-0 rounded-lg bg-saffron px-7 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              Browse the booklist
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
