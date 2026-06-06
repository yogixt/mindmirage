import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import MentorshipForm from "@/components/MentorshipForm";

export const metadata: Metadata = {
  title: "1:1 Mentorship",
  description: "Application-based long-form mentorship with Acharya Bhagyashree Joshi Ji.",
};

export default function MentorshipPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Sit with Guruji · Mentorship"
        deva="आचार्य संरक्षण"
        title={
          <>
            Walked <span className="italic text-ink-soft">slowly</span>, one to one.
          </>
        }
        description={
          <>
            A long-form bond with Acharya Ji for seekers committed to deep, sustained
            practice. Custom in shape and duration. Reviewed personally — not every
            application is accepted, and that is part of the care.
          </>
        }
      />

      <section className="px-6 py-8 sm:py-8 bg-paper-warm">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Apply</p>
          <h2
            className="display mt-4 text-3xl text-ink sm:text-5xl"
            style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
          >
            A short letter <span className="italic text-ink-soft">to begin.</span>
          </h2>
        </div>
        <div className="mx-auto max-w-3xl mt-8">
          <MentorshipForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
