import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Consultation — One-on-One Classes with Acharya Ji on Zoom",
  description:
    "Book a one-on-one Vedanta consultation from Rishikesh, India — personal classes with Acharya Bhagyashree Joshi Ji on Zoom. Meditation, prāṇāyāma, jyotiṣa, contemplation.",
};

export default function ConsultationPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Sit with Guruji · Consultation"
        deva="व्यक्तिगत मार्गदर्शन"
        title={
          <>
            From the Guru&apos;s <span className="italic text-ink-soft">lips.</span>
          </>
        }
        description={
          <>
            One-to-one classes with Acharya Ji on Zoom — every subject taken as
            a course of eight classes. Browse the fields and per-class fees
            under{" "}
            <Link
              href="/programs"
              className="text-saffron underline underline-offset-2"
            >
              Offerings
            </Link>
            , then book below.
          </>
        }
      />

      <section className="bg-paper-warm px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">Request your classes</p>
            <h2
              className="display mt-4 text-3xl text-ink sm:text-5xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Begin the <span className="italic text-ink-soft">course.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink-soft">
              Acharya Ji will confirm or propose alternatives within 24 hours.
              Zoom links are shared on confirmation.
            </p>
          </div>
          <div className="mt-8">
            <BookingForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
