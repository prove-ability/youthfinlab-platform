"use server";
import {
  db,
  dbWithTransaction,
  classes,
  stocks,
  guests,
  news,
  classStockPrices,
  classMarketScenarios,
  marketEventDecisions,
  gameDataGenerations,
} from "@repo/db";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { withAuth } from "@/lib/safe-action";
import { buildCrisisScenario } from "@repo/db/crisis-engine";
import {
  defaultEventStocks,
  type ScenarioStock,
} from "@repo/db/market-scenario";
import { revalidatePath } from "next/cache";

const settings = z.object({
  classId: z.string().uuid(),
  difficulty: z.enum(["easy", "normal", "hard"]),
  stocks: z
    .array(
      z.object({
        stockId: z.string().uuid(),
        exposure: z.enum(["sensitive", "balanced", "defensive"]),
        initialPrice: z.number().int().min(1000).max(1000000),
      }),
    )
    .min(2)
    .max(12)
    .optional(),
});

export const configureMarketScenario = withAuth(
  async (user, input: z.infer<typeof settings>) => {
    const parsed = settings.parse(input);
    await dbWithTransaction.transaction(async (tx) => {
      const [course] = await tx
        .select()
        .from(classes)
        .where(
          and(eq(classes.id, parsed.classId), eq(classes.createdBy, user.id)),
        )
        .for("update");
      if (!course || course.programType !== "stock_game")
        throw new Error("접근할 수 없는 주식 게임 수업입니다.");
      // Retry after a lost response is harmless; configuration is immutable once materialized.
      const existing = await tx.query.classMarketScenarios.findFirst({
        where: eq(classMarketScenarios.classId, course.id),
      });
      if (existing) return;
      if (course.status !== "setting" || course.currentDay !== 1)
        throw new Error("시작 전 수업에서만 설정할 수 있습니다.");
      const [price, article, guest, generated] = await Promise.all([
        tx.query.classStockPrices.findFirst({
          where: eq(classStockPrices.classId, course.id),
        }),
        tx.query.news.findFirst({ where: eq(news.classId, course.id) }),
        tx.query.guests.findFirst({ where: eq(guests.classId, course.id) }),
        tx.query.gameDataGenerations.findFirst({
          where: eq(gameDataGenerations.classId, course.id),
        }),
      ]);
      if (price || article || guest || generated)
        throw new Error(
          "기존 데이터가 있는 수업은 전환할 수 없습니다. AI 자동 생성을 끄고 새 수업을 만들어 주세요.",
        );
      let configuredStocks: ScenarioStock[];
      if (parsed.stocks) {
        const selected = await tx
          .select()
          .from(stocks)
          .where(
            and(
              eq(stocks.createdBy, user.id),
              inArray(
                stocks.id,
                parsed.stocks.map((s) => s.stockId),
              ),
            ),
          );
        if (selected.length !== parsed.stocks.length)
          throw new Error("직접 등록한 서로 다른 종목을 선택하세요.");
        configuredStocks = parsed.stocks.map((s) => ({
          ...s,
          name: selected.find((x) => x.id === s.stockId)!.name,
        }));
      } else {
        // Create class-specific fictional stocks atomically; never repurpose existing stocks.
        configuredStocks = [];
        for (const preset of defaultEventStocks) {
          const [created] = await tx
            .insert(stocks)
            .values({
              name: preset.name,
              industrySector: "교육용 가상 기업",
              marketCountryCode: "KR",
              createdBy: user.id,
              remarks: `금융 위기 기본 구성 · 수업 ${course.id}`,
            })
            .returning();
          configuredStocks.push({ ...preset, stockId: created!.id });
        }
      }
      const scenario = buildCrisisScenario(configuredStocks, parsed.difficulty);
      await tx
        .insert(classMarketScenarios)
        .values({ classId: course.id, scenario });
      await tx.insert(gameDataGenerations).values({ classId: course.id });
      await tx.insert(classStockPrices).values(
        scenario.days.flatMap((day) =>
          day.prices.map((p) => ({
            classId: course.id,
            stockId: p.stockId,
            day: day.day,
            price: String(p.price),
          })),
        ),
      );
      await tx.insert(news).values(
        scenario.days.map((day) => ({
          classId: course.id,
          createdBy: user.id,
          day: day.day,
          title: `[가상 시장 속보] ${day.title}`,
          content: day.news,
          relatedStockIds: scenario.stocks.map((s) => s.stockId),
        })),
      );
      await tx
        .update(classes)
        .set({
          totalDays: scenario.days.length,
          difficulty:
            parsed.difficulty === "hard" ? "normal" : parsed.difficulty,
        })
        .where(eq(classes.id, course.id));
    });
    revalidatePath("/protected/game-management");
    return { success: true as const };
  },
);

export const getMarketScenarioAdmin = withAuth(
  async (user, classId: string) => {
    const course = await db.query.classes.findFirst({
      where: and(eq(classes.id, classId), eq(classes.createdBy, user.id)),
    });
    if (!course) throw new Error("수업 접근 권한이 없습니다.");
    const configured = await db.query.classMarketScenarios.findFirst({
      where: eq(classMarketScenarios.classId, classId),
    });
    const decisions = configured
      ? await db
          .select({
            day: marketEventDecisions.day,
            guestId: marketEventDecisions.guestId,
            reason: marketEventDecisions.reason,
            note: marketEventDecisions.note,
            name: guests.name,
          })
          .from(marketEventDecisions)
          .innerJoin(guests, eq(guests.id, marketEventDecisions.guestId))
          .where(eq(marketEventDecisions.classId, classId))
      : [];
    const participants = configured
      ? await db
          .select({ id: guests.id })
          .from(guests)
          .where(eq(guests.classId, classId))
      : [];
    const completed = new Set(
      decisions
        .filter((d) => d.day === course.currentDay)
        .map((d) => d.guestId),
    ).size;
    return {
      currentDay: course.currentDay,
      participation: {
        total: participants.length,
        completed,
        missing: participants.length - completed,
      },
      scenario: configured?.scenario ?? null,
      decisions,
      status: course.status,
    };
  },
);
