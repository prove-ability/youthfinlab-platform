import { defineConfig } from "vitest/config";
import { resolve } from "node:path";
const local = (path) => resolve(__dirname, path);
export default defineConfig({
  plugins: [
    {
      name: "student-app-auth",
      enforce: "pre",
      resolveId(id, importer) {
        if (id !== "@/lib/auth" || !importer) return;
        for (const app of ["stock-sim", "finance-sim"]) {
          if (importer.replaceAll("\\", "/").includes("/apps/" + app + "/"))
            return local("apps/" + app + "/lib/auth.ts");
        }
      },
    },
  ],
  resolve: {
    alias: [
      {
        find: "@repo/utils",
        replacement: local("packages/utils/src/finance-calculations.ts"),
      },
      {
        find: "@/config/gameConfig",
        replacement: local("apps/admin/src/config/gameConfig.ts"),
      },
      { find: "server-only", replacement: local("tests/cache.ts") },
      {
        find: "@repo/db/schema",
        replacement: local("packages/db/src/schema.ts"),
      },
      { find: "@repo/db", replacement: local("tests/database.ts") },
      { find: "@/lib/with-auth", replacement: local("tests/identity.ts") },
      { find: "@/lib/session", replacement: local("tests/identity.ts") },
      { find: "@/stack/server", replacement: local("tests/identity.ts") },
      {
        find: "@/lib/class-status",
        replacement: local("apps/stock-sim/lib/class-status.ts"),
      },
      {
        find: "@/lib/safe-action",
        replacement: local("apps/admin/src/lib/safe-action.ts"),
      },
      { find: "next/cache", replacement: local("tests/cache.ts") },
    ],
  },
  test: { include: ["tests/**/*.test.ts"], hookTimeout: 30000 },
});
