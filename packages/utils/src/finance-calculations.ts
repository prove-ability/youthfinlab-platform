/** 재무 시뮬레이션 공통 계산 로직 */

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
