import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isAdmin } from "@/lib/auth";
import { listPosts } from "@/lib/journal";
import DeletePostButton from "./DeletePostButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manage Newsletters · Admin",
  robots: { index: false, follow: false },
};

function formatDate(iso: string) {
  return new Date(iso.endsWith("Z") ? iso : `${iso}Z`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" },
  );
}

export default async function AdminNewslettersPage() {
  if (!(await isAdmin())) redirect("/");
  const posts = await listPosts();

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Admin · Newsletters"
        deva="पत्रिका प्रबंधन"
        title={
          <>
            Manage the <span className="italic text-ink-soft">letters.</span>
          </>
        }
        description="Everything posted here appears on the seekers' Newsletters feed."
      />
      <section className="px-6 pb-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-5 flex items-center justify-between">
            <Link
              href="/admin"
              className="text-xs uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
            >
              ← Admin
            </Link>
            <Link
              href="/admin/newsletters/new"
              className="rounded-lg bg-saffron px-6 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              New post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center">
              <p className="display text-xl text-ink">No posts yet.</p>
              <p className="mt-2 text-sm text-ink-soft">
                Write the first letter to the satsang.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-ink/8 bg-paper px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{p.title}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      <span className="capitalize">{p.category}</span> · {p.author} ·{" "}
                      {formatDate(p.created_at)} · {p.likes} likes · {p.comments}{" "}
                      comments
                    </p>
                  </div>
                  <DeletePostButton postId={p.id} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
