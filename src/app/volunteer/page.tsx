import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import VolunteerForm from "@/components/VolunteerForm";
import FormCard from "@/components/FormCard";

export const metadata: Metadata = {
  title: "Karma Yoga · Seva",
  description: "Karma yoga at Mind Mirage — selfless service in the gurukulam tradition.",
};

const ROLES = [
  "Technical support",
  "Community support",
  "WhatsApp group management",
  "Event coordination",
  "Translation (vernacular outreach)",
  "Social media seva",
  "Content and design",
  "Photography and video",
  "Many more — tell us your skill",
];

export default function VolunteerPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Karma Yoga · कर्म योग"
        deva="स्वयंसेवा"
        title={
          <>
            Offered, <span className="italic text-ink-soft">freely.</span>
          </>
        }
        description={
          <>
            Seva is the spirit of selfless service that holds the gurukulam together.
            Mind Mirage welcomes sādhaks who would like to give time, skill, or
            attention — in whatever measure they can.
          </>
        }
      />

      <section className="px-6 py-4 sm:py-4">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Forms of karma yoga</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ROLES.map((r) => (
              <li
                key={r}
                className="rounded-xl border border-ink/8 bg-paper-warm px-5 py-4 text-base text-ink"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-4 sm:py-4 bg-paper-warm">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Offer karma yoga</p>
          <h2
            className="display mt-4 text-3xl text-ink sm:text-5xl"
            style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
          >
            A short note <span className="italic text-ink-soft">to begin.</span>
          </h2>
        </div>
        <div className="mx-auto max-w-3xl mt-4">
          <FormCard subtitle="Offer your karma yoga">
            <VolunteerForm />
          </FormCard>
        </div>
      </section>
      <Footer />
    </main>
  );
}
