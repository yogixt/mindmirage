import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CourseCard from "@/components/CourseCard";
import EditorialHeader from "@/components/EditorialHeader";
import { COURSES, SESSION_COURSES, BOOK_SETS, CONSULTATION_PRODUCTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Indian Philosophy & Yoga Courses Online — Mind Mirage | Rishikesh",
  description:
    "Online courses in Advaita Vedanta, Yoga Sutras, Bhagavad Gita, Meditation, Sanskrit, Buddhism, Jyotish & more. Self-paced & live Zoom classes with Acharya Bhagyashree Joshi Ji at Advaita Sadhana Kutir, Rishikesh.",
  keywords: [
    "Advaita Vedanta course online",
    "Yoga Sutras online course India",
    "Bhagavad Gita classes Rishikesh",
    "Meditation course online",
    "Sanskrit learning online",
    "Indian philosophy courses",
    "Vedanta teacher online",
    "spiritual courses India",
    "Jyotish course online",
    "Lalita Sahasranama classes",
    "Buddhism philosophy course",
    "Sankhya Darshan course",
    "Yoga teacher training Rishikesh",
    "ashram courses India",
    "Guru Shishya Parampara courses",
  ],
  alternates: { canonical: "https://mindmirageindia.com/programs" },
  openGraph: {
    title: "Indian Philosophy & Yoga Courses — Mind Mirage | Rishikesh",
    description:
      "Study Advaita Vedanta, Yoga Sutras, Bhagavad Gita & more — self-paced & live Zoom courses in the Guru-Shishya tradition.",
    url: "https://mindmirageindia.com/programs",
    siteName: "Mind Mirage",
    type: "website",
    images: [{ url: "https://mindmirageindia.com/og-programs.jpg", width: 1200, height: 630 }],
  },
};

export default function ProgramsPage() {
  const liveCourses = COURSES.filter((c) => c.formats);
  const selfPaced = COURSES.filter((c) => !c.formats);

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="§ 01 · Offerings · स्वाध्याय"
        deva="कार्यक्रम"
        title={
          <>
            Our <span className="italic text-saffron">offerings.</span>
          </>
        }
        description={
          <>
            Each course is self-paced and held in the gurukulam rhythm: one lesson at
            a time, an assignment by hand, Acharya Ji&apos;s personal reading.
          </>
        }
      />

      {/* Live classes */}
      <section className="px-6 pb-4 pt-2">
        <div className="mx-auto max-w-6xl">
          <EditorialHeader
            eyebrow="§ 02 · Live classes · on Zoom"
            title={
              <>
                Studied <span className="italic text-ink-soft">together.</span>
              </>
            }
            subtitle="These run as live cohorts on Zoom — and remain available self-paced if you prefer your own rhythm."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveCourses.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Self-paced */}
      <section className="bg-paper-warm px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <EditorialHeader
            eyebrow="§ 03 · Self-paced · gurukulam rhythm"
            title={
              <>
                Studied at your <span className="italic text-ink-soft">own pace.</span>
              </>
            }
            subtitle="One lesson at a time, an assignment by hand, Acharya Ji's personal reading between each."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selfPaced.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 1-on-1 sessions */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <EditorialHeader
            eyebrow="§ 04 · Personal guidance · one-to-one"
            title={
              <>
                Eight classes <span className="italic text-ink-soft">each.</span>
              </>
            }
            subtitle="Live one-to-one sessions on Zoom — personal guidance in meditation, pranayama, asanas, Ayurveda, Jyotish, and more."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SESSION_COURSES.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Consultations */}
      <section className="bg-paper-warm px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <EditorialHeader
            eyebrow="§ 05 · Consultation · with Guruji"
            title={
              <>
                One-to-one <span className="italic text-ink-soft">with Acharya Ji.</span>
              </>
            }
            subtitle="Single sessions and multi-session packs for direct guidance on Zoom."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONSULTATION_PRODUCTS.map((c, i) => (
              <CourseCard key={c.slug} course={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Booklist CTA */}
      <section className="px-6 pb-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col justify-center rounded-2xl border border-ink/[0.06] bg-paper-warm p-6 sm:p-8">
              <p className="eyebrow">§ 06 · Also in our offerings</p>
              <h2 className="display mt-3 text-xl text-ink sm:text-2xl">
                The Booklist — primary texts from the ashram
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Three curated sets — Beginner, Intermediate, Advanced. Selected by
                Acharya Ji to support your sādhanā at every stage.
              </p>
              <Link
                href="/books"
                className="mt-4 w-fit rounded-full bg-saffron px-6 py-2.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
              >
                Browse the booklist →
              </Link>
            </div>
            <div className="grid gap-3">
              {BOOK_SETS.map((b) => (
                <Link
                  key={b.slug}
                  href="/books"
                  className="group flex items-center justify-between rounded-xl border border-ink/[0.06] bg-paper p-4 transition-all hover:border-saffron/15 hover:shadow-[0_12px_40px_-20px_rgba(192,83,31,0.12)]"
                >
                  <div>
                    <p className="deva text-base text-ink">{b.deva}</p>
                    <p className="display text-base text-ink">{b.title}</p>
                  </div>
                  <span className="display text-lg text-ink">
                    ₹{b.priceINR.toLocaleString("en-IN")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
