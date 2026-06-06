import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHero from "@/components/ContactHero";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: `Write to ${SITE.name} — WhatsApp, email, or the inquiry form.`,
};

export default function ContactPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <ContactHero />
      <Footer />
    </main>
  );
}
