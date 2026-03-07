"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/StepProgress";
import { saveInvestmentTendency } from "@/actions/simulation";
import {
  tendencyQuestions,
  getTendencyType,
  tendencyDescriptions,
  type TendencyType,
} from "@/lib/tendency-questions";

const allTypes: TendencyType[] = [
  "안정형",
  "안정추구형",
  "위험중립형",
  "적극투자형",
  "공격투자형",
];

function ScoreGauge({
  score,
  maxScore,
  color,
}: {
  score: number;
  maxScore: number;
  color: string;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / maxScore) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="148" height="148" className="-rotate-90">
        <circle
          cx="74"
          cy="74"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="10"
        />
        <circle
          cx="74"
          cy="74"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color }}>
          {animatedScore}
        </span>
        <span className="text-xs text-white/60">/ {maxScore}점</span>
      </div>
    </div>
  );
}

function PortfolioBar({
  splits,
}: {
  splits: { label: string; ratio: number; color: string }[];
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-4 mb-2">
        {splits.map((s, i) => (
          <div
            key={i}
            className="transition-all duration-700 ease-out"
            style={{
              width: show ? `${s.ratio}%` : "0%",
              backgroundColor: s.color,
              transitionDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {splits.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-xs text-gray-600">
              {s.label} {s.ratio}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RiskMeter({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-5 flex-1 rounded-sm transition-all duration-500 ${
            i <= level ? "opacity-100" : "opacity-20"
          }`}
          style={{
            backgroundColor:
              i <= 2 ? "#4A7C5F" : i === 3 ? "#eab308" : "#ef4444",
            transitionDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default function TendencyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [revealStep, setRevealStep] = useState(0);

  const allAnswered = tendencyQuestions.every(
    (q) => answers[q.id] !== undefined
  );
  const totalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const tendencyType = getTendencyType(totalScore);
  const tendencyInfo = tendencyDescriptions[tendencyType];
  const maxScore = 98;

  function handleAnswer(questionId: string, score: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  }

  function handleShowResult() {
    if (!allAnswered) return;
    setShowResult(true);
    setRevealStep(0);
    setTimeout(() => setRevealStep(1), 200);
    setTimeout(() => setRevealStep(2), 800);
    setTimeout(() => setRevealStep(3), 1400);
    setTimeout(() => setRevealStep(4), 2000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveInvestmentTendency({
        answers,
        totalScore,
        tendencyType,
      });
      router.push("/simulation/report");
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (showResult) {
    return (
      <div className="min-h-dvh flex flex-col bg-stone-50">
        <StepProgress currentStep={5} />

        <div className="flex-1 px-5 py-6">
          {/* 히어로 결과 카드 */}
          <div
            className={`relative overflow-hidden rounded-3xl p-6 mb-5 text-center transition-all duration-700 ${
              revealStep >= 1
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ background: "linear-gradient(135deg, #2F4538, #3A5645)" }}
          >
            <div className="absolute inset-0 bg-white/5" />
            <div className="relative z-10">
              <div className="text-5xl mb-2">{tendencyInfo.emoji}</div>
              <div className="mb-3">
                <ScoreGauge
                  score={totalScore}
                  maxScore={maxScore}
                  color="white"
                />
              </div>
              <h2 className="text-2xl font-black text-white mb-1">
                {tendencyType}
              </h2>
              <p className="text-white/70 text-sm font-medium">
                &ldquo;{tendencyInfo.keyword}&rdquo;
              </p>
            </div>
          </div>

          {/* 설명 카드 */}
          <div
            className={`bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-xs transition-all duration-500 ${
              revealStep >= 2
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              {tendencyInfo.description}
            </p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>안전</span>
                <span>위험 감수도</span>
                <span>공격</span>
              </div>
              <RiskMeter level={tendencyInfo.riskLevel} />
            </div>
          </div>

          {/* 추천 포트폴리오 */}
          <div
            className={`bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-xs transition-all duration-500 ${
              revealStep >= 3
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              추천 포트폴리오
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              {tendencyInfo.strategy}
            </p>
            <PortfolioBar splits={tendencyInfo.portfolioSplit} />
          </div>

          {/* 나의 위치 - 5등급 스케일 */}
          <div
            className={`bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-xs transition-all duration-500 ${
              revealStep >= 4
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              전체 성향 분류에서 나의 위치
            </h3>
            <div className="space-y-2.5">
              {allTypes.map((type) => {
                const info = tendencyDescriptions[type];
                const isMe = type === tendencyType;
                return (
                  <div key={type} className="flex items-center gap-2.5">
                    <span className="text-base w-6 text-center">
                      {isMe ? info.emoji : ""}
                    </span>
                    <div className="flex-1">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${
                          isMe ? "scale-y-125" : ""
                        }`}
                        style={{
                          backgroundColor: info.color,
                          opacity: isMe ? 1 : 0.2,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs w-16 text-right ${
                        isMe ? "font-black" : "text-gray-400"
                      }`}
                      style={isMe ? { color: info.color } : {}}
                    >
                      {type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowResult(false);
                setRevealStep(0);
              }}
              className="flex-1 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              다시 하기
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-[2] py-3.5 rounded-xl bg-forest-700 text-white font-semibold text-sm disabled:opacity-50 transition-colors hover:bg-forest-800"
            >
              {saving ? "저장 중..." : "최종 리포트 보기"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 설문 진행 상태
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / tendencyQuestions.length) * 100;

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <StepProgress currentStep={5} />

      <div className="flex-1 px-5 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          투자 성향 분석
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          7개 문항에 답하고 나에게 맞는 투자 성향을 알아보세요.
        </p>

        {/* 진행률 */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>
              {answeredCount}/{tendencyQuestions.length} 완료
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-forest-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-5">
          {tendencyQuestions.map((q, qi) => (
            <div
              key={q.id}
              className={`rounded-2xl p-4 transition-all duration-300 border ${
                answers[q.id] !== undefined
                  ? "bg-forest-50 border-forest-200"
                  : "bg-white border-gray-100 shadow-xs"
              }`}
            >
              <p className="text-sm font-semibold text-gray-800 mb-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-forest-700 text-white text-xs font-bold mr-2">
                  {qi + 1}
                </span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => handleAnswer(q.id, opt.score)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                      answers[q.id] === opt.score
                        ? "bg-forest-700 text-white shadow-md scale-[1.01]"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-forest-50 hover:border-forest-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.push("/simulation/pension")}
            className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            이전
          </button>
          <button
            onClick={handleShowResult}
            disabled={!allAnswered}
            className="flex-[2] py-3.5 rounded-xl bg-forest-700 text-white font-semibold text-sm hover:bg-forest-800 disabled:opacity-50 transition-all duration-300"
          >
            {allAnswered ? "결과 확인하기" : `${7 - answeredCount}개 남았어요`}
          </button>
        </div>
      </div>
    </div>
  );
}
