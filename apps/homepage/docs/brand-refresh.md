# Instagram brand alignment

Scope: retain homepage text and existing services; align visual identity with A sprout, mint #5CC192, charcoal #1A1D23 and paper #F5F8F6. No Instagram posting, testimonial editing, inquiry submissions or production deployment.

Dependency graph: baseline source → shared brand/assets → layout/hero/navigation + metadata/icons → repeatable checks → desktop/mobile browser evidence → review PR.

Acceptance: existing content remains, approved mascot reused, mobile cards retain balanced padding, keyboard navigation works, Instagram is linked visibly without embeds/tracking scripts, Organization.sameAs points to the real account, all static routes have self canonicals, articles override the blog canonical, favicon/manifest/OG are consistent. Structured data does not guarantee ranking or rich results.

Source baseline: main 2c111f7, downloaded from the signed-in GitHub UI. No repository AGENTS/check harness/CI was present. Existing lint/typecheck/build commands are used; the lint command is intentionally retained initially until its baseline is checked. No new paid services.

Validation results will be recorded after checks. No real form submissions.

## Evidence (2026-11-15)

- Final source lint and TypeScript checks passed; six metadata/manifest/sitemap regression tests passed.
- Production build completed successfully (14 generated routes). Initial sandbox EPERM was resolved by running the build with the granted filesystem permissions.
- Chrome DevTools MCP inspected the live original and local rendered home. Main text parity after whitespace normalization: 2161 characters, identical. Homepage H1 count: 1.
- Actual in-app browser keyboard activation verified mobile menu open/close and light/dark switching. At 390px, no horizontal overflow; all four program-card bottom insets: 29px including border.
- Header/mobile/footer social anchors point to https://www.instagram.com/youthfinlab/ with safe new-tab attributes. Home Organization JSON-LD and canonical/OG output inspected in rendered DOM.
- Desktop, mobile-light and mobile-dark screenshots saved as review evidence outside the app source. No real inquiry submitted. No production deployment.
- GitHub UI: no open homepage PRs at inspection time. Connector repository permission verified and synchronized before branch creation.
- Approved mascot is served as a 512px WebP derivative (24.6 KB); original character is not redrawn. Existing dependency versions/lockfile are retained; dependency/security maintenance is outside this visual refresh.

## Hero follow-up (2026-11-15)
User requested a smaller mascot or purposeful action. Selected smaller static branding: remove portrait frame/rings, use 240px desktop / 96px mobile with responsive image sizes, reduce hero minimum height to 560px. Browser verified at desktop and 390px mobile, no horizontal overflow. Targeted ESLint and TypeScript passed. Existing copy is unchanged; no GIF or motion introduced.

## Felt mascot alignment (2026-11-25)
User approved the warm felt sprout direction for Instagram and the homepage. Reuse sprout-felt-v1.webp for the footer and inquiry CTA; keep the restored wordmark and animated gradient hero unchanged. Derive favicon/touch icons and sharing art from the approved mascot. Keep image dimensions and empty decorative alt attributes; preserve all educational copy, blog URLs and inquiry behavior. Review PR required before release.

Validation: lint, TypeScript (rerun after generated build types settled), nine existing regression tests and production build passed. Chrome DevTools verified felt assets load at 390px dark and desktop light; no horizontal overflow. Header wordmark, hero heading, inquiry target and Instagram links unchanged. No inquiry submission.
