/**
 * 재무 시뮬레이션 계산 로직
 */

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

/** 재무 상태 요약 계산 */
export function calculateFinancialSnapshot(profile: {
  monthlyIncome: number;
  monthlyFixedExpenses: number;
  cashAssets: number;
  investmentAssets: number;
  hasDebt: boolean;
  totalDebtAmount: number;
}) {
  const monthlySurplus = profile.monthlyIncome - profile.monthlyFixedExpenses;
  const savingsRate =
    profile.monthlyIncome > 0
      ? Math.round((monthlySurplus / profile.monthlyIncome) * 100)
      : 0;

  const totalAssets = profile.cashAssets + (profile.investmentAssets || 0);
  const netAssets = totalAssets - (profile.totalDebtAmount || 0);

  // 부채 부담도
  let debtBurden: "없음" | "낮음" | "보통" | "높음" = "없음";
  if (profile.hasDebt && profile.totalDebtAmount > 0) {
    const debtToIncomeRatio =
      profile.monthlyIncome > 0
        ? profile.totalDebtAmount / (profile.monthlyIncome * 12)
        : Infinity;
    if (debtToIncomeRatio < 1) debtBurden = "낮음";
    else if (debtToIncomeRatio < 3) debtBurden = "보통";
    else debtBurden = "높음";
  }

  // 상태 코멘트 생성
  let comment = "";
  if (savingsRate >= 30 && debtBurden === "없음") {
    comment =
      "현재 소득 대비 지출 구조가 안정적이며, 자산 형성에 유리한 조건을 갖추고 있습니다.";
  } else if (savingsRate >= 20) {
    comment =
      "현재는 단기 안정은 가능하나, 장기 준비는 시작 전 단계입니다. 선택에 따라 자산 격차가 커질 수 있습니다.";
  } else if (savingsRate >= 10) {
    comment =
      "지출 구조를 점검하면 저축 여력을 확보할 수 있습니다. 작은 금액이라도 시작이 중요합니다.";
  } else {
    comment =
      "현재 소득과 지출 사이 여유가 적습니다. 고정지출을 점검하고 우선순위를 정리하는 것이 첫 단계입니다.";
  }

  return {
    monthlySurplus,
    savingsRate,
    totalAssets,
    netAssets,
    debtBurden,
    comment,
  };
}

/** 금액 포맷팅 */
export function formatMoney(amount: number): string {
  if (Math.abs(amount) >= 100_000_000) {
    return `${(amount / 100_000_000).toFixed(1)}억`;
  }
  if (Math.abs(amount) >= 10_000) {
    return `${Math.round(amount / 10_000).toLocaleString()}만`;
  }
  return amount.toLocaleString();
}
