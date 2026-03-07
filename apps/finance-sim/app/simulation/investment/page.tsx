"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/StepProgress";
import { saveSavingsInvestmentResult } from "@/actions/simulation";
import {
  compareSavingsVsInvestment,
  getYearlyGrowthData,
  formatMoney,
} from "@/lib/calculations";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PERIOD_OPTIONS = [5, 10, 20];
const RATIO_OPTIONS = [
  { savings: 100, investment: 0, label: "저축 100%" },
  { savings: 70, investment: 30, label: "저축 70 / 투자 30" },
  { savings: 50, investment: 50, label: "저축 50 / 투자 50" },
  { savings: 0, investment: 100, label: "투자 100%" },
];
const RETURN_RATES = [4, 6, 8];

export default function InvestmentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [monthlyAmount, setMonthlyAmount] = useState(30);
  const [periodYears, setPeriodYears] = useState(10);
  const [ratioIndex, setRatioIndex] = useState(1);
  const [returnRate, setReturnRate] = useState(6);

  const ratio = RATIO_OPTIONS[ratioIndex]!;

  const result = useMemo(
    () =>
      compareSavingsVsInvestment(
        monthlyAmount * 10000,
        periodYears,
        ratio.savings,
        returnRate
      ),
    [monthlyAmount, periodYears, ratio.savings, returnRate]
  );

  const chartData = useMemo(
    () =>
      getYearlyGrowthData(
        monthlyAmount * 10000,
        periodYears,
        ratio.savings,
        returnRate
      ),
    [monthlyAmount, periodYears, ratio.savings, returnRate]
  );

  async function handleSave() {
    setSaving(true);
    try {
      await saveSavingsInvestmentResult({
        monthlyAmount: monthlyAmount * 10000,
        periodYears,
        savingsRatio: ratio.savings,
        investmentRatio: ratio.investment,
        investmentReturnRate: returnRate,
        totalDeposited: result.totalDeposited,
        finalSavingsAmount: result.finalSavingsAmount,
        finalInvestmentAmount: result.finalInvestmentAmount,
      });
      router.push("/simulation/pension");
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  const tooltipFormatter = (value: number) => formatMoney(value) + "원";

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <StepProgress currentStep={3} />

      <div className="flex-1 px-5 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          저축 vs 투자 시뮬레이션
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          같은 돈이라도 선택에 따라 결과가 달라집니다.
        </p>

        {/* 월 금액 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            월 저축/투자 금액
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={5}
              max={300}
              step={5}
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-bold text-forest-700 w-20 text-right">
              {monthlyAmount}만원
            </span>
          </div>
        </div>

        {/* 기간 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기간
          </label>
          <div className="flex gap-2">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriodYears(p)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  periodYears === p
                    ? "bg-forest-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}년
              </button>
            ))}
          </div>
        </div>

        {/* 비율 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            저축/투자 비율
          </label>
          <div className="grid grid-cols-2 gap-2">
            {RATIO_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => setRatioIndex(i)}
                className={`py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  ratioIndex === i
                    ? "bg-forest-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 투자 수익률 */}
        {ratio.investment > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예상 투자 수익률
            </label>
            <div className="flex gap-2">
              {RETURN_RATES.map((r) => (
                <button
                  key={r}
                  onClick={() => setReturnRate(r)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    returnRate === r
                      ? "bg-forest-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  연 {r}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 차트 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-xs">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            자산 성장 추이
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}년`}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => formatMoney(v) + "원"}
                width={70}
              />
              <Tooltip formatter={tooltipFormatter} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="deposited"
                name="납입금"
                stroke="#9ca3af"
                fill="#f3f4f6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <Area
                type="monotone"
                dataKey="total"
                name="최종 자산"
                stroke="#2F4538"
                fill="#E3EFE7"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 결과 요약 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-xs">
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">총 납입금액</span>
              <span className="font-semibold">
                {formatMoney(result.totalDeposited)}원
              </span>
            </div>
            {ratio.savings > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">저축 수익 (연 2%)</span>
                <span className="font-semibold text-forest-600">
                  {formatMoney(result.finalSavingsAmount)}원
                </span>
              </div>
            )}
            {ratio.investment > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">
                  투자 수익 (연 {returnRate}%)
                </span>
                <span className="font-semibold text-emerald-600">
                  {formatMoney(result.finalInvestmentAmount)}원
                </span>
              </div>
            )}
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">최종 자산</span>
              <span className="font-bold text-xl text-forest-700">
                {formatMoney(result.totalFinalAmount)}원
              </span>
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <div className="bg-forest-50 border border-forest-100 rounded-2xl p-4 mb-8">
          <p className="text-sm text-forest-800 leading-relaxed">
            {ratio.investment > 0
              ? `같은 돈을 넣었지만, ${periodYears}년 후 자산은 ${formatMoney(result.totalFinalAmount - result.totalDeposited)}원 더 늘어납니다. 복리의 힘은 시간이 길수록 커집니다.`
              : `${periodYears}년간 꾸준히 저축하면 ${formatMoney(result.totalFinalAmount)}원의 자산을 만들 수 있습니다. 투자를 병행하면 더 큰 차이를 만들 수 있습니다.`}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/simulation/snapshot")}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            이전
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-[2] py-3.5 rounded-xl bg-forest-700 text-white font-semibold text-sm hover:bg-forest-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "저장 중..." : "다음 단계로"}
          </button>
        </div>
      </div>
    </div>
  );
}
