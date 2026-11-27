import { defineConfig } from "vite";
import { resolve } from "node:path";
export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@/actions/auth": resolve("tests/browser/login-action.ts"),
      "next/navigation": resolve("tests/browser/navigation.ts"),
      "@/components/ui": resolve("apps/admin/src/components/ui"),
      "@/actions/newsActions": resolve("tests/browser/class-fixtures.ts"),
      "@/actions/gameActions": resolve("tests/browser/class-fixtures.ts"),
      "@tanstack/react-query": resolve(
        "apps/admin/node_modules/@tanstack/react-query",
      ),
      "@repo/ui/brand-intro": resolve("packages/ui/src/brand-intro.tsx"),
      "@repo/ui/async-state": resolve("packages/ui/src/async-state.tsx"),
      "@repo/ui": resolve("tests/browser/ui.ts"),
      "@repo/utils": resolve("packages/utils/src/cn.ts"),
      "@/components/common/modal": resolve(
        "apps/admin/src/components/common/modal.tsx",
      ),
      "@/actions/classActions": resolve("tests/browser/class-fixtures.ts"),
      ...Object.fromEntries(
        [
          "@/actions/stockActions",
          "@/actions/gameDataActions",
          "./edit-class-modal",
          "./class-list-item",
        ].map((key) => [key, resolve("tests/browser/class-fixtures.ts")]),
      ),
    },
  },
  define: {
    "process.env.NEXT_PUBLIC_WEB_APP_URL": JSON.stringify(
      "https://stock.example.test",
    ),
  },
});
