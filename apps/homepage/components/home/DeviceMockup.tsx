import {
  Home,
  Newspaper,
  Trophy,
  User,
  Wifi,
  BatteryFull,
  Signal,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * 모의투자 앱 화면 목업.
 *
 * 제품 스크린샷 역할이라 테마와 무관하게 항상 라이트로 고정한다.
 * 이 파일 안에서만 리터럴 색상을 쓴다.
 */

/** iOS 스타일 상태바. 목업이 실제 앱처럼 보이게 하는 최소 장치 */
function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-7 pb-1 pt-4 text-xs font-semibold",
        dark ? "text-white" : "text-neutral-900"
      )}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <BatteryFull className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

const TABS = [
  { label: "홈", icon: Home },
  { label: "뉴스", icon: Newspaper },
  { label: "랭킹", icon: Trophy },
  { label: "MY", icon: User },
] as const;

/** 하단 탭바 */
function TabBar({ active = 0 }: { active?: number }) {
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-neutral-100 bg-white/95 px-3 pb-3 pt-2 backdrop-blur-sm">
      <div className="flex justify-around">
        {TABS.map(({ label, icon: Icon }, i) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <Icon
              className={cn(
                "h-5 w-5",
                i === active ? "text-brand-600" : "text-neutral-300"
              )}
              strokeWidth={i === active ? 2.4 : 2}
            />
            <p
              className={cn(
                "text-[10px]",
                i === active
                  ? "font-semibold text-brand-600"
                  : "text-neutral-400"
              )}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
      {/* 홈 인디케이터 */}
      <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-neutral-900/15" />
    </div>
  );
}

function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("device-mockup relative", className)}>
      {/*
       * 그림자는 두 겹으로 쌓는다.
       * 넓고 옅은 층이 공간감을, 좁고 진한 층이 접지감을 만든다.
       */}
      <div className="relative h-[620px] w-[306px] rounded-[46px] bg-white p-2.5 ring-1 ring-neutral-900/[0.06] shadow-[0_48px_88px_-24px_rgba(16,40,30,0.22),0_18px_36px_-12px_rgba(16,40,30,0.12)]">
        <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-neutral-50">
          {children}
        </div>
      </div>
    </div>
  );
}

const NEWS = [
  {
    tag: "반도체",
    title: "삼성전자, HBM 공급 확대 발표",
    move: "+3.2%",
    up: true,
  },
  {
    tag: "플랫폼",
    title: "카카오 4분기 영업이익 전망 하향",
    move: "-1.5%",
    up: false,
  },
  {
    tag: "금리",
    title: "한국은행 기준금리 동결 결정",
    move: "+0.4%",
    up: true,
  },
];

/** 뉴스를 읽고 판단하는 화면 */
export function NewsMockup({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className="bg-brand-600 text-white">
        <StatusBar dark />
        <div className="px-6 pb-6 pt-4">
          <p className="text-xs text-white/70">오늘의 시장</p>
          <p className="mt-1.5 text-xl font-bold">뉴스로 배우는 투자</p>
        </div>
      </div>

      <div className="space-y-3.5 p-5">
        {NEWS.map((n) => (
          <div
            key={n.title}
            className="rounded-card bg-white p-4 ring-1 ring-neutral-100"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                {n.tag}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold",
                  n.up ? "text-emerald-600" : "text-red-500"
                )}
              >
                {n.move}
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold leading-snug text-neutral-900">
              {n.title}
            </p>
            <p className="mt-2 text-xs text-neutral-400">
              이 뉴스가 주가에 미친 영향 보기 ›
            </p>
          </div>
        ))}
      </div>

      {/* 탭바 바로 위에 뜨는 실행 버튼 */}
      <div className="absolute inset-x-0 bottom-[84px] px-5">
        <div className="rounded-control bg-brand-600 py-2.5 text-center text-[13px] font-semibold text-white shadow-lg shadow-brand-900/20">
          이 종목 살펴보기
        </div>
      </div>

      <TabBar active={1} />
    </Frame>
  );
}

const HOLDINGS = [
  {
    name: "삼성전자",
    shares: "5주 보유",
    amount: "385,000원",
    change: "+3.2%",
  },
  { name: "카카오", shares: "10주 보유", amount: "520,000원", change: "-1.5%" },
  { name: "네이버", shares: "3주 보유", amount: "615,000원", change: "+2.8%" },
];

/** 직접 투자한 결과를 보는 화면 */
export function PortfolioMockup({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <div className="bg-brand-600 text-white">
        <StatusBar dark />
        <div className="px-6 pb-7 pt-4">
          <p className="text-xs text-white/70">내 포트폴리오</p>
          <p className="mt-1.5 text-[27px] font-bold">10,234,500원</p>
          <p className="mt-1 text-xs text-emerald-300">+234,500원 (+2.34%)</p>
        </div>
      </div>

      <div className="space-y-3.5 p-5">
        {HOLDINGS.map((h) => (
          <div
            key={h.name}
            className="rounded-card bg-white p-4 ring-1 ring-neutral-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500">{h.name}</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {h.shares}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-neutral-900">
                  {h.amount}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    h.change.startsWith("+")
                      ? "text-emerald-600"
                      : "text-red-500"
                  )}
                >
                  {h.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <TabBar active={0} />
    </Frame>
  );
}
