// LOCAL PREVIEW ONLY. No credentials, remote requests or production records.
import {
  buildCrisisScenario,
  studentMarketView,
} from "../../packages/db/src/crisis-engine";
import { defaultEventStocks } from "../../packages/db/src/market-scenario";
import type { Decision } from "../../packages/db/src/market-scenario";
export const stocks = [
  { id: "a", name: "새싹테크" },
  { id: "b", name: "온기생활" },
  { id: "c", name: "든든산업" },
];
export const scenario = buildCrisisScenario(
  stocks.map((s, i) => ({
    stockId: s.id,
    name: s.name,
    initialPrice: 10000,
    exposure: (["sensitive", "defensive", "balanced"] as const)[i]!,
  })),
  new URLSearchParams(location.search).get("difficulty") === "hard"
    ? "hard"
    : "normal",
);
export const state = {
  day: 4,
  configured: true,
  failRead: false,
  failSave: false,
  decisions: [
    {
      day: 3,
      reason: "cash",
      note: "돈을 빌리기 어려워지면 여러 회사가 함께 힘들어질 수 있어 현금을 남겼어요.",
    },
  ] as Decision[],
};
const delay = () => new Promise((r) => setTimeout(r, 250));
export async function getMarketScenarioAdmin() {
  await delay();
  if (state.failRead) throw Error("로컬 읽기 실패");
  return {
    scenario: state.configured ? scenario : null,
    status: "active",
    currentDay: state.day,
    participation: {
      total: 3,
      completed: state.decisions.some((d) => d.day === state.day) ? 1 : 0,
      missing: state.decisions.some((d) => d.day === state.day) ? 2 : 3,
    },
    decisions: state.decisions.map((d) => ({ ...d, name: "미리보기 학생" })),
  };
}
export async function configureMarketScenario(input: any) {
  await delay();
  if (state.failSave) throw Error("저장하지 못했습니다. 다시 시도해 주세요.");
  const built = buildCrisisScenario(
    input.stocks
      ? input.stocks.map((s: any) => ({
          ...s,
          name: stocks.find((x) => x.id === s.stockId)?.name ?? s.stockId,
        }))
      : defaultEventStocks.map((s, i) => ({ ...s, stockId: `default-${i}` })),
    input.difficulty,
  );
  Object.assign(scenario, built);
  state.configured = true;
  return { success: true };
}
export async function getStudentMarketScenario() {
  await delay();
  if (state.failRead) throw Error("로컬 읽기 실패");
  if (!state.configured) return null;
  const view = studentMarketView(
    scenario,
    state.day,
    "active",
    state.decisions,
  );
  return {
    ...view,
    history: view.history.map((h) => {
      const current = scenario.days[h.day - 1]!.prices[0]!.price * 5;
      const next = scenario.days[h.day]!.prices[0]!.price * 5;
      const cash = 50000;
      const before = cash + current;
      return {
        ...h,
        portfolio: {
          day: h.day,
          cash,
          before,
          after: cash + next,
          marketChange: next - current,
          allowance: 100000,
          allocation: [
            {
              name: "현금",
              value: cash,
              percent: Math.round((cash / before) * 1000) / 10,
            },
            {
              name: scenario.stocks[0]!.name,
              value: current,
              percent: Math.round((current / before) * 1000) / 10,
            },
          ],
        },
      };
    }),
  };
}
export async function saveMarketDecision(input: Decision) {
  await delay();
  if (state.failSave) throw Error("저장하지 못했습니다. 다시 시도해 주세요.");
  if (input.day !== state.day)
    throw Error(
      "수업 Day가 바뀌었습니다. 새로고침 후 현재 속보를 확인해 주세요.",
    );
  state.decisions = [
    ...state.decisions.filter((d) => d.day !== input.day),
    input,
  ];
  return { success: true };
}
