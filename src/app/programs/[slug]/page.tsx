import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Divider from "@/components/Divider";
import CourseCta from "@/components/CourseCta";
import { CATALOG, MONTHLY_LIVE, formatINR } from "@/lib/constants";

export function generateStaticParams() {
  return CATALOG.map((c) => ({ slug: c.slug }));
}

/* Per-course search titles and descriptions — each targets the phrases
   sādhaks actually type (e.g. "Bhagavad Gita course online"). */
const SEO: Record<string, { title: string; description: string }> = {
  "yoga-sutras": {
    title: "Yoga Sutras Course Online — Classical Yoga Philosophy",
    description:
      "Study Patañjali's Yoga Sūtras online with a traditional teacher from Rishikesh. Self-paced classical yoga philosophy classes — all four pādas, with personal guidance.",
  },
  "bhagavad-gita": {
    title: "Bhagavad Gita Course Online — Study with a Teacher in India",
    description:
      "A self-paced Bhagavad Gita course online with an Advaita teacher from Rishikesh, India. Verse-by-verse study, handwritten assignments, personal replies.",
  },
  "advaita-vedanta": {
    title: "Advaita Vedanta Course Online — Non-Duality Classes",
    description:
      "Learn Advaita Vedanta online with a teacher in the lineage of Adi Shankaracharya, Rishikesh. Non-duality classes from Tattva-bodha to Vivekacūḍāmaṇi.",
  },
  meditation: {
    title: "Meditation Course from Rishikesh — Dhyāna Online",
    description:
      "A guided meditation course online from Rishikesh, India — posture, breath, and classical dhyāna in the Indian tradition, taught at your own pace.",
  },
  "sankhya-darshan": {
    title: "Sankhya Philosophy Course — Sankhya Darshan Online",
    description:
      "Study Sankhya Darshan online — Kapila's cosmology, puruṣa and prakṛti, the twenty-five tattvas — Indian philosophy taught from Rishikesh.",
  },
  buddhism: {
    title: "Buddhist Philosophy Course Online — Contemplative Study",
    description:
      "A contemplative Buddhist philosophy course online — the Buddha's teaching, meditation, and its conversation with Vedānta — from a Rishikesh teacher.",
  },
  "lalita-for-women": {
    title: "Spiritual Course for Women — Lalita & Feminine Wisdom",
    description:
      "Lalita for Women — a spiritual course for women in India and worldwide. Shakti, feminine wisdom, and sādhanā, taught online from Rishikesh.",
  },
  jyotisha: {
    title: "Vedic Astrology Course Online — Jyotisha Classes",
    description:
      "Learn Vedic astrology online — Jyotisha classes from Rishikesh, India, rooted in primary texts and taught with a traditional teacher's attention.",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const course = CATALOG.find((c) => c.slug === slug);
  if (!course) return { title: "Course" };
  const seo = SEO[slug];
  return {
    title: seo?.title ?? course.title,
    description: seo?.description ?? course.excerpt,
  };
}

export default async function CoursePage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const course = CATALOG.find((c) => c.slug === slug);
  if (!course) notFound();

  const liveVariant = MONTHLY_LIVE.find((l) => l.parentSlug === course.slug);

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />

      <section className="relative bg-paper pt-24 pb-3 px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/programs"
            className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
          >
            ← All programs
          </Link>
          <p className="eyebrow mt-4">{course.tradition}</p>
          <p className="deva mt-3 bg-gradient-to-r from-saffron via-gold to-saffron bg-clip-text text-3xl text-transparent sm:text-4xl">{course.deva}</p>
          <h1
            className="display mt-4 text-4xl text-ink sm:text-6xl"
            style={{ lineHeight: "1.0", letterSpacing: "-0.025em" }}
          >
            {course.title}
          </h1>
          <p className="mt-3 text-base text-ink-soft leading-relaxed sm:text-lg max-w-2xl">
            {course.excerpt}
          </p>
        </div>
      </section>

      <section className="px-6 py-4">
        <div className="mx-auto max-w-3xl grid gap-4 sm:grid-cols-3">
          <Stat label="Pace" value={course.duration.split("·")[0].trim()} />
          <Stat
            label="Prerequisites"
            value={course.prerequisites === "None." ? "None" : "Light"}
          />
          <Stat label="Tuition" value={formatINR(course.priceINR)} />
        </div>
        {course.formats && (
          <div className="mx-auto mt-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">Offered as</span>
              {course.formats.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-saffron/30 bg-saffron/5 px-4 py-1.5 text-xs font-medium text-saffron"
                >
                  {f}
                </span>
              ))}
            </div>
            {liveVariant && (
              <p className="mt-2 text-xs text-ink-soft">
                Live classes: <strong>{formatINR(liveVariant.priceINR)}/month</strong>
                {course.recordedAccess && (
                  <> · Recorded: <strong>{formatINR(course.priceINR)}</strong> ({course.recordedAccess} access with Zoom storage)</>
                )}
              </p>
            )}
            {!liveVariant && course.recordedAccess && (
              <p className="mt-2 text-xs text-ink-soft">
                {course.recordedAccess} access with Zoom storage
              </p>
            )}
            {!liveVariant && !course.recordedAccess && (
              <p className="mt-2 text-xs text-ink-faint">
                Live cohort dates are shared on enrolment — or ask us on WhatsApp.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="px-6 py-4">
        <div className="mx-auto max-w-3xl">
          {course.syllabus.length > 0 && (
            <>
              <p className="eyebrow">Syllabus</p>
              <ul className="mt-4 space-y-3">
                {course.syllabus.map((s, i) => (
                  <li key={i} className="flex gap-4 text-base text-ink leading-relaxed">
                    <span className="display text-gold w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Divider />
          <p className="text-sm text-ink-soft leading-relaxed">
            <strong className="text-ink">How it works:</strong> Enrol through the
            secure checkout. A confirmation email follows — with your live-class
            joining link, or your first self-paced lesson. The team handles
            everything from there.
          </p>
        </div>
      </section>

      {/* Enroll */}
      <section className="px-6 py-4 sm:py-4 bg-paper-warm">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">Enrol</p>
            <h2
              className="display mt-4 text-3xl text-ink sm:text-5xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Begin {course.title}.
            </h2>
          </div>
          <div className="mt-4">
            <CourseCta course={course} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/8 bg-paper-warm px-4 py-3">
      <p className="eyebrow">{label}</p>
      <p className="display mt-1 text-lg text-ink">{value}</p>
    </div>
  );
}
