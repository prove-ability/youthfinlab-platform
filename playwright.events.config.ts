import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/events",
  testMatch: "**/*.spec.ts",
  outputDir: "node_modules/.cache/event-test-results",
  use: { baseURL: "http://127.0.0.1:14313" },
  projects: [
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
    {
      name: "desktop-chromium",
      use: {
        browserName: "chromium",
        channel: "chrome",
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js --config tests/events/vite.config.mts --host 127.0.0.1 --port 14313 --strictPort",
    url: "http://127.0.0.1:14313/tests/events/index.html",
    reuseExistingServer: true,
  },
});
