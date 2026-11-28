import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { parseStringPromise } from "xml2js";

const archiveUrl = new URL("../data/blog-posts.json", import.meta.url);
export function sourceId(link) {
  const url = new URL(link);
  const match = url.pathname.match(/^\/youthfinlab\/(\d+)$/);
  if (url.protocol !== "https:" || url.hostname !== "blog.naver.com" || !match)
    throw new Error("Expected a YouthFinLab Naver post URL");
  return match[1];
}

export function mergePosts(existing, incoming) {
  const result = existing.map((post) => ({ ...post }));
  const ids = new Set(result.map((post) => sourceId(post.link)));
  const slugs = new Set(result.map((post) => post.slug));
  for (const post of incoming) {
    const id = sourceId(post.link);
    // Source title edits must not rename already published URLs.
    if (ids.has(id)) continue;
    if (
      !post.title ||
      !post.slug ||
      !Number.isFinite(Date.parse(post.pubDate)) ||
      typeof post.description !== "string"
    )
      throw new Error("Invalid post; archive was not changed");
    let slug = post.slug;
    if (slugs.has(slug)) slug = `${slug}-${id}`;
    if (slugs.has(slug))
      throw new Error("Slug collision; manual review required");
    result.push({ ...post, id, slug });
    ids.add(id);
    slugs.add(slug);
  }
  return result.sort((a, b) => Date.parse(b.pubDate) - Date.parse(a.pubDate));
}

export async function parseFeed(xml) {
  const parsed = await parseStringPromise(xml, { explicitArray: false });
  if (!parsed?.rss?.channel) throw new Error("Invalid RSS channel");
  const raw = parsed.rss.channel.item;
  const items = raw == null ? [] : Array.isArray(raw) ? raw : [raw];
  if (!items.length) throw new Error("Empty RSS; archive was not changed");
  return items.map((item) => {
    if (
      typeof item.title !== "string" ||
      typeof item.link !== "string" ||
      typeof item.pubDate !== "string" ||
      !Number.isFinite(Date.parse(item.pubDate)) ||
      (item.description != null && typeof item.description !== "string")
    )
      throw new Error("Malformed RSS post; archive was not changed");
    const id = sourceId(item.link);
    const description = item.description ?? "";
    const thumbnail = description.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
    return {
      id,
      title: item.title,
      link: item.link,
      description,
      pubDate: new Date(item.pubDate).toISOString(),
      slug: item.title
        .toLowerCase()
        .replace(/[^가-힣a-z0-9\s]/g, "")
        .replace(/\s+/g, "-"),
      ...(thumbnail ? { thumbnail } : {}),
    };
  });
}

async function main() {
  const existing = JSON.parse(await readFile(archiveUrl, "utf8"));
  const response = await fetch("https://rss.blog.naver.com/youthfinlab.xml", {
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`RSS HTTP ${response.status}`);
  const incoming = await parseFeed(await response.text());
  const merged = mergePosts(existing, incoming);
  await writeFile(archiveUrl, JSON.stringify(merged, null, 2) + "\n");
  console.log(
    `Archive: ${existing.length} → ${merged.length} posts. Review the diff before publishing.`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await main();
