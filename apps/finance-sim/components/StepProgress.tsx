"use client";

const STEPS = [
  { step: 1, label: "기본 정보" },
  { step: 2, label: "상태 요약" },
  { step: 3, label: "저축vs투자" },
  { step: 4, label: "연금 체험" },
  { step: 5, label: "투자 성향" },
  { step: 6, label: "최종 리포트" },
];

export default function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="px-5 pt-5 pb-4 bg-forest-700">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-white/90">
          {currentStep}/6 단계
        </span>
        <span className="text-xs text-white/90">
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>
      <div className="flex gap-1.5" role="progressbar" aria-label="학습 진행 단계" aria-valuemin={0} aria-valuemax={6} aria-valuenow={currentStep} aria-valuetext={`${currentStep}/6 단계: ${STEPS[currentStep - 1]?.label}`}>
        {STEPS.map((s) => (
          <div
            key={s.step}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s.step <= currentStep ? "bg-forest-300" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
