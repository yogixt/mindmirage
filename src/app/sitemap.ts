import type { MetadataRoute } from "next";
import { COURSES, SITE } from "@/lib/constants";
import { listBlog } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/programs",
    "/sit-with-guruji",
    "/consultation",
    "/counselling",
    "/live-qa",
    "/mentorship",
    "/books",
    "/ask",
    "/updates",
    "/blog",
    "/research",
    "/events",
    "/about-us",
    "/our-team",
    "/internship",
    "/volunteer",
    "/contact",
  ].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const courses = COURSES.map((c) => ({
    url: `${SITE.url}/programs/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  let posts: MetadataRoute.Sitemap = [];
  try {
    posts = listBlog().map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: new Date(p.frontmatter.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Content directory may not exist yet — that's fine.
  }

  return [...staticPaths, ...courses, ...posts];
}
