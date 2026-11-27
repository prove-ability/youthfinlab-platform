import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/hydration",
  testMatch: "**/*.spec.ts",
  outputDir: "node_modules/.cache/hydration-results",
  use: { baseURL: "http://127.0.0.1:14314" },
  projects: [
    { name: "desktop-chromium", use: { browserName: "chromium", channel: "chrome" } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next dev tests/hydration --hostname 127.0.0.1 --port 14314",
    url: "http://127.0.0.1:14314",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
