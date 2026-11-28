import Section from "@/components/ui/Section";

/**
 * 미션.
 *
 * 히어로 바로 아래에서 "이 회사가 왜 존재하는가"를 한 번에 말한다.
 * 장식 없이 큰 타이포와 여백만으로 밀도를 낮춰,
 * 스크롤을 잠시 멈추고 읽게 만드는 구간이다.
 *
 * 줄바꿈을 브라우저에 맡기지 않고 직접 끊는다.
 * 의미 단위로 끊어야 긴 문장도 한 번에 읽힌다.
 */
export default function Mission() {
  return (
    <Section id="mission" size="lg" background="default">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[1.75rem] font-bold leading-[1.55] tracking-[-0.03em] text-foreground md:text-[2.75rem]">
          모두가 자신의 돈을 스스로 이해하고,
          <br />
          자신있게 결정할 수 있는 세상을 만듭니다.
        </p>
      </div>
    </Section>
  );
}
