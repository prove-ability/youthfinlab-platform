"use client";
import { LoadError, RefreshStatus } from "@repo/ui/async-state";

import { useEffect, useRef } from "react";
import { getClassRanking } from "@/actions/ranking";
import { useQuery } from "@tanstack/react-query";
import PageLoading from "@/components/PageLoading";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import InfoBanner from "@/components/InfoBanner";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { Users } from "lucide-react";

export default function RankingPage() {
  const myRankRef = useRef<HTMLDivElement>(null);

  // React Query로 랭킹 데이터 페칭 (30초마다 자동 갱신)
  const {
    data: rankingData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["ranking"],
    queryFn: getClassRanking,
    staleTime: 15 * 1000, // 15초 (랭킹은 자주 변함)
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // 30초마다 자동 갱신 (폴링)
    refetchIntervalInBackground: false, // 백그라운드에서는 폴링 안함
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rankings = rankingData?.rankings || [];

  // 내 순위로 자동 스크롤
  useEffect(() => {
    if (rankings.length > 0 && myRankRef.current) {
      // 내가 상위 3위 안에 없으면 스크롤
      const myRank = rankings.find((r) => r.isCurrentUser);
      if (myRank && myRank.rank > 3) {
        setTimeout(() => {
          myRankRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 300);
      }
    }
  }, [rankings]);

  // Pull-to-refresh 기능
  const { isRefreshing } = usePullToRefresh(async () => {
    await refetch();
  });

  if (isError && !rankingData) return <LoadError onRetry={() => refetch()} retrying={isFetching} />;

  if (isLoading) {
    return <PageLoading />;
  }

  const top10 = rankings.slice(0, 10);
  const myRanking = rankings.find((r) => r.isCurrentUser);

  return (
    <div className="min-h-screen bg-yfl-canvas pb-20">
      {isError ? <LoadError onRetry={() => refetch()} retrying={isFetching} hasData /> : <RefreshStatus active={isFetching} />}
      {/* Pull-to-refresh 인디케이터 */}

      <div className="max-w-4xl mx-auto p-4">
        <PageHeader
          title="랭킹"
          description="오늘의 투자순위, 투자왕은 누구일까요?"
        />

        {/* TOP 10 안내 */}
        <InfoBanner
          icon="🏆"
          title="상위 10명의 랭킹이 공개돼요"
          description="친구들과 수익률을 비교하고 더 나은 투자자가 되어보세요!"
        />

        {/* 내 순위 표시 (상위 10위 밖일 경우) */}
        {myRanking && myRanking.rank > 10 && (
          <div className="mb-4 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-base font-semibold text-emerald-900">
                  내 순위: {myRanking.rank}위
                </div>
                <div className="text-sm text-gray-700">
                  {myRanking.nickname || "닉네임 없음"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600">보유 금액</div>
                <div className="text-base font-semibold text-gray-900">
                  {myRanking.totalAssets.toLocaleString()}원
                </div>
                <div className="text-xs text-gray-500">
                  {myRanking.profitRate >= 0 ? "+" : ""}
                  {myRanking.profitRate.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 Rankings */}
        <div id="ranking-list" className="space-y-3">
          {top10.length === 0 ? (
            <EmptyState
              icon={<Users className="h-16 w-16" />}
              title="아직 참가자가 없어요"
              description="게임에 참가한 학생들의 랭킹이 여기에 표시됩니다. 첫 거래를 시작해보세요!"
            />
          ) : (
            top10.map((entry) => {
              const isMe = entry.isCurrentUser;

              return (
                <div
                  key={entry.guestId}
                  ref={isMe ? myRankRef : null}
                  className={`rounded-2xl transition-all p-4 ${
                    isMe
                      ? "bg-emerald-50 border-2 border-emerald-300"
                      : "bg-white border border-yfl-divider"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* 왼쪽: 순위와 닉네임 */}
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-semibold text-gray-700">
                        {entry.rank === 1 && <span className="mr-2">🥇</span>}
                        {entry.rank === 2 && <span className="mr-2">🥈</span>}
                        {entry.rank === 3 && <span className="mr-2">🥉</span>}
                        {entry.rank}
                      </div>
                      <div>
                        <div
                          className={`font-medium text-base ${
                            isMe ? "text-emerald-900" : "text-gray-800"
                          }`}
                        >
                          {entry.nickname || "닉네임 없음"}
                          {isMe && (
                            <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded-md">
                              나
                            </span>
                          )}
                        </div>
                        {entry.rank === 1 && (
                          <div className="text-xs text-emerald-600 mt-0.5 font-medium">
                            TOP 3 달성! 축하해요!
                          </div>
                        )}
                        {entry.rank === 2 && (
                          <div className="text-xs text-emerald-600 mt-0.5 font-medium">
                            TOP 3 달성! 축하해요!
                          </div>
                        )}
                        {entry.rank === 3 && (
                          <div className="text-xs text-emerald-600 mt-0.5 font-medium">
                            TOP 3 달성! 축하해요!
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 오른쪽: 보유 금액 */}
                    <div className="text-right">
                      <div className="text-base font-semibold text-gray-900">
                        {entry.totalAssets.toLocaleString()}원
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        {entry.profitRate >= 0 ? "+" : ""}
                        {entry.profitRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
