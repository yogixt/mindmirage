import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";
import { getSeeker } from "@/lib/auth";
import FormCard from "@/components/FormCard";
import CounsellingPricing from "@/components/CounsellingPricing";
import CounsellingFields from "@/components/CounsellingFields";

export const metadata: Metadata = {
  title: "Counselling — Spiritual Counselling Online from Rishikesh",
  description:
    "Spiritual counselling online with Acharya Bhagyashree Joshi Ji — couple counselling, pre-conception, yogic life, post-trauma, femininity, masculinity, and child-related counselling.",
};

export const dynamic = "force-dynamic";

export default async function CounsellingPage() {
  const seeker = await getSeeker();
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Sit with Guruji · Counselling"
        deva="परामर्श"
        title={
          <>
            When life needs a <span className="italic text-ink-soft">listening.</span>
          </>
        }
        description={
          <>
            One-to-one counselling with Acharya Ji on Zoom — life&apos;s
            difficulties held through the steady lens of the teaching, with the
            confidentiality of a private room.
          </>
        }
      />

      <CounsellingPricing />

      <CounsellingFields />

      <section className="bg-paper-warm px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">Request counselling</p>
            <h2
              className="display mt-4 text-3xl text-ink sm:text-5xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Take the first <span className="italic text-ink-soft">step.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink-soft">
              The team will confirm or propose alternatives within 24 hours.
              Zoom links are shared on confirmation.
            </p>
          </div>
          <div className="mt-4">
            <FormCard subtitle="Request counselling">
              <BookingForm signedIn={!!seeker} enrolled={(seeker?.metadata.enrolledPrograms ?? []).filter(Boolean)} />
            </FormCard>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
