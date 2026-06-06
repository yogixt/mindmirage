import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isAdmin } from "@/lib/auth";
import { journalDb } from "@/lib/journal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

async function counts() {
  const db = journalDb();
  if (!db) return { posts: 0, comments: 0, likes: 0 };
  const rs = await db.execute(
    `SELECT
      (SELECT COUNT(*) FROM posts) AS posts,
      (SELECT COUNT(*) FROM post_comments) AS comments,
      (SELECT COUNT(*) FROM post_likes) AS likes`,
  );
  const r = rs.rows[0];
  return {
    posts: Number(r.posts),
    comments: Number(r.comments),
    likes: Number(r.likes),
  };
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/");
  const stats = await counts();

  const SECTIONS = [
    {
      href: "/admin/newsletters",
      name: "Newsletters",
      text: `${stats.posts} posts · ${stats.likes} likes · ${stats.comments} comments. Write, review, and remove posts.`,
      live: true,
    },
    {
      href: "#",
      name: "Enrolments",
      text: "Seeker enrolments and payments — coming next.",
      live: false,
    },
    {
      href: "#",
      name: "Coupons",
      text: "Edit codes and discounts — currently managed in code.",
      live: false,
    },
  ];

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Team only · प्रबंधन"
        deva="प्रशासन"
        title={
          <>
            The admin <span className="italic text-ink-soft">portal.</span>
          </>
        }
        description="Manage the kuṭīr's site from one place. Nothing here is visible to seekers."
      />
      <section className="px-6 pb-10">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {SECTIONS.map((s) =>
            s.live ? (
              <Link
                key={s.name}
                href={s.href}
                className="group flex flex-col rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]"
              >
                <h2 className="display text-xl text-ink">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {s.text}
                </p>
                <p className="display mt-4 text-sm text-saffron transition-transform group-hover:translate-x-0.5">
                  Manage →
                </p>
              </Link>
            ) : (
              <div
                key={s.name}
                className="flex flex-col rounded-2xl border border-dashed border-ink/15 bg-paper-warm/40 p-5 opacity-70"
              >
                <h2 className="display text-xl text-ink">{s.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {s.text}
                </p>
                <p className="eyebrow mt-4">Coming soon</p>
              </div>
            ),
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
