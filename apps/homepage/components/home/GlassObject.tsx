/**
 * 성과 지표 카드에 얹는 유사 3D 오브제.
 *
 * 실제 3D 렌더 대신 SVG로 그린다. 카드마다 WebGL 컨텍스트를 띄우면
 * 비용이 크고, 이 크기에서는 유리 질감만 살아도 충분하다.
 * 색은 brand 토큰을 따라가므로 브랜드 컬러를 바꾸면 같이 바뀐다.
 */

type Props = { className?: string };

const STOPS = (
  <>
    <stop offset="0%" stopColor="hsl(var(--brand-400))" stopOpacity="0.95" />
    <stop offset="55%" stopColor="hsl(var(--brand-500))" stopOpacity="0.85" />
    <stop offset="100%" stopColor="hsl(var(--brand-700))" stopOpacity="0.95" />
  </>
);

/** 우상향 막대그래프 — 누적 교육 횟수 */
export function BarsObject({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="go-bars" x1="0" y1="0" x2="1" y2="1">
          {STOPS}
        </linearGradient>
        <linearGradient id="go-bars-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--brand-300))" stopOpacity="1" />
          <stop
            offset="100%"
            stopColor="hsl(var(--brand-300))"
            stopOpacity="0.9"
          />
        </linearGradient>
      </defs>

      {[
        { x: 42, h: 62 },
        { x: 88, h: 104 },
        { x: 134, h: 146 },
      ].map(({ x, h }) => {
        const w = 34;
        const d = 14; // 윗면 깊이
        const y = 190 - h;
        return (
          <g key={x}>
            {/* 앞면 */}
            <path
              d={`M${x} ${y} h${w} v${h} h-${w} Z`}
              fill="url(#go-bars)"
              stroke="hsl(var(--brand-800))"
              strokeOpacity="0.5"
            />
            {/* 윗면 */}
            <path
              d={`M${x} ${y} l${d} -${d} h${w} l-${d} ${d} Z`}
              fill="url(#go-bars-top)"
            />
            {/* 옆면 */}
            <path
              d={`M${x + w} ${y} l${d} -${d} v${h} l-${d} ${d} Z`}
              fill="hsl(var(--brand-800))"
              fillOpacity="0.75"
            />
          </g>
        );
      })}
    </svg>
  );
}

/** 말풍선 속 별 — 교육 만족도 */
export function RatingObject({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="go-bub" x1="0" y1="0" x2="1" y2="1">
          {STOPS}
        </linearGradient>
      </defs>

      <path
        d="M34 44a18 18 0 0 1 18-18h96a18 18 0 0 1 18 18v70a18 18 0 0 1-18 18H86l-30 26v-26h-4a18 18 0 0 1-18-18Z"
        fill="url(#go-bub)"
        stroke="hsl(var(--brand-800))"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <path
        d="m100 52 12.4 25.1 27.7 4-20 19.6 4.7 27.6L100 115.2l-24.8 13 4.7-27.6-20-19.6 27.7-4Z"
        fill="hsl(var(--brand-50))"
        fillOpacity="0.95"
      />
    </svg>
  );
}

/** 건물 — 협력 기관 */
export function BuildingObject({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="go-bld" x1="0" y1="0" x2="1" y2="1">
          {STOPS}
        </linearGradient>
      </defs>

      {/* 본체 */}
      <path
        d="M56 62h64v128H56Z"
        fill="url(#go-bld)"
        stroke="hsl(var(--brand-800))"
        strokeOpacity="0.45"
      />
      {/* 측면 */}
      <path
        d="M120 62l24-18v128l-24 18Z"
        fill="hsl(var(--brand-800))"
        fillOpacity="0.8"
      />
      {/* 옥상 */}
      <path
        d="M56 62l24-18h64l-24 18Z"
        fill="hsl(var(--brand-300))"
        fillOpacity="0.9"
      />
      {/* 창문 */}
      {[80, 100, 120, 140, 160].map((y) =>
        [66, 82, 98].map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="8"
            height="12"
            rx="1"
            fill="hsl(var(--brand-50))"
            fillOpacity="0.55"
          />
        ))
      )}
    </svg>
  );
}
