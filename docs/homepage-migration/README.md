# Homepage migration

## Scope and gates

Source: `prove-ability/youthfinlab-homepage` at `ff9a5bf6f3bcbcd49f0acc499e7eb6347447f7f5`.
Destination: `apps/homepage`. Next.js 16 and Tailwind CSS 4; existing copy, URLs, assets, inquiry API and archived articles are retained. The homepage does not import platform DB or authentication packages.

Dependency order: source snapshot → framework/CSS compatibility → checks and four app builds → preview review → explicit production approval → deployment connection switch → domain and inquiry verification.

Run from the workspace root:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm --filter youthfinlab-homepage check
pnpm --filter youthfinlab-homepage build
pnpm --filter admin build
pnpm --filter stock-sim build
pnpm --filter finance-sim build
pnpm --filter youthfinlab-homepage dev
```

The three platform apps require their existing build environment. Never substitute production database credentials into test environments. Homepage inquiry tests must not send real Notion records or Slack notifications.

## Independent deployment and domain cutover

No production connection or DNS change is part of this PR. Prefer retaining the existing homepage Vercel project, domains, TLS and environment variables. After preview approval:

1. Record the existing project ID, Git connection, root directory, production deployment ID, build settings and domain redirects for rollback. Reconfirm the source repository has not gained newer commits.
2. Switch that homepage project's repository to `prove-ability/youthfinlab-platform`, production branch `main`, root directory `apps/homepage`. Keep the other three projects unchanged. Enable access to workspace files outside the root directory if required by Vercel's monorepo settings.
3. Use the app's `vercel.json`: Next.js framework, `pnpm run build`, workspace frozen install. Preserve production and preview environment separation. Required homepage variables: `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `SLACK_WEBHOOK_URL`; optional `NEXT_PUBLIC_CHANNEL_PLUGIN_KEY`. Do not copy database or Stack Auth secrets into the homepage.
4. Preserve `www.youthfinlab.com` as canonical and the current `youthfinlab.com` → www redirect. Keep existing DNS and verification tokens. A same-project repository change should not require moving domains. If a replacement project is necessary, first validate its preview and environment, then explicitly approve reassignment of both hostnames; never detach the live domain before the replacement is ready.
5. Verify HTTPS, redirect status, home and all static routes, original Korean blog slugs, true 404 responses, sitemap, robots, canonical/OG URLs, icons, mobile navigation and inquiry delivery. Test external inquiry delivery only with explicit approval and labeled test data.
6. Disable the old repository's blog archive schedule before setting `HOMEPAGE_ARCHIVE_ENABLED=true` here. Verify this repository allows Actions PR creation. The archive workflow creates review PRs only.

Rollback: promote the recorded prior production deployment and restore the recorded Git/root/build settings. Restore domain assignments only if they were moved. Do not delete or archive the source repository until post-cutover verification is complete.

## CSS compatibility

Tailwind 4 uses explicit cascade layers. Existing brand tokens and custom CSS remain; form placeholders and button cursors retain their old defaults in the base layer. Existing palette values are preserved in `lib/legacy-palette.json`, old shadow/blur utility names are migrated, and gradient interpolation remains sRGB. No shared UI package or another app's global CSS is changed.

## Evidence and limitations

`source-manifest.json` records the original source checksums. Homepage tests cover persisted article URLs, sitemap, metadata and original static assets/API preservation. Preview cannot prove production Notion/Slack delivery without the existing environment and an authorized submission. Browser and build results are recorded in the PR.

Resolved local causes: duplicated Zod versions caused excessive type instantiation; aligning homepage Zod/react-hook-form with the platform fixed it. A sandboxed Turbopack CSS child process exited before connecting; rerun the same build outside the sandbox rather than changing application logic.
