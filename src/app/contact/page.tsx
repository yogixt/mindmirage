import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHero from "@/components/ContactHero";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Mind Mirage, WhatsApp, Email & Inquiry Form",
  description:
    "Contact Mind Mirage at Advaita Sadhana Kutir, Rishikesh. Reach us on WhatsApp (+91 73024 31279), email (namaste@mindmirageindia.com), or send an inquiry.",
  keywords: [
    "contact Mind Mirage",
    "Rishikesh ashram contact",
    "Vedanta teacher contact",
    "Yoga course inquiry",
    "Advaita Vedanta Rishikesh",
  ],
  alternates: { canonical: "https://mindmirageindia.com/contact" },
  openGraph: {
    title: "Contact Mind Mirage, Rishikesh",
    description: "Reach us on WhatsApp, email, or the inquiry form.",
    url: "https://mindmirageindia.com/contact",
    siteName: "Mind Mirage",
    type: "website",
    images: [{ url: "https://mindmirageindia.com/og-contact.jpg", width: 1200, height: 630 }],
  },
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
