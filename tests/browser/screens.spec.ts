import { expect, test } from "@playwright/test";
test("completes stock onboarding after navigating backward and forward", async ({
  page,
}) => {
  await page.goto("/tests/browser/index.html?onboarding");
  const next = page.getByRole("button", { name: "다음" });
  await next.click();
  await page.getByRole("button", { name: "이전" }).click();
  await expect(page.getByText(/투자 게임에 오신 걸 환영해요/)).toBeVisible();
  await next.click();
  await next.click();
  await page.getByRole("button", { name: "시작하기" }).click();
  await expect(page).toHaveURL("/");
  expect(
    await page.evaluate(() => localStorage.getItem("onboarding_completed")),
  ).toBe("true");
});
test("seeds eight news items and one price per stock per day", async ({
  page,
}) => {
  await page.goto("/tests/browser/index.html?seed");
  await page.getByRole("button", { name: "데이터 생성 시작" }).click();
  await expect(page.getByText(/게임 데이터 시드 완료/)).toBeVisible();
  const writes = await page.evaluate(
    () =>
      (
        window as Window & {
          seedWrites: { news: { day: number }[]; prices: { day: number }[] };
        }
      ).seedWrites,
  );
  for (let day = 1; day <= 8; day++) {
    expect(writes.news.filter((article) => article.day === day)).toHaveLength(
      8,
    );
    expect(writes.prices.filter((price) => price.day === day)).toHaveLength(1);
  }
});
