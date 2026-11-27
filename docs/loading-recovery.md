# Loading recovery verification

Scope: loading states, read errors and retries across admin, stock-sim and finance-sim. Student-result table changes are isolated on fix/student-results-responsive. No business actions or schema changes.

## Requirement → implementation → evidence

- Query failures must not become empty lists, permanent loaders or missing-profile redirects → shared LoadError and success-gated redirects → 13 actual page components tested in Chromium and WebKit.
- Refresh must preserve existing content and profile drafts → isFetching feedback and cached-data error state → background refresh and draft recovery tests.
- Switching classes must not expose previous-class operations → placeholder data retains selectors, hides operations/tabs and disables progress actions during failed refresh → class-switch test.
- Loading needs accessible feedback → native indeterminate progress, status/alert announcements and reduced-motion CSS → semantic progress and reduced-motion test. Modern Web Guidance spinner guide informed the baseline implementation; no experimental APIs.
- Retry trading data without redundant requests → remove refetch after invalidateQueries; transaction rules unchanged.

## Validation (2026-11-27)

- TypeScript: all three apps pass.
- Existing unit tests: 39 pass.
- Loading browser tests: 36 pass (Chromium + WebKit, mobile viewport).
- Existing browser tests: 8 pass with one worker. Initial parallel run had an onboarding timeout, not reproduced sequentially. Error-message assertion updated for the new shared message.
- Chrome DevTools: failure → retry → customer list recovered; no console errors or warnings.
- Diff self-reviewed. Production account writes were not used. Mocked read responses are not proof of production network reliability; deployment/build gates remain required before merge.

## Reproduce

- pnpm test
- pnpm test:browser --workers=1
- pnpm test:loading
- pnpm preview:loading → http://localhost:14312/clients.html?mode=fail

Preview compiles actual components, replaces server actions with local fixtures, and blocks unsupported actions. Toolbar selects initial failure, repeated failure, slow responses and background failure/recovery. Redirects are recorded without navigating the harness away. No credentials or production data are bundled.
