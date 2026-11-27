import { beforeAll, afterAll, it, expect } from "vitest";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import * as schema from "../packages/db/src/schema";
import { db, engine } from "./database";
import { admin, createSession } from "./identity";
import {
  buildCrisisScenario,
  studentMarketView,
} from "../packages/db/src/crisis-engine";
import {
  configureMarketScenario,
  getMarketScenarioAdmin,
} from "../apps/admin/src/actions/marketScenarioActions";
import {
  getStudentMarketScenario,
  saveMarketDecision,
} from "../apps/stock-sim/actions/marketScenario";
import {
  incrementDayAndPayAllowance,
  updateClassCurrentDay,
  updateClass,
} from "../apps/admin/src/actions/classActions";
import {
  createStockPrice,
  updateStockPrice,
  deleteStockPrice,
  createGameDay,
} from "../apps/admin/src/actions/gameActions";
import { createNews, deleteNews } from "../apps/admin/src/actions/newsActions";
import { getNewsByDay } from "../apps/stock-sim/actions/news";
import { getStockHistory } from "../apps/stock-sim/actions/stockHistory";
import { buyStock, sellStock } from "../apps/stock-sim/actions/trades";
const { generateDrizzleJson, generateMigration } = createRequire(
  import.meta.url,
)("drizzle-kit/api");
beforeAll(async () => {
  for (const sql of await generateMigration(
    generateDrizzleJson({}),
    generateDrizzleJson(schema),
  ))
    await engine.exec(sql);
});
afterAll(() => engine.close());
async function fixture(configure = true) {
  const [client] = await db
    .insert(schema.clients)
    .values({ name: "격리 테스트", createdBy: admin.id })
    .returning();
  const [manager] = await db
    .insert(schema.managers)
    .values({ name: "강사", createdBy: admin.id, clientId: client.id })
    .returning();
  const [course] = await db
    .insert(schema.classes)
    .values({
      name: "위기 체험",
      code: randomUUID(),
      createdBy: admin.id,
      clientId: client.id,
      managerId: manager.id,
      totalDays: 8,
    })
    .returning();
  const stocks = await db
    .insert(schema.stocks)
    .values(
      ["가상 기술", "가상 생활"].map((name) => ({
        name,
        industrySector: "가상",
        marketCountryCode: "KR" as const,
        createdBy: admin.id,
      })),
    )
    .returning();
  const config = {
    classId: course.id,
    difficulty: "normal" as const,
    stocks: stocks.map((s, i) => ({
      stockId: s.id,
      exposure: i === 0 ? ("sensitive" as const) : ("defensive" as const),
      initialPrice: 10000,
    })),
  };
  if (configure) await configureMarketScenario(config);
  return { course, stocks, config };
}
async function studentFor(classId: string, name = "학생") {
  const [guest] = await db
    .insert(schema.guests)
    .values({
      classId,
      name,
      mobilePhone: "",
      affiliation: "",
      grade: "",
      loginId: randomUUID(),
      password: "local-test",
    })
    .returning();
  const [wallet] = await db
    .insert(schema.wallets)
    .values({ guestId: guest.id, balance: "100000" })
    .returning();
  await createSession({
    id: guest.id,
    classId,
    name: guest.name,
    loginId: guest.loginId,
  });
  return { guest, wallet };
}
it("materializes the same ten-day path for everyone, with bounded easy mode", () => {
  const stocks = [
    {
      stockId: "a",
      name: "A",
      exposure: "sensitive" as const,
      initialPrice: 10000,
    },
    {
      stockId: "b",
      name: "B",
      exposure: "defensive" as const,
      initialPrice: 10000,
    },
  ];
  const normal = buildCrisisScenario(stocks, "normal"),
    easy = buildCrisisScenario(stocks, "easy");
  expect(buildCrisisScenario(stocks, "normal")).toEqual(normal);
  expect(normal.days[3].prices.map((p) => p.price)).toEqual([7300, 9400]);
  expect(easy.days[3].prices[0].price).toBeGreaterThan(
    normal.days[3].prices[0].price,
  );
  expect(() => buildCrisisScenario([stocks[0], stocks[0]], "normal")).toThrow();
  expect(() =>
    buildCrisisScenario(
      stocks.map((s) => ({ ...s, exposure: "sensitive" })),
      "normal",
    ),
  ).toThrow();
  const view = studentMarketView(normal, 3, "active", []);
  expect(view.history.map((h) => h.day)).toEqual([1, 2]);
  expect(JSON.stringify(view)).not.toContain(normal.days[3].news);
  expect(JSON.stringify(view)).not.toContain(normal.days[2].explanation);
  expect(JSON.stringify(view)).not.toContain("7300");
});
it("configures atomically and retries without duplicate prices or news", async () => {
  const f = await fixture();
  await configureMarketScenario(f.config);
  expect(
    await db
      .select()
      .from(schema.classStockPrices)
      .where(eq(schema.classStockPrices.classId, f.course.id)),
  ).toHaveLength(20);
  expect(
    await db
      .select()
      .from(schema.news)
      .where(eq(schema.news.classId, f.course.id)),
  ).toHaveLength(10);
  expect(
    (
      await db.query.classes.findFirst({
        where: eq(schema.classes.id, f.course.id),
      })
    ).totalDays,
  ).toBe(10);
});
it("leaves basic mode and existing class data intact", async () => {
  const f = await fixture(false);
  await studentFor(f.course.id);
  expect(await getStudentMarketScenario()).toBeNull();
  await createStockPrice({
    classId: f.course.id,
    stockId: f.stocks[0].id,
    day: 1,
    price: "20000",
  });
  await expect(configureMarketScenario(f.config)).rejects.toThrow(
    "기존 데이터",
  );
  expect(
    await db.query.classMarketScenarios.findFirst({
      where: eq(schema.classMarketScenarios.classId, f.course.id),
    }),
  ).toBeUndefined();
  expect(
    (
      await db.query.classStockPrices.findFirst({
        where: eq(schema.classStockPrices.classId, f.course.id),
      })
    ).price,
  ).toBe("20000");
  await updateClassCurrentDay(f.course.id, 2);
});
it("rejects foreign classes, foreign stocks, and invalid settings without partial writes", async () => {
  const f = await fixture(false);
  await expect(
    configureMarketScenario({
      ...f.config,
      stocks: [
        f.config.stocks[0],
        { ...f.config.stocks[1], stockId: randomUUID() },
      ],
    }),
  ).rejects.toThrow();
  await db
    .update(schema.classes)
    .set({ createdBy: randomUUID() })
    .where(eq(schema.classes.id, f.course.id));
  await expect(configureMarketScenario(f.config)).rejects.toThrow("접근");
  await expect(getMarketScenarioAdmin(f.course.id)).rejects.toThrow("권한");
  expect(
    await db
      .select()
      .from(schema.classStockPrices)
      .where(eq(schema.classStockPrices.classId, f.course.id)),
  ).toHaveLength(0);
});
it("protects scenario prices, news and progression from alternative edit paths", async () => {
  const f = await fixture();
  const price = await db.query.classStockPrices.findFirst({
    where: eq(schema.classStockPrices.classId, f.course.id),
  });
  const article = await db.query.news.findFirst({
    where: eq(schema.news.classId, f.course.id),
  });
  await expect(
    createStockPrice({
      classId: f.course.id,
      stockId: f.stocks[0].id,
      day: 1,
      price: "1",
    }),
  ).rejects.toThrow("확정");
  await expect(updateStockPrice({ ...price, price: "1" })).rejects.toThrow(
    "확정",
  );
  await expect(deleteStockPrice(price.id)).rejects.toThrow("확정");
  await expect(
    createNews({
      classId: f.course.id,
      day: 1,
      title: "변경",
      content: "변경",
      relatedStockIds: [],
    }),
  ).rejects.toThrow("확정");
  await expect(deleteNews(article.id)).rejects.toThrow("확정");
  await expect(
    createGameDay({
      classId: f.course.id,
      day: 1,
      stocks: [],
      news: [{ title: "변경", content: "변경" }],
    }),
  ).rejects.toThrow("확정");
  await expect(updateClassCurrentDay(f.course.id, 5)).rejects.toThrow("Day +1");
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: "변경",
    totalDays: 9,
    clientId: f.course.clientId,
    managerId: f.course.managerId,
  }))
    form.set(key, String(value));
  expect((await updateClass(f.course.id, form)).error).toBeDefined();
});
it("records only own current-day reasons, preserves them after advancement and hides future news", async () => {
  const f = await fixture();
  const { guest } = await studentFor(f.course.id);
  await expect(
    saveMarketDecision({ day: 1, reason: "cash", note: "현금" }),
  ).rejects.toThrow("진행 중");
  await db
    .update(schema.classes)
    .set({ status: "active" })
    .where(eq(schema.classes.id, f.course.id));
  await saveMarketDecision({
    day: 1,
    reason: "cash",
    note: "현금을 남겨 두기",
  });
  await saveMarketDecision({ day: 1, reason: "spread", note: "위험 나누기" });
  expect((await getStudentMarketScenario()).decision.reason).toBe("spread");
  expect(await getNewsByDay(4)).toEqual([]);
  expect((await getStockHistory(f.stocks[0].id)).priceHistory).toHaveLength(1);
  await expect(
    saveMarketDecision({ day: 1, reason: "cash", note: "x".repeat(501) }),
  ).rejects.toThrow();
  expect((await incrementDayAndPayAllowance(f.course.id, 1)).success).toBe(
    true,
  );
  expect((await incrementDayAndPayAllowance(f.course.id, 1)).success).toBe(
    false,
  );
  await expect(
    saveMarketDecision({ day: 1, reason: "cash", note: "뒤늦게 변경" }),
  ).rejects.toThrow("Day가 바뀌");
  expect((await getStudentMarketScenario()).history[0].decision.reason).toBe(
    "spread",
  );
  await studentFor(f.course.id, "다른 학생");
  expect((await getStudentMarketScenario()).history[0].decision).toBeNull();
  const teacher = await getMarketScenarioAdmin(f.course.id);
  expect(teacher.decisions).toHaveLength(1);
  expect(
    await db
      .select()
      .from(schema.marketEventDecisions)
      .where(eq(schema.marketEventDecisions.guestId, guest.id)),
  ).toHaveLength(1);
});
it("uses materialized event prices for trading and stops trades and reasons on the final day", async () => {
  const f = await fixture();
  const { wallet } = await studentFor(f.course.id);
  await db
    .update(schema.classes)
    .set({ status: "active", currentDay: 4 })
    .where(eq(schema.classes.id, f.course.id));
  expect((await buyStock(f.stocks[0].id, 1, "100", 4)).success).toBe(false);
  expect((await buyStock(f.stocks[0].id, 1.5, "7300", 4)).success).toBe(false);
  expect((await buyStock(f.stocks[0].id, 2, "7300", 4)).success).toBe(true);
  expect((await sellStock(f.stocks[0].id, 1, "7300", 4)).success).toBe(true);
  expect(
    (
      await db.query.wallets.findFirst({
        where: eq(schema.wallets.id, wallet.id),
      })
    ).balance,
  ).toBe("92700.00");
  expect((await buyStock(f.stocks[0].id, 1, "7300", 3)).dayMismatch).toBe(true);
  await db
    .update(schema.classes)
    .set({ currentDay: 10 })
    .where(eq(schema.classes.id, f.course.id));
  expect((await buyStock(f.stocks[0].id, 1, "8600", 10)).success).toBe(false);
  expect((await incrementDayAndPayAllowance(f.course.id, 10)).success).toBe(
    false,
  );
  await expect(
    saveMarketDecision({ day: 5, reason: "wait", note: "" }),
  ).rejects.toThrow();
  const final = await getStudentMarketScenario();
  expect(final.canDecide).toBe(false);
  expect(final.history).toHaveLength(9);
});

it("keeps day 9 writable, ends day 10, and preserves stored six-day boundaries", async () => {
  const f = await fixture();
  await studentFor(f.course.id);
  await db
    .update(schema.classes)
    .set({ status: "active", currentDay: 9 })
    .where(eq(schema.classes.id, f.course.id));
  await saveMarketDecision({ day: 9, reason: "wait", note: "마지막 판단" });
  expect((await getStudentMarketScenario()).canDecide).toBe(true);
  expect((await buyStock(f.stocks[0].id, 1, "8800", 9)).success).toBe(true);
  expect((await incrementDayAndPayAllowance(f.course.id, 9)).success).toBe(
    true,
  );
  await expect(
    saveMarketDecision({ day: 10, reason: "wait", note: "" }),
  ).rejects.toThrow("마지막 Day");
  expect((await getStudentMarketScenario()).history).toHaveLength(9);
  const stored = await db.query.classMarketScenarios.findFirst({
    where: eq(schema.classMarketScenarios.classId, f.course.id),
  });
  const legacy = { ...stored.scenario, days: stored.scenario.days.slice(0, 6) };
  await db
    .update(schema.classMarketScenarios)
    .set({ scenario: legacy })
    .where(eq(schema.classMarketScenarios.classId, f.course.id));
  await db
    .update(schema.classes)
    .set({ currentDay: 6, totalDays: 6 })
    .where(eq(schema.classes.id, f.course.id));
  const view = await getStudentMarketScenario();
  expect(view.totalDays).toBe(6);
  expect(view.canDecide).toBe(false);
  expect(view.history).toHaveLength(5);
  await expect(
    saveMarketDecision({ day: 6, reason: "wait", note: "" }),
  ).rejects.toThrow("마지막 Day");
  expect((await buyStock(f.stocks[0].id, 1, "7000", 6)).success).toBe(false);
  expect((await incrementDayAndPayAllowance(f.course.id, 6)).success).toBe(
    false,
  );
  await configureMarketScenario(f.config);
  expect(
    (await getMarketScenarioAdmin(f.course.id)).scenario.days,
  ).toHaveLength(6);
});

it("adds hard information and cross-stock reversals without changing normal/easy paths", () => {
  const stocks = ["sensitive", "balanced", "defensive"].map((exposure, i) => ({
    stockId: String(i),
    name: "가상 " + i,
    exposure: exposure as "sensitive" | "balanced" | "defensive",
    initialPrice: 10000,
  }));
  const normal = buildCrisisScenario(stocks, "normal"),
    easy = buildCrisisScenario(stocks, "easy"),
    hard = buildCrisisScenario(stocks, "hard");
  const expected = [
    [100, 104, 98, 73, 79, 70, 74, 82, 88, 86],
    [100, 102, 100, 84, 89, 83, 87, 91, 94, 95],
    [100, 101, 102, 94, 95, 93, 95, 97, 99, 98],
  ];
  for (let i = 0; i < 3; i++) {
    expect(normal.days.map((d) => d.prices[i].price)).toEqual(
      expected[i].map((p) => p * 100),
    );
    expect(easy.days.map((d) => d.prices[i].price)).toEqual(
      expected[i].map((p) => (100 + (p - 100) * 0.5) * 100),
    );
  }
  expect(hard.days).toHaveLength(10);
  expect(buildCrisisScenario(stocks, "hard")).toEqual(hard);
  expect(hard.days[4].prices[0].price).toBeGreaterThan(
    hard.days[3].prices[0].price,
  );
  expect(hard.days[4].prices[2].price).toBeLessThan(
    hard.days[3].prices[2].price,
  );
  expect(hard.days[5].prices[0].price).toBeLessThan(
    hard.days[4].prices[0].price,
  );
  expect(hard.days[5].prices[2].price).toBeGreaterThan(
    hard.days[4].prices[2].price,
  );
  hard.days.forEach((d, i) => {
    expect(d.news).not.toBe(normal.days[i].news);
    expect(
      d.prices.every((p) => Number.isSafeInteger(p.price) && p.price > 0),
    ).toBe(true);
  });
  const view = studentMarketView(hard, 5, "active", []);
  expect(view.history).toHaveLength(4);
  expect(JSON.stringify(view)).not.toContain(hard.days[5].news);
  expect(JSON.stringify(view)).not.toContain(hard.days[4].explanation);
});
it("persists hard scenarios while retaining normal base rules and trading actual hard prices", async () => {
  const f = await fixture(false);
  await configureMarketScenario({ ...f.config, difficulty: "hard" });
  const teacher = await getMarketScenarioAdmin(f.course.id);
  expect(teacher.scenario.difficulty).toBe("hard");
  expect(teacher.scenario.days).toHaveLength(10);
  const course = await db.query.classes.findFirst({
    where: eq(schema.classes.id, f.course.id),
  });
  expect(course.difficulty).toBe("normal");
  await studentFor(f.course.id);
  await db
    .update(schema.classes)
    .set({ status: "active", currentDay: 4 })
    .where(eq(schema.classes.id, f.course.id));
  expect((await buyStock(f.stocks[0].id, 1, "7300", 4)).success).toBe(false);
  expect((await buyStock(f.stocks[0].id, 1, "7500", 4)).success).toBe(true);
  await saveMarketDecision({
    day: 4,
    reason: "wait",
    note: "상반된 정보를 더 살펴봅니다",
  });
  expect((await incrementDayAndPayAllowance(f.course.id, 4)).success).toBe(
    true,
  );
  expect((await getStudentMarketScenario()).history[3].decision.note).toContain(
    "상반된",
  );
});
