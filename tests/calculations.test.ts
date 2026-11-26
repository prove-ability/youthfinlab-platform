import { getTendencyType } from "../apps/finance-sim/lib/tendency-questions";
import { expect, it } from "vitest";
import {
  formatMoney,
  calculateFinancialSnapshot,
  compoundInterest,
  compareSavingsVsInvestment,
  getYearlyGrowthData,
  simulatePension,
  getPensionGrowthData,
} from "../apps/finance-sim/lib/calculations";
it.each([
  [0, "0"],
  [10000, "1만"],
  [-10000, "-1만"],
  [100000000, "1.0억"],
])("formats %s", (n, label) => expect(formatMoney(n)).toBe(label));
it.each([
  [0, "없음"],
  [11999, "낮음"],
  [12000, "보통"],
  [36000, "높음"],
])("classifies debt %s", (debt, label) => {
  expect(
    calculateFinancialSnapshot({
      monthlyIncome: 1000,
      monthlyFixedExpenses: 750,
      cashAssets: 10000,
      investmentAssets: 5000,
      hasDebt: debt > 0,
      totalDebtAmount: debt,
    }),
  ).toMatchObject({
    monthlySurplus: 250,
    savingsRate: 25,
    totalAssets: 15000,
    netAssets: 15000 - debt,
    debtBurden: label,
  });
});
it("matches savings and investment report to its yearly chart", () => {
  expect(compoundInterest(100, 0, 2)).toBe(2400);
  const result = compareSavingsVsInvestment(100, 3, 25, 7);
  const chart = getYearlyGrowthData(100, 3, 25, 7);
  expect(chart).toHaveLength(4);
  expect(chart[3]).toMatchObject({
    deposited: 3600,
    total: result.totalFinalAmount,
  });
  expect(result.totalFinalAmount).toBeGreaterThan(result.totalDeposited);
});
it("handles retirement now and a full contribution period", () => {
  expect(simulatePension(65, 65, 100, 65).totalContributed).toBe(0);
  expect(simulatePension(25, 25, 100, 65, 0)).toMatchObject({
    totalContributed: 48000,
    estimatedAssetAtRetirement: 48000,
  });
  expect(getPensionGrowthData(25, 100, 65, 0)).toHaveLength(41);
});

it.each([
  [20, "안정형"],
  [21, "안정추구형"],
  [40, "안정추구형"],
  [41, "위험중립형"],
  [60, "위험중립형"],
  [61, "적극투자형"],
  [80, "적극투자형"],
  [81, "공격투자형"],
] as const)("maps tendency score %i to %s", (score, type) =>
  expect(getTendencyType(score)).toBe(type),
);
