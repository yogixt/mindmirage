import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Mukta } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AshtangaHridayamBanner from "@/components/AshtangaHridayamBanner";

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
  title: "Ashtanga Hridayam · Sutrasthana",
  description:
    "An unhurried study of Ayurveda's core scripture — Aṣṭāṅga Hṛdayam Sutrasthāna. 3 days a week over 2 months, offline in Rishikesh or online on Zoom. Starts 15 July. ₹8,000.",
  openGraph: {
    title: "Ashtanga Hridayam · Sutrasthana — Mind Mirage",
    description:
      "Ayurveda core scripture series · 3 days a week · 2 months · Offline in Rishikesh or Online on Zoom · Starts 15 July.",
    type: "website",
  },
};

export default function AshtangaHridayamPage() {
  return (
    <main className={`${cormorant.variable} ${mukta.variable}`} style={{ background: "#F4EEDF" }}>
      <Navbar variant="solid" />
      <div className="pt-16">
        <div className="mx-auto max-w-[1200px] px-5 pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#E3DBC1] bg-[#FBF6E9] px-4 py-2 text-sm font-semibold text-[#2F3A2B] transition-colors hover:border-[#14432E] hover:text-[#14432E]"
          >
            <span aria-hidden>←</span> Back
          </Link>
        </div>
        <AshtangaHridayamBanner />
      </div>
      <Footer />
    </main>
  );
}
