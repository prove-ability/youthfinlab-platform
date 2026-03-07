"use server";

import {
  db,
  classes,
  guests,
  financeSimulations,
  financeProfiles,
  savingsInvestmentResults,
  pensionResults,
  investmentTendencies,
} from "@repo/db";
import { eq, and, count, avg, sql } from "drizzle-orm";

// 재무 시뮬레이션 수업 목록
export async function getFinanceSimClasses() {
  const result = await db.query.classes.findMany({
    where: eq(classes.programType, "finance_sim"),
    with: {
      client: true,
      manager: true,
    },
    orderBy: (classes, { desc }) => [desc(classes.createdAt)],
  });

  // 각 수업별 학생 수 & 완료 학생 수 집계
  const classesWithStats = await Promise.all(
    result.map(async (cls) => {
      const [studentCount] = await db
        .select({ count: count() })
        .from(guests)
        .where(eq(guests.classId, cls.id));

      const [completedCount] = await db
        .select({ count: count() })
        .from(financeSimulations)
        .where(
          and(
            eq(financeSimulations.classId, cls.id),
            sql`${financeSimulations.completedAt} IS NOT NULL`
          )
        );

      return {
        ...cls,
        studentCount: studentCount?.count || 0,
        completedCount: completedCount?.count || 0,
      };
    })
  );

  return classesWithStats;
}

// 수업별 결과 요약 집계
export async function getClassSimulationSummary(classId: string) {
  // 기본 수업 정보
  const classData = await db.query.classes.findFirst({
    where: eq(classes.id, classId),
    with: { client: true, manager: true },
  });

  if (!classData) throw new Error("Class not found");

  // 학생 수
  const [studentCount] = await db
    .select({ count: count() })
    .from(guests)
    .where(eq(guests.classId, classId));

  // 시뮬레이션 현황
  const [simCount] = await db
    .select({ count: count() })
    .from(financeSimulations)
    .where(eq(financeSimulations.classId, classId));

  const [completedCount] = await db
    .select({ count: count() })
    .from(financeSimulations)
    .where(
      and(
        eq(financeSimulations.classId, classId),
        sql`${financeSimulations.completedAt} IS NOT NULL`
      )
    );

  // 프로필 통계
  const simIds = await db
    .select({ id: financeSimulations.id })
    .from(financeSimulations)
    .where(eq(financeSimulations.classId, classId));

  const simIdList = simIds.map((s) => s.id);

  let profileStats = null;
  let investmentStats = null;
  let pensionStats = null;
  let tendencyDistribution: { tendencyType: string; count: number }[] = [];

  if (simIdList.length > 0) {
    // 프로필 통계
    const profiles = await db
      .select({
        avgIncome: avg(financeProfiles.monthlyIncome),
        avgExpenses: avg(financeProfiles.monthlyFixedExpenses),
        debtCount: sql<number>`COUNT(CASE WHEN ${financeProfiles.hasDebt} = true THEN 1 END)`,
        totalCount: count(),
      })
      .from(financeProfiles)
      .where(
        sql`${financeProfiles.simulationId} IN (${sql.join(
          simIdList.map((id) => sql`${id}`),
          sql`, `
        )})`
      );

    if (profiles[0] && profiles[0].totalCount > 0) {
      profileStats = {
        avgIncome: Math.round(Number(profiles[0].avgIncome || 0)),
        avgExpenses: Math.round(Number(profiles[0].avgExpenses || 0)),
        debtRate: Math.round(
          (Number(profiles[0].debtCount) / profiles[0].totalCount) * 100
        ),
        count: profiles[0].totalCount,
      };
    }

    // 저축/투자 시뮬레이션 통계
    const investResults = await db
      .select({
        avgSavingsRatio: avg(savingsInvestmentResults.savingsRatio),
        avgPeriod: avg(savingsInvestmentResults.periodYears),
        totalCount: count(),
      })
      .from(savingsInvestmentResults)
      .where(
        sql`${savingsInvestmentResults.simulationId} IN (${sql.join(
          simIdList.map((id) => sql`${id}`),
          sql`, `
        )})`
      );

    if (investResults[0] && investResults[0].totalCount > 0) {
      // 비율 분포
      const ratioDistribution = await db
        .select({
          savingsRatio: savingsInvestmentResults.savingsRatio,
          count: count(),
        })
        .from(savingsInvestmentResults)
        .where(
          sql`${savingsInvestmentResults.simulationId} IN (${sql.join(
            simIdList.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
        .groupBy(savingsInvestmentResults.savingsRatio);

      investmentStats = {
        avgSavingsRatio: Math.round(
          Number(investResults[0].avgSavingsRatio || 0)
        ),
        avgPeriod: Math.round(Number(investResults[0].avgPeriod || 0)),
        count: investResults[0].totalCount,
        ratioDistribution: ratioDistribution.map((r) => ({
          savingsRatio: r.savingsRatio,
          count: r.count,
        })),
      };
    }

    // 연금 통계
    const pensionData = await db
      .select({
        avgContribution: avg(pensionResults.monthlyContribution),
        totalCount: count(),
      })
      .from(pensionResults)
      .where(
        sql`${pensionResults.simulationId} IN (${sql.join(
          simIdList.map((id) => sql`${id}`),
          sql`, `
        )})`
      );

    if (pensionData[0] && pensionData[0].totalCount > 0) {
      const timingDist = await db
        .select({
          startTiming: pensionResults.startTiming,
          count: count(),
        })
        .from(pensionResults)
        .where(
          sql`${pensionResults.simulationId} IN (${sql.join(
            simIdList.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
        .groupBy(pensionResults.startTiming);

      pensionStats = {
        avgContribution: Math.round(
          Number(pensionData[0].avgContribution || 0)
        ),
        count: pensionData[0].totalCount,
        timingDistribution: timingDist.map((t) => ({
          timing: t.startTiming,
          count: t.count,
        })),
      };
    }

    // 투자 성향 분포
    tendencyDistribution = (
      await db
        .select({
          tendencyType: investmentTendencies.tendencyType,
          count: count(),
        })
        .from(investmentTendencies)
        .where(
          sql`${investmentTendencies.simulationId} IN (${sql.join(
            simIdList.map((id) => sql`${id}`),
            sql`, `
          )})`
        )
        .groupBy(investmentTendencies.tendencyType)
    ).map((t) => ({ tendencyType: t.tendencyType, count: t.count }));
  }

  return {
    classData,
    studentCount: studentCount?.count || 0,
    simCount: simCount?.count || 0,
    completedCount: completedCount?.count || 0,
    profileStats,
    investmentStats,
    pensionStats,
    tendencyDistribution,
  };
}

// 개별 학생 결과 목록
export async function getClassSimulationDetails(classId: string) {
  const simulations = await db.query.financeSimulations.findMany({
    where: eq(financeSimulations.classId, classId),
    with: {
      guest: true,
      profile: true,
      savingsInvestmentResult: true,
      pensionResult: true,
      investmentTendency: true,
    },
    orderBy: (sims, { desc }) => [desc(sims.createdAt)],
  });

  return simulations;
}

// 학생 개별 시뮬레이션 상세 조회
export async function getStudentSimulation(simulationId: string) {
  const simulation = await db.query.financeSimulations.findFirst({
    where: eq(financeSimulations.id, simulationId),
    with: {
      guest: true,
      class: true,
      profile: true,
      savingsInvestmentResult: true,
      pensionResult: true,
      investmentTendency: true,
    },
  });

  return simulation ?? null;
}
