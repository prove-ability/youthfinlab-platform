"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import StepProgress from "@/components/StepProgress";
import { savePensionResult, getOrCreateSimulation } from "@/actions/simulation";
import {
  simulatePension,
  getPensionGrowthData,
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

const START_OPTIONS = [
  { value: "now", label: "지금 시작", offset: 0 },
  { value: "5years", label: "5년 뒤", offset: 5 },
  { value: "10years", label: "10년 뒤", offset: 10 },
];

export default function PensionPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { data: simulation } = useQuery({
    queryKey: ["simulation"],
    queryFn: () => getOrCreateSimulation(),
  });

  const currentAge = simulation?.profile?.age || 25;
  const [monthlyContribution, setMonthlyContribution] = useState(20);
  const [retirementAge, setRetirementAge] = useState(65);

  const scenarios = useMemo(() => {
    return START_OPTIONS.map((opt) => {
      const startAge = currentAge + opt.offset;
      const result = simulatePension(
        currentAge,
        startAge,
        monthlyContribution * 10000,
        retirementAge
      );
      const growthData = getPensionGrowthData(
        startAge,
        monthlyContribution * 10000,
        retirementAge
      );
      return {
        ...opt,
        startAge,
        ...result,
        growthData,
      };
    });
  }, [currentAge, monthlyContribution, retirementAge]);

  const nowScenario = scenarios[0]!;
  const laterScenario = scenarios[2]!;
  const assetDiff =
    nowScenario.estimatedAssetAtRetirement -
    laterScenario.estimatedAssetAtRetirement;

  const chartData = useMemo(() => {
    const allAges = new Set<number>();
    scenarios.forEach((s) => s.growthData.forEach((d) => allAges.add(d.age)));
    const sortedAges = Array.from(allAges).sort((a, b) => a - b);

    return sortedAges.map((age) => {
      const entry: Record<string, number> = { age };
      scenarios.forEach((s) => {
        const point = s.growthData.find((d) => d.age === age);
        entry[s.value] = point?.asset || 0;
      });
      return entry;
    });
  }, [scenarios]);

  async function handleSave() {
    setSaving(true);
    try {
      await savePensionResult({
        currentAge,
        startTiming: "now",
        monthlyContribution: monthlyContribution * 10000,
        retirementAge,
        totalContributed: nowScenario.totalContributed,
        estimatedAssetAtRetirement: nowScenario.estimatedAssetAtRetirement,
        estimatedMonthlyPension: nowScenario.estimatedMonthlyPension,
      });
      router.push("/simulation/tendency");
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  const tooltipFormatter = (value: number) => formatMoney(value) + "원";

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <StepProgress currentStep={4} />

      <div className="flex-1 px-5 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          연금 준비 체험
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          시작 시점이 만드는 차이를 직접 확인해보세요.
        </p>

        {/* 입력 */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 나이
            </label>
            <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700">
              {currentAge}세
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월 납입액
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={monthlyContribution}
                onChange={(e) =>
                  setMonthlyContribution(Number(e.target.value))
                }
                className="flex-1"
              />
              <span className="text-sm font-bold text-forest-700 w-20 text-right">
                {monthlyContribution}만원
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              은퇴 나이
            </label>
            <div className="flex gap-2">
              {[60, 65, 70].map((age) => (
                <button
                  key={age}
                  onClick={() => setRetirementAge(age)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    retirementAge === age
                      ? "bg-forest-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {age}세
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 차트 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-xs">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            시작 시점별 자산 성장 비교
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="age"
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}세`}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => formatMoney(v) + "원"}
                width={70}
              />
              <Tooltip
                formatter={tooltipFormatter}
                labelFormatter={(v) => `${v}세`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="now"
                name="지금 시작"
                stroke="#2F4538"
                fill="#E3EFE7"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="5years"
                name="5년 뒤"
                stroke="#f59e0b"
                fill="#fef3c7"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="10years"
                name="10년 뒤"
                stroke="#ef4444"
                fill="#fef2f2"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 시나리오별 결과 */}
        <div className="space-y-3 mb-5">
          {scenarios.map((s, i) => (
            <div
              key={s.value}
              className={`rounded-2xl p-4 ${
                i === 0
                  ? "bg-forest-50 border border-forest-200"
                  : "bg-white border border-gray-100 shadow-xs"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-sm font-semibold ${i === 0 ? "text-forest-800" : "text-gray-700"}`}
                >
                  {s.label} ({s.startAge}세~)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">총 납입</p>
                  <p className="font-semibold">
                    {formatMoney(s.totalContributed)}원
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">은퇴 시 자산</p>
                  <p className="font-semibold">
                    {formatMoney(s.estimatedAssetAtRetirement)}원
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">월 수령액</p>
                  <p className="font-semibold">
                    {formatMoney(s.estimatedMonthlyPension)}원
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 메시지 */}
        <div className="bg-forest-50 border border-forest-100 rounded-2xl p-4 mb-8">
          <p className="text-sm text-forest-800 leading-relaxed">
            더 많이 넣어서가 아니라,{" "}
            <strong>더 일찍 시작했기 때문에 차이가 납니다.</strong> 지금
            시작하면 10년 뒤 시작보다{" "}
            <strong>{formatMoney(assetDiff)}원</strong> 더 많은 자산을 만들 수
            있습니다.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/simulation/investment")}
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
