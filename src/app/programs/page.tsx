import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CourseCard from "@/components/CourseCard";
import AddToCartButton from "@/components/AddToCartButton";
import { COURSES, GUIDANCE_SUBJECTS } from "@/lib/constants";

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
              These run as live cohorts with Acharya Ji on Zoom — and remain
              available self-paced if you prefer your own rhythm.
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

      {/* One-to-one classes — part of the offerings */}
      <section className="bg-paper-warm px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="eyebrow">1:1 with Acharya Ji</p>
            <h2 className="display mt-3 text-3xl text-ink sm:text-4xl">
              Choose the field of inquiry
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-soft">
              Every subject is a complete one-to-one course of{" "}
              <strong className="text-ink">eight classes</strong> on Zoom — add
              to your basket and check out; timings are scheduled together
              after enrolment.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {GUIDANCE_SUBJECTS.map((s) => (
              <div
                key={s.slug}
                className="flex items-center justify-between gap-3 rounded-xl border border-ink/8 bg-paper px-5 py-4"
              >
                <div className="min-w-0">
                  {s.deva && <p className="deva text-base text-ink">{s.deva}</p>}
                  <p className="display text-lg text-ink">{s.name}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {s.priceINR
                      ? `₹${s.priceINR.toLocaleString("en-IN")}`
                      : s.notes ?? ""}
                  </p>
                </div>
                {s.priceINR ? (
                  <AddToCartButton
                    slug={`1on1-${s.slug}`}
                    variant="secondary"
                    className="shrink-0"
                  />
                ) : (
                  <Link
                    href="/mentorship"
                    className="shrink-0 rounded-lg border border-ink/15 px-4 py-2 text-xs text-ink transition-colors hover:border-ink"
                  >
                    Apply
                  </Link>
                )}
              </div>
            ))}
          </div>
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
