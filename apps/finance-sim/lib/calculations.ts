/**
 * 재무 시뮬레이션 계산 로직
 *
 * calculateFinancialSnapshot and formatMoney live in @repo/utils so the admin
 * app can share the same canonical implementations. They are re-exported here
 * so existing internal imports don't need to change.
 */
export { calculateFinancialSnapshot, formatMoney } from "@repo/utils";

/** 복리 계산: 월 적립식 복리 */
export function compoundInterest(
  monthlyContribution: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return monthlyContribution * months;
  }

  // FV = PMT × [((1 + r)^n - 1) / r]
  return (
    monthlyContribution *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  );
}

/** 저축 vs 투자 비교 시뮬레이션 */
export function compareSavingsVsInvestment(
  monthlyAmount: number,
  periodYears: number,
  savingsRatio: number,
  investmentReturnRate: number
) {
  const savingsRate = 2; // 저축 연 2% 고정
  const investmentRatio = 100 - savingsRatio;

  const monthlySavings = monthlyAmount * (savingsRatio / 100);
  const monthlyInvestment = monthlyAmount * (investmentRatio / 100);

  const totalDeposited = monthlyAmount * periodYears * 12;
  const finalSavingsAmount = compoundInterest(
    monthlySavings,
    savingsRate,
    periodYears
  );
  const finalInvestmentAmount = compoundInterest(
    monthlyInvestment,
    investmentReturnRate,
    periodYears
  );

  return {
    totalDeposited,
    finalSavingsAmount: Math.round(finalSavingsAmount),
    finalInvestmentAmount: Math.round(finalInvestmentAmount),
    totalFinalAmount: Math.round(finalSavingsAmount + finalInvestmentAmount),
    savingsGain: Math.round(finalSavingsAmount - monthlySavings * periodYears * 12),
    investmentGain: Math.round(
      finalInvestmentAmount - monthlyInvestment * periodYears * 12
    ),
  };
}

/** 연도별 자산 성장 추이 데이터 (차트용) */
export function getYearlyGrowthData(
  monthlyAmount: number,
  periodYears: number,
  savingsRatio: number,
  investmentReturnRate: number
) {
  const savingsRate = 2;
  const investmentRatio = 100 - savingsRatio;
  const monthlySavings = monthlyAmount * (savingsRatio / 100);
  const monthlyInvestment = monthlyAmount * (investmentRatio / 100);

  const data = [];
  for (let year = 0; year <= periodYears; year++) {
    const savings =
      year === 0 ? 0 : compoundInterest(monthlySavings, savingsRate, year);
    const investment =
      year === 0
        ? 0
        : compoundInterest(monthlyInvestment, investmentReturnRate, year);
    const deposited = monthlyAmount * year * 12;

    data.push({
      year,
      deposited: Math.round(deposited),
      savings: Math.round(savings),
      investment: Math.round(investment),
      total: Math.round(savings + investment),
    });
  }

  return data;
}

/** 연금 시뮬레이션 */
export function simulatePension(
  currentAge: number,
  startAge: number,
  monthlyContribution: number,
  retirementAge: number,
  annualReturnRate: number = 5 // 보수적 가정 5%
) {
  const contributionYears = retirementAge - startAge;
  if (contributionYears <= 0) {
    return {
      totalContributed: 0,
      estimatedAssetAtRetirement: 0,
      estimatedMonthlyPension: 0,
    };
  }

  const totalContributed = monthlyContribution * contributionYears * 12;
  const estimatedAssetAtRetirement = compoundInterest(
    monthlyContribution,
    annualReturnRate,
    contributionYears
  );

  // 은퇴 후 20년간 수령 가정 (연 3% 수익 유지)
  const pensionYears = 20;
  const monthlyPensionRate = 3 / 100 / 12;
  const pensionMonths = pensionYears * 12;
  const estimatedMonthlyPension =
    (estimatedAssetAtRetirement * monthlyPensionRate) /
    (1 - Math.pow(1 + monthlyPensionRate, -pensionMonths));

  return {
    totalContributed: Math.round(totalContributed),
    estimatedAssetAtRetirement: Math.round(estimatedAssetAtRetirement),
    estimatedMonthlyPension: Math.round(estimatedMonthlyPension),
  };
}

/** 연금 연도별 자산 추이 데이터 (차트용) */
export function getPensionGrowthData(
  startAge: number,
  monthlyContribution: number,
  retirementAge: number,
  annualReturnRate: number = 5
) {
  const data = [];
  const contributionYears = retirementAge - startAge;

  for (let year = 0; year <= contributionYears; year++) {
    const age = startAge + year;
    const asset =
      year === 0
        ? 0
        : compoundInterest(monthlyContribution, annualReturnRate, year);
    const deposited = monthlyContribution * year * 12;

    data.push({
      age,
      year,
      deposited: Math.round(deposited),
      asset: Math.round(asset),
    });
  }

  return data;
}

