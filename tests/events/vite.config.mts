import { defineConfig } from "vite";
import { resolve } from "node:path";
export default defineConfig({
  optimizeDeps: { entries: ["tests/events/index.html"] },
  esbuild: { jsx: "automatic" },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@/actions/marketScenarioActions": resolve("tests/events/fixtures.ts"),
      "@/actions/marketScenario": resolve("tests/events/fixtures.ts"),
      "@repo/db/market-scenario": resolve("packages/db/src/market-scenario.ts"),
      "@repo/ui/market-event.css": resolve("packages/ui/src/market-event.css"),
      "@tanstack/react-query": resolve(
        "apps/admin/node_modules/@tanstack/react-query",
      ),
    },
  },
});
