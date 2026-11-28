import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import RecruitFaq from "@/components/recruit/RecruitFaq";
import { LECTURE_LOCATION } from "@/app/constants/partners";
import {
  RECRUIT_EMAIL,
  RECRUIT_MAILTO,
  RECRUIT_POSITIONS,
} from "@/app/constants/recruit";

export const metadata: Metadata = {
  title: "인재 채용 | 유스핀랩",
  description:
    "금융교육 전문기업 유스핀랩에서 함께할 금융교육 전문강사와 교육 프로젝트 매니저를 모집합니다. 전국 복지기관·학교·지자체·기업 현장에서 금융교육을 만들어갑니다.",
  alternates: { canonical: "/recruit" },
  openGraph: {
    title: "인재 채용 | 유스핀랩",
    description:
      "금융교육 전문기업 유스핀랩에서 함께할 금융교육 전문강사와 교육 프로젝트 매니저를 모집합니다.",
    url: "/recruit",
    type: "website",
  },
};

const APPLICATION_DOCUMENTS = [
  { label: "받는 주소", value: RECRUIT_EMAIL },
  { label: "메일 제목", value: "[지원] 포지션 / 성함" },
  { label: "첨부 서류", value: "이력서, 경력 기술서, 보유 자격증 사본" },
];

/**
 * 상세 블록은 전부 같은 격자 칸을 쓴다.
 * 한 줄에 하나씩 쌓으면 스크롤만 길어지므로, 칸을 여러 열로 나눠 세로 길이를 줄인다.
 * 같은 그리드 행끼리는 높이가 맞춰져 윗선이 가지런히 이어진다.
 */
const CELL = "border-t border-border py-5";
const CELL_LABEL = "text-sm font-semibold text-subtle-foreground";
/** 블록(주요 업무·지원 자격 등) 사이 간격 */
const BLOCK = "mt-14";

export default function Recruit() {
  return (
    <main>
      {/* 히어로 */}
      <Section size="lg" background="fade-from-brand">
        <div className="mx-auto max-w-3xl text-center">
          <Typography.H1 className="text-foreground">
            금융교육의 현장을
            <br />
            함께 만들 동료를 찾습니다
          </Typography.H1>

          <Typography.Lead className="mt-8">
            유스핀랩은 복지기관·학교·지자체·금융기관과 함께
            <br className="hidden md:block" />
            누적{" "}
            <strong className="font-semibold text-foreground">
              500회 이상
            </strong>
            , <strong className="font-semibold text-foreground">1만 명</strong>
            이 넘는 금융교육을 진행해왔습니다.
          </Typography.Lead>

          <div className="mt-11 flex justify-center">
            <Button size="2xl" asChild>
              <a href={RECRUIT_MAILTO}>
                이력서 보내기
                <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* 협력기관 마퀴 — 조직 규모를 숫자 대신 이름으로 보여준다 */}
      <Section
        size="none"
        bleed
        className="border-y border-border bg-background py-12"
      >
        <p className="mb-8 px-6 text-center text-sm font-medium tracking-[0.02em] text-subtle-foreground">
          유스핀랩이 금융교육을 진행한 곳
        </p>
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 animate-scroll items-center gap-10 pr-10 motion-reduce:animate-none"
            >
              {LECTURE_LOCATION.map((name) => (
                <li
                  key={name}
                  className="whitespace-nowrap text-lg font-semibold text-foreground/45 md:text-xl"
                >
                  {name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Section>

      {/* 모집 포지션 개요 */}
      <Section size="md" background="default">
        <Typography.H2 className="mb-12 text-foreground">
          모집 중인 포지션
        </Typography.H2>

        <div className="grid gap-5 md:grid-cols-2">
          {RECRUIT_POSITIONS.map((position) => (
            <a
              key={position.id}
              href={`#${position.id}`}
              className="group flex flex-col rounded-panel bg-muted p-10 transition-colors duration-300 hover:bg-accent md:p-12"
            >
              <p className="text-sm font-semibold text-primary">
                {position.employment}
              </p>

              <Typography.H3 className="mt-4 text-foreground">
                {position.name}
              </Typography.H3>

              <p className="mt-5 flex-1 text-lg leading-[1.8] text-muted-foreground">
                {position.summary}
              </p>

              <span className="mt-9 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                자세히 보기
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* 포지션 상세 — 면을 칠하지 않고 헤어라인으로만 끊는다 */}
      {RECRUIT_POSITIONS.map((position) => (
        <Section
          key={position.id}
          id={position.id}
          size="sm"
          background="default"
          className="scroll-mt-14 border-t border-border"
        >
          <header>
            <p className="text-sm font-semibold text-primary">
              {position.employment}
            </p>
            <Typography.H2 className="mt-4 text-foreground">
              {position.name}
            </Typography.H2>
          </header>

          {/* 주요 업무 — 두 열로 나눠 세로 길이를 절반으로 줄인다 */}
          <Typography.H4 className={`${BLOCK} text-foreground`}>
            주요 업무
          </Typography.H4>
          <ol className="mt-6 grid gap-x-12 md:grid-cols-2">
            {position.tasks.map((task, index) => (
              <li key={task.title} className={`${CELL} flex gap-4`}>
                <span className="mt-0.5 text-sm font-bold tabular-nums text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h5 className="font-bold leading-[1.6] text-foreground">
                    {task.title}
                  </h5>
                  <p className="mt-1.5 text-sm leading-[1.8] text-muted-foreground">
                    {task.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* 사용하는 도구 — 강사에는 없는 블록이라 조건부로 둔다 */}
          {position.tools && (
            <>
              <Typography.H4 className={`${BLOCK} text-foreground`}>
                사용하는 도구
              </Typography.H4>
              <dl className="mt-6 grid gap-x-12 md:grid-cols-3">
                {position.tools.map((tool) => (
                  <div key={tool.name} className={CELL}>
                    <dt className="font-semibold text-foreground">
                      {tool.name}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-[1.8] text-muted-foreground">
                      {tool.usage}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          {/* 지원 자격 — 필수와 우대를 나란히 두어 한 화면에 담는다 */}
          <Typography.H4 className={`${BLOCK} text-foreground`}>
            지원 자격
          </Typography.H4>
          <div className="mt-6 grid gap-x-12 md:grid-cols-2">
            <div className={CELL}>
              <p className="text-sm font-bold text-primary">필수</p>
              <ul className="mt-4 space-y-3.5">
                {position.requirements.map((requirement) => (
                  <li key={requirement.title}>
                    <p className="font-semibold leading-[1.6] text-foreground">
                      {requirement.title}
                    </p>
                    {requirement.note && (
                      <Typography.Muted className="mt-1">
                        {requirement.note}
                      </Typography.Muted>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className={CELL}>
              <p className={CELL_LABEL}>우대</p>
              <ul className="mt-4 space-y-3.5">
                {position.preferred.map((item) => (
                  <li
                    key={item}
                    className="leading-[1.6] text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 근무 조건 */}
          <Typography.H4 className={`${BLOCK} text-foreground`}>
            근무 조건
          </Typography.H4>
          <dl className="mt-6 grid gap-x-12 md:grid-cols-2">
            {position.conditions.map((condition) => (
              <div key={condition.label} className={CELL}>
                <dt className={CELL_LABEL}>{condition.label}</dt>
                <dd className="mt-1.5 font-semibold leading-[1.6] text-foreground">
                  {condition.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* 복지 — 프리랜서 위촉인 강사에는 없는 블록이라 조건부로 둔다 */}
          {position.benefits && (
            <>
              <Typography.H4 className={`${BLOCK} text-foreground`}>
                복지 및 지원
              </Typography.H4>
              <dl className="mt-6 grid gap-x-12 md:grid-cols-3">
                {position.benefits.map((group) => (
                  <div key={group.label} className={CELL}>
                    <dt className={CELL_LABEL}>{group.label}</dt>
                    <dd>
                      <ul className="mt-4 space-y-3.5">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="leading-[1.6] text-foreground"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </Section>
      ))}

      {/* FAQ */}
      <Section size="md" background="fade-to-brand">
        <div className="mx-auto max-w-3xl">
          <Typography.H2 className="mb-12 text-foreground">
            자주 묻는 질문
          </Typography.H2>
          <RecruitFaq />
        </div>
      </Section>

      {/* 지원 방법 — 페이지의 유일한 전환 지점이라 브랜드 패널로 마무리한다 */}
      <Section size="lg" background="brand">
        <div className="mx-auto max-w-2xl text-center">
          <Typography.H2 className="text-on-panel">
            이력서를 메일로 보내주세요
          </Typography.H2>

          <p className="mt-7 text-lg/[1.85] text-on-panel/75">
            보내주신 서류는 인재풀에 등록되며,
            <br />
            검토 후 개별적으로 연락드립니다.
          </p>

          <dl className="mt-12 divide-y divide-on-panel/15 border-y border-on-panel/15 text-left">
            {APPLICATION_DOCUMENTS.map((row) => (
              <div
                key={row.label}
                className="grid gap-1.5 py-5 sm:grid-cols-[7rem_1fr] sm:gap-6"
              >
                <dt className="text-sm font-semibold text-on-panel/60">
                  {row.label}
                </dt>
                <dd className="font-medium leading-[1.7] text-on-panel">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex justify-center">
            <Button size="2xl" variant="on-brand" asChild>
              <a href={RECRUIT_MAILTO}>
                메일 보내기
                <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
