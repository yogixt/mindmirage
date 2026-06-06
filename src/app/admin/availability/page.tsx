import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isAdmin } from "@/lib/auth";
import ManageCalendar from "./ManageCalendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Availability · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAvailabilityPage() {
  if (!(await isAdmin())) redirect("/");

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Admin · Availability"
        deva="उपलब्धता"
        title={
          <>
            The <span className="italic text-ink-soft">calendar.</span>
          </>
        }
        description="Tap a date to block or open it. Seekers see green as available, red as blocked."
      />
      <section className="px-6 pb-6">
        <div className="mx-auto max-w-md">
          <div className="mb-4">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
            >
              ← Admin
            </Link>
          </div>
          <ManageCalendar />
        </div>
      </section>
      <Footer />
    </main>
  );
}
