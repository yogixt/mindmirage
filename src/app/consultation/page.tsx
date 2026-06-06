import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";
import { GUIDANCE_SUBJECTS, SLOTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Consultation — One-on-One Sessions with Acharya Ji on Zoom",
  description:
    "Book a one-on-one Vedanta consultation from Rishikesh, India — personal sessions with Acharya Bhagyashree Joshi Ji on Zoom. Meditation, prāṇāyāma, jyotiṣa, contemplation.",
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
            One-to-one sessions with Acharya Ji on Zoom. Personal guidance, direct
            answers, the warmth of the traditional Guru-Sishya Paramparā.
          </>
        }
      />

      <section className="px-6 py-8 sm:py-8 bg-paper-warm">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="eyebrow">Subjects offered</p>
            <h2 className="display mt-4 text-3xl text-ink sm:text-4xl">
              Choose the field of inquiry
            </h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {GUIDANCE_SUBJECTS.map((s) => (
              <div
                key={s.slug}
                className="flex items-center justify-between rounded-xl border border-ink/8 bg-paper px-5 py-4"
              >
                <div>
                  {s.deva && <p className="deva text-base text-ink">{s.deva}</p>}
                  <p className="display text-lg text-ink">{s.name}</p>
                </div>
                <p className="text-sm text-ink-soft">
                  {s.priceINR
                    ? `₹${s.priceINR.toLocaleString("en-IN")} / session`
                    : s.notes ?? ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8 sm:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="eyebrow">Fixed IST time slots</p>
            <h2 className="display mt-4 text-3xl text-ink sm:text-4xl">
              Two windows · five timezones
            </h2>
          </div>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-soft">
                  <th className="eyebrow py-3 pr-4">Slot</th>
                  <th className="eyebrow py-3 pr-4">IST</th>
                  <th className="eyebrow py-3 pr-4">UK</th>
                  <th className="eyebrow py-3 pr-4">USA · ET</th>
                  <th className="eyebrow py-3 pr-4">UAE</th>
                </tr>
              </thead>
              <tbody className="text-base text-ink">
                {SLOTS.map((s) => (
                  <tr key={s.id} className="border-t border-ink/8">
                    <td className="py-4 pr-4 display">{s.label}</td>
                    <td className="py-4 pr-4">{s.ist}</td>
                    <td className="py-4 pr-4">{s.uk}</td>
                    <td className="py-4 pr-4">{s.usaET}</td>
                    <td className="py-4 pr-4">{s.uae}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 sm:py-8 bg-paper-warm">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">Book five sessions</p>
            <h2
              className="display mt-4 text-3xl text-ink sm:text-5xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Choose <span className="italic text-ink-soft">five dates</span>.
            </h2>
            <p className="mt-4 text-sm text-ink-soft max-w-xl mx-auto">
              Acharya Ji will confirm or propose alternatives within 24 hours. Zoom
              links are shared on confirmation.
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
