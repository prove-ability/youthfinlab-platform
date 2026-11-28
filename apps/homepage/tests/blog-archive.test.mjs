import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { mergePosts, parseFeed, sourceId } from "../scripts/sync-blog.mjs";

const archive = JSON.parse(
  await readFile(new URL("../data/blog-posts.json", import.meta.url), "utf8")
);
const post = {
  id: "1",
  title: "금융 교육",
  slug: "금융-교육",
  link: "https://blog.naver.com/youthfinlab/1",
  description: "본문",
  pubDate: "2026-01-01T00:00:00.000Z",
};

test("RSS rollover, empty window and title changes do not remove or rename published posts", () => {
  assert.deepEqual(mergePosts([post], []), [post]);
  assert.deepEqual(
    mergePosts([post], [{ ...post, title: "수정", slug: "수정" }]),
    [post]
  );
  const added = {
    ...post,
    id: "2",
    link: "https://blog.naver.com/youthfinlab/2",
  };
  assert.deepEqual(
    mergePosts([post], [added]).map((p) => p.slug),
    ["금융-교육", "금융-교육-2"]
  );
  assert.equal(mergePosts([post], [post, post]).length, 1);
});

test("invalid feed and external source fail closed before modifying archive", async () => {
  for (const xml of [
    "<html/>",
    "<broken",
    "<rss><channel/></rss>",
    "<rss><channel><item><title>x</title></item></channel></rss>",
  ])
    await assert.rejects(parseFeed(xml));
  assert.throws(() => sourceId("https://example.com/youthfinlab/123"));
  const xml =
    "<rss><channel><item><title>교육</title><link>https://blog.naver.com/youthfinlab/3</link><pubDate>2026-01-01</pubDate></item></channel></rss>";
  assert.equal((await parseFeed(xml))[0].slug, "교육");
});

test("archive has unique stable URLs, verified source IDs, dates and all recovered GSC posts", () => {
  assert.equal(new Set(archive.map((p) => p.slug)).size, archive.length);
  assert.equal(
    new Set(archive.map((p) => sourceId(p.link))).size,
    archive.length
  );
  for (const p of archive) {
    assert.equal(p.id, sourceId(p.link));
    assert.ok(p.title && p.description && p.slug);
    assert.ok(Number.isFinite(Date.parse(p.pubDate)));
  }
  const expected = [
    "청소년-금융교육서울시-중구청과-함께하는-금융교육한양중학교자유학기제",
    "지역아동센터-기부-소식지역아동센터-금융교육-초등학생-금융캠프유스핀랩",
    "여성기업인증중소기업-인증유스핀랩",
    "자산관리교육신입사원-입문교육-자산관리-연수후성그룹-금융교육",
    "금융교육-강사금융교육-회사금융교육-문의유스핀랩",
    "연금교육직장인-연금교육화성시문화재단유스핀랩",
    "가정-밖-청소년-경제교육한울타리-금융교육-소식",
    "금융캠프고등학생-금융캠프홍천농업고등학교청소년-금융교육유스핀랩",
  ];
  for (const slug of expected)
    assert.ok(
      archive.some((p) => p.slug === slug),
      slug
    );
});
