"use client";

import Link from "next/link";

type Summary = {
  classData: any;
  studentCount: number;
  simCount: number;
  completedCount: number;
  profileStats: {
    avgIncome: number;
    avgExpenses: number;
    debtRate: number;
    count: number;
  } | null;
  investmentStats: {
    avgSavingsRatio: number;
    avgPeriod: number;
    count: number;
    ratioDistribution: { savingsRatio: number; count: number }[];
  } | null;
  pensionStats: {
    avgContribution: number;
    count: number;
    timingDistribution: { timing: string; count: number }[];
  } | null;
  tendencyDistribution: { tendencyType: string; count: number }[];
};

type SimulationDetail = {
  id: string;
  currentStep: number;
  completedAt: Date | null;
  guest: { id: string; name: string; loginId: string } | null;
  profile: {
    age: number;
    currentStatus: string;
    monthlyIncome: string;
    monthlyFixedExpenses: string;
  } | null;
  savingsInvestmentResult: {
    savingsRatio: number;
    investmentRatio: number;
    periodYears: number;
    finalSavingsAmount: string;
    finalInvestmentAmount: string;
  } | null;
  pensionResult: {
    estimatedMonthlyPension: string;
  } | null;
  investmentTendency: {
    tendencyType: string;
    totalScore: number;
  } | null;
};

const TENDENCY_COLORS: Record<string, string> = {
  안정형: "#3b82f6",
  안정추구형: "#22c55e",
  위험중립형: "#eab308",
  적극투자형: "#f97316",
  공격투자형: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  employed: "재직",
  freelancer: "프리랜서",
  job_seeker: "취준",
  on_leave: "휴직",
};

const TIMING_LABELS: Record<string, string> = {
  now: "지금",
  "5years": "5년 뒤",
  "10years": "10년 뒤",
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

export function ResultsDashboard({
  summary,
  details,
  classId,
}: {
  summary: Summary;
  details: SimulationDetail[];
  classId: string;
}) {
  const completionRate =
    Number(summary.studentCount) > 0
      ? Math.round(
          (summary.completedCount / Number(summary.studentCount)) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* 참여 현황 */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="총 학생 수"
          value={`${summary.studentCount}명`}
          color="blue"
        />
        <StatCard
          label="시뮬레이션 시작"
          value={`${summary.simCount}명`}
          color="purple"
        />
        <StatCard
          label="완료"
          value={`${summary.completedCount}명`}
          color="green"
        />
        <StatCard label="완료율" value={`${completionRate}%`} color="amber" />
      </div>

      {/* 재무 프로필 요약 */}
      {summary.profileStats && (
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold mb-4">재무 프로필 요약</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground">평균 월 소득</p>
              <p className="text-xl font-bold text-blue-600">
                {summary.profileStats.avgIncome.toLocaleString()}만원
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                평균 저축 가능 비율
              </p>
              <p className="text-xl font-bold text-emerald-600">
                {summary.profileStats.avgIncome > 0
                  ? Math.round(
                      ((summary.profileStats.avgIncome -
                        summary.profileStats.avgExpenses) /
                        summary.profileStats.avgIncome) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground">부채 보유 비율</p>
              <p className="text-xl font-bold text-red-600">
                {summary.profileStats.debtRate}%
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 저축/투자 시뮬레이션 결과 */}
      {summary.investmentStats && (
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold mb-4">
            저축/투자 시뮬레이션 분포
          </h2>
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                평균 저축 비율
              </p>
              <p className="text-xl font-bold">
                {summary.investmentStats.avgSavingsRatio}%
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground">평균 선택 기간</p>
              <p className="text-xl font-bold">
                {summary.investmentStats.avgPeriod}년
              </p>
            </div>
          </div>

          {/* 비율 분포 바 차트 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              선택 비율 분포
            </p>
            {summary.investmentStats.ratioDistribution.map((item) => {
              const investRatio = 100 - item.savingsRatio;
              const label =
                item.savingsRatio === 100
                  ? "저축 100%"
                  : item.savingsRatio === 0
                    ? "투자 100%"
                    : `저축 ${item.savingsRatio} / 투자 ${investRatio}`;
              const percentage = Math.round(
                (item.count / summary.investmentStats!.count) * 100
              );

              return (
                <div key={item.savingsRatio} className="flex items-center gap-3">
                  <span className="text-xs w-28 text-right text-muted-foreground">
                    {label}
                  </span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-14">
                    {item.count}명 ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 연금 인사이트 */}
      {summary.pensionStats && (
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold mb-4">연금 준비 인사이트</h2>
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                평균 월 납입액
              </p>
              <p className="text-xl font-bold text-purple-600">
                {formatMoney(summary.pensionStats.avgContribution)}원
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                시작 시점 선택 분포
              </p>
              <div className="space-y-1">
                {summary.pensionStats.timingDistribution.map((item) => {
                  const percentage = Math.round(
                    (item.count / summary.pensionStats!.count) * 100
                  );
                  return (
                    <div key={item.timing} className="flex items-center gap-2">
                      <span className="text-xs w-14">
                        {TIMING_LABELS[item.timing] || item.timing}
                      </span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {item.count}명
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 투자 성향 분포 */}
      {summary.tendencyDistribution.length > 0 && (
        <section className="rounded-xl border bg-card p-5">
          <h2 className="text-lg font-semibold mb-4">투자 성향 분포</h2>
          <div className="flex gap-2 flex-wrap">
            {summary.tendencyDistribution.map((item) => (
              <div
                key={item.tendencyType}
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor:
                    (TENDENCY_COLORS[item.tendencyType] || "#6b7280") + "15",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      TENDENCY_COLORS[item.tendencyType] || "#6b7280",
                  }}
                />
                <span className="text-sm font-medium">{item.tendencyType}</span>
                <span className="text-sm text-muted-foreground">
                  {item.count}명
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 개별 학생 결과 테이블 */}
      <section className="rounded-xl border bg-card p-5">
        <h2 className="text-lg font-semibold mb-4">개별 학생 결과</h2>
        {details.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            아직 시뮬레이션을 시작한 학생이 없습니다.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">이름</th>
                  <th className="pb-2 font-medium">진행</th>
                  <th className="pb-2 font-medium">나이</th>
                  <th className="pb-2 font-medium">상태</th>
                  <th className="pb-2 font-medium">소득</th>
                  <th className="pb-2 font-medium">저축/투자</th>
                  <th className="pb-2 font-medium">연금</th>
                  <th className="pb-2 font-medium">투자 성향</th>
                </tr>
              </thead>
              <tbody>
                {details.map((sim) => (
                  <tr key={sim.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">
                      <Link
                        href={`/protected/finance-sim/${classId}/${sim.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {sim.guest?.name || "-"}
                      </Link>
                    </td>
                    <td className="py-2">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          sim.completedAt
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {sim.completedAt
                          ? "완료"
                          : `${sim.currentStep}/6단계`}
                      </span>
                    </td>
                    <td className="py-2">{sim.profile?.age || "-"}</td>
                    <td className="py-2">
                      {sim.profile
                        ? STATUS_LABELS[sim.profile.currentStatus] || "-"
                        : "-"}
                    </td>
                    <td className="py-2">
                      {sim.profile
                        ? `${Number(sim.profile.monthlyIncome).toLocaleString()}만`
                        : "-"}
                    </td>
                    <td className="py-2">
                      {sim.savingsInvestmentResult
                        ? `${sim.savingsInvestmentResult.savingsRatio}:${sim.savingsInvestmentResult.investmentRatio}`
                        : "-"}
                    </td>
                    <td className="py-2">
                      {sim.pensionResult
                        ? `${formatMoney(Number(sim.pensionResult.estimatedMonthlyPension))}원/월`
                        : "-"}
                    </td>
                    <td className="py-2">
                      {sim.investmentTendency ? (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor:
                              (TENDENCY_COLORS[
                                sim.investmentTendency.tendencyType
                              ] || "#6b7280") + "20",
                            color:
                              TENDENCY_COLORS[
                                sim.investmentTendency.tendencyType
                              ] || "#6b7280",
                          }}
                        >
                          {sim.investmentTendency.tendencyType}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "blue" | "green" | "purple" | "amber";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className={`rounded-xl p-4 ${colorMap[color]}`}>
      <p className="text-xs opacity-80 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
