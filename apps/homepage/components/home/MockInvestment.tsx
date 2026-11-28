import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import { NewsMockup, PortfolioMockup } from "@/components/home/DeviceMockup";

/**
 * 모의투자 플랫폼 소개.
 *
 * 텍스트와 목업을 대각선으로 엇갈리게 배치해
 * 스크롤하면서 "읽고 → 보고 → 읽고 → 보고"가 반복되게 한다.
 */
export default function MockInvestment() {
  return (
    <Section size="lg" background="fade-to-brand">
      <div className="grid gap-x-12 gap-y-20 lg:grid-cols-2">
        {/* 좌: 제목 위, 목업 아래 */}
        <div className="flex flex-col gap-16">
          <div>
            <Typography.Eyebrow className="mb-5 text-primary">
              모의투자 · 교육용 플랫폼
            </Typography.Eyebrow>
            <Typography.H2 className="text-balance text-foreground">
              뉴스를 읽고
              <br />
              직접 투자해보는
              <br />
              교육용 플랫폼
            </Typography.H2>
          </div>

          <div className="flex justify-center lg:justify-start">
            <NewsMockup />
          </div>
        </div>

        {/* 우: 목업 위, 설명 아래 */}
        <div className="flex flex-col gap-16 lg:pt-20">
          <div className="flex justify-center lg:justify-end">
            <PortfolioMockup />
          </div>

          <div className="lg:pl-6">
            {/* 줄을 직접 끊어 의미 단위로 읽히게 한다 */}
            <p className="text-xl/[1.8] font-semibold text-foreground md:text-2xl/[1.8]">
              오늘의 뉴스가 왜 주가를 움직였는지 확인하고,
              <br className="max-sm:hidden" /> 가상 자금으로 직접 사고팔아
              보세요.
            </p>
            <Link
              href="/mock-investment"
              className="mt-10 inline-flex items-center gap-2 text-lg font-semibold text-primary transition-colors hover:text-primary-hover md:text-xl"
            >
              모의투자 체험 알아보기
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
