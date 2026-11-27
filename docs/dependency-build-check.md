# Windows dependency resolution (2026-11-27)

- All three apps directly import drizzle-orm; each now declares ^0.44.5 in dependencies. The lockfile retains the existing 0.44.5 resolution and peers.
- Declaring the dependency alone did not resolve the local Turbopack failure. Node resolved the package, but Turbopack could not resolve its 269-character Windows path.
- Pin pnpm 9.15.9 and set virtual-store-dir-max-length=60 in .npmrc. Reinstall with the frozen lockfile to regenerate shorter package paths (observed: 209 characters). Do not manually copy packages or add bundler aliases.
- Run the repository-pinned pnpm version, then `pnpm install --frozen-lockfile` and the app build scripts.
- Verified: stock-sim and finance-sim Next.js 16.0.8 Turbopack production builds passed; 39 tests passed.
- Admin compilation no longer reports drizzle-orm resolution errors. Full admin build remains blocked at page-data collection by the missing local NEXT_PUBLIC_STACK_PROJECT_ID. No placeholder credentials were added.
- No dependency library version, schema, migration, database record, or deployed configuration was changed.

Reference: https://github.com/pnpm/pnpm.io/blob/main/versioned_docs/version-10.x/settings.md#virtualstoredirmaxlength
