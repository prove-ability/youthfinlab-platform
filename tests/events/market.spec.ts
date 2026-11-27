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
  await expect(page.getByLabel("보통 · 뚜렷한 위기와 반등 체험")).toBeChecked();
  await page.getByLabel("어려움 · 복합 정보와 큰 충격·재하락").check();
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
  await page.getByLabel("어려움 · 복합 정보와 큰 충격·재하락").check();
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
test("first-use guide, fixed path and recording counts are visible to the teacher", async ({
  page,
}) => {
  await page.getByRole("button", { name: "관리자 설정", exact: true }).click();
  await expect(
    page.getByText("기록 완료 0 / 전체 3명", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText("이벤트 수업은 난이도별 사건·가격 경로가 고정", {
      exact: false,
    }),
  ).toBeVisible();
  await page
    .getByText("처음 사용하는 강사를 위한 진행 안내", { exact: true })
    .click();
  await expect(page.getByText("수업 준비:", { exact: false })).toBeVisible();
  await page.getByLabel("진행 Day").selectOption("10");
  await expect(
    page.getByText("최종 회고 Day입니다.", { exact: false }),
  ).toBeVisible();
});
test("additional reasons save and retrospective separates allowance from market change", async ({
  page,
}) => {
  await page.getByLabel("기존 판단을 유지했어요").check();
  await page
    .getByRole("button", { name: "선택 이유 저장", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("저장했어요");
  await page.getByLabel("다른 이유가 있어요").check();
  await page
    .getByRole("button", { name: "선택 이유 저장", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("저장했어요");
  await expect(
    page
      .getByText("시세 변동 손익", { exact: false })
      .filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page
      .getByText("하루 전체 매매 수익률은 아닙니다.", { exact: false })
      .filter({ visible: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 360, height: 780 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
test("unsaved draft survives Day transition without allowing late submission", async ({
  page,
}) => {
  await page.getByLabel("다른 이유가 있어요").check();
  await page.getByLabel("조금 더 설명하기").fill("이 메모는 제출 전입니다");
  await page.getByLabel("진행 Day").selectOption("5");
  const draft = page.getByRole("region", { name: "Day 4 미제출 초안" });
  await expect(draft).toContainText("이 메모는 제출 전입니다");
  await expect(draft).toContainText("제출이 마감");
  await expect(page.getByLabel("조금 더 설명하기")).toHaveValue("");
  await expect(
    draft.getByRole("button", { name: "선택 이유 저장" }),
  ).toHaveCount(0);
});
test("actual management page cancels, retries and advances through Day 6 to the final day", async ({
  page,
}) => {
  await page.goto("/tests/events/index.html?view=manage");
  const next = page.getByRole("button", { name: "Day +1 · 용돈 지급" });
  await expect(next).toBeEnabled();
  page.once("dialog", (d) => d.dismiss());
  await next.click();
  expect(await page.evaluate(() => (window as any).eventAudit.payments)).toBe(
    0,
  );
  await page.evaluate(() => {
    (window as any).eventAudit.failNext = true;
  });
  page.once("dialog", (d) => d.accept());
  await next.click();
  await expect(next).toBeEnabled();
  expect(await page.evaluate(() => (window as any).eventAudit.payments)).toBe(
    0,
  );
  page.on("dialog", (d) => d.accept());
  await next.click();
  await expect
    .poll(() => page.evaluate(() => (window as any).eventAudit.payments))
    .toBe(1);
  for (let day = 5; day < 10; day++) {
    await expect(next).toBeEnabled();
    await next.click();
    await expect
      .poll(() => page.evaluate(() => (window as any).eventAudit.payments))
      .toBe(day - 3);
  }
  await expect(next).toBeDisabled();
});
test("lost advance response refreshes current Day without paying the same Day twice", async ({
  page,
}) => {
  await page.goto("/tests/events/index.html?view=manage");
  page.on("dialog", (d) => d.accept());
  const next = page.getByRole("button", { name: "Day +1 · 용돈 지급" });
  await expect(next).toBeEnabled();
  await page.evaluate(() => {
    (window as any).eventAudit.loseResponse = true;
  });
  await next.click();
  await expect(next).toBeEnabled();
  await expect(
    page.getByText("Day 5 · 이유 기록 현황", { exact: false }),
  ).toBeVisible();
  expect(await page.evaluate(() => (window as any).eventAudit.payments)).toBe(
    1,
  );
});
test("create form defaults to basic and submits an event without AI or separate stock setup", async ({
  page,
}) => {
  await page.goto("/tests/events/index.html?view=create");
  page.on("dialog", (d) => d.accept());
  await expect(page.getByLabel("기본 모드", { exact: true })).toBeChecked();
  await page.getByLabel("금융 위기 이벤트", { exact: true }).check();
  await page.getByLabel("어려움", { exact: true }).check();
  await expect(
    page.getByText("게임 데이터 자동 생성 (AI)", { exact: true }),
  ).toHaveCount(0);
  await page.getByLabel("수업명 *", { exact: true }).fill("새 이벤트 수업");
  await page.locator("#clientId").selectOption("client");
  await page.locator("#managerId").selectOption("manager");
  await page.locator("#start_date").fill("2026-11-27");
  await page.locator("button[type=submit]").click();
  await expect
    .poll(() => page.evaluate(() => (window as any).eventAudit.creates.length))
    .toBe(1);
  expect(await page.evaluate(() => (window as any).eventAudit.aiCalls)).toBe(0);
  expect(
    await page.evaluate(() => (window as any).eventAudit.creates[0]),
  ).toMatchObject({
    eventMode: "crisis",
    eventDifficulty: "hard",
    totalDays: "10",
  });
});
