import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Acharya Bhagyashree Joshi Ji, institutional mentors, and the core team of Mind Mirage.",
};

const MENTORS = [
  {
    name: "Institutional Mentors",
    description:
      "Mind Mirage works in conversation with senior teachers and scholars in the Advaita and broader Indian philosophical traditions. Names will be added here as their consent and contribution is published.",
  },
  {
    name: "Core Team",
    description:
      "Acharya Ji is supported by a small core team of seekers and volunteers who hold the day-to-day work — assignments, communications, content, and the Rishikesh courtyard itself.",
  },
];

export default function OurTeamPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Our team · परिवार"
        deva="आचार्या एवं सहयोगी"
        title={
          <>
            The people <span className="italic text-ink-soft">behind the work.</span>
          </>
        }
      />

      <section className="px-6 py-5 sm:py-5">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-5 sm:items-start">
            <div className="sm:col-span-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-ink/10">
                <Image
                  src="/acharya-ji.jpg"
                  alt="Acharya Bhagyashree Joshi Ji by the Ganga in Rishikesh"
                  fill
                  sizes="(min-width: 640px) 40vw, 100vw"
                  className="object-cover object-[28%_center]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent px-4 pb-3 pt-8">
                  <p className="deva text-sm text-paper">आचार्य भाग्यश्री जोशी जी</p>
                </div>
              </div>
            </div>
            <div className="sm:col-span-3">
              <p className="eyebrow">Founder · Teacher</p>
              <h2 className="display mt-4 text-3xl text-ink sm:text-4xl">
                {SITE.founder}
              </h2>
              <p className="mt-6 text-base text-ink-soft leading-relaxed">
                Acharya Bhagyashree Joshi Ji is a teacher in the Advaita lineage of
                Adi Shankarācārya. She studies and teaches Yoga, Vedānta, Sanskrit,
                Sānkhya, and the contemplative traditions of the Indian Knowledge
                System — from her seat at Advaita Sādhanā Kuṭīr in Rishikesh.
              </p>
              <p className="mt-4 text-base text-ink-soft leading-relaxed">
                Her teaching is rooted in primary texts, but its register is
                intimate. She works with seekers one at a time, in the rhythm of
                the gurukulam — a lesson sent personally, an assignment read
                personally, a reply written by hand.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            {MENTORS.map((m) => (
              <div key={m.name} className="border-t border-ink/8 pt-8">
                <p className="eyebrow">{m.name}</p>
                <p className="mt-4 text-base text-ink-soft leading-relaxed max-w-3xl">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
