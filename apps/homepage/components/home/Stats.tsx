import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import { LECTURE_LOCATION } from "@/app/constants/partners";
import {
  BarsObject,
  RatingObject,
  BuildingObject,
} from "@/components/home/GlassObject";

/**
 * 숫자로 보는 유스핀랩.
 *
 * 어두운 브랜드 카드 위에 큰 숫자와 유사 3D 오브제를 얹는다.
 * 오브제는 카드 밖으로 살짝 넘겨 평면감을 깬다.
 */
export default function Stats() {
  return (
    <Section size="lg" background="fade-to-brand">
      <div className="mb-16 text-center">
        <Typography.Eyebrow className="mb-5 text-primary">
          YOUTHFINLAB IN NUMBERS
        </Typography.Eyebrow>
        <Typography.H2 className="text-foreground">
          숫자가 증명하는
          <br />
          유스핀랩의 금융교육
        </Typography.H2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/*
         * 오브제는 카드 폭에 비례하는 크기로 둔다.
         * 고정 크기로 두면 화면이 좁아질 때 오브제만 그대로 남아 글자를 덮는다.
         * 글자 쪽은 relative로 올려 어떤 폭에서도 오브제 위에 놓이게 한다.
         */}

        {/* 누적 교육 횟수 */}
        <article className="relative overflow-hidden rounded-panel bg-panel p-9 text-on-panel md:p-12">
          <BarsObject className="pointer-events-none absolute -bottom-3 -right-3 aspect-square w-[30%] min-w-20 md:-bottom-4 md:-right-2 md:w-52" />
          <div className="relative">
            <p className="text-sm font-medium text-on-panel/75">
              누적 교육 횟수
            </p>
            <p className="mt-4 text-5xl/[1.15] font-bold md:text-6xl/[1.15]">
              500<span className="text-3xl text-panel-accent">+</span>
              <span className="ml-2 text-2xl font-semibold">회</span>
            </p>
            <p className="mt-5 pr-[34%] text-sm leading-[1.8] text-on-panel/75 md:pr-0">
              참여 학생 누적 1만 명 이상
            </p>
          </div>
        </article>

        {/* 교육 만족도 */}
        <article className="relative overflow-hidden rounded-panel bg-panel p-9 text-on-panel md:p-12">
          <RatingObject className="pointer-events-none absolute -bottom-4 -right-4 aspect-square w-[30%] min-w-20 md:-bottom-6 md:w-52" />
          <div className="relative">
            <p className="text-sm font-medium text-on-panel/75">교육 만족도</p>
            <p className="mt-4 text-5xl/[1.15] font-bold md:text-6xl/[1.15]">
              98
              <span className="text-3xl text-panel-accent">%</span>
            </p>
            <p className="mt-5 pr-[34%] text-sm leading-[1.8] text-on-panel/75 md:pr-0">
              수강생이 다시 듣고 싶은 교육
            </p>
          </div>
        </article>

        {/* 협력 기관 — 와이드 */}
        <article className="relative overflow-hidden rounded-panel bg-panel py-9 text-on-panel md:col-span-2 md:py-12">
          {/*
           * 오브제가 기관명을 가리지 않도록 영역을 나눈다.
           * 좌측이 텍스트, 우측이 오브제 자리.
           */}
          <div className="md:pr-44">
            <div className="px-8 md:px-10">
              <p className="text-lg font-bold">금융교육을 진행한 곳</p>
            </div>

            {/* 기관명 무한 마퀴 */}
            <div className="relative mt-8 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_88%,transparent)]">
              {[0, 1].map((copy) => (
                <ul
                  key={copy}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 animate-scroll items-center gap-10 pr-10 motion-reduce:animate-none"
                >
                  {LECTURE_LOCATION.map((name) => (
                    <li
                      key={name}
                      className="whitespace-nowrap text-lg font-semibold text-on-panel/75 md:text-xl"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* 카드 높이에 영향을 주지 않도록 절대 배치 */}
          <BuildingObject className="pointer-events-none absolute -bottom-6 right-2 hidden h-44 w-44 md:block" />
        </article>
      </div>
    </Section>
  );
}
