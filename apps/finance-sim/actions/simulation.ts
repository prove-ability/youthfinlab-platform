"use server";

import {
  db,
  dbWithTransaction,
  financeSimulations,
  financeProfiles,
  savingsInvestmentResults,
  pensionResults,
  investmentTendencies,
} from "@repo/db";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/with-auth";

// 시뮬레이션 조회 또는 생성
export const getOrCreateSimulation = withAuth(async (user) => {
  const existing = await db.query.financeSimulations.findFirst({
    where: and(
      eq(financeSimulations.guestId, user.id),
      eq(financeSimulations.classId, user.classId)
    ),
    with: {
      profile: true,
      savingsInvestmentResult: true,
      pensionResult: true,
      investmentTendency: true,
    },
  });

  if (existing) {
    return {
      ...existing,
      profile: existing.profile ?? null,
      savingsInvestmentResult: existing.savingsInvestmentResult ?? null,
      pensionResult: existing.pensionResult ?? null,
      investmentTendency: existing.investmentTendency ?? null,
    };
  }

  const [newSim] = await dbWithTransaction
    .insert(financeSimulations)
    .values({
      guestId: user.id,
      classId: user.classId,
      currentStep: 1,
    })
    .returning();

  return {
    ...newSim!,
    profile: null as null,
    savingsInvestmentResult: null as null,
    pensionResult: null as null,
    investmentTendency: null as null,
  };
});

// 1단계: 기본 정보 저장
export const saveProfile = withAuth(
  async (
    user,
    data: {
      age: number;
      currentStatus: string;
      monthlyIncome: number;
      monthlyFixedExpenses: number;
      cashAssets: number;
      investmentAssets: number | null;
      hasDebt: boolean;
      totalDebtAmount: number | null;
    }
  ) => {
    const simulation = await db.query.financeSimulations.findFirst({
      where: and(
        eq(financeSimulations.guestId, user.id),
        eq(financeSimulations.classId, user.classId)
      ),
    });

    if (!simulation) throw new Error("Simulation not found");

    // 기존 프로필 삭제 후 다시 생성 (upsert)
    await dbWithTransaction.transaction(async (tx) => {
      await tx
        .delete(financeProfiles)
        .where(eq(financeProfiles.simulationId, simulation.id));

      await tx.insert(financeProfiles).values({
        simulationId: simulation.id,
        age: data.age,
        currentStatus: data.currentStatus,
        monthlyIncome: String(data.monthlyIncome),
        monthlyFixedExpenses: String(data.monthlyFixedExpenses),
        cashAssets: String(data.cashAssets),
        investmentAssets:
          data.investmentAssets != null ? String(data.investmentAssets) : null,
        hasDebt: data.hasDebt,
        totalDebtAmount:
          data.totalDebtAmount != null ? String(data.totalDebtAmount) : null,
      });

      // 스텝 업데이트 (최소 2단계)
      if (simulation.currentStep < 2) {
        await tx
          .update(financeSimulations)
          .set({ currentStep: 2 })
          .where(eq(financeSimulations.id, simulation.id));
      }
    });

    return { success: true };
  }
);

// 3단계: 저축 vs 투자 결과 저장
export const saveSavingsInvestmentResult = withAuth(
  async (
    user,
    data: {
      monthlyAmount: number;
      periodYears: number;
      savingsRatio: number;
      investmentRatio: number;
      investmentReturnRate: number;
      totalDeposited: number;
      finalSavingsAmount: number;
      finalInvestmentAmount: number;
    }
  ) => {
    const simulation = await db.query.financeSimulations.findFirst({
      where: and(
        eq(financeSimulations.guestId, user.id),
        eq(financeSimulations.classId, user.classId)
      ),
    });

    if (!simulation) throw new Error("Simulation not found");

    await dbWithTransaction.transaction(async (tx) => {
      await tx
        .delete(savingsInvestmentResults)
        .where(eq(savingsInvestmentResults.simulationId, simulation.id));

      await tx.insert(savingsInvestmentResults).values({
        simulationId: simulation.id,
        monthlyAmount: String(data.monthlyAmount),
        periodYears: data.periodYears,
        savingsRatio: data.savingsRatio,
        investmentRatio: data.investmentRatio,
        investmentReturnRate: String(data.investmentReturnRate),
        totalDeposited: String(data.totalDeposited),
        finalSavingsAmount: String(data.finalSavingsAmount),
        finalInvestmentAmount: String(data.finalInvestmentAmount),
      });

      if (simulation.currentStep < 3) {
        await tx
          .update(financeSimulations)
          .set({ currentStep: 3 })
          .where(eq(financeSimulations.id, simulation.id));
      }
    });

    return { success: true };
  }
);

// 4단계: 연금 결과 저장
export const savePensionResult = withAuth(
  async (
    user,
    data: {
      currentAge: number;
      startTiming: string;
      monthlyContribution: number;
      retirementAge: number;
      totalContributed: number;
      estimatedAssetAtRetirement: number;
      estimatedMonthlyPension: number;
    }
  ) => {
    const simulation = await db.query.financeSimulations.findFirst({
      where: and(
        eq(financeSimulations.guestId, user.id),
        eq(financeSimulations.classId, user.classId)
      ),
    });

    if (!simulation) throw new Error("Simulation not found");

    await dbWithTransaction.transaction(async (tx) => {
      await tx
        .delete(pensionResults)
        .where(eq(pensionResults.simulationId, simulation.id));

      await tx.insert(pensionResults).values({
        simulationId: simulation.id,
        currentAge: data.currentAge,
        startTiming: data.startTiming,
        monthlyContribution: String(data.monthlyContribution),
        retirementAge: data.retirementAge,
        totalContributed: String(data.totalContributed),
        estimatedAssetAtRetirement: String(data.estimatedAssetAtRetirement),
        estimatedMonthlyPension: String(data.estimatedMonthlyPension),
      });

      if (simulation.currentStep < 5) {
        await tx
          .update(financeSimulations)
          .set({ currentStep: 5 })
          .where(eq(financeSimulations.id, simulation.id));
      }
    });

    return { success: true };
  }
);

// 5단계: 투자 성향 결과 저장
export const saveInvestmentTendency = withAuth(
  async (
    user,
    data: {
      answers: Record<string, number>;
      totalScore: number;
      tendencyType: string;
    }
  ) => {
    const simulation = await db.query.financeSimulations.findFirst({
      where: and(
        eq(financeSimulations.guestId, user.id),
        eq(financeSimulations.classId, user.classId)
      ),
    });

    if (!simulation) throw new Error("Simulation not found");

    await dbWithTransaction.transaction(async (tx) => {
      await tx
        .delete(investmentTendencies)
        .where(eq(investmentTendencies.simulationId, simulation.id));

      await tx.insert(investmentTendencies).values({
        simulationId: simulation.id,
        answers: data.answers,
        totalScore: data.totalScore,
        tendencyType: data.tendencyType,
      });

      await tx
        .update(financeSimulations)
        .set({ currentStep: 6, completedAt: new Date() })
        .where(eq(financeSimulations.id, simulation.id));
    });

    return { success: true };
  }
);
