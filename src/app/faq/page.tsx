import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Answers to common questions about Mind Mirage courses, consultations, live classes, payments, and studying with Acharya Bhagyashree Joshi Ji from Rishikesh.",
};

const FAQS = [
  {
    q: "How do the self-paced courses work?",
    a: "Buy the course through the secure checkout and a confirmation email follows with your first lesson. You study at your own rhythm; the team handles everything from there.",
  },
  {
    q: "Which courses also run as live classes on Zoom?",
    a: "Bhagavad Gītā, Advaita Vedānta, and Lalita for Women are offered both self-paced and as live cohorts on Zoom. Live cohort dates are shared on enrolment, or ask us on WhatsApp.",
  },
  {
    q: "How do the one-to-one classes work?",
    a: "Each subject — meditation, prāṇāyāma, āsanas, shatkarma, āyurveda, jyotiṣa, western philosophy, contemplation — is taken as a course of eight classes on Zoom. Browse the fields under Offerings, add a subject to your basket, and check out — timings are scheduled together after enrolment.",
  },
  {
    q: "What is the difference between Mentorship and Consultation?",
    a: "Mentorship is a long-form relationship in the gurukulam rhythm, by application. Consultation covers both subject-based one-to-one study and personal guidance — life's difficulties, transitions, and obstacles in practice — held through the lens of the teaching. Both live under Sit with Guruji.",
  },
  {
    q: "Do I need to know Sanskrit?",
    a: "No. Everything is taught in English with the Sanskrit alongside; you absorb the vocabulary naturally as you study. Where Sanskrit matters, Acharya Ji teaches it from zero.",
  },
  {
    q: "How do payments work?",
    a: "All courses — self-paced, live, and one-to-one — are bought through the site's secure checkout: UPI, cards, net banking, wallets, with coupon codes applied at checkout. Books are confirmed by the team first; payment follows on confirmation.",
  },
  {
    q: "Are the class timings friendly for sādhaks outside India?",
    a: "Yes — classes run in fixed IST windows that map to mornings in the UK and Europe and evenings in the US. Acharya Ji confirms exact timings with you before anything is fixed.",
  },
  {
    q: "How do I buy books from the ashram?",
    a: "The Booklist comes as three sets — Beginner, Intermediate, and Advanced. Purchase from the Booklist page — our team will contact you.",
  },
  {
    q: "Where do I find blogs, news, and announcements from the team?",
    a: "In Vageshwari — blogs, news, photos, and announcements posted by Acharya Ji and the team. Sign in to read, like, and comment. Retreats and gatherings are also announced to the WhatsApp sādhaks' list first.",
  },
  {
    q: "I have a question that isn't answered here.",
    a: "Write to us — the contact page routes to WhatsApp, email, and the inquiry form. The quickest reply is on WhatsApp.",
  },
];

export default function FAQPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="FAQ · प्रश्नोत्तर"
        deva="प्रश्नोत्तरी"
        title={
          <>
            Asked, <span className="italic text-ink-soft">answered.</span>
          </>
        }
        description={
          <>
            The questions sādhaks ask most — about courses, classes, payments,
            and studying with Acharya Ji.
          </>
        }
      />

      <section className="px-6 pb-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-ink/8 bg-paper open:border-ink/20 open:bg-paper-warm/50 transition-colors"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="display text-lg text-ink">{f.q}</span>
                <span
                  className="shrink-0 text-xl text-saffron transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-ink-soft">
                {f.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-4 max-w-3xl rounded-2xl border border-ink/10 bg-paper-warm p-6 text-center">
          <p className="display text-xl text-ink">Still wondering?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink("Namaste. I have a question that is not in the FAQ.")}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-lg bg-saffron px-7 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              Ask on WhatsApp
            </a>
            <Link
              href="/contact"
              className="rounded-lg border border-ink/15 px-7 py-3 text-sm text-ink transition-colors hover:border-ink"
            >
              Use the form
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
