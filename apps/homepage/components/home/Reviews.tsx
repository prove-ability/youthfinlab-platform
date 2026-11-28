import { Star } from "lucide-react";

import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import { REVIEWS, type Review } from "@/app/constants/reviews";
import { cn } from "@/lib/utils";

/** 카드 한 장 */
function ReviewCard({ review, accent }: { review: Review; accent: boolean }) {
  return (
    <li
      className={cn(
        "flex w-[320px] shrink-0 flex-col gap-4 rounded-card p-7 md:w-[380px]",
        accent
          ? "bg-panel text-on-panel"
          : "border border-border-strong bg-card text-foreground"
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-semibold">{review.program}</span>
        <span
          className={cn(
            "text-sm",
            accent ? "text-on-panel/75" : "text-subtle-foreground"
          )}
        >
          · {review.author}
        </span>
      </div>

      <div
        className="flex gap-0.5"
        aria-label={`5점 만점에 ${review.rating}점`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < review.rating
                ? accent
                  ? "fill-panel-accent text-panel-accent"
                  : "fill-primary text-primary"
                : accent
                  ? "text-on-panel/20"
                  : "text-faint-foreground"
            )}
          />
        ))}
      </div>

      <p
        className={cn(
          "text-sm leading-[1.85]",
          accent ? "text-on-panel/85" : "text-muted-foreground"
        )}
      >
        {review.content}
      </p>
    </li>
  );
}

/** 한 줄짜리 무한 마퀴 */
function ReviewRow({
  items,
  reverse = false,
  offset = 0,
}: {
  items: Review[];
  /** true면 오른쪽으로 흐른다 */
  reverse?: boolean;
  /** 카드 색을 번갈아 칠할 때의 시작 위치 */
  offset?: number;
}) {
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      {/*
       * 같은 목록을 두 벌 이어붙이고 -100%만큼 밀면 이음매 없이 반복된다.
       * 두 번째 벌은 시각적 복제이므로 스크린리더에서 제외한다.
       */}
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            "flex shrink-0 animate-scroll-slow gap-5 pr-5 motion-reduce:animate-none",
            reverse && "[animation-direction:reverse]"
          )}
        >
          {items.map((review, i) => (
            <ReviewCard
              key={`${review.program}-${review.author}-${i}`}
              review={review}
              accent={(i + offset) % 2 === 0}
            />
          ))}
        </ul>
      ))}
    </div>
  );
}

/**
 * 수강생 후기.
 * 두 줄이 서로 반대 방향으로 흘러 정지 화면에서도 리듬이 생긴다.
 */
export default function Reviews() {
  const half = Math.ceil(REVIEWS.length / 2);
  const topRow = REVIEWS.slice(0, half);
  const bottomRow = REVIEWS.slice(half);

  return (
    <Section size="lg" background="default" bleed>
      <div className="container mx-auto mb-16 max-w-content px-6 text-center">
        <Typography.Eyebrow className="mb-5 text-primary">
          REVIEWS
        </Typography.Eyebrow>
        <Typography.H2 className="text-foreground">
          교육의 효과를 증명하는
          <br />
          수강생 후기
        </Typography.H2>
      </div>

      <div className="flex flex-col gap-6">
        <ReviewRow items={topRow} />
        <ReviewRow items={bottomRow} reverse offset={1} />
      </div>
    </Section>
  );
}
