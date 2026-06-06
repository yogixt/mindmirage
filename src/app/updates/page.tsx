import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isAdmin } from "@/lib/auth";
import { listPosts, POST_CATEGORIES } from "@/lib/journal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Updates from the Kuṭīr — Announcements, Guidance & Conferences",
  description:
    "Official updates from Acharya Ji and the Mind Mirage team — new posts, guidance notes, conference dates, and collaboration details.",
};

const CATEGORY_LABEL = Object.fromEntries(
  POST_CATEGORIES.map((c) => [c.value, c.label]),
);

const CATEGORY_STYLE: Record<string, string> = {
  announcement: "border-saffron/30 bg-saffron/5 text-saffron",
  guidance: "border-gold/40 bg-gold/10 text-ink",
  conference: "border-maroon/30 bg-maroon/5 text-maroon",
  collaboration: "border-ink/20 bg-paper-deep text-ink-soft",
};

function formatDate(iso: string) {
  return new Date(iso.endsWith("Z") ? iso : `${iso}Z`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" },
  );
}

export default async function UpdatesPage() {
  const [posts, admin] = await Promise.all([listPosts(), isAdmin()]);

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Updates · सूचना"
        deva="कुटीर से"
        title={
          <>
            From the <span className="italic text-ink-soft">kuṭīr.</span>
          </>
        }
        description={
          <>
            Official word from Acharya Ji and the team — announcements, guidance
            notes, conference dates, and collaborations. Seekers&apos; questions
            live in{" "}
            <Link href="/ask" className="text-saffron underline underline-offset-2">
              Ask
            </Link>
            .
          </>
        }
      />

      <section className="px-6 pb-10">
        <div className="mx-auto max-w-3xl">
          {admin && (
            <div className="mb-6 flex justify-end">
              <Link
                href="/updates/new"
                className="rounded-lg bg-saffron px-6 py-2.5 text-sm text-paper transition-transform hover:scale-[1.03]"
              >
                New update
              </Link>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center">
              <p className="display text-xl text-ink">
                The first update is being written.
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Announcements, conference dates, and collaborations will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <article
                  key={p.id}
                  className="rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:border-ink/20"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-0.5 text-[11px] font-medium ${
                        CATEGORY_STYLE[p.category] ?? CATEGORY_STYLE.announcement
                      }`}
                    >
                      {CATEGORY_LABEL[p.category] ?? p.category}
                    </span>
                    <span className="text-xs text-ink-faint">
                      {p.author} · {formatDate(p.created_at)}
                    </span>
                  </div>
                  <h2 className="display mt-2 text-xl text-ink">{p.title}</h2>
                  {p.body && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                      {p.body}
                    </p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-3 inline-block text-sm text-saffron underline underline-offset-2"
                    >
                      Details →
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
