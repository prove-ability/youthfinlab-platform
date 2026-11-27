import { test, expect } from "@playwright/test";
const screens = [
  "clients",
  "dashboard",
  "classes",
  "game",
  "stocks",
  "profile",
  "snapshot",
  "report",
  "analysis",
  "home",
  "news",
  "ranking",
  "invest",
];
for (const screen of screens)
  test(`${screen}: failed query can recover without a false redirect`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`/${screen}.html?mode=fail`);
    await expect(page.getByRole("alert")).toBeVisible();
    expect(
      await page.evaluate(() => (window as any).loadingTest.navigation),
    ).toBeNull();
    const retry = page.getByRole("button", { name: "다시 시도", exact: true });
    await retry.click();
    await expect(page.getByRole("alert")).toHaveCount(0);
    if (["snapshot", "report"].includes(screen))
      await expect
        .poll(() => page.evaluate(() => (window as any).loadingTest.navigation))
        .toBe("/simulation/profile");
    else if (screen === "analysis")
      await expect
        .poll(() => page.evaluate(() => (window as any).loadingTest.navigation))
        .toBe("/");
    else await expect(page.locator("#root")).not.toBeEmpty();
    expect(errors).toEqual([]);
  });
test("repeated failure remains recoverable and never claims an empty list", async ({
  page,
}) => {
  await page.goto("/clients.html?mode=always-fail");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "다시 시도", exact: true }),
  ).toBeEnabled();
  await expect(page.getByText("등록된 고객사가 없습니다")).toHaveCount(0);
});
test("background refresh preserves records and recovers with one request", async ({
  page,
}) => {
  await page.goto("/clients.html?mode=success");
  await expect(page.getByText("검증용 교육기관")).toBeVisible();
  await page.getByRole("button", { name: "갱신 실패", exact: true }).click();
  await expect(page.getByText("검증용 교육기관")).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("이전 내용");
  await page.getByRole("button", { name: "갱신 복구", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText("검증용 교육기관")).toBeVisible();
  expect(
    await page.evaluate(() => (window as any).loadingTest.calls.getClients),
  ).toBe(3);
});
test("slow load communicates status and respects reduced motion without overflow", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/stocks.html?mode=slow");
  await expect(page.getByRole("progressbar")).toBeVisible();
  expect(
    await page
      .getByRole("progressbar")
      .evaluate((e) => getComputedStyle(e).animationDuration),
  ).toBe("6s");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await expect(page.getByRole("heading", { name: "주식 관리" })).toBeVisible({
    timeout: 10000,
  });
});

test("class switch keeps selectors but hides stale operations until the new read completes", async ({
  page,
}) => {
  await page.goto("/game.html?mode=success");
  await expect(page.getByLabel("클래스", { exact: true })).toBeEnabled();
  await page.evaluate(() => {
    (window as any).loadingTest.delay = 1500;
  });
  await page.getByLabel("클래스", { exact: true }).selectOption("b");
  await expect(page.getByLabel("고객사", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Day +1 · 용돈 지급", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("tablist")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Day +1 · 용돈 지급", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "갱신 실패", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Day +1 · 용돈 지급", exact: true }),
  ).toBeDisabled();
});

test("profile draft survives a failed refresh and recovery", async ({
  page,
}) => {
  await page.goto("/profile.html?mode=success");
  const age = page.getByPlaceholder("예: 25", { exact: true });
  await age.fill("28");
  await page.getByRole("button", { name: "갱신 실패", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(age).toHaveValue("28");
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "다시 시도", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "갱신 복구", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(age).toHaveValue("28");
});

for (const screen of [
  "clients",
  "dashboard",
  "classes",
  "game",
  "stocks",
  "profile",
  "snapshot",
  "report",
  "analysis",
  "home",
  "news",
  "ranking",
  "invest",
]) {
  test(`${screen}: loading surface is white with a green indicator and specific status`, async ({
    page,
  }) => {
    await page.goto(`/${screen}.html?mode=slow`);
    const progress = page.getByRole("progressbar", { name: /불러오는 중/ });
    await expect(progress).toBeVisible();
    await expect(progress).toHaveCSS("border-top-color", "rgb(25, 57, 31)");
    await expect(page.locator(".yfl-async-state")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(progress).toHaveAccessibleName(/.+불러오는 중…/);
    if (screen === "invest") {
      await expect(progress).toHaveAccessibleName("투자 정보를 불러오는 중…");
      await expect(page.locator("#root > div")).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)",
      );
    }
  });
}
