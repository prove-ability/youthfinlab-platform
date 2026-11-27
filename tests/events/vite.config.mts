import { createRequire } from "node:module";
import { defineConfig } from "vite";
import { resolve } from "node:path";
const appRequire = createRequire(resolve("apps/admin/package.json"));
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        appRequire("@tailwindcss/postcss")({ base: resolve("apps/admin") }),
      ],
    },
  },
  optimizeDeps: { entries: ["tests/events/index.html"] },
  esbuild: { jsx: "automatic" },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "next/link": resolve("tests/events/link.tsx"),
      "@/actions/classActions": resolve("tests/events/admin-fixtures.ts"),
      "@/actions/gameActions": resolve("tests/events/admin-fixtures.ts"),
      "@/actions/stockActions": resolve("tests/events/admin-fixtures.ts"),
      "@/actions/gameDataActions": resolve("tests/events/admin-fixtures.ts"),
      "@/components/game/GameDayManagement": resolve("tests/events/unused.tsx"),
      "@/components/game/PriceManagement": resolve("tests/events/unused.tsx"),
      "@repo/ui/async-state": resolve("packages/ui/src/async-state.tsx"),
      "@repo/utils": resolve("packages/utils/src/cn.ts"),
      "@/components": resolve("apps/admin/src/components"),
      "@/lib": resolve("apps/admin/src/lib"),
      "@/actions/marketScenarioActions": resolve("tests/events/fixtures.ts"),
      "@/actions/marketScenario": resolve("tests/events/fixtures.ts"),
      "@repo/db/market-scenario": resolve("packages/db/src/market-scenario.ts"),
      "@repo/ui/market-event.css": resolve("packages/ui/src/market-event.css"),
      "@repo/ui": resolve("tests/browser/ui.ts"),
      "@tanstack/react-query": resolve(
        "apps/admin/node_modules/@tanstack/react-query",
      ),
    },
  },
});
