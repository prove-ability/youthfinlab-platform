"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import StepProgress from "@/components/StepProgress";
import { getOrCreateSimulation } from "@/actions/simulation";
import { calculateFinancialSnapshot, formatMoney } from "@/lib/calculations";

export default function SnapshotPage() {
  const router = useRouter();

  const { data: simulation, isLoading } = useQuery({
    queryKey: ["simulation"],
    queryFn: () => getOrCreateSimulation(),
  });

  const profile = simulation?.profile;

  useEffect(() => {
    if (!isLoading && !profile) {
      router.push("/simulation/profile");
    }
  }, [isLoading, profile, router]);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-pulse text-gray-400">불러오는 중...</div>
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

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <StepProgress currentStep={2} />

      <div className="flex-1 px-5 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          나의 재무 상태
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          입력한 정보를 바탕으로 현재 상태를 정리했습니다.
        </p>

        {/* 핵심 지표 카드 */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-forest-50 rounded-2xl p-4 border border-forest-100">
            <p className="text-xs text-forest-600 mb-1">월 여유자금</p>
            <p className="text-lg font-bold text-forest-800">
              {formatMoney(snapshot.monthlySurplus * 10000)}원
            </p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <p className="text-xs text-emerald-600 mb-1">저축 가능 비율</p>
            <p className="text-lg font-bold text-emerald-800">
              {snapshot.savingsRate}%
            </p>
          </div>
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
            <p className="text-xs text-stone-500 mb-1">순자산</p>
            <p className="text-lg font-bold text-stone-800">
              {formatMoney(snapshot.netAssets * 10000)}원
            </p>
          </div>
          <div
            className={`rounded-2xl p-4 border ${
              snapshot.debtBurden === "없음"
                ? "bg-gray-50 border-gray-200"
                : snapshot.debtBurden === "낮음"
                  ? "bg-green-50 border-green-100"
                  : snapshot.debtBurden === "보통"
                    ? "bg-amber-50 border-amber-100"
                    : "bg-red-50 border-red-100"
            }`}
          >
            <p
              className={`text-xs mb-1 ${
                snapshot.debtBurden === "없음"
                  ? "text-gray-500"
                  : snapshot.debtBurden === "낮음"
                    ? "text-green-600"
                    : snapshot.debtBurden === "보통"
                      ? "text-amber-600"
                      : "text-red-600"
              }`}
            >
              부채 부담도
            </p>
            <p
              className={`text-lg font-bold ${
                snapshot.debtBurden === "없음"
                  ? "text-gray-700"
                  : snapshot.debtBurden === "낮음"
                    ? "text-green-800"
                    : snapshot.debtBurden === "보통"
                      ? "text-amber-800"
                      : "text-red-800"
              }`}
            >
              {snapshot.debtBurden}
            </p>
          </div>
        </div>

        {/* 세부 내역 - 카드 스타일 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-xs">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            월 자산 현황
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">수입</span>
              <span className="font-bold text-forest-700 text-base">
                {Number(profile.monthlyIncome).toLocaleString()}만원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">지출</span>
              <span className="font-bold text-red-500 text-base">
                {Number(profile.monthlyFixedExpenses).toLocaleString()}만원
              </span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-gray-500">저축</span>
              <span className="font-bold text-forest-700 text-base">
                {snapshot.monthlySurplus.toLocaleString()}만원
              </span>
            </div>
          </div>
        </div>

        {/* 자산 현황 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-xs">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            보유 자산
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">현금성 자산</span>
              <span className="font-medium">
                {Number(profile.cashAssets).toLocaleString()}만원
              </span>
            </div>
            {profile.investmentAssets && (
              <div className="flex justify-between">
                <span className="text-gray-500">투자자산</span>
                <span className="font-medium">
                  {Number(profile.investmentAssets).toLocaleString()}만원
                </span>
              </div>
            )}
            {profile.hasDebt && profile.totalDebtAmount && (
              <div className="flex justify-between">
                <span className="text-gray-500">총 부채</span>
                <span className="font-medium text-red-500">
                  -{Number(profile.totalDebtAmount).toLocaleString()}만원
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 상태 코멘트 */}
        <div className="bg-forest-50 border border-forest-100 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-forest-500 mt-0.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>
            <p className="text-sm text-forest-800 leading-relaxed">
              {snapshot.comment}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/simulation/profile?edit=true")}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            이전
          </button>
          <button
            onClick={() => router.push("/simulation/investment")}
            className="flex-[2] py-3.5 rounded-xl bg-forest-700 text-white font-semibold text-sm hover:bg-forest-800 transition-colors"
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
}
