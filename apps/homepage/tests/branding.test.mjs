import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import ts from "typescript";

const read = (p) => fs.readFile(new URL("../" + p, import.meta.url), "utf8");
async function loadTs(file, rewrite = (s) => s) {
  const source = ts.transpileModule(rewrite(await read(file)), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import(
    "data:text/javascript;base64," + Buffer.from(source).toString("base64")
  );
}
const { BRAND, organization } = await loadTs("lib/brand.ts");
test("sameAs identifies the approved official Instagram and crawlable brand logo", () => {
  assert.equal(BRAND.instagram, "https://www.instagram.com/youthfinlab/");
  assert.deepEqual(organization.sameAs, [BRAND.instagram]);
  assert.equal(organization.logo, BRAND.url + "/android-chrome-512x512.png");
});
test("manifest has a real name, stable launch URL and opaque square icons", async () => {
  const manifest = JSON.parse(await read("public/site.webmanifest"));
  assert.equal(manifest.name, "유스핀랩");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.theme_color, "#1A1D23");
  for (const icon of manifest.icons) {
    const png = await fs.readFile(
      new URL("../public" + icon.src, import.meta.url)
    );
    const [w, h] = icon.sizes.split("x").map(Number);
    assert.equal(png.readUInt32BE(16), w);
    assert.equal(png.readUInt32BE(20), h);
  }
});
test("share card is a real 1200x630 PNG and all icon fallbacks are present", async () => {
  const png = await fs.readFile(
    new URL("../public" + BRAND.image, import.meta.url)
  );
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  for (const p of [
    "icon.svg",
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
  ])
    assert.ok(
      (await fs.stat(new URL("../public/" + p, import.meta.url))).size > 0
    );
});
const archive = JSON.parse(await read("data/blog-posts.json"));
const blogStore = await loadTs("lib/blog-posts.ts", (s) =>
  s.replace(
    'import archive from "@/data/blog-posts.json";',
    `const archive = ${JSON.stringify(archive)};`
  )
);
test("article lookup accepts Korean and encoded URLs and rejects malformed escapes", () => {
  for (const post of archive) {
    assert.equal(blogStore.getBlogPost(post.slug)?.id, post.id);
    assert.equal(
      blogStore.getBlogPost(encodeURIComponent(post.slug))?.id,
      post.id
    );
  }
  assert.equal(blogStore.getBlogPost("%zz"), undefined);
  assert.equal(blogStore.getBlogPost("missing"), undefined);
});
const sitemapModule = await loadTs("app/sitemap.ts", (s) =>
  s
    .replace(
      'import { BRAND } from "@/lib/brand";',
      `const BRAND = ${JSON.stringify(BRAND)};`
    )
    .replace(
      'import { getBlogPosts } from "@/lib/blog-posts";',
      `const getBlogPosts = () => ${JSON.stringify(archive)};`
    )
);
test("sitemap includes every persisted post without a network dependency", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = () => {
      throw Error("offline");
    };
    const result = await sitemapModule.default();
    assert.equal(result.length, 7 + archive.length);
    assert.ok(result.slice(0, 7).every((r) => !r.lastModified));
    for (const post of archive)
      assert.ok(
        result.some(
          (r) => r.url === BRAND.url + "/blog/" + encodeURIComponent(post.slug)
        )
      );
  } finally {
    globalThis.fetch = original;
  }
});
test("all static page canonicals and article override are explicit", async () => {
  for (const route of [
    "mock-investment",
    "financial-consulting",
    "blog",
    "education-inquiry",
    "customer-support",
    "recruit",
  ]) {
    const source = await read("app/" + route + "/layout.tsx");
    assert.ok(source.includes('canonical: BRAND.url + "/' + route + '"'));
  }
  assert.match(
    await read("app/blog/[slug]/page.tsx"),
    /canonical:.*encodeURIComponent\(post.slug\)/
  );
});
