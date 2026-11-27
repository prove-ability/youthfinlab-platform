import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/tests/events/index.html");
});
test("student saves a reason, recovers a failed save, and sees it after the Day changes", async ({
  page,
}) => {
  await expect(
    page.getByRole("heading", { name: "자금 조달 불안, 시장 전반으로 확산" }),
  ).toBeVisible();
  await page.getByLabel("저장 실패 재현").check();
  await page.getByLabel("정보가 부족해서 더 지켜보려 해요").check();
  await page
    .getByLabel("조금 더 설명하기")
    .fill("대책이 실제로 효과가 있는지 더 확인하고 싶어요.");
  await page.getByRole("button", { name: "선택 이유 저장" }).click();
  await expect(page.getByRole("alert")).toContainText("저장하지 못했습니다");
  await expect(page.getByLabel("조금 더 설명하기")).toHaveValue(
    "대책이 실제로 효과가 있는지 더 확인하고 싶어요.",
  );
  await page.getByLabel("저장 실패 재현").uncheck();
  await page.getByRole("button", { name: "선택 이유 저장" }).click();
  await expect(page.getByRole("status")).toContainText("저장했어요");
  await page.getByLabel("진행 Day").selectOption("5");
  await expect(
    page.getByRole("heading", { name: "시장 안정 대책이 발표됐습니다" }),
  ).toBeVisible();
  await expect(
    page.getByText("대책이 실제로 효과가 있는지 더 확인하고 싶어요.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByLabel("진행 Day").selectOption("9");
  await expect(
    page.getByRole("button", { name: "선택 이유 저장" }),
  ).toBeVisible();
  await page.getByLabel("진행 Day").selectOption("10");
  await expect(
    page.getByText("거래를 마쳤습니다.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "선택 이유 저장" }),
  ).toHaveCount(0);
});
test("read failure is recoverable without a blank screen", async ({ page }) => {
  await page.getByLabel("읽기 실패 재현").check();
  await expect(page.getByRole("alert")).toContainText("속보");
  await page.getByLabel("읽기 실패 재현").uncheck();
  await expect(
    page.getByRole("heading", { name: "자금 조달 불안, 시장 전반으로 확산" }),
  ).toBeVisible();
});
test("admin config validates selection and displays the actual materialized schedule", async ({
  page,
}) => {
  await page.getByRole("button", { name: "새 수업 설정 체험" }).click();
  await page.getByLabel("금융 위기 이벤트 · 10일 체험").check();
  await page.getByText("고급 설정 · 종목 직접 수정", { exact: true }).click();
  await page.getByLabel("직접 구성 사용", { exact: true }).check();
  await page.getByRole("button", { name: "금융 위기 모드로 확정" }).click();
  await expect(page.getByRole("alert")).toContainText("2~12개");
  await page.getByLabel("새싹테크", { exact: true }).check();
  await page.getByLabel("온기생활", { exact: true }).check();
  await page.getByLabel("가상 기업 특성").nth(1).selectOption("defensive");
  await page.getByRole("button", { name: "금융 위기 모드로 확정" }).click();
  await expect(page.getByText("시나리오 확정", { exact: true })).toBeVisible();
  await page.getByText("교사용 시나리오·가격 확인", { exact: true }).click();
  await expect(page.getByRole("table")).toContainText("7,300원");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
test("current news, labels and controls fit narrow widths with readable text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await expect(
    page.getByRole("heading", { name: "자금 조달 불안, 시장 전반으로 확산" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await page.getByLabel("불확실성에 대비해 현금을 남기려 해요").click();
  await expect(
    page.getByLabel("불확실성에 대비해 현금을 남기려 해요"),
  ).toBeChecked();
  expect(
    await page
      .getByLabel("조금 더 설명하기")
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize)),
  ).toBeGreaterThanOrEqual(16);
});

test("hard mode is opt-in and shows its own news and retrospective", async ({
  page,
}) => {
  await page.getByRole("button", { name: "새 수업 설정 체험" }).click();
  await expect(page.getByLabel("기본 모드 · 기존 뉴스와 거래")).toBeChecked();
  await page.getByLabel("금융 위기 이벤트 · 10일 체험").check();
  await expect(page.getByLabel("보통 · 서로 다른 신호를 비교")).toBeChecked();
  await page.getByLabel("어려움 · 상반된 뉴스와 기업별 반응 비교").check();
  await page.getByText("고급 설정 · 종목 직접 수정", { exact: true }).click();
  await page.getByLabel("직접 구성 사용", { exact: true }).check();
  await page.getByLabel("새싹테크", { exact: true }).check();
  await page.getByLabel("온기생활", { exact: true }).check();
  await page.getByLabel("가상 기업 특성").nth(1).selectOption("defensive");
  await page.getByRole("button", { name: "금융 위기 모드로 확정" }).click();
  await expect(
    page.getByText("어려움 · 복합 정보 판단", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "학생 화면", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "시장 급락 속 공급 계약 소식" }),
  ).toBeVisible();
  await page.getByLabel("정보가 부족해서 더 지켜보려 해요").check();
  await page.getByRole("button", { name: "선택 이유 저장" }).click();
  await expect(page.getByRole("status")).toContainText("저장했어요");
  await page.getByLabel("진행 Day").selectOption("5");
  await expect(
    page.getByText("같은 시장 속보 속에서도", { exact: false }),
  ).toBeVisible();
  await page.getByLabel("진행 Day").selectOption("10");
  await expect(
    page.getByRole("button", { name: "선택 이유 저장" }),
  ).toHaveCount(0);
});

test("default setup needs only mode and difficulty and can recover from custom settings", async ({
  page,
}) => {
  await page.getByRole("button", { name: "새 수업 설정 체험" }).click();
  await page.getByLabel("금융 위기 이벤트 · 10일 체험").check();
  await expect(
    page.getByText("기본 구성 자동 적용", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByLabel("직접 구성 사용", { exact: true }),
  ).not.toBeVisible();
  await page.getByText("고급 설정 · 종목 직접 수정", { exact: true }).click();
  await page.getByLabel("직접 구성 사용", { exact: true }).check();
  await page.getByRole("button", { name: "금융 위기 모드로 확정" }).click();
  await expect(page.getByRole("alert")).toContainText("2~12개");
  await page.getByLabel("직접 구성 사용", { exact: true }).uncheck();
  await page.getByLabel("어려움 · 상반된 뉴스와 기업별 반응 비교").check();
  await page.getByRole("button", { name: "금융 위기 모드로 확정" }).click();
  await expect(page.getByText("시나리오 확정", { exact: true })).toBeVisible();
  await page.getByText("교사용 시나리오·가격 확인", { exact: true }).click();
  await expect(page.getByRole("table")).toContainText("든든산업");
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(4);
});
test("untouched defaults save directly", async ({ page }) => {
  await page.getByRole("button", { name: "새 수업 설정 체험" }).click();
  await page.getByLabel("금융 위기 이벤트 · 10일 체험").check();
  await page.getByRole("button", { name: "금융 위기 모드로 확정" }).click();
  await expect(page.getByText("시나리오 확정", { exact: true })).toBeVisible();
});

test("public bulletin moods change without revealing a price direction", async ({
  page,
}) => {
  const mood = page.locator(".event-mood");
  await expect(mood).toHaveAttribute("data-mood", "crisis");
  await page.getByLabel("진행 Day").selectOption("5");
  await expect(mood).toHaveAttribute("data-mood", "response");
  await page.getByLabel("진행 Day").selectOption("6");
  await expect(mood).toHaveAttribute("data-mood", "caution");
  await page.getByLabel("진행 Day").selectOption("7");
  await expect(mood).toHaveAttribute("data-mood", "review");
  await page.getByLabel("진행 Day").selectOption("1");
  await expect(mood).toHaveAttribute("data-mood", "observe");
  await expect(mood).not.toContainText(/매수|매도|상승|하락/);
});
test("illustration stops after one short animation and stays visible with reduced motion", async ({
  page,
}) => {
  await expect(page.locator(".event-mood")).toBeVisible();
  const sprout = page.locator(".event-mood-sprout");
  const motion = await sprout.evaluate((el) => ({
    name: getComputedStyle(el).animationName,
    iterations: getComputedStyle(el).animationIterationCount,
    duration: getComputedStyle(el).animationDuration,
    staticExpected: matchMedia(
      "(max-width:767px), (pointer:coarse), (prefers-reduced-motion:reduce)",
    ).matches,
  }));
  if (motion.staticExpected) expect(motion.name).toBe("none");
  else {
    expect(motion.iterations).toBe("1");
    expect(parseFloat(motion.duration)).toBeLessThanOrEqual(2);
  }
  await expect
    .poll(() =>
      page
        .locator(".event-mood-scene")
        .evaluate(
          (el) =>
            el
              .getAnimations({ subtree: true })
              .filter((a) => a.playState === "running").length,
        ),
    )
    .toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByLabel("진행 Day").selectOption("5");
  await expect(page.locator(".event-mood")).toHaveAttribute(
    "data-mood",
    "response",
  );
  expect(
    await sprout.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await expect(page.locator(".event-mood-scene")).toBeVisible();
  expect(
    await page
      .locator(".event-mood-document")
      .evaluate((el) => getComputedStyle(el).opacity),
  ).toBe("1");
  await page.setViewportSize({ width: 360, height: 780 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
