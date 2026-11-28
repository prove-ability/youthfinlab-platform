/**
 * 미션 섹션 배경에 흩뿌리는 돈 오브제.
 *
 * GlassObject와 같은 방식이다. 실제 3D 대신 SVG로 등축 투영을 흉내내고,
 * 색은 brand 토큰을 따라가므로 브랜드 컬러를 바꾸면 같이 바뀐다.
 *
 * 다만 이쪽은 카드 위 주인공이 아니라 배경 장식이라
 * 채도와 명도를 한 단계 낮춰 글자를 방해하지 않게 한다.
 */

type Props = { className?: string };

/** 오브제마다 gradient id가 겹치면 안 된다 */
const face = (id: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stopColor="hsl(var(--brand-300))" stopOpacity="0.95" />
    <stop offset="55%" stopColor="hsl(var(--brand-400))" stopOpacity="0.9" />
    <stop offset="100%" stopColor="hsl(var(--brand-600))" stopOpacity="0.95" />
  </linearGradient>
);

/** 동전 한 닢. 옆면을 먼저 깔고 윗면 타원을 덮는다 */
function Coin({
  cy,
  rx = 54,
  ry = 22,
  depth = 16,
  fill,
}: {
  cy: number;
  rx?: number;
  ry?: number;
  depth?: number;
  fill: string;
}) {
  const left = 100 - rx;
  return (
    <g>
      {/* 옆면 — 아래로 볼록한 반타원 */}
      <path
        d={`M${left} ${cy} v${depth} a${rx} ${ry} 0 0 0 ${rx * 2} 0 v-${depth} Z`}
        fill="hsl(var(--brand-700))"
        fillOpacity="0.8"
      />
      {/* 윗면 */}
      <ellipse
        cx="100"
        cy={cy}
        rx={rx}
        ry={ry}
        fill={fill}
        stroke="hsl(var(--brand-800))"
        strokeOpacity="0.35"
      />
      <ellipse
        cx="100"
        cy={cy}
        rx={rx - 12}
        ry={ry - 5}
        fill="hsl(var(--brand-50))"
        fillOpacity="0.35"
      />
    </g>
  );
}

/** 쌓인 동전 — 모으는 돈 */
export function CoinStackObject({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <defs>{face("mo-stack")}</defs>
      <Coin cy={150} fill="url(#mo-stack)" />
      <Coin cy={116} fill="url(#mo-stack)" />
      <Coin cy={82} fill="url(#mo-stack)" />
    </svg>
  );
}

/** ₩ 동전 — 원화 */
export function WonCoinObject({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <defs>{face("mo-won")}</defs>
      <g transform="rotate(-14 100 100)">
        <Coin cy={104} rx={62} ry={58} depth={12} fill="url(#mo-won)" />
        <text
          x="100"
          y="104"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="56"
          fontWeight="700"
          fill="hsl(var(--brand-800))"
          fillOpacity="0.75"
        >
          ₩
        </text>
      </g>
    </svg>
  );
}

/** 지폐 다발 — 흐르는 돈 */
export function BillObject({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <defs>{face("mo-bill")}</defs>
      {/* 뒤로 겹친 두 장 */}
      <path
        d="M28 92 130 62l42 30-102 30Z"
        fill="hsl(var(--brand-700))"
        fillOpacity="0.45"
      />
      <path
        d="M28 110 130 80l42 30-102 30Z"
        fill="hsl(var(--brand-600))"
        fillOpacity="0.6"
      />
      {/* 맨 앞 장 */}
      <path
        d="M28 128 130 98l42 30-102 30Z"
        fill="url(#mo-bill)"
        stroke="hsl(var(--brand-800))"
        strokeOpacity="0.35"
      />
      <ellipse
        cx="100"
        cy="128"
        rx="18"
        ry="12"
        fill="hsl(var(--brand-50))"
        fillOpacity="0.5"
      />
    </svg>
  );
}

/** 동전에서 자라는 새싹 — 불어나는 돈 */
export function SproutObject({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <defs>{face("mo-sprout")}</defs>
      {/* 줄기 */}
      <path
        d="M100 148V78"
        stroke="hsl(var(--brand-700))"
        strokeOpacity="0.8"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* 잎 */}
      <path
        d="M100 96c-2-26-20-38-40-38-2 22 14 40 40 38Z"
        fill="hsl(var(--brand-400))"
        fillOpacity="0.9"
      />
      <path
        d="M100 82c2-24 20-34 38-34 2 20-14 36-38 34Z"
        fill="hsl(var(--brand-300))"
        fillOpacity="0.9"
      />
      {/* 화분 대신 동전 */}
      <Coin cy={150} rx={48} ry={20} fill="url(#mo-sprout)" />
    </svg>
  );
}
