# Blog URL preservation

## Problem and approach

GSC on 2026-11-16 listed seven old article URLs as 404. Detail pages depended on the current Naver RSS window, so an article could disappear even while its Naver original remained public. The list, detail route and sitemap now read the same versioned `data/blog-posts.json`. No runtime fetch to the production domain or Naver is required to resolve a published URL. Unknown URLs use Next.js `notFound()` (404 + noindex), not a redirect to `/404`.

Dependency graph: verified public sources → persistent archive → list/API/detail/sitemap → regression tests + build → HTTP/browser evidence → PR → separate merge/deploy approval.

## Initial source evidence

- Existing 50 posts copied from the production `/api/blog` response on 2026-11-16, retaining their URLs and descriptions.
- Seven GSC 404s recovered using Naver's public YouthFinLab post listing and each article's PostView page. One additional crawled-but-unindexed article was recovered at the same time.
- Original post IDs: 223899956152 (한양중), 223830766539 (여성기업인증), 223824246910 (후성그룹), 223750005616 (지역아동센터), 223723863657 (금융교육 강사), 223719782045 (화성시문화재단), 223305136934 (한울타리), 223717506868 (홍천농업고).
- Recovered descriptions are excerpts of the first eight nonempty text paragraphs of the actual public originals, HTML-escaped before storage. Titles and publication dates come from the public list. They are not AI-reconstructed full articles; the existing “네이버 블로그에서 전체 글 보기” link still opens the original. Date-only recovery records use midnight UTC without inventing a publication time.

## Updates and operating tradeoff

New posts are published only after their data is durably committed. `npm run sync:blog` fetches the public RSS and adds new source IDs without deleting missing entries or overwriting an existing slug/title/body. A source title edit cannot break its existing URL. Duplicate new titles receive a source-ID suffix. Explicit corrections and removals require a reviewed data change; private/deleted originals are not automatically mirrored as deletions.

The scheduled workflow runs at 08:17 KST daily (GitHub may delay schedules) and can be manually dispatched. It opens a data-only review PR and never merges it. If an archive PR is already open, review that PR first; the next run collects further additions. **New Naver posts therefore appear after review, merge and deployment, not immediately on RSS publication.** This is intentional to ensure every public URL is already persisted.

Deployment prerequisite for automatic PR creation: GitHub Actions must be enabled and the repository must allow Actions to create pull requests. No PAT, paid DB or security-setting change is included. The repository setting cannot be verified by this connector. If disabled, run `npm run sync:blog` locally and open a normal PR; published URLs remain available meanwhile. GITHUB_TOKEN-created PR checks may need maintainer approval. Do not enable auto-merge. Workflow installation/scheduled execution can only be verified after this PR is merged.

## Validation

- Regression coverage: source identity, RSS rollover, source title edits, duplicate titles, malformed/empty feeds, all eight GSC URLs, encoded Korean lookup, sitemap parity and existing branding metadata.
- Build and HTTP/browser results are recorded in the PR. Unknown URL must return HTTP 404 with no redirect and noindex; each recovered URL must return 200 with its own canonical.
- Self-review only; no independent reviewer or production deployment in this task.
- After approved deployment, use GSC URL inspection and validate fixed 404s. Google recrawl/indexing is asynchronous and not guaranteed by this code change. Sitemap submission and GSC validation were not performed by this PR.
