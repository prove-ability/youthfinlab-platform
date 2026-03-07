"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import StepProgress from "@/components/StepProgress";
import { getOrCreateSimulation } from "@/actions/simulation";
import { logout } from "@/actions/auth";
import {
  calculateFinancialSnapshot,
  formatMoney,
} from "@/lib/calculations";
import { tendencyDescriptions, type TendencyType } from "@/lib/tendency-questions";

const STATUS_LABELS: Record<string, string> = {
  employed: "재직 중",
  freelancer: "프리랜서",
  job_seeker: "취업 준비 중",
  on_leave: "휴직 중",
};

export default function ReportPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: simulation, isLoading } = useQuery({
    queryKey: ["simulation"],
    queryFn: () => getOrCreateSimulation(),
  });

  const profile = simulation?.profile;
  const investResult = simulation?.savingsInvestmentResult;
  const pensionResult = simulation?.pensionResult;
  const tendency = simulation?.investmentTendency;

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push("/simulation/profile");
    }
  }, [isLoading, profile, router]);

  const handlePrint = useCallback(() => {
    if (!printRef.current) return;

    const el = printRef.current;
    const pageHeight = 1009;
    const contentHeight = el.scrollHeight;
    const scale = contentHeight > pageHeight ? pageHeight / contentHeight : 1;

    el.style.setProperty("--print-scale", String(scale));
    window.print();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-pulse text-gray-400">리포트 생성 중...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const snapshot = calculateFinancialSnapshot({
    monthlyIncome: Number(profile.monthlyIncome),
    monthlyFixedExpenses: Number(profile.monthlyFixedExpenses),
    cashAssets: Number(profile.cashAssets),
    investmentAssets: Number(profile.investmentAssets || 0),
    hasDebt: profile.hasDebt,
    totalDebtAmount: Number(profile.totalDebtAmount || 0),
  });

  const tendencyInfo = tendency
    ? tendencyDescriptions[tendency.tendencyType as TendencyType]
    : null;

  const actions = generateActions(
    snapshot,
    investResult
      ? {
          monthlyAmount: Number(investResult.monthlyAmount),
          savingsRatio: investResult.savingsRatio,
        }
      : null,
    pensionResult
      ? { monthlyContribution: Number(pensionResult.monthlyContribution) }
      : null
  );

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
          .print-area {
            transform: scale(var(--print-scale, 1));
            transform-origin: top left;
            width: calc(100% / var(--print-scale, 1));
          }
        }
      `}</style>

      <div className="min-h-dvh flex flex-col bg-stone-50">
        <div className="print:hidden">
          <StepProgress currentStep={6} />
        </div>

        <div className="flex-1 px-5 py-6 print:px-0 print:py-0">
          <div ref={printRef} className="print-area">
            {/* 헤더 - 다크 그린 */}
            <div className="rounded-2xl p-5 mb-5 print:mb-4 text-center" style={{ background: "linear-gradient(135deg, #2F4538, #3A5645)" }}>
              <h1 className="text-xl font-bold text-white mb-1">
                나의 재무 리포트
              </h1>
              <p className="text-sm text-white/60">
                시뮬레이션 결과를 종합한 맞춤 리포트입니다.
              </p>
            </div>

            {/* 1. 재무 상태 요약 */}
            <section className="mb-4">
              <SectionHeader num={1} title="나의 현재 재무 상태" />
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoItem
                    label="나이 / 상태"
                    value={`${profile.age}세 / ${STATUS_LABELS[profile.currentStatus]}`}
                  />
                  <InfoItem
                    label="월 여유자금"
                    value={`${snapshot.monthlySurplus.toLocaleString()}만원`}
                    valueClass="text-forest-700"
                  />
                  <InfoItem
                    label="저축 가능 비율"
                    value={`${snapshot.savingsRate}%`}
                    valueClass="text-emerald-700"
                  />
                  <InfoItem label="부채 부담도" value={snapshot.debtBurden} />
                </div>
              </div>
            </section>

            {/* 2. 저축 vs 투자 시뮬레이션 결과 */}
            {investResult && (
              <section className="mb-4">
                <SectionHeader num={2} title="저축 vs 투자 시뮬레이션" />
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
                  <div className="space-y-2 text-sm">
                    <Row
                      label="선택 비율"
                      value={`저축 ${investResult.savingsRatio}% / 투자 ${investResult.investmentRatio}%`}
                    />
                    <Row
                      label="기간 / 월 금액"
                      value={`${investResult.periodYears}년 / ${formatMoney(Number(investResult.monthlyAmount))}원`}
                    />
                    <hr className="border-gray-100" />
                    <Row
                      label="총 납입금"
                      value={`${formatMoney(Number(investResult.totalDeposited))}원`}
                    />
                    <Row
                      label="최종 자산"
                      value={`${formatMoney(Number(investResult.finalSavingsAmount) + Number(investResult.finalInvestmentAmount))}원`}
                      bold
                      valueClass="text-forest-700"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* 3. 연금 시뮬레이션 결과 */}
            {pensionResult && (
              <section className="mb-4">
                <SectionHeader num={3} title="연금 준비 시뮬레이션" />
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
                  <div className="space-y-2 text-sm">
                    <Row
                      label="시작 시점"
                      value={`${pensionResult.currentAge}세 (지금)`}
                    />
                    <Row
                      label="월 납입액"
                      value={`${formatMoney(Number(pensionResult.monthlyContribution))}원`}
                    />
                    <hr className="border-gray-100" />
                    <Row
                      label="은퇴 시 예상 자산"
                      value={`${formatMoney(Number(pensionResult.estimatedAssetAtRetirement))}원`}
                      bold
                      valueClass="text-forest-700"
                    />
                    <Row
                      label="예상 월 수령액"
                      value={`${formatMoney(Number(pensionResult.estimatedMonthlyPension))}원`}
                      bold
                      valueClass="text-forest-700"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* 4. 투자 성향 */}
            {tendency && tendencyInfo && (
              <section className="mb-4">
                <SectionHeader num={4} title="나의 투자 성향" />
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{tendencyInfo.emoji}</span>
                    <span
                      className="text-lg font-bold"
                      style={{ color: tendencyInfo.color }}
                    >
                      {tendency.tendencyType}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({tendency.totalScore}점)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {tendencyInfo.strategy}
                  </p>
                </div>
              </section>
            )}

            {/* 5. 행동 추천 */}
            <section>
              <SectionHeader num={5} title="지금 할 수 있는 행동 3가지" />
              <div className="space-y-2">
                {actions.map((action, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-3 shadow-xs"
                  >
                    <span className="w-6 h-6 rounded-full bg-forest-500 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 액션 버튼 (인쇄에서 제외) */}
          <div className="space-y-3 mt-8 print:hidden">
            <button
              onClick={handlePrint}
              className="w-full py-3.5 rounded-xl bg-forest-700 text-white font-semibold text-sm hover:bg-forest-800 transition-colors"
            >
              리포트 인쇄 / 저장
            </button>
            <button
              onClick={() => router.push("/simulation/profile?edit=true")}
              className="w-full py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              처음부터 다시 하기
            </button>
            <button
              onClick={() => logout()}
              className="w-full py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <h2 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-forest-700 text-white text-xs flex items-center justify-center">
        {num}
      </span>
      {title}
    </h2>
  );
}

function InfoItem({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className={`font-semibold ${valueClass || ""}`}>{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  valueClass,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className={`text-gray-600 ${bold ? "font-semibold" : ""}`}>
        {label}
      </span>
      <span className={`${bold ? "font-bold" : "font-semibold"} ${valueClass || ""}`}>
        {value}
      </span>
    </div>
  );
}

function generateActions(
  snapshot: ReturnType<typeof calculateFinancialSnapshot>,
  invest: { monthlyAmount: number; savingsRatio: number } | null,
  pension: { monthlyContribution: number } | null
): string[] {
  const actions: string[] = [];

  if (snapshot.monthlySurplus > 0) {
    const suggestAmount = Math.min(
      Math.round(snapshot.monthlySurplus * 0.5),
      snapshot.monthlySurplus
    );
    actions.push(
      `매월 ${suggestAmount}만원 자동이체를 설정하세요. 작은 금액이라도 자동화가 핵심입니다.`
    );
  } else {
    actions.push(
      "고정지출을 점검하고, 불필요한 구독 서비스나 지출을 줄여 저축 여력을 만들어보세요."
    );
  }

  if (invest) {
    if (invest.savingsRatio >= 70) {
      actions.push(
        "저축과 투자의 비율을 조정해보세요. 장기적으로 투자 비중을 조금씩 늘리면 복리 효과를 더 누릴 수 있습니다."
      );
    } else {
      actions.push(
        `현재 선택한 저축/투자 비율을 실제로 실행해보세요. 소액 ETF 투자부터 시작하는 것도 좋은 방법입니다.`
      );
    }
  } else {
    actions.push(
      "저축과 투자의 비율을 정하고, 소액이라도 투자를 시작해보세요."
    );
  }

  if (pension) {
    actions.push(
      `연금 납입을 지금 바로 시작하세요. 월 ${formatMoney(pension.monthlyContribution)}원이면 충분합니다. 늦을수록 같은 결과를 위해 더 많은 돈이 필요합니다.`
    );
  } else {
    actions.push(
      "연금 준비 시점을 결정하세요. 가장 좋은 시점은 항상 '지금'입니다."
    );
  }

  return actions;
}
