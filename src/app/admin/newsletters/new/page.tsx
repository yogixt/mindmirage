import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isAdmin } from "@/lib/auth";
import NewPostForm from "./NewPostForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Post · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminNewPostPage() {
  if (!(await isAdmin())) redirect("/");

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Admin · Newsletters"
        deva="नवीन पत्र"
        title={
          <>
            Write to the <span className="italic text-ink-soft">satsang.</span>
          </>
        }
        description="Blogs, news, photos, links — visible to signed-in seekers the moment you post."
      />
      <section className="px-6 pb-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5">
            <Link
              href="/admin/newsletters"
              className="text-xs uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
            >
              ← All posts
            </Link>
          </div>
          <NewPostForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
