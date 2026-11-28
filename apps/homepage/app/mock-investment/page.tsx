"use client";

import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Users,
  LineChart,
  Code2,
  GraduationCap,
  Building,
  Trophy,
} from "lucide-react";

const WHY_MOCK_INVESTMENT = [
  {
    title: "리스크 없는 실전",
    description: "가상 자금으로 체험하므로 실패해도 부담이 없습니다",
  },
  {
    title: "이론 → 실전",
    description: "배운 지식을 곧바로 적용해볼 수 있습니다",
  },
  {
    title: "올바른 습관",
    description: "장기적 관점의 건강한 투자 기준을 만듭니다",
  },
  {
    title: "재미있는 학습",
    description: "직접 해보며 자연스럽게 익힙니다",
  },
];

export default function MockInvestment() {
  return (
    <main className="bg-background">
      {/* Hero Section with Phone Mockup */}
      <section className="relative min-h-[90vh] flex items-center bg-linear-to-br/srgb from-brand-600 to-brand-800 overflow-hidden">
        {/* 배경 데코레이션 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 왼쪽: 텍스트 */}
            {/* 홈 히어로와 같은 리듬 — 제목 줄간격 1.55, 본문 1.85 */}
            <div className="text-white order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                <Code2 className="w-4 h-4" />
                유스핀랩 자체 개발
              </div>
              <Typography.H1 className="mt-7 text-white">
                직접 경험하며
                <br />
                <span className="text-brand-accent">배우는 투자</span>의
                <br />첫 걸음
              </Typography.H1>
              <Typography.Lead className="mt-7 max-w-lg text-white/75">
                유스핀랩이 직접 개발한 모의투자 플랫폼으로 가상 자금을 활용해
                실제 시장을 체험하고, 리스크 없이 투자 감각을 키워보세요.
              </Typography.Lead>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/education-inquiry"
                  className="inline-flex items-center justify-center gap-2 bg-on-brand text-brand-600 hover:bg-on-brand/90 px-8 py-2 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  프로그램 문의하기
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://blog.naver.com/youthfinlab/224115273108"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center border-2 border-white/50 text-white hover:bg-white/10 px-8 py-2 text-lg font-semibold rounded-xl transition-all duration-200"
                >
                  체험 후기 보기
                </a>
              </div>
            </div>

            {/* 오른쪽: 스마트폰 목업 */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative">
                {/* 폰 프레임 — 제품 스크린샷이므로 테마 고정 */}
                <div className="device-mockup relative w-[280px] h-[560px] bg-neutral-900 rounded-[45px] p-2.5 shadow-2xl">
                  {/* 노치 */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-neutral-900 rounded-b-2xl z-20"></div>
                  {/* 스크린 */}
                  <div className="w-full h-full bg-white rounded-[36px] overflow-hidden relative">
                    {/* 상태바 */}
                    <div className="bg-brand-600 text-white px-5 pt-6 pb-2.5 text-xs flex justify-between items-center">
                      <span>9:41</span>
                      <span className="font-medium">모의투자</span>
                      <span>100%</span>
                    </div>
                    {/* 앱 헤더 */}
                    <div className="bg-brand-600 text-white px-5 py-5 pb-8">
                      <p className="text-xs text-white/70 mb-1">
                        내 포트폴리오
                      </p>
                      <p className="text-3xl font-bold">10,234,500원</p>
                      <p className="text-sm text-green-300 mt-1">
                        +234,500원 (+2.34%)
                      </p>
                    </div>
                    {/* 앱 콘텐츠 */}
                    <div className="p-4 space-y-3 -mt-4">
                      {/* 보유 종목 */}
                      <div className="bg-neutral-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-neutral-500">삼성전자</p>
                            <p className="text-sm font-semibold text-neutral-900">
                              5주 보유
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-neutral-900">
                              385,000원
                            </p>
                            <p className="text-xs text-green-600">+3.2%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-neutral-500">카카오</p>
                            <p className="text-sm font-semibold text-neutral-900">
                              10주 보유
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-neutral-900">
                              520,000원
                            </p>
                            <p className="text-xs text-red-500">-1.5%</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-neutral-500">네이버</p>
                            <p className="text-sm font-semibold text-neutral-900">
                              3주 보유
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-neutral-900">
                              615,000원
                            </p>
                            <p className="text-xs text-green-600">+2.8%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* 하단 네비게이션 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-3 py-3 flex justify-around">
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto mb-1 bg-brand-600 rounded-lg flex items-center justify-center">
                          <LineChart className="w-3.5 h-3.5 text-white" />
                        </div>
                        <p className="text-[10px] text-brand-600 font-medium">
                          홈
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto mb-1 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <p className="text-[10px] text-neutral-400">종목</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto mb-1 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <Trophy className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <p className="text-[10px] text-neutral-400">랭킹</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto mb-1 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <p className="text-[10px] text-neutral-400">MY</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 폰 글로우 효과 */}
                <div className="absolute -inset-6 bg-white/10 rounded-[60px] blur-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
       * 왜 모의투자인가 & 기능 Section
       * 아래 섹션의 상단 여백과 합쳐지므로 하단만 줄여 잡는다.
       */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* 왜 모의투자인가 */}
            <div className="text-center mb-16">
              <Typography.H2 className="mb-5 text-foreground">
                모의투자체험이 필요한 이유
              </Typography.H2>
              <Typography.Lead>
                실전 같은 경험, 하지만 완벽하게 안전한 환경에서
              </Typography.Lead>
            </div>

            {/*
             * 네 항목의 내용량이 같으므로 칸도 같은 크기로 둔다.
             * 크기에 차이를 주면 짧은 글이 빈 공간만 남긴다.
             * 아이콘 대신 짧은 강조선으로 각 칸의 시작점만 표시한다.
             */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-20">
              {WHY_MOCK_INVESTMENT.map((item) => (
                <article
                  key={item.title}
                  className="rounded-card bg-muted p-8 md:p-9"
                >
                  <span
                    aria-hidden
                    className="block h-1 w-8 rounded-full bg-primary"
                  />
                  <h3 className="mt-7 text-lg font-bold leading-[1.5] text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.8] text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            {/* 플랫폼 특징 */}
            <div className="bg-muted rounded-3xl p-8 md:p-12">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Code2 className="w-4 h-4" />
                  유스핀랩 자체 개발 플랫폼
                </div>
                <Typography.H2 className="mb-5 text-foreground">
                  교육 현장의 목소리를 담았습니다
                </Typography.H2>
                <Typography.Lead>
                  수많은 교육 경험을 바탕으로 학습 효과를 극대화하는 기능들
                </Typography.Lead>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    교육 목적 설계
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    단순 수익률 경쟁이 아닌
                    <br />
                    올바른 투자 습관 형성
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    학습자 중심 UX
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    복잡한 증권사 앱 대신
                    <br />
                    직관적이고 쉬운 인터페이스
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    기관 맞춤 운영
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    그룹 관리 및 실시간
                    <br />
                    학습 현황 모니터링
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 기관 프로그램 Section */}
      <section className="pt-16 pb-24 md:pt-20 md:pb-32 bg-linear-to-b/srgb from-background to-brand-600/5">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            {/* 다른 섹션과 같은 형태의 중앙 정렬 헤더 */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Building className="w-4 h-4" />
                기관 대상 프로그램
              </div>
              <Typography.H2 className="mb-5 text-foreground">
                프로그램은 이렇게 진행됩니다
              </Typography.H2>
              <Typography.Lead>
                기초 금융교육부터 모의투자 체험, 결과 분석까지 체계적인
                커리큘럼으로 금융 역량을 키워갑니다.
              </Typography.Lead>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* 왼쪽: 진행 단계 */}
              <div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        기초 금융교육
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        주식, 채권, 펀드 등 기본 개념을 쉽고 재미있게
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        모의투자 플랫폼 체험
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        가상 자금으로 실제 종목 매매, 나만의 투자 결정
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        포트폴리오 구성
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        분산투자 원리를 배우며 나만의 전략 수립
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        결과 분석 & 피드백
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        투자 결과 복기, 성공과 실패 모두가 값진 배움
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 카드들 */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">중·고등학교</h4>
                      <p className="text-sm text-subtle-foreground">
                        자유학기제·창의적 체험활동
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    학생들이 직접 주식을 사고팔아보니 금융에 대한 관심이 크게
                    높아졌습니다.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        대학·청년센터
                      </h4>
                      <p className="text-sm text-subtle-foreground">
                        사회초년생 금융역량 강화
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    실제 투자에 앞서 연습해볼 수 있어 청년들의 만족도가
                    높았습니다.
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        복지기관·금융캠프
                      </h4>
                      <p className="text-sm text-subtle-foreground">
                        방학 및 특별 프로그램
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    함께 경쟁하며 배우니 더 집중하고, 기억에도 오래 남았습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-linear-to-b/srgb from-brand-600 to-brand-800">
        <div className="container mx-auto px-6">
          {/* 홈 하단 CTA와 같은 리듬 — space-y-10, 제목 줄간격 1.55, 본문 1.85 */}
          <div className="max-w-3xl mx-auto text-center space-y-10">
            <Typography.H2 className="text-white">
              우리 기관에도
              <br />
              모의투자 프로그램을 도입하고 싶다면?
            </Typography.H2>
            <p className="mx-auto max-w-xl text-xl/[1.85] text-white/75">
              학교, 대학, 청년센터, 복지기관 등
              <br />
              맞춤형 프로그램을 설계해드립니다
            </p>
            <div className="pt-4 flex justify-center">
              <Link href="/education-inquiry">
                <Button
                  size="xl"
                  className="bg-on-brand text-brand-600 hover:bg-on-brand/90 px-10 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center"
                >
                  <span className="flex items-center gap-2">
                    프로그램 문의하기
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
