"use client";

import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  ClipboardCheck,
  TrendingUp,
  Shield,
  PiggyBank,
  Target,
  Users,
  Wallet,
  BarChart3,
  Calculator,
  Building,
} from "lucide-react";

export default function FinancialConsulting() {
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
                <HeartHandshake className="w-4 h-4" />
                1:1 맞춤 재무상담 프로그램
              </div>
              <Typography.H1 className="mt-7 text-white">
                나의 재무 건강,
                <br />
                <span className="text-brand-accent">직접 확인하고</span>
                <br />
                전문가와 함께
              </Typography.H1>
              <Typography.Lead className="mt-7 max-w-lg text-white/75">
                유스핀랩 재무상담 플랫폼으로 내 재무상태를 직접 진단하고,
                <br />
                전문 상담사의 1:1 맞춤 컨설팅을 받아보세요.
              </Typography.Lead>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/education-inquiry">
                  <Button
                    size="xl"
                    className="bg-on-brand text-brand-600 hover:bg-on-brand/90 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <span className="flex items-center gap-2">
                      프로그램 문의하기
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </Link>
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
                  <div className="w-full h-full bg-neutral-50 rounded-[36px] overflow-hidden relative">
                    {/* 상태바 */}
                    <div className="bg-brand-600 text-white px-5 pt-6 pb-2.5 text-xs flex justify-between items-center">
                      <span>9:41</span>
                      <span className="font-medium">재무건강</span>
                      <span>100%</span>
                    </div>

                    {/* 앱 헤더 - 재무건강 점수 */}
                    <div className="bg-brand-600 text-white px-5 py-5 pb-8">
                      <p className="text-xs text-white/70 mb-1">
                        나의 재무건강 점수
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold">72</span>
                        <span className="text-lg mb-1">/ 100점</span>
                      </div>
                      <div className="mt-3 bg-white/20 rounded-full h-2">
                        <div
                          className="bg-green-300 h-2 rounded-full"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-green-300 mt-2">
                        양호한 편입니다. 조금만 더 관리해보세요
                      </p>
                    </div>

                    {/* 앱 콘텐츠 */}
                    <div className="p-4 space-y-3 -mt-4">
                      {/* 투자성향 카드 */}
                      <div className="bg-white rounded-xl p-4 shadow-xs border border-neutral-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-neutral-500">
                            나의 투자성향
                          </span>
                          <span className="text-xs text-brand-600 font-medium">
                            분석완료
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900">
                              안정추구형
                            </p>
                            <p className="text-xs text-neutral-500">
                              원금 보존을 중시하는 유형
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 자산 현황 */}
                      <div className="bg-white rounded-xl p-4 shadow-xs border border-neutral-100">
                        <p className="text-xs text-neutral-500 mb-3">
                          월 자산 현황
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">
                              수입
                            </span>
                            <span className="text-sm font-semibold text-neutral-900">
                              2,500,000원
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">
                              지출
                            </span>
                            <span className="text-sm font-semibold text-red-500">
                              1,800,000원
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">
                              저축
                            </span>
                            <span className="text-sm font-semibold text-brand-600">
                              700,000원
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 추천 플랜 버튼 */}
                      <div className="bg-brand-600 rounded-xl p-4 text-white">
                        <p className="text-sm font-medium mb-1">
                          맞춤 재무 플랜 확인하기
                        </p>
                        <p className="text-xs text-white/70">
                          전문가가 분석한 나만의 플랜
                        </p>
                      </div>
                    </div>

                    {/* 하단 네비게이션 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-3 py-3 flex justify-around">
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto mb-1 bg-brand-600 rounded-lg flex items-center justify-center">
                          <Wallet className="w-3.5 h-3.5 text-white" />
                        </div>
                        <p className="text-[10px] text-brand-600 font-medium">
                          홈
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto mb-1 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <p className="text-[10px] text-neutral-400">투자성향</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto mb-1 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <Calculator className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <p className="text-[10px] text-neutral-400">비교</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 mx-auto mb-1 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <PiggyBank className="w-3.5 h-3.5 text-neutral-400" />
                        </div>
                        <p className="text-[10px] text-neutral-400">연금</p>
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

      {/* 대상 & 기능 Section */}
      {/* 아래 섹션의 상단 여백과 합쳐지므로 하단만 줄여 잡는다 */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* 대상 */}
            <div className="text-center mb-16">
              <Typography.H2 className="mb-5 text-foreground">
                이런 분들을 위해 만들었습니다
              </Typography.H2>
              <Typography.Lead>
                재무 관리가 막막한 모든 분들을 위한 맞춤 솔루션
              </Typography.Lead>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-20">
              <div className="text-center p-8 rounded-3xl bg-linear-to-b/srgb from-brand-600/5 to-transparent">
                <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  자립준비청년
                </h3>
                <p className="text-muted-foreground">
                  독립 생활의 첫 걸음,
                  <br />
                  체계적인 재무 설계부터
                </p>
              </div>

              <div className="text-center p-8 rounded-3xl bg-linear-to-b/srgb from-brand-600/5 to-transparent">
                <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  사회초년생
                </h3>
                <p className="text-muted-foreground">
                  첫 월급부터 시작하는
                  <br />
                  현명한 돈 관리 습관
                </p>
              </div>

              <div className="text-center p-8 rounded-3xl bg-linear-to-b/srgb from-brand-600/5 to-transparent">
                <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HeartHandshake className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  재무관리가 필요한 누구나
                </h3>
                <p className="text-muted-foreground">
                  막연한 불안감을
                  <br />
                  구체적인 계획으로
                </p>
              </div>
            </div>

            {/* 플랫폼 기능 */}
            <div className="bg-muted rounded-3xl p-8 md:p-12">
              <div className="text-center mb-16">
                <Typography.H2 className="mb-5 text-foreground">
                  플랫폼에서 직접 확인합니다
                </Typography.H2>
                <Typography.Lead>
                  웹과 앱으로 언제든지 내 재무상태를 점검할 수 있습니다
                </Typography.Lead>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ClipboardCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    재무상태 입력
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    수입, 지출, 자산을
                    <br />
                    간편하게 입력
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    투자성향 분석
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    나에게 맞는
                    <br />
                    투자 스타일 확인
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">
                    투자 vs 저축 비교
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    나에게 유리한
                    <br />
                    방법 시뮬레이션
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <PiggyBank className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">연금 플랜</h4>
                  <p className="text-sm text-muted-foreground">
                    노후 대비
                    <br />
                    연금 시뮬레이션
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
                기관에서 신청하면 1:1 전문 상담까지
              </Typography.H2>
              <Typography.Lead>
                플랫폼으로 재무상태를 먼저 진단하고, 전문 상담사가 1:1로 맞춤
                컨설팅을 진행합니다. 단순 진단을 넘어 실질적인 재무 계획까지
                함께 세워드립니다.
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
                        플랫폼 사전 진단
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        참여자가 직접 재무상태를 입력하고 분석 결과 확인
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        1:1 전문 상담
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        진단 결과를 바탕으로 전문 상담사가 맞춤 컨설팅 진행
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        실행 계획 수립
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        구체적인 재무 목표와 실천 가능한 액션 플랜 제시
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 추천 대상 카드 */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        청년센터 · 복지관
                      </h4>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    자립준비청년, 청년구직자 대상 재무역량 강화 프로그램
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        기업 · 공공기관
                      </h4>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    신입사원, 임직원 대상 재무건강 복지 프로그램
                  </p>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        대학교 · 교육기관
                      </h4>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    취업준비생, 사회진출 예정자 대상 금융교육 프로그램
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
              재무상담 프로그램을 도입하고 싶다면?
            </Typography.H2>
            <p className="mx-auto max-w-xl text-xl/[1.85] text-white/75">
              청년센터, 기업, 학교 등
              <br />
              기관 맞춤형 프로그램을 설계해드립니다
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
