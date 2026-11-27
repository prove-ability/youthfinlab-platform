"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentMarketScenario } from "@/actions/marketScenario";
import Day1GuideBanner from "./Day1GuideBanner";
import Day2GuideBanner from "./Day2GuideBanner";
import InfoBanner from "./InfoBanner";
import PageHeader from "./PageHeader";

type Props = { currentDay: number; totalDays: number };

// Share the event panel's cache; never guess basic mode while its query is pending/failed.
function useGuidance({ currentDay, totalDays }: Props) {
  const query = useQuery({
    queryKey: ["student-market-scenario"],
    queryFn: getStudentMarketScenario,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });
  const event = query.data;
  return {
    ready: query.data !== undefined,
    event: !!event,
    day: event ? Math.max(event.day, currentDay) : currentDay,
    last: event
      ? event.ended || Math.max(event.day, currentDay) >= event.totalDays
      : totalDays > 0 && currentDay >= totalDays,
  };
}

export function HomeGuidance(props: Props) {
  const { ready, event, day, last } = useGuidance(props);
  if (!ready) return null;
  if (!event)
    return (
      <>
        <Day1GuideBanner currentDay={day} />
        <Day2GuideBanner currentDay={day} />
      </>
    );
  const steps = last
    ? [
        "당시 알 수 있었던 정보와 내가 남긴 이유 돌아보기",
        "시세 변동 손익과 지원금을 구분해 확인하기",
        "다시 선택한다면 무엇을 확인할지 함께 이야기하기",
      ]
    : [
        "오늘의 시장 속보와 기업 특성 읽기",
        "매수·매도·보유와 남겨 둘 현금을 함께 판단하기",
        "선택 이유 남기기 (선택 사항 · 실제 주문과 별개)",
        "선생님이 다음 Day로 진행하면 결과와 해설 확인하기",
      ];
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100">
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {last ? "오늘은 선택을 돌아보는 날" : "오늘의 미션"}
      </h3>
      <p className="text-sm text-gray-600 mb-5">
        {last
          ? "거래와 새 이유 작성은 마감됐어요. 수익률뿐 아니라 판단 과정도 살펴보세요."
          : "정해진 시각이 아니라 선생님의 진행에 따라 Day가 바뀌어요. 거래하지 않고 지켜보는 선택도 가능해요."}
      </p>
      <ol className="list-decimal pl-5 space-y-3 text-sm text-gray-700">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

export function InvestPageHeader(props: Props) {
  const { ready, event, last } = useGuidance(props);
  return (
    <PageHeader
      title="투자"
      description={
        !ready
          ? ""
          : event && last
            ? "최종 자산과 거래내역을 확인해보세요"
            : "뉴스를 읽고 주식을 사고팔아보세요"
      }
    />
  );
}

export function InvestGuidance(
  props: Props & {
    placement: "top" | "day";
    hasStocks: boolean;
    hasHoldings: boolean;
  },
) {
  const { ready, event, day, last } = useGuidance(props);
  if (!ready) return null;
  if (event) {
    if (props.placement === "day") return null;
    return (
      <InfoBanner
        icon={last ? "🔒" : "💡"}
        title={
          last
            ? "거래를 마치고 선택을 돌아보세요"
            : "가상 시장에서 판단을 연습해요"
        }
        description={
          last
            ? "마지막 Day에는 매수·매도할 수 없어요. 홈에서 당시 선택과 결과 해설을 살펴보고, 거래내역과 최종 자산을 확인해보세요."
            : "가격은 교육용으로 정한 가상 시나리오예요. 시장 속보와 기업 특성을 읽고 매수·매도·보유를 판단하세요. 선생님이 다음 Day로 진행하면 결과를 확인할 수 있어요."
        }
      />
    );
  }
  // Basic-mode copy and visibility remain unchanged.
  if (props.placement === "top")
    return (
      <>
        {last && (
          <InfoBanner
            icon="⚠️"
            title="마지막 Day에요!"
            description="게임이 종료되어 더 이상 매수/매도할 수 없어요. 최종 결과를 확인하고 랭킹을 확인해보세요!"
          />
        )}
        {!last && (
          <InfoBanner
            icon="💡"
            title="모든 가격은 원화(₩)로 표시돼요"
            description="해외 주식은 환율이 적용된 원화 가격이에요. 실제 투자와 동일한 환경에서 학습해보세요!"
          />
        )}
        {props.hasStocks && !last && (
          <InfoBanner
            icon="👆"
            title="종목 카드를 눌러보세요!"
            description="종목 카드를 클릭하면 주식을 사고팔 수 있어요. 뉴스를 읽고 현명하게 투자해보세요!"
          />
        )}
      </>
    );
  if (day === 1)
    return (
      <InfoBanner
        icon="🎉"
        title="첫날입니다!"
        description="뉴스를 읽고 주식을 사보세요. 내일 결과를 확인할 수 있어요!"
      />
    );
  return day >= 2 && props.hasHoldings ? (
    <InfoBanner
      icon="💡"
      title="투자 팁!"
      description="현금이 부족한가요? 내가 가진 주식을 체크해보세요! 오늘 뉴스를 읽고 불안한 종목은 정리하고, 유망한 주식에 투자해보세요!"
    />
  ) : null;
}
