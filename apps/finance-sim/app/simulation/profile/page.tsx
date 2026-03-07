"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepProgress from "@/components/StepProgress";
import { saveProfile, getOrCreateSimulation } from "@/actions/simulation";
import { useQuery } from "@tanstack/react-query";

const STATUS_OPTIONS = [
  { value: "employed", label: "재직 중" },
  { value: "freelancer", label: "프리랜서" },
  { value: "job_seeker", label: "취업 준비 중" },
  { value: "on_leave", label: "휴직 중" },
];

interface ProfileDraft {
  age: string;
  currentStatus: string;
  monthlyIncome: string;
  monthlyFixedExpenses: string;
  cashAssets: string;
  investmentAssets: string;
  hasDebt: boolean;
  totalDebtAmount: string;
}

const DRAFT_KEY_PREFIX = "finance_sim_profile_draft_";

function getDraftKey(simulationId: string) {
  return `${DRAFT_KEY_PREFIX}${simulationId}`;
}

function saveDraft(simulationId: string, draft: ProfileDraft) {
  try {
    localStorage.setItem(getDraftKey(simulationId), JSON.stringify(draft));
  } catch {
    // localStorage 사용 불가 시 무시
  }
}

function loadDraft(simulationId: string): ProfileDraft | null {
  try {
    const stored = localStorage.getItem(getDraftKey(simulationId));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function clearDraft(simulationId: string) {
  try {
    localStorage.removeItem(getDraftKey(simulationId));
  } catch {
    // 무시
  }
}

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const [saving, setSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [form, setForm] = useState<ProfileDraft>({
    age: "",
    currentStatus: "",
    monthlyIncome: "",
    monthlyFixedExpenses: "",
    cashAssets: "",
    investmentAssets: "",
    hasDebt: false,
    totalDebtAmount: "",
  });

  const { data: simulation, isLoading } = useQuery({
    queryKey: ["simulation"],
    queryFn: () => getOrCreateSimulation(),
  });

  const simulationId = simulation?.id;
  const profile = simulation?.profile;
  const currentStep = simulation?.currentStep ?? 1;
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isLoading || isEditMode) return;
    if (profile && currentStep >= 2) {
      const stepRoutes: Record<number, string> = {
        2: "/simulation/snapshot",
        3: "/simulation/investment",
        4: "/simulation/pension",
        5: "/simulation/tendency",
        6: "/simulation/report",
      };
      router.replace(stepRoutes[currentStep] || "/simulation/snapshot");
    }
  }, [isLoading, profile, currentStep, isEditMode, router]);

  useEffect(() => {
    if (isLoading || !simulationId || initializedRef.current) return;
    initializedRef.current = true;

    const draft = loadDraft(simulationId);
    if (draft) {
      setForm(draft);
    } else if (isEditMode && profile) {
      setForm({
        age: String(profile.age),
        currentStatus: profile.currentStatus,
        monthlyIncome: String(Number(profile.monthlyIncome)),
        monthlyFixedExpenses: String(Number(profile.monthlyFixedExpenses)),
        cashAssets: String(Number(profile.cashAssets)),
        investmentAssets: profile.investmentAssets
          ? String(Number(profile.investmentAssets))
          : "",
        hasDebt: profile.hasDebt,
        totalDebtAmount: profile.totalDebtAmount
          ? String(Number(profile.totalDebtAmount))
          : "",
      });
    }
    setIsReady(true);
  }, [isLoading, simulationId, profile, isEditMode]);

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const autoSaveDraft = useCallback(() => {
    if (!simulationId) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveDraft(simulationId, form);
    }, 500);
  }, [simulationId, form]);

  useEffect(() => {
    if (isReady) autoSaveDraft();
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [form, isReady, autoSaveDraft]);

  function updateField(field: keyof ProfileDraft, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    try {
      await saveProfile({
        age: Number(form.age),
        currentStatus: form.currentStatus,
        monthlyIncome: Number(form.monthlyIncome),
        monthlyFixedExpenses: Number(form.monthlyFixedExpenses),
        cashAssets: Number(form.cashAssets),
        investmentAssets: form.investmentAssets
          ? Number(form.investmentAssets)
          : null,
        hasDebt: form.hasDebt,
        totalDebtAmount: form.hasDebt ? Number(form.totalDebtAmount) : null,
      });

      if (simulationId) clearDraft(simulationId);
      router.push("/simulation/snapshot");
    } catch {
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !isReady) {
    return (
      <div className="min-h-dvh flex flex-col">
        <StepProgress currentStep={1} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">불러오는 중...</div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow";

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <StepProgress currentStep={1} />

      <div className="flex-1 px-5 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">기본 정보 입력</h1>
        <p className="text-sm text-gray-500 mb-5">
          나의 재무 상태를 파악하기 위한 기본 정보입니다.
        </p>

        <div className="bg-forest-50 rounded-xl p-3 mb-6 border border-forest-100">
          <p className="text-xs text-forest-700">
            정확하지 않아도 괜찮습니다. 대략적인 숫자로도 충분합니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              기본 정보
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">나이</label>
                <input
                  name="age"
                  type="number"
                  required
                  min={15}
                  max={40}
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  placeholder="예: 25"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  현재 상태
                </label>
                <select
                  name="currentStatus"
                  required
                  value={form.currentStatus}
                  onChange={(e) => updateField("currentStatus", e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    선택해주세요
                  </option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 소득/지출 */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              소득 / 지출
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  월 소득 (세후, 만원)
                </label>
                <input
                  name="monthlyIncome"
                  type="number"
                  required
                  min={0}
                  value={form.monthlyIncome}
                  onChange={(e) => updateField("monthlyIncome", e.target.value)}
                  placeholder="예: 250"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  월 고정지출 (만원)
                </label>
                <input
                  name="monthlyFixedExpenses"
                  type="number"
                  required
                  min={0}
                  value={form.monthlyFixedExpenses}
                  onChange={(e) =>
                    updateField("monthlyFixedExpenses", e.target.value)
                  }
                  placeholder="예: 150"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* 자산 */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">자산</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  현금성 자산 (통장, 예금 등, 만원)
                </label>
                <input
                  name="cashAssets"
                  type="number"
                  required
                  min={0}
                  value={form.cashAssets}
                  onChange={(e) => updateField("cashAssets", e.target.value)}
                  placeholder="예: 1000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  투자자산 (선택, 만원)
                </label>
                <input
                  name="investmentAssets"
                  type="number"
                  min={0}
                  value={form.investmentAssets}
                  onChange={(e) =>
                    updateField("investmentAssets", e.target.value)
                  }
                  placeholder="없으면 비워두세요"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* 부채 */}
          <section className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">부채</h2>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => updateField("hasDebt", false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  !form.hasDebt
                    ? "bg-forest-700 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                없음
              </button>
              <button
                type="button"
                onClick={() => updateField("hasDebt", true)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  form.hasDebt
                    ? "bg-forest-700 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                있음
              </button>
            </div>
            {form.hasDebt && (
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  총 부채 금액 (만원)
                </label>
                <input
                  name="totalDebtAmount"
                  type="number"
                  required={form.hasDebt}
                  min={0}
                  value={form.totalDebtAmount}
                  onChange={(e) =>
                    updateField("totalDebtAmount", e.target.value)
                  }
                  placeholder="학자금, 신용대출 등 총액"
                  className={inputClass}
                />
              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-forest-700 text-white font-semibold text-sm hover:bg-forest-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "저장 중..." : "다음 단계로"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex flex-col">
          <StepProgress currentStep={1} />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">불러오는 중...</div>
          </div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
