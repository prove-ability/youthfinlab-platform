import archive from "@/data/blog-posts.json";
import type { BlogPost } from "@/app/blog/types";

// Publish persisted posts only, independent of the RSS window or availability.
export function getBlogPosts(): BlogPost[] {
  return [...archive].sort(
    (a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate)
  );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  try {
    const decoded = decodeURIComponent(slug);
    return archive.find((post) => post.slug === decoded);
  } catch {
    return undefined;
  }
}
