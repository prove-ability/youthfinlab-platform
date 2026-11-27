"use client";
import { LoadingState, LoadError, RefreshStatus } from "@repo/ui/async-state";

import { useState, useMemo, useEffect, useRef } from "react";
import "./game-management.css";

import { Button } from "@/components/ui/button";
import { MARKET_FLAGS } from "@/lib/market-constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  updateClassCurrentDay,
  incrementDayAndPayAllowance,
} from "@/actions/classActions";
import { DaySelectionModal } from "./components/DaySelectionModal";
import { getGameManagementData } from "@/actions/gameActions";
import GameDayManagement from "@/components/game/GameDayManagement";
import PriceManagement from "@/components/game/PriceManagement";
import { Stock, ClassWithRelations } from "@/types";
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
  const { data, isLoading, isError, isFetching, isPlaceholderData, refetch } = useQuery({
    queryKey: ["game-management", { classId: selectedClass, day: selectedDay }],
    queryFn: () =>
      getGameManagementData({
        selectedClassId: selectedClass || undefined,
        selectedDay: selectedDay,
      }),
    placeholderData: (previous) => previous,
    staleTime: 30_000, // 30초 캐시
  });

  const classes = useMemo(() => data?.classes || ([] as ClassWithRelations[]), [data?.classes]);
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
      const firstClientId = classes[0]?.client?.id;
      if (firstClientId) {
        setSelectedClientId(firstClientId);
        const firstClassOfClient = classes.find(
          (c) => c.client?.id === firstClientId
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

  if (isLoading) return <LoadingState label="게임 관리 데이터를 불러오는 중…" />;
  if (isError && !data) return <LoadError onRetry={() => refetch()} retrying={isFetching} />;

  const uniqueClients = Array.from(
    new Set(classes.map((c) => c.client?.id).filter(Boolean))
  ).map((clientId) => {
    const classWithClient = classes.find((c) => c.client?.id === clientId);
    return classWithClient?.client;
  }).filter((client): client is NonNullable<ClassWithRelations["client"]> => client != null);

  const classesOfSelectedClient = classes.filter(
    (c) => c.client?.id === selectedClientId
  );

  return (
    <div className="yfl-game-workspace">
      <header className="yfl-game-heading">
        <h1>게임 관리</h1>
        <p>수업 진행을 조정하고, 종목·뉴스·가격을 관리하세요.</p>
      </header>
      {!isFetching && classes.length === 0 && <p>등록된 클래스가 없습니다. 클래스 관리에서 수업을 추가해 주세요.</p>}
      {/* 클래스 선택 */}
      <div className="yfl-game-filters">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="game-client" className="text-sm font-medium">고객사</label>
          <select
            id="game-client"
            disabled={isDayOperationLoading || isFetching || isError}
            value={selectedClientId}
            onChange={(e) => {
              const newClientId = e.target.value;
              setSelectedClientId(newClientId);
              if (newClientId) {
                const classesOfClient = classes.filter(
                  (c) => c.client?.id === newClientId
                );
                const firstClass = classesOfClient[0];
                if (firstClass) {
                  setSelectedClass(firstClass.id);
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
            {uniqueClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {selectedClientId && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="game-class" className="text-sm font-medium">클래스</label>
            <div className="relative">
              <select
                id="game-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDayOperationLoading || isFetching || isError}
              >
                <option value="">클래스를 선택하세요</option>
                {classesOfSelectedClient.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
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

      {selectedClass && !isPlaceholderData && (
        <section className="yfl-game-operation" aria-labelledby="game-progress-title" aria-busy={isDayOperationLoading}>
          <div className="yfl-game-operation-main">
            <div className="yfl-game-current">
              <h2 id="game-progress-title">현재 수업 진행</h2>
              <p className="yfl-game-day"><strong>Day {getCurrentDay()}</strong><span>/ {classes.find((c) => c.id === selectedClass)?.totalDays ?? "—"}</span></p>
              <p className="yfl-game-class-name">{classes.find((c) => c.id === selectedClass)?.name}</p>
            </div>
            <div className="yfl-game-run">
              <div className="yfl-game-run-buttons">
                <Button onClick={handleDayDecrease} variant="outline" size="sm" isLoading={isDayOperationLoading} disabled={isDayOperationLoading || isFetching || isError}>Day −1</Button>
                <Button onClick={handleDayIncrease} size="sm" isLoading={isDayOperationLoading} disabled={isDayOperationLoading || isFetching || isError}>Day +1 · 용돈 지급</Button>
              </div>
              <p>Day +1 실행 시 수업이 진행되고 용돈이 지급됩니다.</p>
              {isDayOperationLoading && <p role="status">진행 상태 업데이트 중…</p>}
            </div>
          </div>
          {gameProgress && (
            <dl className="yfl-game-data-summary" aria-label="등록 데이터 요약">
              <div><dt>최대 Day</dt><dd>{gameProgress.maxDay}</dd></div>
              <div><dt>총 뉴스</dt><dd>{gameProgress.totalNews}<span>개</span></dd></div>
              <div><dt>가격 데이터</dt><dd>{gameProgress.totalPrices}<span>개</span></dd></div>
            </dl>
          )}
        </section>
      )}

      {isPlaceholderData ? <LoadingState label="선택한 수업 정보를 불러오는 중…" /> : isError ? <LoadError onRetry={() => refetch()} retrying={isFetching} hasData /> : <RefreshStatus active={isFetching} />}
      {/* 탭 */}
      {selectedClass && !isPlaceholderData && (
        <Tabs defaultValue="stock-management" className="yfl-game-data w-full">
          <div className="yfl-game-data-heading">
            <h2>게임 데이터</h2>
            <div className="yfl-game-view-day">
              <span>조회 기준 <strong>Day {selectedDay}</strong></span>
              <Button onClick={handleDaySelection} variant="outline" size="sm" disabled={isDayOperationLoading || isFetching || isError}>조회 Day 변경</Button>
            </div>
          </div>
          <TabsList className="yfl-game-tabs" aria-label="게임 데이터 종류">
            <TabsTrigger value="stock-management">종목 목록</TabsTrigger>
            <TabsTrigger value="game-day-management">Day 뉴스 관리</TabsTrigger>
            <TabsTrigger value="price-management">가격 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="stock-management">
            <section className="yfl-game-stocks" aria-labelledby="game-stocks-title">
              <div className="yfl-game-stocks-heading">
                <h3 id="game-stocks-title">사용 중인 종목 <span>{stocks.length}</span></h3>
                <p>종목 추가·수정은 주식 관리 메뉴에서 할 수 있습니다.</p>
              </div>
              {stocks.length === 0 ? (
                <p className="yfl-game-empty">등록된 주식 종목이 없습니다.</p>
              ) : (
                <ul className="yfl-game-stock-list">
                  {stocks.map((stock: Stock) => (
                    <li key={stock.id}>
                      <span className="yfl-game-stock-name">{stock.name}</span>
                      <span className="yfl-game-stock-sector">{stock.industrySector || "업종 미등록"}</span>
                      <span className="yfl-game-stock-market">{MARKET_FLAGS[stock.marketCountryCode] ?? "🌐"} {stock.marketCountryCode}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
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
