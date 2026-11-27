"use client";
import { LoadError, RefreshStatus } from "@repo/ui/async-state";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStocksForInvest } from "@/actions/stocks";
import { getTransactionHistory } from "@/actions/transactions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TradeBottomSheet from "@/components/TradeBottomSheet";
import StockNewsSheet from "@/components/StockNewsSheet";
import StockListSkeleton from "@/components/StockListSkeleton";
import TransactionListSkeleton from "@/components/TransactionListSkeleton";
import PageLoading from "@/components/PageLoading";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useTour } from "@/hooks/useTour";
import { ShoppingCart, Receipt } from "lucide-react";
import InfoBanner from "@/components/InfoBanner";

interface Stock {
  id: string;
  name: string;
  currentPrice: number;
  change: number;
  changeRate: number;
  marketCountryCode: "KR" | "US" | "JP" | "CN";
  holdingQuantity: number;
  holdingValue: number;
  averagePurchasePrice: number;
  newsCount: number;
}

// 국가 코드 매핑
const COUNTRY_NAMES: Record<string, string> = {
  KR: "대한민국",
  US: "미국",
  JP: "일본",
  CN: "중국",
};

export default function InvestPage() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter");
  const queryClient = useQueryClient();

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [activeTab, setActiveTab] = useState<"stocks" | "history">("stocks");
  const [showOnlyHoldings, setShowOnlyHoldings] = useState(
    filterParam === "holdings"
  );
  const [showOnlyNews, setShowOnlyNews] = useState(false);
  const [newsStock, setNewsStock] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // React Query로 주식 데이터 페칭
  const {
    data: stockData,
    isLoading: isLoadingStocks,
    isFetching: fetchingStocks,
    isError: stocksError,
    refetch: refetchStocks,
  } = useQuery({
    queryKey: ["stocks"],
    queryFn: getStocksForInvest,
    staleTime: 20 * 1000, // 20초
  });

  // React Query로 거래내역 페칭 (탭 활성화 시만)
  const {
    data: transactions = [],
    isLoading: isLoadingHistory,
    isFetching: fetchingHistory,
    isError: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactionHistory,
    enabled: activeTab === "history", // history 탭일 때만 로드
    staleTime: 30 * 1000, // 30초
  });

  const stocks = stockData?.stocks || [];
  const balance = stockData?.balance || 0;
  const currentDay = stockData?.currentDay || 1;
  const totalDays = stockData?.totalDays || 0;
  const totalProfit = stockData?.profit || 0;
  const totalProfitRate = stockData?.profitRate || 0;
  
  // 마지막 Day 체크
  const isLastDay = currentDay >= totalDays && totalDays > 0;

  const isInitialLoading = isLoadingStocks;
  const isRefreshing =
    activeTab === "stocks" ? fetchingStocks : fetchingHistory;

  // 투어 훅 추가
  useTour(true);

  const handleTradeSuccess = async () => {
    // 거래 성공 시 모든 관련 데이터 갱신
    await queryClient.invalidateQueries({ queryKey: ["stocks"] });
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    await queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // 홈 화면도 갱신

  };

  // Pull-to-refresh 기능
  usePullToRefresh(async () => {
    if (activeTab === "stocks") {
      await refetchStocks();
    } else {
      await refetchHistory();
    }
  });

  const holdingStocks = stocks.filter((s) => s.holdingQuantity > 0);
  const newsStocks = stocks.filter((s) => s.newsCount > 0);
  const totalHoldingValue = holdingStocks.reduce(
    (sum, s) => sum + s.holdingValue,
    0
  );

  let displayStocks = stocks;
  if (showOnlyHoldings && showOnlyNews) {
    // 둘 다 체크: 보유 중이면서 뉴스가 있는 종목
    displayStocks = stocks.filter(
      (s) => s.holdingQuantity > 0 && s.newsCount > 0
    );
  } else if (showOnlyHoldings) {
    displayStocks = holdingStocks;
  } else if (showOnlyNews) {
    displayStocks = newsStocks;
  }

  if (stocksError && !stockData) return <LoadError onRetry={() => refetchStocks()} retrying={fetchingStocks} />;

  if (isInitialLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-yfl-canvas pb-20">
      <div className="max-w-4xl mx-auto p-4">
        <PageHeader
          title="투자"
          description="뉴스를 읽고 주식을 사고팔아보세요"
        />

        {/* 마지막 Day 안내 */}
        {isLastDay && (
          <InfoBanner
            icon="⚠️"
            title="마지막 Day에요!"
            description="게임이 종료되어 더 이상 매수/매도할 수 없어요. 최종 결과를 확인하고 랭킹을 확인해보세요!"
          />
        )}

        {/* 환율 안내 배너 */}
        {!isLastDay && (
          <InfoBanner
            icon="💡"
            title="모든 가격은 원화(₩)로 표시돼요"
            description="해외 주식은 환율이 적용된 원화 가격이에요. 실제 투자와 동일한 환경에서 학습해보세요!"
          />
        )}

        {/* 종목 클릭 안내 */}
        {stocks.length > 0 && !isLastDay && (
          <InfoBanner
            icon="👆"
            title="종목 카드를 눌러보세요!"
            description="종목 카드를 클릭하면 주식을 사고팔 수 있어요. 뉴스를 읽고 현명하게 투자해보세요!"
          />
        )}

        {/* Portfolio Summary */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-yfl-divider">
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-1.5">남은 현금</p>
              <p className="text-xl font-bold text-gray-900">
                {balance.toLocaleString()}원
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-yfl-divider">
              <div>
                <p className="text-xs text-gray-600 mb-1.5">내 주식</p>
                <p className="text-base font-bold text-gray-900">
                  {totalHoldingValue.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1.5">투자 결과</p>
                <p
                  className={`text-base font-bold ${
                    totalProfit === 0
                      ? "text-gray-500"
                      : totalProfit > 0
                        ? "text-red-600"
                        : "text-blue-600"
                  }`}
                >
                  {totalProfit === 0 ? "" : totalProfit > 0 ? "+" : ""}
                  {totalProfit.toLocaleString()}원
                </p>
                <p
                  className={`text-xs font-medium ${
                    totalProfit === 0
                      ? "text-gray-500"
                      : totalProfit > 0
                        ? "text-red-600"
                        : "text-blue-600"
                  }`}
                >
                  {totalProfitRate === 0 ? "" : totalProfitRate > 0 ? "+" : ""}
                  {totalProfitRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("stocks")}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              activeTab === "stocks"
                ? "bg-emerald-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            투자 종목
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
              activeTab === "history"
                ? "bg-emerald-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            거래내역
          </button>
        </div>

        {/* Filter Toggle - 투자 종목 탭에서만 표시 */}
        {activeTab === "stocks" && (
          <>
            <div className="mb-4 bg-yfl-canvas rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyHoldings}
                    onChange={(e) => setShowOnlyHoldings(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    내가 가진 주식
                  </span>
                  {showOnlyHoldings && (
                    <span className="text-xs text-gray-500">
                      ({holdingStocks.length}개)
                    </span>
                  )}
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyNews}
                    onChange={(e) => setShowOnlyNews(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    ⚡ 오늘 주목할 주식
                  </span>
                  {showOnlyNews && (
                    <span className="text-xs text-gray-500">
                      ({newsStocks.length}개)
                    </span>
                  )}
                </label>
              </div>
              {/* 두 필터 동시 사용 안내 */}
              {showOnlyHoldings && showOnlyNews && (
                <div className="pt-2 border-t border-yfl-divider">
                  <p className="text-xs text-emerald-700 flex items-center gap-1">
                    <span>✓</span>
                    <span>
                      내가 가진 주식 중 오늘 뉴스가 있는 종목만 표시 중
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Day별 안내 배너 */}
            {currentDay === 1 ? (
              <InfoBanner
                icon="🎉"
                title="첫날입니다!"
                description="뉴스를 읽고 주식을 사보세요. 내일 결과를 확인할 수 있어요!"
              />
            ) : (
              currentDay >= 2 &&
              holdingStocks.length > 0 && (
                <InfoBanner
                  icon="💡"
                  title="투자 팁!"
                  description="현금이 부족한가요? 내가 가진 주식을 체크해보세요! 오늘 뉴스를 읽고 불안한 종목은 정리하고, 유망한 주식에 투자해보세요!"
                />
              )
            )}
          </>
        )}

        {stocksError && <LoadError onRetry={() => refetchStocks()} retrying={fetchingStocks} hasData />}
        <RefreshStatus active={isRefreshing} />
        {activeTab === "history" && historyError && transactions.length > 0 && <LoadError onRetry={() => refetchHistory()} retrying={fetchingHistory} hasData />}
        {/* Transaction History */}
        {activeTab === "history" ? (
          <>
            {/* 안내 메시지 */}
            <InfoBanner
              icon="💡"
              title="수익률 계산 안내"
              description="수익률은 사고 팔기 거래만 반영됩니다. 지원금은 초기 자본이므로 수익률 계산에서 제외됩니다."
            />

            {historyError && transactions.length === 0 ? (
              <LoadError onRetry={() => refetchHistory()} retrying={fetchingHistory} hasData={transactions.length > 0} />
            ) : isLoadingHistory ? (
              <TransactionListSkeleton />
            ) : transactions.length === 0 ? (
              <EmptyState
                icon={<Receipt className="h-16 w-16" />}
                title="아직 거래 내역이 없어요"
                description="첫 거래를 시작해보세요! 투자 종목 탭에서 주식을 선택하면 거래할 수 있습니다."
              />
            ) : (
              <div className="space-y-4">
                {(() => {
                  // Day별로 그룹화
                  const txByDay: Record<number, typeof transactions> =
                    transactions.reduce(
                      (acc: Record<number, typeof transactions>, tx) => {
                        if (!acc[tx.day]) {
                          acc[tx.day] = [];
                        }
                        acc[tx.day]!.push(tx);
                        return acc;
                      },
                      {}
                    );

                  // 각 Day 내에서 지원금을 맨 아래, 나머지는 시간순으로 정렬
                  Object.keys(txByDay).forEach((day) => {
                    const dayNum = Number(day);
                    if (txByDay[dayNum]) {
                      txByDay[dayNum].sort((a, b) => {
                        // 지원금을 맨 아래로
                        if (a.subType === "benefit" && b.subType !== "benefit")
                          return 1;
                        if (a.subType !== "benefit" && b.subType === "benefit")
                          return -1;
                        // 같은 타입이면 최신순
                        return (
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                        );
                      });
                    }
                  });

                  const sortedDays = Object.keys(txByDay)
                    .map(Number)
                    .sort((a, b) => b - a); // 최신 Day 먼저

                  return sortedDays.map((day) => (
                    <div key={day} className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-full">
                          Day {day}
                        </span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>
                      {txByDay[day]?.map((tx) => {
                        const isMoneyIn = tx.type === "deposit";
                        const isBenefit = tx.subType === "benefit";
                        const totalAmount = isBenefit
                          ? parseFloat(tx.price)
                          : parseFloat(tx.price) * tx.quantity;

                        // 현재 Day의 지원금인지 확인
                        const isNew = isBenefit && tx.day === currentDay;

                        return (
                          <div
                            key={tx.id}
                            className={`rounded-lg p-4 shadow hover:shadow-md transition-shadow border-l-4 ${
                              isBenefit
                                ? "bg-yfl-canvas border-gray-300"
                                : "bg-white border-yfl-divider"
                            }`}
                            style={{
                              borderLeftColor: isBenefit
                                ? "#9ca3af"
                                : isMoneyIn
                                  ? "#10b981"
                                  : "#ef4444",
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {isNew && (
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded animate-pulse">
                                      NEW
                                    </span>
                                  )}
                                  <span
                                    className={`text-xs ${
                                      isBenefit
                                        ? "text-gray-500"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {isBenefit
                                      ? "지원금"
                                      : tx.subType === "buy"
                                        ? "구매"
                                        : "판매"}
                                  </span>
                                  {isBenefit && (
                                    <span className="ml-auto px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded font-medium">
                                      수익률 계산 제외
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`font-bold mb-1 ${
                                    isBenefit
                                      ? "text-gray-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {tx.stockName || "지원금"}
                                </p>
                                {!isBenefit && (
                                  <p className="text-sm text-gray-600">
                                    {tx.quantity}주 • 주당{" "}
                                    {parseFloat(tx.price).toLocaleString()}원
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="flex items-center justify-end gap-1 mb-1">
                                  <span
                                    className={`text-2xl font-bold ${
                                      isBenefit
                                        ? "text-gray-500"
                                        : isMoneyIn
                                          ? "text-green-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {isMoneyIn ? "+" : "-"}
                                    {totalAmount.toLocaleString()}
                                  </span>
                                  <span
                                    className={`text-sm ${
                                      isBenefit
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    원
                                  </span>
                                </div>
                                <div className="flex items-center justify-end gap-1">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      isBenefit
                                        ? "bg-gray-400"
                                        : isMoneyIn
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs ${
                                      isBenefit
                                        ? "text-gray-500"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {isMoneyIn ? "입금" : "출금"}
                                  </span>
                                </div>
                                <p
                                  className={`text-xs mt-2 ${
                                    isBenefit
                                      ? "text-gray-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {new Date(tx.createdAt).toLocaleDateString(
                                    "ko-KR",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>
            )}
          </>
        ) : isLoadingStocks ? (
          <StockListSkeleton />
        ) : displayStocks.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart className="h-16 w-16" />}
            title={
              showOnlyHoldings && showOnlyNews
                ? "조건에 맞는 주식이 없어요"
                : showOnlyHoldings
                  ? "아직 산 주식이 없어요"
                  : showOnlyNews
                    ? "오늘 주목할 주식이 없어요"
                    : "투자 가능한 주식이 없어요"
            }
            description={
              showOnlyHoldings && showOnlyNews
                ? "내가 가진 주식 중 오늘 뉴스가 있는 종목이 없어요."
                : showOnlyHoldings
                  ? "아직 투자한 주식이 없습니다. 주식을 사서 포트폴리오를 만들어보세요!"
                  : showOnlyNews
                    ? "오늘은 뉴스가 발표된 주식이 없습니다. 내일을 기대해주세요!"
                    : "관리자가 주식을 등록하면 여기에 표시됩니다."
            }
          />
        ) : (
          <div id="stock-list" className="space-y-3">
            {displayStocks.map((stock, index) => {
              const profitLoss =
                (stock.currentPrice - stock.averagePurchasePrice) *
                stock.holdingQuantity;
              const profitLossRate =
                stock.averagePurchasePrice > 0
                  ? (profitLoss /
                      (stock.averagePurchasePrice * stock.holdingQuantity)) *
                    100
                  : 0;
              const isHolding = stock.holdingQuantity > 0;

              return (
                <div
                  key={stock.id}
                  id={index === 0 ? "first-stock-card" : undefined}
                  onClick={() => !isLastDay && setSelectedStock(stock)}
                  className={`bg-white rounded-3xl p-5 shadow-sm transition-all duration-200 border border-yfl-divider relative group ${
                    isLastDay 
                      ? "cursor-not-allowed" 
                      : "hover:shadow-lg hover:border-emerald-200 cursor-pointer"
                  }`}
                >
                  {/* 마지막 Day 호버 가이드 */}
                  {isLastDay && (
                    <div className="absolute inset-0 bg-gray-900/80 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <div className="text-center px-6">
                        <p className="text-white font-bold text-sm mb-1">
                          🔒 거래 종료
                        </p>
                        <p className="text-gray-300 text-xs">
                          마지막 Day는 매수/매도가 불가능해요
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">
                          {stock.name}
                        </h3>
                        {isHolding && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-md">
                            보유중
                          </span>
                        )}
                        {stock.newsCount > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewsStock({
                                id: stock.id,
                                name: stock.name,
                              });
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 active:scale-95 transition-all"
                          >
                            <span>뉴스</span>
                            <span className="text-emerald-500">›</span>
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {COUNTRY_NAMES[stock.marketCountryCode] ||
                          stock.marketCountryCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium text-gray-900">
                        {stock.currentPrice.toLocaleString()}원
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          stock.changeRate === 0
                            ? "text-gray-400"
                            : stock.changeRate > 0
                              ? "text-red-600"
                              : "text-blue-600"
                        }`}
                      >
                        <span className="text-xs opacity-70 mr-1">오늘</span>
                        {stock.changeRate > 0 ? "+" : ""}
                        {stock.changeRate.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Holdings Info */}
                  {isHolding && (
                    <div className="mt-3 pt-3 border-t border-yfl-divider">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-gray-900">
                            {stock.holdingQuantity}주
                          </span>
                          <span className="text-gray-400 mx-1.5">·</span>
                          <span className="text-xs">
                            평균 {stock.averagePurchasePrice.toLocaleString()}원
                          </span>
                        </div>
                        {profitLoss !== 0 && (
                          <div
                            className={`text-sm font-medium ${
                              profitLoss > 0 ? "text-red-600" : "text-blue-600"
                            }`}
                          >
                            <span className="text-xs opacity-70 mr-1">
                              내 수익
                            </span>
                            {profitLoss > 0 ? "+" : ""}
                            {profitLoss.toLocaleString()}원
                            <span className="text-xs ml-1 opacity-70">
                              ({profitLossRate > 0 ? "+" : ""}
                              {profitLossRate.toFixed(1)}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Trade Bottom Sheet */}
        <TradeBottomSheet
          stock={selectedStock}
          balance={balance}
          currentDay={currentDay}
          onClose={() => setSelectedStock(null)}
          onTradeSuccess={handleTradeSuccess}
        />

        {/* Stock News Sheet */}
        {newsStock && (
          <StockNewsSheet
            stockId={newsStock.id}
            stockName={newsStock.name}
            isOpen={!!newsStock}
            onClose={() => setNewsStock(null)}
          />
        )}
      </div>
    </div>
  );
}
