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
  difficulty: "easy" | "normal";
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
  }[];
};
