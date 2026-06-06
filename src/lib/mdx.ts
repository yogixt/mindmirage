import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

export type MDXEntry<T extends Record<string, unknown> = Record<string, unknown>> = {
  slug: string;
  frontmatter: T;
  content: string;
};

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function listMDX<T extends Record<string, unknown>>(
  collection: string,
): MDXEntry<T>[] {
  const dir = path.join(CONTENT_ROOT, collection);
  ensureDir(dir);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return files
    .map((file) => readMDX<T>(collection, file.replace(/\.(mdx|md)$/, "")))
    .filter((e): e is MDXEntry<T> => e !== null);
}

export function readMDX<T extends Record<string, unknown>>(
  collection: string,
  slug: string,
): MDXEntry<T> | null {
  const dir = path.join(CONTENT_ROOT, collection);
  const tryPaths = [
    path.join(dir, `${slug}.mdx`),
    path.join(dir, `${slug}.md`),
  ];
  const filepath = tryPaths.find((p) => fs.existsSync(p));
  if (!filepath) return null;
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    frontmatter: data as T,
    content,
  };
}

export type BlogFrontmatter = {
  title: string;
  date: string;
  author?: string;
  type?: "blog" | "note" | "teaching" | "quiz" | "announcement";
  tags?: string[];
  excerpt?: string;
  image?: string;
  sanskrit?: string;
  translation?: string;
};

export function listBlog(): MDXEntry<BlogFrontmatter>[] {
  return listMDX<BlogFrontmatter>("blog").sort((a, b) => {
    const da = new Date(a.frontmatter.date).getTime();
    const db = new Date(b.frontmatter.date).getTime();
    return db - da;
  });
}

export function readBlog(slug: string) {
  return readMDX<BlogFrontmatter>("blog", slug);
}
