import { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
import { getBlogPosts } from "@/lib/blog-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    "",
    "/mock-investment",
    "/financial-consulting",
    "/blog",
    "/customer-support",
    "/education-inquiry",
    "/recruit",
  ].map((route) => ({
    url: BRAND.url + route,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
  const blogs: MetadataRoute.Sitemap = (await getBlogPosts()).map((post) => ({
    url: BRAND.url + "/blog/" + encodeURIComponent(post.slug),
    lastModified: new Date(post.pubDate),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...routes, ...blogs];
}
