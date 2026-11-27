import { test, expect } from "@playwright/test";

for (const day of [1, 4, 9]) {
  test(`event Day ${day} explains teacher-led progression without a clock promise`, async ({
    page,
  }) => {
    await page.goto(`/tests/events/index.html?view=guidance&day=${day}`);
    await expect(
      page.getByRole("heading", { name: "오늘의 미션" }),
    ).toBeVisible();
    await expect(page.getByRole("listitem").last()).toContainText(
      "선생님이 다음 Day로 진행하면",
    );
    await expect(page.getByText("가상 시장에서 판단을 연습해요")).toBeVisible();
    await expect(page.locator("main")).not.toContainText("내일 오전 9시");
    await expect(page.locator("main")).not.toContainText("실제 투자와 동일한");
    await expect(page.locator("main")).not.toContainText("유망한 주식");
  });
}

test("event final Day offers reflection instead of new trades", async ({
  page,
}) => {
  await page.goto("/tests/events/index.html?view=guidance&day=10");
  await expect(
    page.getByRole("heading", { name: "오늘은 선택을 돌아보는 날" }),
  ).toBeVisible();
  await expect(page.getByText("거래를 마치고 선택을 돌아보세요")).toBeVisible();
  await expect(page.locator("main")).not.toContainText("주식 더 사보기");
  await expect(page.locator("main")).not.toContainText("투자 팁!");
  await expect(page.locator("main")).not.toContainText("내일");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

for (const day of [1, 4, 10]) {
  test(`basic Day ${day} retains existing guidance`, async ({ page }) => {
    await page.goto(
      `/tests/events/index.html?view=guidance&mode=basic&day=${day}`,
    );
    await expect(
      page.getByRole("heading", { name: "오늘의 미션" }),
    ).toBeVisible();
    await expect(page.locator("main")).toContainText("내일 오전 9시");
    await expect(page.locator("main")).not.toContainText("선생님의 진행");
    if (day === 1) await expect(page.getByText("첫날입니다!")).toBeVisible();
    else await expect(page.getByText("투자 팁!")).toBeVisible();
    if (day === 10)
      await expect(page.getByText("마지막 Day에요!")).toBeVisible();
  });
}
