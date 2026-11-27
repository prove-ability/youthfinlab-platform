import type {
  CrisisScenario,
  ScenarioStock,
  Decision,
  StudentMarketView,
} from "./market-scenario";

// Server-only scenario materialization: never import this file into a student bundle.
const headlines = [
  "시장이 문을 열었습니다",
  "기업 실적은 양호하지만",
  "은행의 대출 심사가 까다로워졌습니다",
  "자금 조달 불안, 시장 전반으로 확산",
  "시장 안정 대책이 발표됐습니다",
  "대책 발표 뒤에도 불안은 남았습니다",
  "기업들의 대응이 갈리기 시작했습니다",
  "일부 실적에서 회복 신호가 나타났습니다",
  "반등 속에서도 전망은 엇갈립니다",
  "회복 속도는 기업마다 달랐습니다",
];
const news = [
  "오늘부터 가상의 주식시장에 참여합니다. 기업 특성과 남겨 둘 현금을 함께 생각해 보세요. 가격의 방향을 확실히 알 수 있는 사람은 없습니다.",
  "일부 기업의 매출이 늘었습니다. 한편 은행은 대출을 더 신중하게 검토하기 시작했습니다. 좋은 소식만으로 시장 전체를 설명할 수 있을까요?",
  "기업이 돈을 빌리기 어려워지고 있습니다. 빚에 의존하는 기업과 생활에 필요한 물건을 파는 기업은 같은 영향을 받을까요? 아직 위기의 규모는 알 수 없습니다.",
  "자금을 구하지 못하는 기업이 늘며 여러 종목의 가격이 함께 내렸습니다. 생활 수요가 꾸준한 기업도 하락을 피하지 못했습니다. 급하게 결정하기 전에 내 자산과 현금을 확인해 보세요.",
  "자금 공급을 늘리는 대책이 발표됐습니다. 다만 모든 기업의 문제가 해결된 것은 아닙니다. 반등을 기대하는 시각과 추가 손실을 걱정하는 시각이 함께 나옵니다.",
  "안정 대책에도 자금이 필요한 기업의 어려움은 이어졌습니다. 일부 가격이 다시 내리며 반등이 곧 회복을 뜻하는지 의문이 커졌습니다. 오늘 새로 확인할 정보는 무엇인가요?",
  "일부 기업은 비용을 줄이고 빚을 조정합니다. 생활에 필요한 상품의 수요는 상대적으로 꾸준하지만 모든 기업이 같은 상황은 아닙니다. 기업별 대응을 비교해 보세요.",
  "일부 기업의 매출과 자금 사정이 나아졌다는 소식이 나왔습니다. 아직 어려운 기업도 있습니다. 앞서 세운 판단을 유지할지 바꿀지, 근거를 확인해 보세요.",
  "여러 종목이 반등했지만 회복이 오래 이어질지는 알 수 없습니다. 내일의 결과를 맞히기보다 감당할 위험과 남겨 둘 현금을 기준으로 마지막 거래를 판단해 보세요.",
  "일부 종목은 반등했지만 위기 전 가격을 회복하지 못한 종목도 있습니다. 이제 수익률과 함께 당시 알 수 있었던 정보, 선택의 이유를 돌아봅니다.",
];
const explanations = [
  "첫날에는 비교할 정보가 적었습니다. 현금을 남기거나 여러 기업을 살펴보는 선택에도 이유가 있습니다.",
  "좋은 실적과 자금 조달 부담이 동시에 나타났습니다. 이 시나리오에서는 차입 의존형의 부담이 먼저 가격에 반영됐습니다. 좋은 뉴스가 항상 상승을 보장하지는 않습니다.",
  "신용 경색이 시장 전체로 번지며 여러 종목이 함께 하락했습니다. 종목을 나눠도 시장 전체의 위험은 남습니다. 현금 비중과 감당할 수 있는 손실을 함께 생각할 수 있습니다.",
  "안정 대책에 대한 기대는 반응을 만들었지만 기업마다 차이가 있었습니다. 많이 떨어졌다는 사실만으로 회복 시점이나 크기를 확신하기 어렵습니다.",
  "대책 발표 뒤 다시 하락했습니다. 정책의 효과에는 시간이 걸릴 수 있고 기대와 실제 기업 상황은 다를 수 있습니다. 반등 직후에도 손실 가능성을 살펴야 합니다.",
  "기업별 대응과 수요 차이가 가격에 다르게 반영됐습니다. 분산은 기업 고유의 위험을 나누지만 시장 전체의 위험까지 없애지는 못합니다.",
  "일부 개선 신호와 함께 가격이 반등했습니다. 새로운 정보에 따라 판단을 바꾸는 것과 가격만 보고 따라가는 것은 다릅니다.",
  "회복 기대 속에서도 기업별 상승 폭은 달랐습니다. 이미 오른 가격을 보고 앞으로도 계속 오를 것이라고 확신하기는 어렵습니다.",
  "대책 이후에도 회복 속도는 달랐습니다. 이 결과는 학습용으로 정한 한 가지 경로입니다. 실제 위기에서 같은 순서나 수익이 보장되지 않습니다.",
];
const paths = {
  sensitive: [100, 104, 98, 73, 79, 70, 74, 82, 88, 86],
  balanced: [100, 102, 100, 84, 89, 83, 87, 91, 94, 95],
  defensive: [100, 101, 102, 94, 95, 93, 95, 97, 99, 98],
};
export function buildCrisisScenario(
  stocks: ScenarioStock[],
  difficulty: "easy" | "normal",
): CrisisScenario {
  if (
    stocks.length < 2 ||
    stocks.length > 12 ||
    new Set(stocks.map((s) => s.stockId)).size !== stocks.length
  )
    throw new Error("서로 다른 종목 2~12개를 선택하세요.");
  if (new Set(stocks.map((s) => s.exposure)).size < 2)
    throw new Error("두 가지 이상의 기업 특성을 선택하세요.");
  for (const s of stocks)
    if (
      !paths[s.exposure] ||
      !Number.isSafeInteger(s.initialPrice) ||
      s.initialPrice < 1000 ||
      s.initialPrice > 1000000
    )
      throw new Error("시작 가격은 1,000~1,000,000원 범위의 정수여야 합니다.");
  return {
    version: 1,
    difficulty,
    stocks,
    days: headlines.map((title, i) => ({
      day: i + 1,
      title,
      news:
        difficulty === "easy"
          ? news[i]!.replaceAll(
              "신용 경색",
              "돈을 빌리기 어려운 상황",
            ).replaceAll("자금 조달", "필요한 돈 마련")
          : news[i]!,
      explanation: explanations[i] ?? "전체 선택을 돌아보세요.",
      prices: stocks.map((s) => ({
        stockId: s.stockId,
        price: Math.round(
          (s.initialPrice *
            (100 +
              (paths[s.exposure][i]! - 100) *
                (difficulty === "easy" ? 0.5 : 1))) /
            100,
        ),
      })),
    })),
  };
}

/** Whitelist the released fields. No future prices, news or explanations reach the client. */
export function studentMarketView(
  scenario: CrisisScenario,
  currentDay: number,
  status: string,
  decisions: Decision[],
): StudentMarketView {
  const day = Math.min(scenario.days.length, Math.max(1, currentDay));
  const current = scenario.days[day - 1]!;
  return {
    day,
    totalDays: scenario.days.length,
    ended: status === "ended",
    canDecide: status === "active" && day < scenario.days.length,
    stocks: scenario.stocks.map(({ stockId, name, exposure }) => ({
      stockId,
      name,
      exposure,
    })),
    bulletin: { title: current.title, news: current.news },
    decision: decisions.find((d) => d.day === day) ?? null,
    history: scenario.days
      .filter((d) => d.day < day)
      .map((d) => ({
        day: d.day,
        title: d.title,
        explanation: d.explanation,
        decision: decisions.find((x) => x.day === d.day) ?? null,
        changes: d.prices.map((p) => ({
          name: scenario.stocks.find((s) => s.stockId === p.stockId)!.name,
          percent:
            Math.round(
              (scenario.days[d.day]!.prices.find(
                (x) => x.stockId === p.stockId,
              )!.price /
                p.price -
                1) *
                1000,
            ) / 10,
        })),
      })),
  };
}
