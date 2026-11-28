import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";

type Program = {
  target: string;
  headline: string;
  description: string;
  topics: string[];
};

const PROGRAMS: Program[] = [
  {
    target: "청소년",
    headline: "용돈에서 투자까지,\n금융의 첫걸음",
    description:
      "뉴스를 읽고 직접 투자해보며 돈이 움직이는 원리를 몸으로 익힙니다.",
    topics: ["모의투자 체험", "금융 기초", "소비 습관"],
  },
  {
    target: "청년",
    headline: "사회 첫걸음에\n필요한 돈 관리",
    description:
      "수입과 지출을 정리하고, 저축·청약·연금의 우선순위를 함께 세웁니다.",
    topics: ["1:1 재무상담", "자산관리", "부채 정리"],
  },
  {
    target: "직장인·성인",
    headline: "노후까지 내다보는\n자산 관리",
    description:
      "금리와 세금부터 퇴직연금 운용까지, 지금 시기에 맞는 판단 기준을 세웁니다.",
    topics: ["퇴직연금 교육", "금융 특강", "투자 교육", "금융 사기 예방"],
  },
  {
    target: "기관·기업",
    headline: "대상에 맞춰\n설계하는 단체교육",
    description:
      "참여자 특성을 먼저 파악해 커리큘럼을 설계하고, 결과보고서까지 제공합니다.",
    topics: ["교육 용역", "맞춤 커리큘럼", "그룹 운영", "결과 보고"],
  },
];

/**
 * 대상별 프로그램.
 *
 * 아이콘 칩은 카드마다 다른 그림이 붙어 시선이 분산됐다.
 * 대상을 작은 브랜드 컬러 라벨로만 두고 큰 제목에 무게를 몰아준다.
 */
export default function Programs() {
  return (
    <Section size="lg" background="fade-from-brand">
      <div className="mb-16 text-center">
        <Typography.Eyebrow className="mb-5 text-primary">
          PROGRAMS
        </Typography.Eyebrow>
        <Typography.H2 className="text-foreground">
          누구에게나 맞는
          <br />
          금융교육이 있습니다
        </Typography.H2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {PROGRAMS.map(({ target, headline, description, topics }) => (
          <article
            key={target}
            className="program-card group rounded-panel border border-border-strong bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_48px_-20px_rgba(16,40,30,0.18)]"
          >
            <p className="text-base font-bold text-primary">{target}</p>

            <p className="mt-6 whitespace-pre-line text-2xl/[1.55] font-bold tracking-[-0.03em] text-foreground md:text-[1.75rem]/[1.55]">
              {headline}
            </p>

            <p className="mt-6 leading-[1.9] text-muted-foreground">
              {description}
            </p>

            <ul className="flex flex-wrap gap-2.5">
              {topics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
