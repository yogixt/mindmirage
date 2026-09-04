import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Divider from "@/components/Divider";
import { listBlog, readBlog } from "@/lib/mdx";

export function generateStaticParams() {
  return listBlog().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = readBlog(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
  };
}

export default async function BlogPost(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = readBlog(slug);
  if (!post) notFound();

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />

      <article className="px-6 pt-24 pb-4 sm:pt-24">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/blog"
            className="text-xs uppercase tracking-[0.2em] text-ink-soft hover:text-ink"
          >
            ← Journal
          </Link>
          <p className="eyebrow mt-4">
            {post.frontmatter.type ?? "blog"} ·{" "}
            {new Date(post.frontmatter.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          {post.frontmatter.sanskrit && (
            <p className="deva mt-4 text-2xl text-ink sm:text-3xl">
              {post.frontmatter.sanskrit}
            </p>
          )}
          {post.frontmatter.translation && (
            <p className="sanskrit-italic mt-3 text-base text-ink-soft">
              {post.frontmatter.translation}
            </p>
          )}
          <h1
            className="display mt-4 text-4xl text-ink sm:text-6xl"
            style={{ lineHeight: "1.0", letterSpacing: "-0.025em" }}
          >
            {post.frontmatter.title}
          </h1>
          {post.frontmatter.author && (
            <p className="mt-4 text-sm text-ink-soft">By {post.frontmatter.author}</p>
          )}

          <Divider />

          <div className="prose-mm">
            <MDXRemote source={post.content} />
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
