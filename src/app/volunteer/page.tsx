import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import VolunteerForm from "@/components/VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer · Seva",
  description: "Offer seva to Mind Mirage — selfless service in the gurukulam tradition.",
};

const ROLES = [
  "Community support",
  "WhatsApp group management",
  "Event coordination",
  "Translation (vernacular outreach)",
  "Social media seva",
];

export default function VolunteerPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Seva · सेवा"
        deva="स्वयंसेवा"
        title={
          <>
            Offered, <span className="italic text-ink-soft">freely.</span>
          </>
        }
        description={
          <>
            Seva is the spirit of selfless service that holds the gurukulam together.
            Mind Mirage welcomes seekers who would like to give time, skill, or
            attention — in whatever measure they can.
          </>
        }
      />

      <section className="px-6 py-5 sm:py-5">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">Forms of seva</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {ROLES.map((r) => (
              <li
                key={r}
                className="rounded-xl border border-ink/8 bg-paper-warm px-5 py-4 text-base text-ink"
              >
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-soft leading-relaxed">
            Recognition: a seva badge, acknowledgement in publications, and a
            personal note of appreciation from Acharya Ji each year.
          </p>
        </div>
      </section>

      <section className="px-6 py-5 sm:py-5 bg-paper-warm">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Offer seva</p>
          <h2
            className="display mt-4 text-3xl text-ink sm:text-5xl"
            style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
          >
            A short note <span className="italic text-ink-soft">to begin.</span>
          </h2>
        </div>
        <div className="mx-auto max-w-3xl mt-5">
          <VolunteerForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
