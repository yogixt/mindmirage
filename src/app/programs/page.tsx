import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CourseCard from "@/components/CourseCard";
import { COURSES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Indian Philosophy Courses Online — Programs",
  description:
    "Indian philosophy courses online from Rishikesh — Yoga Sūtras, Bhagavad Gītā, Advaita Vedānta, Meditation, Sānkhya, Buddhism, Lalitā, and Vedic astrology. Self-paced, with a traditional teacher.",
};

export default function ProgramsPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="स्वाध्याय · Svādhyāya"
        deva="कार्यक्रम"
        title={
          <>
            All <span className="italic text-ink-soft">eight</span> studies.
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
      <section className="px-6 pb-8 sm:pb-32">
        <div className="mx-auto max-w-6xl grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c, i) => (
            <CourseCard key={c.slug} course={c} index={i} />
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
