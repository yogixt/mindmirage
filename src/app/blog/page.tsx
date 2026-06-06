import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { listBlog } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes, teachings, and reflections by Acharya Bhagyashree Joshi Ji and the Mind Mirage community.",
};

export default function BlogPage() {
  const posts = listBlog();
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Journal · ज्ञानदर्पण"
        deva="लेखन"
        title={
          <>
            Notes from the <span className="italic text-ink-soft">courtyard.</span>
          </>
        }
        description={
          <>
            Short reflections, teachings, and contemplative questions — written by
            Acharya Ji and the Mind Mirage community.
          </>
        }
      />

      <section className="px-6 pb-4 sm:pb-32">
        <div className="mx-auto max-w-3xl">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-ink-soft py-4">
              The first writings will appear here soon.
            </p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {posts.map((p) => (
                <li key={p.slug} className="py-4">
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <p className="eyebrow">
                      {p.frontmatter.type ?? "blog"} ·{" "}
                      {new Date(p.frontmatter.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {p.frontmatter.sanskrit && (
                      <p className="deva mt-4 text-xl text-ink">
                        {p.frontmatter.sanskrit}
                      </p>
                    )}
                    <h2 className="display mt-2 text-3xl text-ink group-hover:text-ink-soft transition-colors">
                      {p.frontmatter.title}
                    </h2>
                    {p.frontmatter.excerpt && (
                      <p className="mt-3 text-base text-ink-soft leading-relaxed">
                        {p.frontmatter.excerpt}
                      </p>
                    )}
                    <p className="display mt-4 text-sm text-ink group-hover:translate-x-0.5 transition-transform">
                      Read →
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
