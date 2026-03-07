"use client";

import { useState, useMemo, useEffect, useRef } from "react";

const MARKET_FLAGS: Record<string, string> = {
  KR: "🇰🇷",
  US: "🇺🇸",
  JP: "🇯🇵",
  CN: "🇨🇳",
};
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  updateClassCurrentDay,
  incrementDayAndPayAllowance,
} from "@/actions/classActions";
import { DaySelectionModal } from "./components/DaySelectionModal";
import { getGameManagementData } from "@/actions/gameActions";
import GameDayManagement from "@/components/game/GameDayManagement";
import PriceManagement from "@/components/game/PriceManagement";
import { Stock } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function GameManagementPage() {
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [dayAdjustmentModal, setDayAdjustmentModal] = useState({
    isOpen: false,
    newDay: 1,
  });
  const [isDayOperationLoading, setIsDayOperationLoading] = useState(false);
  const isInitialized = useRef(false);

  // 단일 쿼리로 모든 데이터 조회
  const { data, isLoading } = useQuery({
    queryKey: ["game-management", { classId: selectedClass, day: selectedDay }],
    queryFn: () =>
      getGameManagementData({
        selectedClassId: selectedClass || undefined,
        selectedDay: selectedDay,
      }),
    staleTime: 30_000, // 30초 캐시
  });

  const classes = useMemo(() => data?.classes || [], [data?.classes]);
  const stocks = useMemo(() => data?.stocks || [], [data?.stocks]);
  const gameProgress = useMemo(
    () => data?.gameProgress || null,
    [data?.gameProgress]
  );
  const prices = useMemo(() => data?.prices || [], [data?.prices]);

  // 초기 선택 설정 (한 번만 실행)
  useEffect(() => {
    if (classes.length > 0 && !isInitialized.current) {
      isInitialized.current = true;
      const firstClientId = (classes[0] as any)?.client?.id;
      if (firstClientId) {
        setSelectedClientId(firstClientId);
        const firstClassOfClient = classes.find(
          (c) => (c as any)?.client?.id === firstClientId
        );
        setSelectedClass(firstClassOfClient?.id || classes[0]?.id || "");
      } else {
        setSelectedClass(classes[0]?.id || "");
      }
    }
  }, [classes]);

  const getCurrentDay = () => {
    const selectedClassData = classes.find((c) => c.id === selectedClass);
    return selectedClassData?.currentDay || 1;
  };

  const handleDayDecrease = async () => {
    if (!selectedClass || isDayOperationLoading) return;

    const currentDay = getCurrentDay();
    const newDay = Math.max(1, currentDay - 1);
    if (newDay === currentDay) return;

    setIsDayOperationLoading(true);
    try {
      await updateClassCurrentDay(selectedClass, newDay);
      await queryClient.invalidateQueries({ queryKey: ["game-management"] });
      alert(`현재 Day가 ${newDay}로 업데이트되었습니다.`);
    } catch (error) {
      console.error("Day 감소 실패:", error);
      alert("Day 감소에 실패했습니다.");
    } finally {
      setIsDayOperationLoading(false);
    }
  };

  const handleDayIncrease = async () => {
    if (!selectedClass || isDayOperationLoading) return;

    const currentDay = getCurrentDay();
    const selectedClassData = classes.find((c) => c.id === selectedClass);
    const totalDays = selectedClassData?.totalDays;

    if (!totalDays) {
      alert("클래스의 최대 Day가 설정되지 않았습니다.");
      return;
    }

    if (currentDay >= totalDays) {
      alert(`최대 Day는 ${totalDays}입니다.`);
      return;
    }

    const newDay = currentDay + 1;

    setIsDayOperationLoading(true);
    try {
      await incrementDayAndPayAllowance(selectedClass);
      await queryClient.invalidateQueries({ queryKey: ["game-management"] });
      alert(`Day ${newDay}로 진행되었으며, 용돈이 지급되었습니다.`);
    } catch (error) {
      console.error("Day 증가 실패:", error);
      alert("Day 증가에 실패했습니다.");
    } finally {
      setIsDayOperationLoading(false);
    }
  };

  const handleDaySelection = () => {
    setDayAdjustmentModal({ isOpen: true, newDay: selectedDay });
  };

  const confirmDaySelection = () => {
    const newDay = dayAdjustmentModal.newDay;
    const selectedClassData = classes.find((c) => c.id === selectedClass);
    const totalDays = selectedClassData?.totalDays;

    if (!totalDays) {
      alert("클래스의 최대 Day가 설정되지 않았습니다.");
      return;
    }

    if (newDay < 1 || newDay > totalDays) {
      alert(`Day는 1부터 ${totalDays} 사이여야 합니다.`);
      return;
    }

    setSelectedDay(newDay);
    setDayAdjustmentModal({ ...dayAdjustmentModal, isOpen: false });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">게임 관리 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const uniqueClients = Array.from(
    new Set(classes.map((c: any) => c.client?.id).filter(Boolean))
  ).map((clientId) => {
    const classWithClient = classes.find((c: any) => c.client?.id === clientId);
    return (classWithClient as any)?.client;
  });

  const classesOfSelectedClient = classes.filter(
    (c: any) => c.client?.id === selectedClientId
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <CardTitle>게임 관리</CardTitle>
          <CardDescription>
            주식 게임의 종목, Day별 뉴스, 가격을 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 클래스 선택 */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">고객사 선택</label>
              <select
                value={selectedClientId}
                onChange={(e) => {
                  const newClientId = e.target.value;
                  setSelectedClientId(newClientId);
                  if (newClientId) {
                    const classesOfClient = classes.filter(
                      (c: any) => c.client?.id === newClientId
                    );
                    if (classesOfClient.length > 0) {
                      setSelectedClass(classesOfClient[0].id);
                    } else {
                      setSelectedClass("");
                    }
                  } else {
                    setSelectedClass("");
                  }
                }}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">고객사를 선택하세요</option>
                {uniqueClients.map((client: any) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedClientId && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">클래스 선택</label>
                <div className="relative">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isDayOperationLoading}
                  >
                    <option value="">클래스를 선택하세요</option>
                    {classesOfSelectedClient.map((cls: any) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} (현재 Day: {cls.currentDay})
                      </option>
                    ))}
                  </select>
                  {isDayOperationLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>
                {isDayOperationLoading && (
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full" />
                    Day 업데이트 중... 잠시만 기다려주세요
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 게임 진행 상황 */}
          {selectedClass && gameProgress && (
            <div className={`mb-6 rounded-xl border bg-blue-50 border-blue-200 p-4 transition-opacity ${isDayOperationLoading ? "opacity-60" : ""}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-blue-800">게임 진행 상황</p>
                {isDayOperationLoading && (
                  <span className="text-xs text-blue-600 flex items-center gap-1.5">
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full" />
                    업데이트 중...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">최대 Day</p>
                  <p className="text-2xl font-bold text-blue-600">{gameProgress.maxDay}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">총 뉴스</p>
                  <p className="text-2xl font-bold text-blue-600">{gameProgress.totalNews}<span className="text-sm font-normal ml-0.5">개</span></p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">가격 데이터</p>
                  <p className="text-2xl font-bold text-blue-600">{gameProgress.totalPrices}<span className="text-sm font-normal ml-0.5">개</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Day 조정 버튼 */}
          {selectedClass && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 border-r pr-2 mr-1">
                <Button
                  onClick={handleDayDecrease}
                  variant="outline"
                  size="sm"
                  isLoading={isDayOperationLoading}
                  disabled={isDayOperationLoading}
                >
                  Day −1
                </Button>
                <Button
                  onClick={handleDayIncrease}
                  size="sm"
                  isLoading={isDayOperationLoading}
                  disabled={isDayOperationLoading}
                >
                  Day +1 · 용돈 지급
                </Button>
              </div>
              <Button
                onClick={handleDaySelection}
                variant="secondary"
                size="sm"
                disabled={isDayOperationLoading}
              >
                조회 Day 선택
              </Button>
              {isDayOperationLoading && (
                <span className="text-xs text-blue-600 flex items-center gap-1.5 ml-1">
                  <span className="animate-spin inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full" />
                  처리 중...
                </span>
              )}
            </div>
          )}

          {/* 탭 */}
          {selectedClass && (
            <Tabs defaultValue="stock-management" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stock-management">종목 목록</TabsTrigger>
                <TabsTrigger value="game-day-management">Day 뉴스 관리</TabsTrigger>
                <TabsTrigger value="price-management">가격 관리</TabsTrigger>
              </TabsList>

              <TabsContent value="stock-management">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">이 게임에 사용 중인 종목</CardTitle>
                    <CardDescription>
                      종목 추가·수정은 주식 관리 메뉴에서 할 수 있습니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stocks.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8 text-sm">
                          등록된 주식 종목이 없습니다.
                        </p>
                      ) : (
                        stocks.map((stock: Stock) => (
                          <div
                            key={stock.id}
                            className="flex items-center gap-3 px-4 py-3 border rounded-xl bg-gray-50/60"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900">{stock.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {stock.industrySector && <span className="mr-2">{stock.industrySector}</span>}
                                <span>{MARKET_FLAGS[stock.marketCountryCode] ?? "🌐"} {stock.marketCountryCode}</span>
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="game-day-management">
                <GameDayManagement
                  selectedClass={selectedClass}
                  selectedDay={selectedDay}
                  stocks={stocks}
                  totalDays={gameProgress?.maxDay || 100}
                  onRefresh={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["game-management"],
                    })
                  }
                />
              </TabsContent>

              <TabsContent value="price-management">
                <PriceManagement
                  selectedClass={selectedClass}
                  selectedDay={selectedDay}
                  stocks={stocks}
                  prices={prices}
                  maxDay={gameProgress?.maxDay || 0}
                  onRefresh={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["game-management"],
                    })
                  }
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Day 선택 모달 */}
      <DaySelectionModal
        isOpen={dayAdjustmentModal.isOpen}
        currentDay={dayAdjustmentModal.newDay}
        maxDay={gameProgress?.maxDay || 100}
        onClose={() =>
          setDayAdjustmentModal({ ...dayAdjustmentModal, isOpen: false })
        }
        onConfirm={confirmDaySelection}
        onDayChange={(day: number) =>
          setDayAdjustmentModal({ ...dayAdjustmentModal, newDay: day })
        }
      />
    </div>
  );
}
