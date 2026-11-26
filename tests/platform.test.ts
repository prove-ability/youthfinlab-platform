import * as stockAuth from "../apps/stock-sim/actions/auth";
import * as financeAuth from "../apps/finance-sim/actions/auth";
import * as dashboardActions from "../apps/admin/src/actions/dashboardActions";
import * as marketNews from "../apps/stock-sim/actions/news";
import * as market from "../apps/stock-sim/actions/stocks";
import { getGameProgress as studentProgress } from "../apps/stock-sim/actions/dashboard";
import { checkNeedsSetup } from "../apps/stock-sim/actions/profile";
import { beforeAll, afterAll, it, expect, vi } from "vitest";
import { createRequire } from "node:module";
import * as schema from "../packages/db/src/schema";
import { db, engine } from "./database";
import { student } from "./identity";
import * as clients from "../apps/admin/src/actions/clientActions";
import * as managers from "../apps/admin/src/actions/managerActions";
import * as classes from "../apps/admin/src/actions/classActions";
import * as stocks from "../apps/admin/src/actions/stockActions";
import { generateGameData } from "../apps/admin/src/actions/gameDataActions";
import * as stockQR from "../apps/stock-sim/actions/qr-auth";
import * as financeQR from "../apps/finance-sim/actions/qr-auth";
import { buyStock, sellStock } from "../apps/stock-sim/actions/trades";
import { submitSurvey } from "../apps/stock-sim/actions/survey";
import * as finance from "../apps/finance-sim/actions/simulation";
import { eq } from "drizzle-orm";
import * as adminNews from "../apps/admin/src/actions/newsActions";
import * as game from "../apps/admin/src/actions/gameActions";
import * as users from "../apps/admin/src/actions/userActions";
import * as reports from "../apps/admin/src/actions/financeSimActions";
import * as surveys from "../apps/admin/src/actions/surveyActions";
import {
  getDashboardStats,
  getDashboardAll,
} from "../apps/admin/src/actions/dashboardActions";
import { verifyCredentials } from "../apps/stock-sim/lib/auth";
import { verifyCredentials as verifyFinance } from "../apps/finance-sim/lib/auth";
import { getTransactionHistory } from "../apps/stock-sim/actions/transactions";
import { getClassRanking } from "../apps/stock-sim/actions/ranking";
import { getDashboardData } from "../apps/stock-sim/actions/dashboard";
import { getStocksForInvest } from "../apps/stock-sim/actions/stocks";
import { getStockHistory } from "../apps/stock-sim/actions/stockHistory";
import { getAllNews } from "../apps/stock-sim/actions/news";
import {
  updateNickname,
  updatePassword,
} from "../apps/stock-sim/actions/profile";
import { createSession } from "./identity";
const { generateDrizzleJson, generateMigration } = createRequire(
  import.meta.url,
)("drizzle-kit/api");

beforeAll(async () => {
  const ddl = await generateMigration(
    generateDrizzleJson({}),
    generateDrizzleJson(schema),
  );
  for (const statement of ddl) await engine.exec(statement);
});
afterAll(async () => {
  await engine.close();
});

function form(values) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values))
    data.set(key, String(value));
  return data;
}
async function course(programType) {
  const client = await clients.createClientAction(
    form({ name: "테스트 고객사" }),
  );
  expect(client.success).toBe(true);
  const manager = await managers.createManager(
    client.data.id,
    form({ name: "담당자", mobile_phone: "", email: "" }),
  );
  expect(manager.success).toBe(true);
  const result = await classes.createClass(
    form({
      name: "수업",
      managerId: manager.data.id,
      clientId: client.data.id,
      programType,
      loginMethod: "qr",
      totalDays: 2,
    }),
  );
  const id = result.data.id;
  expect(result.data.code).toMatch(/^[A-Z0-9]{6}$/);
  expect((await classes.updateClassStatus(id, "active")).success).toBe(true);
  return id;
}

it("rejects missing client and class names", async () => {
  expect((await clients.createClientAction(form({ name: "" }))).success).toBe(
    false,
  );
  expect((await classes.createClass(form({}))).error.name).toBeDefined();
});

it("creates stock game, validates QR, trades against the wallet and saves feedback", async () => {
  const id = await course("stock_game");
  const token = await classes.generateQRToken(id);
  expect((await stockQR.verifyQRToken(token.qrToken, id)).success).toBe(true);
  expect((await financeQR.verifyQRToken(token.qrToken, id)).success).toBe(
    false,
  );
  expect((await stockQR.verifyQRToken("wrong", id)).success).toBe(false);
  expect((await stockQR.createQRGuestSession(id, "학생")).success).toBe(true);
  const stock = await stocks.createStock({
    name: "종목",
    industrySector: "IT",
    marketCountryCode: "KR",
  });
  expect(await stocks.getStocks()).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: stock.id })]),
  );
  expect((await buyStock(stock.id, 2, "1000", 2)).success).toBe(false);
  expect((await buyStock(stock.id, 2, "1000", 1)).success).toBe(true);
  expect((await sellStock(stock.id, 3, "1200", 1)).success).toBe(false);
  expect((await sellStock(stock.id, 1, "1200", 1)).success).toBe(true);
  const wallet = await db.query.wallets.findFirst({
    where: eq(schema.wallets.guestId, student.id),
  });
  expect(Number(wallet.balance)).toBe(1999200);
  expect((await submitSurvey({ rating: 5, feedback: "좋아요" })).success).toBe(
    true,
  );
});

it("saves each finance stage and reloads the completed report", async () => {
  const id = await course("finance_sim");
  const token = await classes.generateQRToken(id);
  expect((await financeQR.verifyQRToken(token.qrToken, id)).success).toBe(true);
  expect((await financeQR.createQRGuestSession(id, "재무학생")).success).toBe(
    true,
  );
  const initial = await finance.getOrCreateSimulation();
  expect(initial.currentStep).toBe(1);
  await expect(finance.saveInvestmentTendency({})).rejects.toThrow();
  await finance.saveProfile({
    age: 20,
    currentStatus: "student",
    monthlyIncome: 2000000,
    monthlyFixedExpenses: 900000,
    cashAssets: 100000,
    investmentAssets: null,
    hasDebt: false,
    totalDebtAmount: null,
  });
  await finance.saveSavingsInvestmentResult({
    monthlyAmount: 100000,
    periodYears: 3,
    savingsRatio: 50,
    investmentRatio: 50,
    investmentReturnRate: 5,
    totalDeposited: 3600000,
    finalSavingsAmount: 1800000,
    finalInvestmentAmount: 1900000,
  });
  await finance.savePensionResult({
    currentAge: 20,
    startTiming: "now",
    monthlyContribution: 100000,
    retirementAge: 65,
    totalContributed: 54000000,
    estimatedAssetAtRetirement: 80000000,
    estimatedMonthlyPension: 300000,
  });
  await finance.saveInvestmentTendency({
    answers: { q1: 3 },
    totalScore: 3,
    tendencyType: "balanced",
  });
  const report = await finance.getOrCreateSimulation();
  expect(report).toMatchObject({
    id: initial.id,
    currentStep: 6,
    profile: { age: 20 },
    investmentTendency: { totalScore: 3 },
  });
  expect(await reports.getStudentSimulation(initial.id)).toMatchObject({
    id: initial.id,
  });
  expect(await reports.getClassSimulationSummary(id)).toMatchObject({
    simCount: 1,
    completedCount: 1,
  });
  expect(await reports.getClassSimulationDetails(id)).toEqual([
    expect.objectContaining({ id: initial.id }),
  ]);
  expect(await reports.getFinanceSimClasses()).toEqual(
    expect.arrayContaining([expect.objectContaining({ id })]),
  );
  expect(report.completedAt).toBeTruthy();
});

it("rejects unknown AI stock IDs and stores a retried generation once", async () => {
  const classId = await course("stock_game");
  const stock = await stocks.createStock({
    name: "AI 종목",
    industrySector: "IT",
    marketCountryCode: "US",
  });
  const params = { classId, stocks: [stock], totalDays: 2 };
  const response = (id) =>
    Response.json({
      choices: [
        {
          finish_reason: "stop",
          message: {
            content: JSON.stringify({
              days: [
                {
                  day: 1,
                  news: [
                    { title: "뉴스", content: "내용", relatedStockIds: [id] },
                  ],
                  prices: [{ stockId: id, price: 1000 }],
                },
                { day: 2, news: [], prices: [{ stockId: id, price: 1100 }] },
              ],
            }),
          },
        },
      ],
    });
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(response("invalid"))
    .mockResolvedValueOnce(response(stock.id));
  vi.stubEnv("OPENAI_API_KEY", "test");
  vi.stubGlobal("fetch", fetch);
  try {
    expect((await generateGameData(params)).success).toBe(false);
    expect((await generateGameData(params)).success).toBe(true);
    expect((await generateGameData(params)).success).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(
      await db
        .select()
        .from(schema.classStockPrices)
        .where(eq(schema.classStockPrices.classId, classId)),
    ).toHaveLength(2);
    expect(await adminNews.getNewsByClassAndDay(classId, 1)).toHaveLength(1);
  } finally {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  }
});

vi.mock("../apps/stock-sim/lib/session", () => import("./identity"));

it("connects roster, account login, market information, ranking, allowance and survey reports", async () => {
  const classId = await course("stock_game");
  const cls = await db.query.classes.findFirst({
    where: eq(schema.classes.id, classId),
  });
  const account = await users.createUser(
    form({
      name: "학생1",
      phone: "01000000000",
      grade: "1",
      school_name: "학교",
      class_id: classId,
    }),
  );
  expect(account.success).toBe(true);
  const login = await verifyCredentials("학생1", "pw1234", cls.code);
  expect(login.success).toBe(true);
  expect((await verifyCredentials("학생1", "wrong", cls.code)).success).toBe(
    false,
  );
  expect((await verifyFinance("학생1", "pw1234", cls.code)).success).toBe(
    false,
  );
  await createSession(login.user);
  expect((await updateNickname("새별명")).success).toBe(true);
  expect((await updatePassword("pw1234", "changed-password")).success).toBe(
    true,
  );
  expect(
    (await verifyCredentials("학생1", "changed-password", cls.code)).success,
  ).toBe(true);
  const stock = await stocks.createStock({
    name: "가격 테스트",
    industrySector: "IT",
    marketCountryCode: "KR",
  });
  const article = await adminNews.createNews({
    classId,
    day: 1,
    title: "시장 소식",
    content: "내용",
    relatedStockIds: [stock.id],
  });
  await game.createStockPrice({
    classId,
    day: 1,
    stockId: stock.id,
    price: "5000",
  });
  expect(await marketNews.getCurrentDayNews()).toEqual([
    expect.objectContaining({ id: article.id }),
  ]);
  expect(await game.getGameProgress(classId)).toMatchObject({ totalPrices: 1 });
  expect((await getAllNews()).news).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: article.id })]),
  );
  expect(await getStockHistory(stock.id)).toMatchObject({ currentPrice: 5000 });
  expect((await getStocksForInvest()).stocks).toHaveLength(1);
  expect((await getDashboardData()).currentDay).toBe(1);
  expect((await getClassRanking()).rankings).toHaveLength(1);
  expect((await classes.incrementDayAndPayAllowance(classId)).success).toBe(
    true,
  );
  expect(
    (await getTransactionHistory()).some(
      (tx) => tx.day === 2 && tx.subType === "benefit",
    ),
  ).toBe(true);
  await submitSurvey({ rating: 4, feedback: "의견" });
  expect((await surveys.getSurveysByClass(classId)).success).toBe(true);

  for (const entries of [
    await marketNews.getNewsByDay(1),
    await marketNews.getNewsByStock(stock.id),
    await adminNews.getNews(1),
  ]) {
    expect(entries).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: article.id })]),
    );
  }
  expect(await adminNews.getNewsCountByDay(1)).toBeGreaterThan(0);
  expect(await market.getStockById(stock.id)).toMatchObject({ id: stock.id });
  expect(await market.getStockInfo([stock.id])).toEqual([
    expect.objectContaining({ id: stock.id }),
  ]);
  expect(await market.getStocksWithPrices()).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: stock.id })]),
  );
  expect(await studentProgress()).toMatchObject({ currentDay: 2 });
  expect(await checkNeedsSetup()).toMatchObject({ needsSetup: false });
  expect(await surveys.getSurveyByGuest(student.id)).toMatchObject({
    data: { rating: 4 },
  });
  expect(await users.getStudentGameHistory(student.id)).toMatchObject({
    data: { currentDay: 2 },
  });
  expect(
    await game.getGameManagementData({
      selectedClassId: classId,
      selectedDay: 1,
    }),
  ).toMatchObject({ gameProgress: { totalPrices: 1 } });
  await adminNews.deleteNews(article.id);
  expect(await adminNews.getNewsByClassAndDay(classId, 1)).toHaveLength(0);
});

it("filters admin finance reports by class", async () => {
  const classId = await course("finance_sim");
  expect(await reports.getClassSimulationSummary(classId)).toMatchObject({
    simCount: 0,
    completedCount: 0,
  });
  expect(await reports.getClassSimulationDetails(classId)).toEqual([]);
  expect(await reports.getStudentSimulation(crypto.randomUUID())).toBeNull();
});

it("loads the admin dashboard used by the page", async () => {
  await course("finance_sim");
  const result = await getDashboardAll();
  expect(result.success, result.error).toBe(true);
  expect(result.data.stats.totalClasses).toBeGreaterThanOrEqual(1);
});

it("returns dashboard counts with multiple classes", async () => {
  await course("finance_sim");
  await course("stock_game");
  const result = await getDashboardStats();
  expect(result.success, result.error).toBe(true);
  expect(result.data.totalClasses).toBeGreaterThanOrEqual(2);
});

it("edits and removes a class, manager, and client without affecting other clients", async () => {
  const id = await course("stock_game");
  const cls = await db.query.classes.findFirst({
    where: eq(schema.classes.id, id),
  });
  const fields = form({
    name: "수정된 수업",
    managerId: cls.managerId,
    clientId: cls.clientId,
    totalDays: 4,
  });
  await classes.updateClass(id, fields);
  expect(
    await db.query.classes.findFirst({ where: eq(schema.classes.id, id) }),
  ).toMatchObject({ name: "수정된 수업", totalDays: 4 });
  await classes.updateClassCurrentDay(id, 2);
  expect((await classes.updateClassStatus(id, "ended")).success).toBe(true);
  expect((await classes.updateClassStatus(id, "active")).success).toBe(false);
  expect(
    (
      await managers.updateManager(
        cls.managerId,
        form({ name: "수정 담당자", email: "", mobile_phone: "" }),
      )
    ).success,
  ).toBe(true);
  expect(
    (
      await clients.updateClientAction(
        cls.clientId,
        {},
        form({ name: "변경 고객사" }),
      )
    ).success,
  ).toBe(true);
  expect(
    (await clients.getClients()).data.some((c) => c.name === "변경 고객사"),
  ).toBe(true);
  await classes.deleteClass(id);
  expect(
    await db.query.classes.findFirst({ where: eq(schema.classes.id, id) }),
  ).toBeUndefined();
  expect((await managers.deleteManager(cls.managerId)).success).toBe(true);
  expect((await clients.deleteClientAction(cls.clientId)).success).toBe(true);
  expect(
    (await clients.getClients()).data.some((c) => c.id === cls.clientId),
  ).toBe(false);
});

it("manages the roster through bulk import, search, editing, and removal", async () => {
  const classId = await course("stock_game");
  const students = ["학생A", "학생B"].map((name) => ({
    name,
    mobilePhone: "01000000000",
    grade: "1",
    affiliation: "학교",
    classId,
  }));
  await users.bulkCreateUsers(students);
  const roster = await users.getUsersByClass(classId);
  expect(roster.data).toHaveLength(2);
  expect((await users.getUsersByClass(classId, "학생B")).data).toHaveLength(1);
  await users.updateUser(roster.data[0].id, {
    ...students[0],
    name: "편집학생",
    loginId: "edited",
  });
  expect((await users.getUsersByClass(classId, "편집학생")).data).toHaveLength(
    1,
  );
  await users.deleteGuests(
    roster.data.map((g) => g.id),
    classId,
  );
  expect((await users.getUsersByClass(classId)).data).toEqual([]);
});

it("edits a manual stock price and removes it from the class", async () => {
  const classId = await course("stock_game");
  const stock = await stocks.createStock({
    name: "수정 전",
    marketCountryCode: "KR",
    industrySector: "IT",
  });
  await stocks.updateStock({ ...stock, name: "수정 후" });
  const price = await game.createStockPrice({
    classId,
    stockId: stock.id,
    day: 1,
    price: "1000",
  });
  await game.updateStockPrice({ ...price, price: "2000" });
  expect((await game.getClassStockPrices(classId, 1))[0]).toMatchObject({
    price: "2000",
  });
  await game.deleteStockPrice(price.id);
  expect(await game.getClassStockPrices(classId)).toHaveLength(0);
  await stocks.deleteStock(stock.id);
  expect((await stocks.getStocks()).some((s) => s.id === stock.id)).toBe(false);
});

it.each([
  ["recent classes", dashboardActions.getRecentClasses],
  ["recent students", dashboardActions.getRecentGuests],
  ["class progress", dashboardActions.getClassProgress],
  ["recent surveys", dashboardActions.getRecentSurveys],
])("loads admin %s across multiple classes", async (_, load) => {
  await course("stock_game");
  await course("finance_sim");
  const result = await load();
  expect(result.success, result.error).toBe(true);
  expect(Array.isArray(result.data)).toBe(true);
});

it("saves manual game day and updates a previously entered price", async () => {
  const classId = await course("stock_game");
  const stock = await stocks.createStock({
    name: "수동 종목",
    industrySector: "IT",
    marketCountryCode: "KR",
  });
  const data = {
    classId,
    day: 1,
    news: [{ title: "시장", content: "뉴스", relatedStockIds: [stock.id] }],
    stocks: [{ stockId: stock.id, price: 100 }],
  };
  await game.createGameDay(data);
  const [originalPrice] = await game.getClassStockPrices(classId, 1);
  await game.createGameDay({
    ...data,
    news: [],
    stocks: [{ stockId: stock.id, price: 200 }],
  });
  expect(await adminNews.getNewsByClassAndDay(classId, 1)).toHaveLength(1);
  expect(await game.getClassStockPrices(classId, 1)).toEqual([
    expect.objectContaining({ id: originalPrice.id, newsId: originalPrice.newsId, price: "200" }),
  ]);
});

it("finds classes, clients, managers and removes a single student", async () => {
  const classId = await course("stock_game");
  const { data: cls } = await classes.getClassById(classId);
  expect((await classes.getClasses()).data).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: classId })]),
  );
  const options = await classes.getClientsAndManagers();
  expect(options.managers.some((manager) => manager.id === cls.managerId)).toBe(
    true,
  );
  expect(options.clients.some((client) => client.id === cls.clientId)).toBe(
    true,
  );
  await users.createUser(
    form({
      name: "삭제학생",
      phone: "01000000000",
      grade: "1",
      school_name: "학교",
      class_id: classId,
    }),
  );
  const {
    data: [guest],
  } = await users.getUsersByClass(classId);
  expect(
    (await users.getUsers()).data.some((entry) => entry.id === guest.id),
  ).toBe(true);
  const deletion = await users.deleteUser(guest.id);
  expect(deletion.success, deletion.error).toBe(true);
  expect((await users.getUsersByClass(classId)).data).toEqual([]);
});

it.each([
  ["stock_game", stockAuth],
  ["finance_sim", financeAuth],
] as const)("logs in and out through the %s form", async (type, actions) => {
  const classId = await course(type);
  const { data: cls } = await classes.getClassById(classId);
  await users.createUser(
    form({
      name: "로그인학생",
      phone: "01000000000",
      grade: "1",
      school_name: "학교",
      class_id: classId,
    }),
  );
  const {
    data: [guest],
  } = await users.getUsersByClass(classId);
  expect(await actions.login(form({}))).toHaveProperty(
    "error",
    expect.any(String),
  );
  const result = await actions.login(
    form({ classCode: cls.code, loginId: guest.loginId, password: "pw1234" }),
  );
  expect(result).toMatchObject(
    type === "stock_game" ? { success: true } : { error: null },
  );
  expect(student.id).toBe(guest.id);
  await expect(actions.logout()).rejects.toThrow("NEXT_REDIRECT");
  expect(student).toBeNull();
});
