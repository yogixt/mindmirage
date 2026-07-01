import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";
import { getSeeker } from "@/lib/auth";
import FormCard from "@/components/FormCard";

export const metadata: Metadata = {
  title: "Consultation — Book Your Session",
  description:
    "Book a Vedanta consultation or one-to-one class with the Mind Mirage team from Rishikesh, India — live sessions on Zoom.",
};

export const dynamic = "force-dynamic";

export default async function ConsultationPage() {
  const seeker = await getSeeker();
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
            Live one-to-one sessions on Zoom — classes, guidance, and
            counselling, all held in the warmth of the Guru-Śiṣya Paramparā.
            Browse the fields under{" "}
            <Link
              href="/programs"
              className="text-saffron underline underline-offset-2"
            >
              Offerings
            </Link>
            , then choose your dates below.
          </>
        }
      />

      <section className="bg-paper-warm px-6 py-6 sm:py-10">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="eyebrow">Request your session</p>
            <h2
              className="display mt-4 text-3xl text-ink sm:text-5xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Choose your <span className="italic text-ink-soft">time.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-ink-soft">
              Pick your subject, see your slot, and select the dates that work
              for you. The team will confirm or propose alternatives within 24
              hours.
            </p>
          </div>
          <div className="mt-6">
            <FormCard subtitle="Book your consultation">
              <BookingForm
                signedIn={!!seeker}
                enrolled={(seeker?.metadata.enrolledPrograms ?? []).filter(
                  Boolean,
                )}
              />
            </FormCard>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
