import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Write to ${SITE.name} — WhatsApp, email, or the inquiry form.`,
};

export default function ContactPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Reach us · सम्पर्क"
        deva="संवाद"
        title={
          <>
            Begin a <span className="italic text-ink-soft">conversation.</span>
          </>
        }
        description={
          <>
            The quickest reply is on WhatsApp. The longer one comes by email. The
            inquiry form below routes the same way.
          </>
        }
      />

      <section className="px-6 py-8">
        <div className="mx-auto max-w-4xl grid gap-4 sm:grid-cols-3">
          <ContactCard
            label="WhatsApp"
            value={SITE.whatsappDisplay}
            href={whatsappLink()}
            external
          />
          <ContactCard label="Email" value={SITE.email} href={`mailto:${SITE.email}`} />
          <ContactCard label="Visit" value={SITE.location} />
        </div>
      </section>

      <section className="px-6 py-8 sm:py-8 bg-paper-warm">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">Or use the form</p>
            <h2
              className="display mt-4 text-3xl text-ink sm:text-5xl"
              style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
            >
              Send a <span className="italic text-ink-soft">quiet message.</span>
            </h2>
          </div>
          <div className="mt-8">
            <InquiryForm />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function ContactCard({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <p className="eyebrow">{label}</p>
      <p className="display mt-4 text-xl text-ink leading-snug">{value}</p>
    </>
  );
  const cls =
    "block rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]";
  if (!href) return <div className={cls}>{inner}</div>;
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={cls}
    >
      {inner}
    </a>
  );
}
