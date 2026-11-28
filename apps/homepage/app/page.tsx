import type { Metadata } from "next";
import { BRAND, organization, brandOpenGraph } from "@/lib/brand";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import Hero from "@/components/hero/Hero";
import Mission from "@/components/home/Mission";
import MockInvestment from "@/components/home/MockInvestment";
import Stats from "@/components/home/Stats";
import Reviews from "@/components/home/Reviews";
import Programs from "@/components/home/Programs";
import Typography from "@/components/ui/Typography";

export const metadata: Metadata = {
  alternates: { canonical: BRAND.url },
  openGraph: {
    ...brandOpenGraph,
    url: BRAND.url,
    images: [BRAND.image],
  },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />

      <Mission />

      <Stats />

      <Reviews />

      <MockInvestment />

      <Programs />

      {/* CTA */}
      <Section
        size="lg"
        background="brand"
        decoration={
          /*
           * 진입 페이드는 섹션 상단 여백 높이만큼만 덮는 장식 레이어다.
           * 배경 자체는 항상 solid brand-600이라 문구가 길어져도
           * 흰 구간에 흰 글씨가 얹히지 않는다.
           */
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-linear-to-b/srgb from-background to-panel md:h-32"
          />
        }
      >
        <div className="mx-auto max-w-3xl space-y-10 text-center">
          <Typography.H2 className="text-on-panel">
            금융교육의 시작
            <br />
            오늘부터 경험해보세요
          </Typography.H2>

          <p className="mx-auto max-w-xl text-xl/[1.85] text-on-panel/75">
            금융교육에만 전념하는 금융교육 전문 유스핀랩과 함께
            <br />
            건강한 금융생활을 시작하세요.
          </p>

          <div className="flex justify-center pt-4">
            <Button size="2xl" asChild>
              <Link href="/education-inquiry">
                교육 문의하기
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
