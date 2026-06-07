import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import BookingForm from "@/components/BookingForm";
import { getSeeker } from "@/lib/auth";
import FormCard from "@/components/FormCard";
import CounsellingPricing from "@/components/CounsellingPricing";

export const metadata: Metadata = {
  title: "Counselling — Spiritual Counselling Online from Rishikesh",
  description:
    "Spiritual counselling online with Acharya Bhagyashree Joshi Ji — couple counselling, pre-conception, yogic life, post-trauma, femininity, masculinity, and child-related counselling.",
};

const FIELDS = [
  { deva: "गृहस्थाश्रम", name: "Grihasthāshrama", text: "Couple counselling — navigating marriage, family duties, and shared dharma through the wisdom of the Grihastha āshrama." },
  { deva: "रजस्वला", name: "Rajaswalā", text: "Pre-conception counselling — preparing body, mind, and spirit for the journey of parenthood." },
  { deva: "साधक", name: "Sādhak", text: "Yogic life counselling — aligning your daily life with the principles of sādhana and self-inquiry." },
  { deva: "वैराग्य", name: "Vairāgya", text: "Post-trauma counselling — moving through loss and pain with the steadying gaze of dispassion." },
  { deva: "स्त्रीधर्म", name: "Strīdharma", text: "Femininity counselling — understanding the feminine principle through the Śāstras and living tradition." },
  { deva: "पुरुषधर्म", name: "Puruṣdharma", text: "Masculinity counselling — exploring the masculine ideal as taught in the Itihāsas and Purāṇas." },
  { deva: "बालसंस्कार", name: "Bālasaṁskāra", text: "Child-related counselling — guiding children through saṁskāras, education, and the shaping of character." },
];

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

      <section className="px-6 pb-4">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FIELDS.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-ink/8 bg-paper-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
                <p className="deva text-lg text-saffron">{f.deva}</p>
                <p className="display mt-2 text-lg text-ink">{f.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-ink-faint">
          Counselling is contemplative, not clinical — for medical or psychiatric
          care, please also consult a qualified professional.
        </p>
      </section>

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
