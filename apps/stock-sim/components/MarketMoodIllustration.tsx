import {
  marketMoodFromBulletin,
  marketMoodLabels,
} from "@repo/db/market-scenario";

/** Decorative scene derives ONLY from the currently public bulletin title. */
export default function MarketMoodIllustration({ title }: { title: string }) {
  const mood = marketMoodFromBulletin(title);
  return (
    <figure className="event-mood" data-mood={mood}>
      <div className="event-mood-scene" aria-hidden="true">
        <svg
          className="event-mood-props"
          viewBox="0 0 180 140"
          focusable="false"
        >
          <ellipse cx="88" cy="128" rx="60" ry="5" fill="#dfe7df" />
          {(mood === "caution" || mood === "crisis") && (
            <g className="event-mood-cloud">
              <path
                d="M93 37c-13 0-15-18-3-22 1-15 23-19 31-6 15-7 30 2 29 15 17 1 18 22 1 22H100c-5 0-7-4-7-9Z"
                fill={mood === "crisis" ? "#78867e" : "#c4cec5"}
              />
              {mood === "crisis" && (
                <path
                  d="M130 10c8-8 24-3 24 8 13-1 20 16 7 23"
                  fill="none"
                  stroke="#536158"
                  strokeWidth="3"
                />
              )}
            </g>
          )}
          {mood === "response" && (
            <g
              className="event-mood-document"
              fill="#fff"
              stroke="#536158"
              strokeWidth="2.5"
              strokeLinejoin="round"
            >
              <path d="M119 10h30l13 13v42h-43Z" />
              <path
                d="M149 10v14h13M127 34h26M127 43h26M127 52h16"
                fill="none"
              />
            </g>
          )}
          {mood === "review" && (
            <g
              className="event-mood-document"
              fill="#fff"
              stroke="#536158"
              strokeWidth="2.5"
            >
              <rect x="117" y="12" width="24" height="46" rx="4" />
              <rect x="147" y="20" width="24" height="46" rx="4" />
              <path
                d="M123 25h12m-12 9h12m-12 9h8m22-10h12m-12 9h12m-12 9h8"
                fill="none"
              />
            </g>
          )}
        </svg>
        <span className="event-mood-sprout" />
        <svg
          className="event-mood-notebook"
          viewBox="0 0 80 50"
          focusable="false"
        >
          <path
            d="M5 8q18-6 35 2 17-8 35-2v34q-18-5-35 2-17-7-35-2Z"
            fill="#fff"
            stroke="#536158"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M40 10v34M13 17l19 2m-19 6 19 2m16-8 19-2m-19 10 19-2"
            fill="none"
            stroke="#879789"
            strokeWidth="2"
          />
        </svg>
      </div>
      <figcaption>{marketMoodLabels[mood]}</figcaption>
    </figure>
  );
}
