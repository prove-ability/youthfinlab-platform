/** Pure, client-safe presentation types. The actual scenario is stored on the server. */
export const exposureLabels = {
  sensitive: "차입 의존형",
  balanced: "균형형",
  defensive: "생활 수요형",
} as const;
export type Exposure = keyof typeof exposureLabels;
export const reasonLabels = {
  cash: "불확실성에 대비해 현금을 남기려 해요",
  spread: "한 종목에 집중된 위험을 나누려 해요",
  value: "가격과 기업의 상황을 비교했어요",
  wait: "정보가 부족해서 더 지켜보려 해요",
  maintain: "기존 판단을 유지했어요",
  other: "다른 이유가 있어요",
} as const;
export type DecisionReason = keyof typeof reasonLabels;
export type ScenarioStock = {
  stockId: string;
  name: string;
  exposure: Exposure;
  initialPrice: number;
};
export type ScenarioDay = {
  day: number;
  title: string;
  news: string;
  explanation: string;
  prices: { stockId: string; price: number }[];
};
export type CrisisScenario = {
  version: 1;
  difficulty: "easy" | "normal" | "hard";
  stocks: ScenarioStock[];
  days: ScenarioDay[];
};
export type Decision = { day: number; reason: DecisionReason; note: string };
export type StudentMarketView = {
  totalDays: number;
  day: number;
  ended: boolean;
  canDecide: boolean;
  stocks: Omit<ScenarioStock, "initialPrice">[];
  bulletin: { title: string; news: string };
  decision: Decision | null;
  history: {
    day: number;
    title: string;
    explanation: string;
    decision: Decision | null;
    changes: { name: string; percent: number }[];
    portfolio?: PortfolioReview | null;
  }[];
};

/** Shared preview and server defaults; prices are educational, not market data. */
export const defaultEventStocks = [
  { name: "새싹테크", exposure: "sensitive", initialPrice: 10000 },
  { name: "든든산업", exposure: "balanced", initialPrice: 10000 },
  { name: "온기생활", exposure: "defensive", initialPrice: 10000 },
] as const;

export const marketMoodLabels = {
  observe: "정보 살펴보기",
  caution: "불확실성 확대",
  crisis: "시장 충격",
  response: "정책 발표 확인",
  review: "엇갈린 정보 점검",
} as const;
/** Deliberately accepts no prices, future days, difficulty, or outcomes. */
export function marketMoodFromBulletin(
  title: string,
): keyof typeof marketMoodLabels {
  if (/시장 급락|시장 전반으로 확산/.test(title)) return "crisis";
  if (/지원책 발표|시장 안정 대책이 발표/.test(title)) return "response";
  if (/불안|대출.*강화|대출 심사|지원 심사 지연/.test(title)) return "caution";
  if (/회복|반등|대응이 갈리|재조정|이익 감소|상환 부담/.test(title))
    return "review";
  return "observe";
}

export type PortfolioReview = {
  day: number;
  cash: number;
  before: number;
  after: number;
  marketChange: number;
  allowance: number;
  allocation: { name: string; value: number; percent: number }[];
};
