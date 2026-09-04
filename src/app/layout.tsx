import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Noto_Serif_Devanagari, Yatra_One, Kalam } from "next/font/google";
import "./globals.css";
import Tejas from "@/components/Tejas";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContributeButton from "@/components/ContributeButton";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart";
import { SITE } from "@/lib/constants";
import { AuthProvider } from "./AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const notoDeva = Noto_Serif_Devanagari({
  variable: "--font-noto-deva",
  subsets: ["devanagari"],
  display: "swap",
});

const yatra = Yatra_One({
  variable: "--font-yatra",
  weight: "400",
  subsets: ["latin", "devanagari"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-kalam",
  weight: "400",
  subsets: ["latin", "devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} India, Vedic & Indian Philosophy Courses from Rishikesh`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Mind Mirage is a contemplative learning space at Advaita Sādhanā Kuṭīr, Rishikesh. Yoga, Vedānta, meditation, and the living stream of the Indian Knowledge System, taught in the gurukulam tradition.",
  keywords: [
    "Advaita Vedanta",
    "Yoga Sutras",
    "Bhagavad Gita",
    "Rishikesh ashram",
    "meditation course",
    "Sanskrit",
    "Adi Shankaracharya",
    "Mind Mirage",
    "Acharya Bhagyashree Joshi",
  ],
  authors: [{ name: SITE.founder }],
  openGraph: {
    title: `${SITE.name}, ${SITE.tagline}`,
    description:
      "A contemplative learning space rooted in the Advaita tradition of Adi Shankarācārya. Rishikesh.",
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}, ${SITE.tagline}`,
    description:
      "Yoga, Vedānta, meditation, and the living stream of the Indian Knowledge System.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${notoDeva.variable} ${yatra.variable} ${kalam.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      style={{ fontSize: 18 }}
    >
      <body className="bg-paper text-ink antialiased" style={{ fontSize: 18, lineHeight: 1.6 }}>
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <Tejas />
            <WhatsAppButton />
            <ContributeButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
