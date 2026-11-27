"use client";
import { LoadingState, LoadError, RefreshStatus } from "@repo/ui/async-state";

import "./dashboard.css";

import { BrandIntro } from "@repo/ui/brand-intro";

import { useMemo } from "react";
import {
  Users,
  Building2,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
  Star,
  StarHalf,
  ArrowRight,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { getDashboardAll } from "@/actions/dashboardActions";
import { useQuery } from "@tanstack/react-query";

// 최소 응답 타입 정의 (컴포넌트에서 사용하는 필드만)
type RecentClass = {
  id: string;
  name: string;
  createdAt: string | Date;
  client: { name: string };
  manager: { name: string };
};
type ClassProgressItem = {
  id: string;
  name: string;
  currentDay: number;
  client: { name: string };
};
type RecentGuest = {
  id: string;
  name: string;
  createdAt: string | Date;
  class?: { name: string } | null;
};
type RecentSurvey = {
  id: string;
  rating: number;
  feedback?: string | null;
  createdAt: string | Date;
  guest?: { name?: string | null } | null;
  class?: { name?: string | null } | null;
};
type DashboardAllSuccess = {
  success: true;
  data: {
    stats: {
      totalClients: number;
      totalClasses: number;
      totalGuests: number;
      totalSurveys: number;
      totalTransactions: number;
      activeGames: number;
      averageRating: number;
      recentClassesCount: number;
    };
    recentClasses: RecentClass[];
    recentGuests: RecentGuest[];
    classProgress: ClassProgressItem[];
    recentSurveys: RecentSurvey[];
  };
};

export function DashboardClient() {
  const { data, isLoading, isFetching, refetch, isError } = useQuery<any>({
    queryKey: ["dashboard", "all"],
    queryFn: async () => { const result = await getDashboardAll(); if (!result.success) throw new Error("대시보드 조회 실패"); return result; },
    staleTime: 60_000,
  });

  const loading = useMemo(() => isLoading, [isLoading]);
  const payload = data?.success
    ? (data.data as DashboardAllSuccess["data"])
    : null;

  if (loading) return <LoadingState label="대시보드를 불러오는 중…" />;

  const renderStars = (rating: number) => {
    // 10점 만점을 5개 별로 표현 (1점 = 반별)
    const normalizedRating = rating / 2; // 10점 → 5점 척도로 변환
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= fullStars) {
            // 채워진 별
            return (
              <Star
                key={star}
                className="w-3 h-3 fill-yellow-400 text-yellow-400"
              />
            );
          } else if (star === fullStars + 1 && hasHalfStar) {
            // 반별
            return (
              <StarHalf
                key={star}
                className="w-3 h-3 fill-yellow-400 text-yellow-400"
              />
            );
          } else {
            // 빈 별
            return (
              <Star
                key={star}
                className="w-3 h-3 text-gray-300"
              />
            );
          }
        })}
      </div>
    );
  };

  if (!payload) return <LoadError onRetry={() => refetch()} retrying={isFetching} />;

  return (
    <div className="yfl-dashboard yfl-dashboard-review space-y-6">
      {isError ? <LoadError onRetry={() => refetch()} retrying={isFetching} hasData /> : <RefreshStatus active={isFetching} />}
      {/* 헤더 */}
      <BrandIntro title="관리자 대시보드" description="주식 게임 및 재무 시뮬레이션 전체 현황을 한눈에 확인하세요" />

      {/* 주요 통계 카드 */}
      {payload && (
        <div className="yfl-dashboard-stats">
          {/* 총 클라이언트 수 */}
          <Link href="/protected/clients">
            <div className="yfl-stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="yfl-stat-icon p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--yfl-ink)]" />
              </div>
              <h3 className="text-sm font-medium text-[var(--yfl-ink)] mb-1">
                총 클라이언트
              </h3>
              <p className="text-3xl font-bold text-[var(--yfl-ink)]">
                {payload.stats.totalClients}
              </p>
            </div>
          </Link>

          {/* 총 클래스 수 */}
          <Link href="/protected/classes">
            <div className="yfl-stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="yfl-stat-icon p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--yfl-ink)]" />
              </div>
              <h3 className="text-sm font-medium text-[var(--yfl-ink)] mb-1">
                총 클래스
              </h3>
              <p className="text-3xl font-bold text-[var(--yfl-ink)]">
                {payload.stats.totalClasses}
              </p>
              <p className="text-xs text-[var(--yfl-ink)] mt-2">
                최근 7일: +{payload.stats.recentClassesCount}
              </p>
            </div>
          </Link>

          {/* 총 학생 수 */}
          <Link href="/protected/classes">
            <div className="yfl-stat-card">
              <div className="flex items-center justify-between mb-4">
                <div className="yfl-stat-icon p-3 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--yfl-ink)]" />
              </div>
              <h3 className="text-sm font-medium text-[var(--yfl-ink)] mb-1">
                총 학생 수
              </h3>
              <p className="text-3xl font-bold text-[var(--yfl-ink)]">
                {payload.stats.totalGuests}
              </p>
              <p className="text-xs text-[var(--yfl-ink)] mt-2">
                거래 {payload.stats.totalTransactions.toLocaleString()}건
              </p>
            </div>
          </Link>

          {/* 활성 게임 */}
          <Link href="/protected/game-management">
            <div className="yfl-stat-card yfl-stat-active">
              <div className="flex items-center justify-between mb-4">
                <div className="yfl-stat-icon p-3 rounded-xl">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--yfl-ink)]" />
              </div>
              <h3 className="text-sm font-medium text-[var(--yfl-ink)] mb-1">
                활성 게임
              </h3>
              <p className="text-3xl font-bold text-[var(--yfl-ink)]">
                {payload.stats.activeGames}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* 서베이 통계 및 최근 활동 */}
      <div className="yfl-dashboard-primary">
        {/* 클래스 진행 상황 */}
        {payload && (
          <div className="yfl-dashboard-panel yfl-dashboard-progress p-6">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-[var(--yfl-ink)]" />
              <h2 className="text-xl font-semibold text-[var(--yfl-ink)]">
                클래스 진행 상황
              </h2>
            </div>
            <div className="yfl-dashboard-rows max-h-[300px] overflow-y-auto">
              {payload.classProgress
                .slice(0, 5)
                .map((classItem: ClassProgressItem) => (
                  <Link
                    key={classItem.id}
                    href={`/protected/classes/${classItem.id}`}
                  >
                    <div className="flex items-center justify-between p-3 hover:bg-[var(--yfl-soft)] rounded-lg transition-colors cursor-pointer border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[var(--yfl-ink)] truncate">
                          {classItem.name}
                        </h4>
                        <p className="text-sm text-[var(--yfl-secondary)] truncate">
                          {classItem.client.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-right">
                          <p className="text-xs text-[var(--yfl-secondary)]">진행 Day</p>
                          <p className="text-lg font-bold text-[var(--yfl-ink)]">
                            {classItem.currentDay}
                          </p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-[var(--yfl-ink)]" />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* 서베이 통계 */}
        {payload && (
          <div className="yfl-dashboard-panel yfl-dashboard-survey p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-[var(--yfl-ink)]" />
              <h2 className="text-xl font-semibold text-[var(--yfl-ink)]">
                서베이 통계
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[var(--yfl-soft)] rounded-lg">
                <div>
                  <p className="text-sm text-[var(--yfl-secondary)]">총 응답 수</p>
                  <p className="text-2xl font-bold text-[var(--yfl-ink)]">
                    {payload.stats.totalSurveys}
                  </p>
                </div>
                <MessageSquare className="w-12 h-12 text-[var(--yfl-ink)]" />
              </div>
              <div className="flex items-center justify-between p-4 bg-[var(--yfl-soft)] rounded-lg">
                <div>
                  <p className="text-sm text-[var(--yfl-secondary)]">평균 평점</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-[var(--yfl-ink)]">
                      {payload.stats.averageRating}
                    </p>
                    <span className="text-sm text-[var(--yfl-secondary)]">/ 10.0</span>
                  </div>
                </div>
                <Star className="w-12 h-12 text-yellow-400" />
              </div>
              <section
                className="p-4 bg-[var(--yfl-soft)] rounded-lg"
                aria-labelledby="satisfaction-heading"
              >
                <h3
                  id="satisfaction-heading"
                  className="text-sm text-[var(--yfl-secondary)] mb-2"
                >
                  만족도
                </h3>
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 bg-gray-200 rounded-full h-3"
                    role="progressbar"
                    aria-valuenow={Math.round(
                      (payload.stats.averageRating / 10) * 100
                    )}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="만족도 게이지"
                  >
                    <div
                      className="bg-[var(--yfl-forest)] h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(payload.stats.averageRating / 10) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <output
                    className="text-lg font-bold text-[var(--yfl-ink)]"
                    htmlFor="satisfaction-heading"
                  >
                    {Math.round((payload.stats.averageRating / 10) * 100)}%
                  </output>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {/* 최근 클래스 및 학생 */}
      <div className="yfl-dashboard-recent">
        {/* 최근 생성된 클래스 */}
        {payload && (
          <div className="yfl-dashboard-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[var(--yfl-ink)]" />
                <h2 className="text-xl font-semibold text-[var(--yfl-ink)]">
                  최근 클래스
                </h2>
              </div>
              <Link
                href="/protected/classes"
                className="text-sm text-[var(--yfl-ink)] hover:text-[var(--yfl-ink)] font-medium"
              >
                전체 보기 →
              </Link>
            </div>
            <div className="yfl-dashboard-rows">
              {payload.recentClasses.map((classItem: RecentClass) => (
                <Link
                  key={classItem.id}
                  href={`/protected/classes/${classItem.id}`}
                >
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-[var(--yfl-muted)] hover:bg-[var(--yfl-soft)] transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[var(--yfl-ink)] truncate">
                          {classItem.name}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-[var(--yfl-secondary)] truncate">
                            {classItem.client.name}
                          </p>
                          <p className="text-sm text-[var(--yfl-secondary)]">
                            {classItem.manager.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-[var(--yfl-secondary)] ml-4">
                        {new Date(classItem.createdAt).toLocaleDateString(
                          "ko-KR",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 최근 등록된 학생 */}
        {payload && (
          <div className="yfl-dashboard-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-[var(--yfl-ink)]" />
                <h2 className="text-xl font-semibold text-[var(--yfl-ink)]">
                  최근 등록 학생
                </h2>
              </div>
              <Link
                href="/protected/classes"
                className="text-sm text-[var(--yfl-ink)] hover:text-[var(--yfl-ink)] font-medium"
              >
                전체 보기 →
              </Link>
            </div>
            <div className="yfl-dashboard-rows max-h-[300px] overflow-y-auto">
              {payload.recentGuests.map((guest: RecentGuest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-3 hover:bg-[var(--yfl-soft)] rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--yfl-soft)] flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-[var(--yfl-ink)]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-[var(--yfl-ink)]">
                        {guest.name}
                      </h4>
                      <p className="text-sm text-[var(--yfl-secondary)]">
                        {guest.class?.name || "클래스 없음"}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--yfl-secondary)]">
                    {new Date(guest.createdAt).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 최근 서베이 응답 */}
      {payload && (
        <div className="yfl-dashboard-panel p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-6 h-6 text-[var(--yfl-ink)]" />
            <h2 className="text-xl font-semibold text-[var(--yfl-ink)]">
              최근 서베이 응답
            </h2>
          </div>
          <div className="yfl-dashboard-feedback">
            {payload.recentSurveys.map((survey: RecentSurvey) => (
              <div
                key={survey.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-[var(--yfl-soft)] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--yfl-ink)] truncate">
                      {survey.guest?.name || "익명"}
                    </h4>
                    <p className="text-sm text-[var(--yfl-secondary)] truncate">
                      {survey.class?.name}
                    </p>
                  </div>
                  {renderStars(survey.rating)}
                </div>
                {survey.feedback && (
                  <p className="text-sm text-[var(--yfl-secondary)] line-clamp-2">
                    {survey.feedback}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(survey.createdAt).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
