import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

test("migration preserves original assets, archive, APIs and SEO identity", async () => {
  const manifest = JSON.parse(
    await fs.readFile(
      new URL(
        "../../../docs/homepage-migration/source-manifest.json",
        import.meta.url
      ),
      "utf8"
    )
  );
  const files = Object.keys(manifest.files).filter((file) =>
    /^(public\/|data\/|app\/api\/|lib\/(brand|notion|blog-posts)\.ts$|app\/sitemap\.ts$)/.test(
      file
    )
  );
  assert.ok(files.length > 20);
  for (const file of files) {
    let bytes = await fs.readFile(new URL("../" + file, import.meta.url));
    if (/\.(tsx?|m?js|json|css|txt|svg|webmanifest)$/.test(file))
      bytes = Buffer.from(bytes.toString("utf8").replace(/\r\n/g, "\n"));
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      manifest.files[file],
      file
    );
  }
});
