/**
 * 투자 성향 분석 설문 문항
 * 금융투자협회 표준투자권유준칙 기반 5등급 분류 체계
 *
 * 안정형 (20점 이하) / 안정추구형 (21-40점) / 위험중립형 (41-60점)
 * 적극투자형 (61-80점) / 공격투자형 (81점 초과)
 */

export interface TendencyQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    score: number;
  }[];
}

export const tendencyQuestions: TendencyQuestion[] = [
  {
    id: "q1",
    question: "투자의 주된 목적은 무엇인가요?",
    options: [
      { label: "생활비 충당 등 단기 자금 마련", score: 2 },
      { label: "목돈 마련 (결혼, 주택 등)", score: 6 },
      { label: "노후 자금 등 장기 자산 증식", score: 10 },
      { label: "적극적인 투자를 통한 높은 수익 추구", score: 14 },
    ],
  },
  {
    id: "q2",
    question: "투자 가능 기간은 어느 정도인가요?",
    options: [
      { label: "6개월 이내", score: 2 },
      { label: "6개월 ~ 1년", score: 4 },
      { label: "1년 ~ 3년", score: 8 },
      { label: "3년 ~ 5년", score: 12 },
      { label: "5년 이상", score: 14 },
    ],
  },
  {
    id: "q3",
    question: "금융 상품에 투자해 본 경험이 있나요?",
    options: [
      { label: "예적금 이외의 투자 경험이 없다", score: 2 },
      { label: "펀드나 채권에 투자해 본 적 있다", score: 6 },
      { label: "주식에 직접 투자해 본 적 있다", score: 10 },
      { label: "파생상품(선물, 옵션 등)까지 경험이 있다", score: 14 },
    ],
  },
  {
    id: "q4",
    question: "투자 원금에 손실이 발생할 경우 어떻게 하시겠어요?",
    options: [
      { label: "어떤 손실도 감수하기 어렵다", score: 2 },
      { label: "투자 원금의 10% 이내 손실은 감수할 수 있다", score: 6 },
      { label: "투자 원금의 20% 이내 손실은 감수할 수 있다", score: 10 },
      { label: "투자 원금의 20% 이상 손실도 감수할 수 있다", score: 14 },
    ],
  },
  {
    id: "q5",
    question: "연간 기대 수익률은 어느 정도인가요?",
    options: [
      { label: "예금 금리 수준 (연 2~3%)", score: 2 },
      { label: "예금 금리 + α (연 5~6%)", score: 6 },
      { label: "주식시장 평균 수익률 (연 8~10%)", score: 10 },
      { label: "주식시장 평균 이상의 높은 수익 (연 15% 이상)", score: 14 },
    ],
  },
  {
    id: "q6",
    question: "현재 소득 대비 향후 소득 전망은 어떤가요?",
    options: [
      { label: "현재 소득이 감소하거나 불안정하다", score: 2 },
      { label: "현재 수준을 유지할 것 같다", score: 6 },
      { label: "향후 소득이 증가할 것으로 예상된다", score: 10 },
      { label: "향후 소득이 크게 증가할 것으로 확신한다", score: 14 },
    ],
  },
  {
    id: "q7",
    question:
      "만약 투자한 금액이 한 달 만에 20% 하락했다면 어떻게 하시겠어요?",
    options: [
      { label: "즉시 전액 매도한다", score: 2 },
      { label: "일부를 매도하고 나머지는 지켜본다", score: 6 },
      { label: "그대로 보유하면서 상황을 관찰한다", score: 10 },
      { label: "오히려 추가 매수 기회로 삼는다", score: 16 },
    ],
  },
];

export type TendencyType =
  | "안정형"
  | "안정추구형"
  | "위험중립형"
  | "적극투자형"
  | "공격투자형";

export function getTendencyType(totalScore: number): TendencyType {
  if (totalScore <= 20) return "안정형";
  if (totalScore <= 40) return "안정추구형";
  if (totalScore <= 60) return "위험중립형";
  if (totalScore <= 80) return "적극투자형";
  return "공격투자형";
}

export const tendencyDescriptions: Record<
  TendencyType,
  {
    description: string;
    strategy: string;
    color: string;
    gradient: string;
    emoji: string;
    keyword: string;
    riskLevel: number; // 1~5
    portfolioSplit: { label: string; ratio: number; color: string }[];
  }
> = {
  안정형: {
    description:
      "원금 보존을 가장 중요하게 생각하며, 안정적인 수익을 선호합니다. 예적금이나 국채 등 확정 수익형 상품이 적합합니다.",
    strategy:
      "예적금 위주로 시작하고, 여유 자금의 일부만 안전한 채권형 펀드에 투자해보세요.",
    color: "#3b82f6",
    gradient: "from-blue-400 to-blue-600",
    emoji: "🛡️",
    keyword: "안전 제일",
    riskLevel: 1,
    portfolioSplit: [
      { label: "예적금", ratio: 90, color: "#3b82f6" },
      { label: "채권", ratio: 10, color: "#93c5fd" },
    ],
  },
  안정추구형: {
    description:
      "안정적인 투자를 선호하지만, 약간의 위험은 감수할 수 있습니다. 원금 보호와 함께 소폭의 추가 수익을 기대합니다.",
    strategy: "예적금 70% + 채권형 펀드 30% 비율로 시작해보세요.",
    color: "#22c55e",
    gradient: "from-emerald-400 to-green-600",
    emoji: "🌿",
    keyword: "느리지만 확실하게",
    riskLevel: 2,
    portfolioSplit: [
      { label: "예적금", ratio: 70, color: "#22c55e" },
      { label: "채권형 펀드", ratio: 30, color: "#86efac" },
    ],
  },
  위험중립형: {
    description:
      "위험과 수익의 균형을 추구합니다. 어느 정도의 손실 가능성을 인지하면서도 중간 수준의 수익을 기대합니다.",
    strategy: "예적금 50% + 혼합형 펀드/ETF 50% 비율을 고려해보세요.",
    color: "#eab308",
    gradient: "from-amber-400 to-yellow-600",
    emoji: "⚖️",
    keyword: "균형과 조화",
    riskLevel: 3,
    portfolioSplit: [
      { label: "예적금", ratio: 50, color: "#eab308" },
      { label: "혼합형 펀드", ratio: 30, color: "#fcd34d" },
      { label: "ETF", ratio: 20, color: "#fef08a" },
    ],
  },
  적극투자형: {
    description:
      "높은 수준의 투자 위험을 감수할 수 있으며, 장기적인 관점에서 높은 수익을 추구합니다.",
    strategy: "안정 자산 30% + 주식형 펀드/ETF 70% 비율을 고려해보세요.",
    color: "#f97316",
    gradient: "from-orange-400 to-orange-600",
    emoji: "🚀",
    keyword: "도전과 성장",
    riskLevel: 4,
    portfolioSplit: [
      { label: "예적금", ratio: 30, color: "#fdba74" },
      { label: "주식형 펀드", ratio: 40, color: "#f97316" },
      { label: "ETF", ratio: 30, color: "#ea580c" },
    ],
  },
  공격투자형: {
    description:
      "최대한의 수익을 추구하며, 투자 원금의 상당 부분에 대한 손실 위험도 적극 감수할 수 있습니다.",
    strategy:
      "분산 투자를 전제로, 주식/ETF 위주의 적극적인 포트폴리오를 구성해보세요.",
    color: "#ef4444",
    gradient: "from-red-400 to-rose-600",
    emoji: "🔥",
    keyword: "하이리스크 하이리턴",
    riskLevel: 5,
    portfolioSplit: [
      { label: "예적금", ratio: 10, color: "#fca5a5" },
      { label: "주식", ratio: 50, color: "#ef4444" },
      { label: "ETF", ratio: 30, color: "#dc2626" },
      { label: "기타", ratio: 10, color: "#991b1b" },
    ],
  },
};
