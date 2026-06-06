import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import InternshipForm from "@/components/InternshipForm";

export const metadata: Metadata = {
  title: "Internship",
  description:
    "Remote 3-month internship program at Mind Mirage — content, Sanskrit, course material, community, and technical.",
};

const ROLES = [
  "Content research",
  "Sanskrit support",
  "Course material design",
  "Community moderation",
  "Technical support",
];

const BENEFITS = [
  "Free access to all self-paced courses",
  "Certificate of internship",
  "Acharya Ji's mentorship letter",
  "Community recognition badge",
];

export default function InternshipPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Internship · प्रशिक्षण"
        deva="इन्टर्नशिप"
        title={
          <>
            Three months <span className="italic text-ink-soft">in the courtyard.</span>
          </>
        }
        description={
          <>
            A 3-month remote internship at Mind Mirage. 10–15 hours a week. Real work
            on real materials, in the company of the tradition.
          </>
        }
      />

      <section className="px-6 py-8 sm:py-8">
        <div className="mx-auto max-w-4xl grid gap-12 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Roles available</p>
            <ul className="mt-6 space-y-3">
              {ROLES.map((r, i) => (
                <li key={r} className="flex gap-4 text-base text-ink">
                  <span className="display text-gold w-8">{String(i + 1).padStart(2, "0")}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">What you receive</p>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex gap-4 text-base text-ink">
                  <span className="display text-gold w-8">✦</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 sm:py-8 bg-paper-warm">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Apply</p>
          <h2
            className="display mt-4 text-3xl text-ink sm:text-5xl"
            style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
          >
            Begin the <span className="italic text-ink-soft">conversation.</span>
          </h2>
          <p className="mt-4 text-sm text-ink-soft">
            Reviewed personally. A short interview follows.
          </p>
        </div>
        <div className="mx-auto max-w-3xl mt-8">
          <InternshipForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
