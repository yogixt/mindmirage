import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CourseCard from "@/components/CourseCard";
import { COURSES } from "@/lib/constants";

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
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-6xl grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c, i) => (
            <CourseCard key={c.slug} course={c} index={i} />
          ))}
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
