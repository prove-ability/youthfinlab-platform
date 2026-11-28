"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";
import {
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  FileText,
  Users,
  CheckCircle,
  ClipboardList,
  BarChart3,
  Award,
} from "lucide-react";

export default function CustomerSupport() {
  return (
    <main className="pt-24">
      {/* 문의 방법 Section - 상단 통합 */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                고객지원
              </h1>
              <p className="text-muted-foreground">
                궁금한 점이 있으시면 편한 방법으로 문의해주세요
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* 전화 문의 */}
              <div className="bg-muted rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">전화 문의</h3>
                <p className="text-primary font-semibold text-lg mb-1">
                  070-8098-3703
                </p>
                <p className="text-sm text-subtle-foreground">
                  평일 10:00 - 20:00
                </p>
              </div>

              {/* 이메일 문의 */}
              <div className="bg-muted rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">이메일 문의</h3>
                <p className="text-primary font-semibold mb-1">
                  contact@youthfinlab.com
                </p>
                <p className="text-sm text-subtle-foreground">
                  24시간 접수 가능
                </p>
              </div>

              {/* 채팅 상담 */}
              <div
                onClick={() => ChannelService.showMessenger()}
                className="bg-brand-600 rounded-2xl p-6 text-center hover:bg-brand-800 transition-all duration-300 h-full cursor-pointer"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">채팅 상담</h3>
                <p className="text-white/80 mb-1">실시간 상담하기</p>
                <p className="text-sm text-white/80">평일 10:00 - 18:00</p>
              </div>
            </div>

            {/* 운영 시간 안내 */}
            <div className="mt-8 bg-muted rounded-2xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">운영 시간</h4>
                <p className="text-muted-foreground text-sm">
                  평일 오전 10시 ~ 저녁 8시 | 주말 및 공휴일 문의는 영업일에
                  순차 답변드립니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 교육 진행 과정 Section */}
      <section className="py-20 bg-linear-to-b/srgb from-background to-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                교육 진행 과정
              </h2>
              <p className="text-muted-foreground">
                체계적인 단계별 과정으로 최적의 교육을 설계합니다
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    1
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <ClipboardList className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">
                    사전진단 및 분석
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    교육 대상의 필요 사항을 파악하여 맞춤형 교육을 설계합니다
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border-strong"></div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    2
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">교육 설계</h3>
                  <p className="text-sm text-muted-foreground">
                    목표 설정과 주요 지표를 반영한 커리큘럼을 수립합니다
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border-strong"></div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    3
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">교육 진행</h3>
                  <p className="text-sm text-muted-foreground">
                    전문 강사진과 함께 실질적인 변화를 경험합니다
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border-strong"></div>
              </div>

              {/* Step 4 */}
              <div>
                <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 h-full">
                  <div className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                    4
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">결과 보고</h3>
                  <p className="text-sm text-muted-foreground">
                    체계적인 결과보고서와 사후 관리를 제공합니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 유스핀랩 강점 Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                유스핀랩을 선택하는 이유
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 bg-card rounded-xl p-5">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    맞춤형 커리큘럼
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    대상과 목적에 맞춘 프로그램 설계
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card rounded-xl p-5">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    전문 강사진
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    금융교육 전문가가 직접 진행
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-card rounded-xl p-5">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    체계적인 결과 보고
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    교육 효과를 명확하게 전달
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                자주 묻는 질문
              </h2>
              <p className="text-muted-foreground">
                궁금한 점을 빠르게 확인하세요
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <Accordion.Item
                value="item-1"
                className="bg-muted rounded-xl border-none"
              >
                <Accordion.Trigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-medium">
                    교육 관련 답변은 문의 후 얼마나 걸리나요?
                  </span>
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      영업시간(평일 10:00~20:00) 기준{" "}
                      <strong className="text-primary">2시간 이내</strong>로
                      안내드립니다.
                    </p>
                    <p className="text-sm">
                      주말 및 공휴일에 접수된 문의는 영업일에 순차적으로
                      답변드립니다.
                    </p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item
                value="item-2"
                className="bg-muted rounded-xl border-none"
              >
                <Accordion.Trigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-medium">
                    커리큘럼을 확인하고 싶어요.
                  </span>
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      교육 대상, 인원, 목적 등을 상담 후{" "}
                      <strong className="text-primary">맞춤형 커리큘럼</strong>
                      을 제안드립니다.
                    </p>
                    <div className="bg-card rounded-lg p-4 text-sm space-y-2">
                      <p>1. 사전 상담 진행</p>
                      <p>2. 맞춤형 커리큘럼 설계</p>
                      <p>3. 커리큘럼 제안서 제공</p>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item
                value="item-3"
                className="bg-muted rounded-xl border-none"
              >
                <Accordion.Trigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-medium">
                    온라인으로도 교육이 가능한가요?
                  </span>
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      네, 다양한 형태의{" "}
                      <strong className="text-primary">온라인 교육</strong>을
                      제공합니다.
                    </p>
                    <div className="bg-card rounded-lg p-4 text-sm space-y-2">
                      <p>
                        <strong>라이브 강의:</strong> 실시간 소통이 가능한
                        온라인 강의
                      </p>
                      <p>
                        <strong>VOD 강의:</strong> 언제든 반복 학습 가능한 녹화
                        강의
                      </p>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Item>

              <Accordion.Item
                value="item-4"
                className="bg-muted rounded-xl border-none"
              >
                <Accordion.Trigger className="text-left px-6 py-4 hover:no-underline">
                  <span className="font-medium">
                    교육 비용은 어떻게 되나요?
                  </span>
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-4">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      교육 대상, 인원, 시간, 내용에 따라 맞춤 견적을
                      안내드립니다.
                    </p>
                    <p className="text-sm">
                      문의 시 상세 내용을 말씀해주시면 빠르게 견적을 안내드릴 수
                      있습니다.
                    </p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-b/srgb from-brand-600 to-brand-800">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              교육 문의가 필요하신가요?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              지금 바로 문의하시면 빠르게 안내드리겠습니다
            </p>
            <Link href="/education-inquiry">
              <Button
                size="xl"
                className="bg-on-brand text-brand-600 hover:bg-on-brand/90 px-10 py-4 text-lg font-semibold rounded-xl"
              >
                <span className="flex items-center gap-2">
                  교육 문의하기
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
