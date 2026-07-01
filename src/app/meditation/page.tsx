import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Mukta } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeditationBanner from "@/components/MeditationBanner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meditation · Level 01",
  description:
    "A 10-hour guided meditation course over 8 days — online or at the Advaita Sādhanā Kuṭīr ashram in Rishikesh. Reserve your seat.",
  openGraph: {
    title: "Meditation · Level 01 — Mind Mirage",
    description:
      "A 10-hour guided meditation course over 8 days · Online or at our Rishikesh ashram.",
    type: "website",
  },
};

export default function MeditationPage() {
  return (
    <main className={`${cormorant.variable} ${mukta.variable}`} style={{ background: "#F6EFDD" }}>
      <Navbar variant="solid" />
      <div className="pt-16">
        <div className="mx-auto max-w-[1200px] px-5 pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#E0D6BC] bg-[#FBF6E9] px-4 py-2 text-sm font-semibold text-[#46453E] transition-colors hover:border-[#C97A45] hover:text-[#C97A45]"
          >
            <span aria-hidden>←</span> Back
          </Link>
        </div>
        <MeditationBanner />
      </div>
      <Footer />
    </main>
  );
}
