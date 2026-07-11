import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Mukta } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YogaBanner from "@/components/YogaBanner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iyengar Yoga",
  description:
    "Iyengar Yoga at the Advaita Sādhanā Kuṭīr, Rishikesh — alignment-based āsana with props, prāṇāyāma and the eight limbs. Regular classes from 05 July, 2–4 PM. Online or at the ashram.",
  openGraph: {
    title: "Iyengar Yoga — Mind Mirage",
    description: "Alignment · Precision · Balance. Regular classes from 05 July · 2–4 PM.",
    type: "website",
  },
};

export default function YogaPage() {
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
        <YogaBanner />
      </div>
      <Footer />
    </main>
  );
}
