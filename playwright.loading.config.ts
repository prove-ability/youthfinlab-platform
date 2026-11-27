import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/loading",
  testMatch: "*.spec.ts",
  outputDir: "node_modules/.cache/loading-test-results",
  use: {
    baseURL: "http://127.0.0.1:14312",
    viewport: { width: 390, height: 844 },
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium", channel: "chrome" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: {
    command: "node tests/loading/build.cjs && node tests/loading/serve.cjs",
    url: "http://127.0.0.1:14312",
    reuseExistingServer: !process.env.CI,
  },
  workers: 3,
});
