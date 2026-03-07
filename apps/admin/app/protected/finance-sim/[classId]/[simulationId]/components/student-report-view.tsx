"use client";

const STATUS_LABELS: Record<string, string> = {
  employed: "재직 중",
  freelancer: "프리랜서",
  job_seeker: "취업 준비 중",
  on_leave: "휴직 중",
};

const TENDENCY_COLORS: Record<string, string> = {
  안정형: "#3b82f6",
  안정추구형: "#22c55e",
  위험중립형: "#eab308",
  적극투자형: "#f97316",
  공격투자형: "#ef4444",
};

const TENDENCY_EMOJIS: Record<string, string> = {
  안정형: "🛡️",
  안정추구형: "🌿",
  위험중립형: "⚖️",
  적극투자형: "🚀",
  공격투자형: "🔥",
};

const TIMING_LABELS: Record<string, string> = {
  now: "지금 바로",
  "5years": "5년 뒤",
  "10years": "10년 뒤",
};

type Simulation = {
  id: string;
  currentStep: number;
  completedAt: Date | null;
  createdAt: Date;
  guest: { id: string; name: string; loginId: string } | null;
  class: { id: string; name: string } | null;
  profile: {
    age: number;
    currentStatus: string;
    monthlyIncome: string;
    monthlyFixedExpenses: string;
    cashAssets: string;
    investmentAssets: string | null;
    hasDebt: boolean;
    totalDebtAmount: string | null;
  } | null;
  savingsInvestmentResult: {
    monthlyAmount: string;
    periodYears: number;
    savingsRatio: number;
    investmentRatio: number;
    investmentReturnRate: string;
    totalDeposited: string;
    finalSavingsAmount: string;
    finalInvestmentAmount: string;
  } | null;
  pensionResult: {
    currentAge: number;
    startTiming: string;
    monthlyContribution: string;
    retirementAge: number;
    totalContributed: string;
    estimatedAssetAtRetirement: string;
    estimatedMonthlyPension: string;
  } | null;
  investmentTendency: {
    answers: Record<string, number>;
    totalScore: number;
    tendencyType: string;
  } | null;
};

function formatMoney(amount: number): string {
  if (Math.abs(amount) >= 100_000_000) {
    return `${(amount / 100_000_000).toFixed(1)}억`;
  }
  if (Math.abs(amount) >= 10_000) {
    return `${Math.round(amount / 10_000).toLocaleString()}만`;
  }
  return amount.toLocaleString();
}

function calculateFinancialSnapshot(data: {
  monthlyIncome: number;
  monthlyFixedExpenses: number;
  cashAssets: number;
  investmentAssets: number;
  hasDebt: boolean;
  totalDebtAmount: number;
}) {
  const monthlySurplus = data.monthlyIncome - data.monthlyFixedExpenses;
  const savingsRate =
    data.monthlyIncome > 0
      ? Math.round((monthlySurplus / data.monthlyIncome) * 100)
      : 0;
  const totalAssets = data.cashAssets + data.investmentAssets;
  const netWorth = totalAssets - data.totalDebtAmount;
  const debtToAssetRatio =
    totalAssets > 0
      ? Math.round((data.totalDebtAmount / totalAssets) * 100)
      : 0;

  let debtBurden = "없음";
  if (data.hasDebt) {
    if (debtToAssetRatio > 50) debtBurden = "높음";
    else if (debtToAssetRatio > 20) debtBurden = "보통";
    else debtBurden = "낮음";
  }

  return {
    monthlySurplus,
    savingsRate,
    totalAssets,
    netWorth,
    debtToAssetRatio,
    debtBurden,
  };
}

export function StudentReportView({ simulation }: { simulation: Simulation }) {
  const profile = simulation.profile;
  const investResult = simulation.savingsInvestmentResult;
  const pensionResult = simulation.pensionResult;
  const tendency = simulation.investmentTendency;

  if (!profile) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
        <p className="text-lg font-medium mb-1">아직 프로필을 입력하지 않았습니다</p>
        <p className="text-sm">
          학생이 시뮬레이션을 시작하면 결과가 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  const snapshot = calculateFinancialSnapshot({
    monthlyIncome: Number(profile.monthlyIncome),
    monthlyFixedExpenses: Number(profile.monthlyFixedExpenses),
    cashAssets: Number(profile.cashAssets),
    investmentAssets: Number(profile.investmentAssets || 0),
    hasDebt: profile.hasDebt,
    totalDebtAmount: Number(profile.totalDebtAmount || 0),
  });

  return (
    <div className="space-y-6">
      {/* 1. 재무 상태 요약 */}
      <section className="rounded-xl border bg-card p-5">
        <SectionHeader num={1} title="현재 재무 상태" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
          <MetricCard
            label="나이 / 상태"
            value={`${profile.age}세`}
            sub={STATUS_LABELS[profile.currentStatus] || profile.currentStatus}
            color="blue"
          />
          <MetricCard
            label="월 소득"
            value={`${Number(profile.monthlyIncome).toLocaleString()}만원`}
            sub={`고정지출 ${Number(profile.monthlyFixedExpenses).toLocaleString()}만원`}
            color="blue"
          />
          <MetricCard
            label="월 여유자금"
            value={`${snapshot.monthlySurplus.toLocaleString()}만원`}
            sub={`저축 가능 비율 ${snapshot.savingsRate}%`}
            color="emerald"
          />
          <MetricCard
            label="부채 부담도"
            value={snapshot.debtBurden}
            sub={
              profile.hasDebt
                ? `부채 ${Number(profile.totalDebtAmount || 0).toLocaleString()}만원`
                : "부채 없음"
            }
            color={
              snapshot.debtBurden === "높음"
                ? "red"
                : snapshot.debtBurden === "보통"
                  ? "amber"
                  : "green"
            }
          />
        </div>

        {/* 자산 현황 */}
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">현금 자산</p>
            <p className="text-lg font-bold">
              {Number(profile.cashAssets).toLocaleString()}만원
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">투자 자산</p>
            <p className="text-lg font-bold">
              {Number(profile.investmentAssets || 0).toLocaleString()}만원
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-muted-foreground">순자산</p>
            <p className="text-lg font-bold text-blue-600">
              {snapshot.netWorth.toLocaleString()}만원
            </p>
          </div>
        </div>
      </section>

      {/* 2. 저축 vs 투자 시뮬레이션 결과 */}
      {investResult ? (
        <section className="rounded-xl border bg-card p-5">
          <SectionHeader num={2} title="저축 vs 투자 시뮬레이션" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <MetricCard
              label="월 납입액"
              value={`${formatMoney(Number(investResult.monthlyAmount))}원`}
              sub={`${investResult.periodYears}년간`}
              color="emerald"
            />
            <MetricCard
              label="저축 / 투자 비율"
              value={`${investResult.savingsRatio}% / ${investResult.investmentRatio}%`}
              sub={`투자 수익률 ${Number(investResult.investmentReturnRate)}%`}
              color="emerald"
            />
            <MetricCard
              label="총 납입금"
              value={`${formatMoney(Number(investResult.totalDeposited))}원`}
              sub="원금 합계"
              color="gray"
            />
            <MetricCard
              label="최종 자산"
              value={`${formatMoney(Number(investResult.finalSavingsAmount) + Number(investResult.finalInvestmentAmount))}원`}
              sub={`수익 ${formatMoney(Number(investResult.finalSavingsAmount) + Number(investResult.finalInvestmentAmount) - Number(investResult.totalDeposited))}원`}
              color="emerald"
            />
          </div>

          {/* 저축/투자 각각 금액 */}
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700 font-medium">
                  저축 ({investResult.savingsRatio}%)
                </span>
                <span className="text-lg font-bold text-blue-800">
                  {formatMoney(Number(investResult.finalSavingsAmount))}원
                </span>
              </div>
              <div className="mt-2 h-2 bg-blue-200 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.round(
                      (Number(investResult.finalSavingsAmount) /
                        (Number(investResult.finalSavingsAmount) +
                          Number(investResult.finalInvestmentAmount))) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-emerald-700 font-medium">
                  투자 ({investResult.investmentRatio}%)
                </span>
                <span className="text-lg font-bold text-emerald-800">
                  {formatMoney(Number(investResult.finalInvestmentAmount))}원
                </span>
              </div>
              <div className="mt-2 h-2 bg-emerald-200 rounded-full">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.round(
                      (Number(investResult.finalInvestmentAmount) /
                        (Number(investResult.finalSavingsAmount) +
                          Number(investResult.finalInvestmentAmount))) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <StepNotCompleted step={2} title="저축 vs 투자 시뮬레이션" />
      )}

      {/* 3. 연금 시뮬레이션 결과 */}
      {pensionResult ? (
        <section className="rounded-xl border bg-card p-5">
          <SectionHeader num={3} title="연금 준비 시뮬레이션" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <MetricCard
              label="시작 시점"
              value={TIMING_LABELS[pensionResult.startTiming] || pensionResult.startTiming}
              sub={`현재 ${pensionResult.currentAge}세`}
              color="purple"
            />
            <MetricCard
              label="월 납입액"
              value={`${formatMoney(Number(pensionResult.monthlyContribution))}원`}
              sub={`은퇴 ${pensionResult.retirementAge}세까지`}
              color="purple"
            />
            <MetricCard
              label="은퇴 시 예상 자산"
              value={`${formatMoney(Number(pensionResult.estimatedAssetAtRetirement))}원`}
              sub={`총 납입 ${formatMoney(Number(pensionResult.totalContributed))}원`}
              color="purple"
            />
            <MetricCard
              label="예상 월 수령액"
              value={`${formatMoney(Number(pensionResult.estimatedMonthlyPension))}원`}
              sub="매월 연금 수령"
              color="purple"
            />
          </div>
        </section>
      ) : (
        <StepNotCompleted step={3} title="연금 준비 시뮬레이션" />
      )}

      {/* 4. 투자 성향 */}
      {tendency ? (
        <section className="rounded-xl border bg-card p-5">
          <SectionHeader num={4} title="투자 성향 분석" />
          <div className="mt-4 flex items-start gap-6">
            {/* 성향 뱃지 */}
            <div
              className="flex-shrink-0 w-32 h-32 rounded-2xl flex flex-col items-center justify-center"
              style={{
                backgroundColor:
                  (TENDENCY_COLORS[tendency.tendencyType] || "#6b7280") + "15",
              }}
            >
              <span className="text-3xl mb-1">
                {TENDENCY_EMOJIS[tendency.tendencyType] || "📊"}
              </span>
              <span
                className="text-lg font-bold"
                style={{
                  color: TENDENCY_COLORS[tendency.tendencyType] || "#6b7280",
                }}
              >
                {tendency.tendencyType}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {tendency.totalScore}점
              </span>
            </div>

            {/* 질문별 응답 */}
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                질문별 응답 점수
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {Object.entries(tendency.answers).map(([questionId, score]) => (
                  <div
                    key={questionId}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-muted-foreground w-10 text-right">
                      Q{questionId}
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(score / 5) * 100}%`,
                          backgroundColor:
                            TENDENCY_COLORS[tendency.tendencyType] || "#6b7280",
                        }}
                      />
                    </div>
                    <span className="font-medium w-6 text-right">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <StepNotCompleted step={4} title="투자 성향 분석" />
      )}
    </div>
  );
}

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <h2 className="text-lg font-semibold flex items-center gap-2">
      <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
        {num}
      </span>
      {title}
    </h2>
  );
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: "blue" | "emerald" | "purple" | "amber" | "red" | "green" | "gray";
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50",
    emerald: "bg-emerald-50",
    purple: "bg-purple-50",
    amber: "bg-amber-50",
    red: "bg-red-50",
    green: "bg-green-50",
    gray: "bg-gray-50",
  };

  const textMap: Record<string, string> = {
    blue: "text-blue-700",
    emerald: "text-emerald-700",
    purple: "text-purple-700",
    amber: "text-amber-700",
    red: "text-red-700",
    green: "text-green-700",
    gray: "text-gray-700",
  };

  return (
    <div className={`rounded-lg p-3 ${colorMap[color]}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-xl font-bold ${textMap[color]}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function StepNotCompleted({ step, title }: { step: number; title: string }) {
  return (
    <section className="rounded-xl border border-dashed bg-gray-50 p-5">
      <h2 className="text-base font-semibold flex items-center gap-2 text-gray-400">
        <span className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 text-xs flex items-center justify-center">
          {step}
        </span>
        {title}
      </h2>
      <p className="text-sm text-gray-400 mt-2">
        아직 이 단계를 완료하지 않았습니다.
      </p>
    </section>
  );
}
