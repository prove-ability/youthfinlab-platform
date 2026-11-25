import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "**/*.spec.ts",
  outputDir: "node_modules/.cache/playwright-results",
  use: {
    browserName: "webkit",
    viewport: { width: 390, height: 650 },
    baseURL: "http://127.0.0.1:43519",
  },
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js --config tests/browser/vite.config.mts --host 127.0.0.1 --port 43519 --strictPort",
    url: "http://127.0.0.1:43519/tests/browser/index.html",
  },
});
