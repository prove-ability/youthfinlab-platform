import { test, expect } from "@playwright/test";

test("static CSS preserves the workspace before JavaScript runs without Emotion", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    await expect(
      page.getByRole("heading", { name: "관리자 초기화 검증" }),
    ).toBeVisible();
    await expect(page.locator("style[data-emotion]")).toHaveCount(0);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator("body")).toHaveCSS("font-size", "16px");
    await expect(page.locator("body")).toHaveCSS("line-height", "24px");
    await expect(page.locator("body")).toHaveCSS(
      "color",
      "rgba(0, 0, 0, 0.87)",
    );
    await expect(page.locator("input")).toHaveCSS("box-sizing", "border-box");
    await expect(page.locator("strong")).toHaveCSS("font-weight", "700");
  } finally {
    await context.close();
  }
});

test("initial hydration, interaction, navigation and reload stay error-free", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "확인 0", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "확인 1", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "다음 화면" }).click();
  await expect(page).toHaveURL(/\/second$/);
  await page.reload();
  await page.getByRole("button", { name: "확인 0", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "확인 1", exact: true }),
  ).toBeVisible();
  await expect(page.locator("body style[data-emotion]")).toHaveCount(0);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  expect(errors).toEqual([]);
});

test("workspace defaults do not leak after client navigation outside the workspace", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS(
    "font-family",
    "Roboto, Helvetica, Arial, sans-serif",
  );
  await page.getByRole("link", { name: "외부 화면" }).click();
  await expect(page).toHaveURL(/\/outside$/);
  await expect(page.locator("body")).not.toHaveCSS(
    "font-family",
    "Roboto, Helvetica, Arial, sans-serif",
  );
  await expect(page.locator("body")).toHaveCSS("letter-spacing", "normal");
  await expect(page.locator("style[data-emotion]")).toHaveCount(0);
});
