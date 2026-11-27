import { test, expect } from "@playwright/test";

test("SSR styles are in head before JavaScript runs", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(page.getByRole("heading", { name: "관리자 초기화 검증" })).toBeVisible();
    expect(await page.locator('head style[data-emotion^="css-global"]').count()).toBeGreaterThan(0);
    await expect(page.locator("body style[data-emotion]")).toHaveCount(0);
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  } finally {
    await context.close();
  }
});

test("initial hydration, interaction, navigation and reload stay error-free", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "확인 0", exact: true }).click();
  await expect(page.getByRole("button", { name: "확인 1", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "다음 화면" }).click();
  await expect(page).toHaveURL(/\/second$/);
  await page.reload();
  await page.getByRole("button", { name: "확인 0", exact: true }).click();
  await expect(page.getByRole("button", { name: "확인 1", exact: true })).toBeVisible();
  await expect(page.locator("body style[data-emotion]")).toHaveCount(0);
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  expect(errors).toEqual([]);
});
