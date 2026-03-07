"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Calendar } from "lucide-react";
import { createGameDay, type GameData } from "@/actions/gameActions";
import { Stock, News } from "@/types";
import { getNews, deleteNews } from "@/actions/newsActions";

interface GameDayManagementProps {
  selectedClass: string;
  selectedDay: number;
  totalDays: number | undefined;
  stocks: Stock[];
  onRefresh: () => void;
}

interface NewsInput {
  title: string;
  content: string;
  relatedStockIds: string[];
}

export default function GameDayManagement({
  selectedClass,
  selectedDay,
  totalDays,
  stocks,
  onRefresh,
}: GameDayManagementProps) {
  const queryClient = useQueryClient();
  // 마지막 Day 체크
  const isLastDay = totalDays ? selectedDay === totalDays : false;
  const [newsLoading, setNewsLoading] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [savingNewsIndex, setSavingNewsIndex] = useState<number | null>(null);

  const [newsItems, setNewsItems] = useState<NewsInput[]>([
    { title: "", content: "", relatedStockIds: [] },
  ]);
  const [existingNews, setExistingNews] = useState<News[]>([]);

  // 클래스나 Day가 변경될 때마다 상태 초기화 및 기존 뉴스 로드
  useEffect(() => {
    resetForm();
    loadExistingNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedDay]);

  const loadExistingNews = async () => {
    if (!selectedClass) {
      setExistingNews([]);
      return;
    }

    setNewsLoading(true);
    try {
      const allNews = await getNews();
      // 현재 클래스와 Day에 해당하는 뉴스만 필터링
      const filteredNews = allNews.filter(
        (news) => news.classId === selectedClass && news.day === selectedDay
      );
      setExistingNews(filteredNews);
    } catch (error) {
      console.error("기존 뉴스 로드 실패:", error);
      setExistingNews([]);
    } finally {
      setNewsLoading(false);
    }
  };

  const addNewsItem = () => {
    setNewsItems([
      ...newsItems,
      { title: "", content: "", relatedStockIds: [] },
    ]);
  };

  const removeNewsItem = (index: number) => {
    if (newsItems.length > 1) {
      setNewsItems(newsItems.filter((_, i) => i !== index));
    }
  };

  const updateNewsItem = (
    index: number,
    field: keyof NewsInput,
    value: any
  ) => {
    const updated = [...newsItems];
    const currentItem = updated[index];
    if (currentItem) {
      updated[index] = {
        title: currentItem.title || "",
        content: currentItem.content || "",
        relatedStockIds: currentItem.relatedStockIds || [],
        [field]: value,
      };
      setNewsItems(updated);
    }
  };

  const toggleStockInNews = (newsIndex: number, stockId: string) => {
    const updated = [...newsItems];
    const currentItem = updated[newsIndex];

    if (currentItem) {
      const relatedStocks = currentItem.relatedStockIds;

      if (relatedStocks.includes(stockId)) {
        updated[newsIndex] = {
          ...currentItem,
          relatedStockIds: relatedStocks.filter((id) => id !== stockId),
        };
      } else {
        updated[newsIndex] = {
          ...currentItem,
          relatedStockIds: [...relatedStocks, stockId],
        };
      }

      setNewsItems(updated);
    }
  };

  const resetForm = () => {
    setNewsItems([{ title: "", content: "", relatedStockIds: [] }]);
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm("정말로 이 뉴스를 삭제하시겠습니까?")) {
      return;
    }

    setDeletingNewsId(newsId);
    try {
      await deleteNews(newsId);
      await loadExistingNews();
      onRefresh();
      // invalidate related caches for consistency
      if (selectedClass) {
        queryClient.invalidateQueries({ queryKey: ["game", "progress", selectedClass] });
        queryClient.invalidateQueries({ queryKey: ["game", "prices", { classId: selectedClass, day: selectedDay }] });
      }
      alert("뉴스가 성공적으로 삭제되었습니다!");
    } catch (error) {
      console.error("뉴스 삭제 실패:", error);
      alert("뉴스 삭제에 실패했습니다.");
    } finally {
      setDeletingNewsId(null);
    }
  };

  const handleSaveIndividualNews = async (newsIndex: number) => {
    const news = newsItems[newsIndex];
    if (!selectedClass) {
      alert("클래스를 선택해주세요.");
      return;
    }

    if (!news || !news.title.trim() || !news.content.trim()) {
      alert("뉴스 제목과 내용을 모두 입력해주세요.");
      return;
    }

    setSavingNewsIndex(newsIndex);
    try {
      const gameData: GameData = {
        classId: selectedClass,
        day: selectedDay,
        stocks: [], // 빈 배열로 설정 (주식 가격은 다른 탭에서 관리)
        news: [news],
      };

      await createGameDay(gameData);

      // 해당 뉴스를 목록에서 제거
      const updatedNewsItems = newsItems.filter(
        (_, index) => index !== newsIndex
      );
      setNewsItems(
        updatedNewsItems.length > 0
          ? updatedNewsItems
          : [{ title: "", content: "", relatedStockIds: [] }]
      );

      await loadExistingNews();
      onRefresh();
      // invalidate related caches for consistency
      if (selectedClass) {
        queryClient.invalidateQueries({ queryKey: ["game", "progress", selectedClass] });
        queryClient.invalidateQueries({ queryKey: ["game", "prices", { classId: selectedClass, day: selectedDay }] });
      }
      alert("뉴스가 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("뉴스 저장 실패:", error);
      alert("뉴스 저장에 실패했습니다.");
    } finally {
      setSavingNewsIndex(null);
    }
  };

  if (!selectedClass) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              클래스를 선택해주세요
            </h3>
            <p className="text-muted-foreground">
              먼저 상단에서 클래스를 선택한 후 Day {selectedDay}의 데이터를
              설정할 수 있습니다.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}

      {/* Day별 뉴스 관리 통합 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Day {selectedDay} 종료 후 뉴스 (→ Day {selectedDay + 1} 가격
                영향)
              </CardTitle>
              <CardDescription>
                {isLastDay ? (
                  <span className="inline-flex items-center gap-1.5 text-orange-600 font-medium">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    마지막 Day입니다. 뉴스는 등록할 수 없으며 가격만 설정하세요.
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                    </svg>
                    이 뉴스들은 <strong>다음 거래일(Day {selectedDay + 1})</strong> 주식 가격 변동에 영향을 줍니다
                  </span>
                )}
              </CardDescription>
            </div>
            {!isLastDay && (
              <Button variant="outline" size="sm" onClick={addNewsItem}>
                <Plus className="h-4 w-4 mr-2" />
                뉴스 추가
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {newsLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <span className="animate-spin inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-3" />
                <p className="text-sm text-muted-foreground">뉴스를 불러오는 중...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 기존 뉴스 목록 */}
              {existingNews.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px bg-border flex-1"></div>
                    <span className="text-sm text-muted-foreground px-2">
                      저장된 뉴스
                    </span>
                    <div className="h-px bg-border flex-1"></div>
                  </div>
                  {existingNews.map((news, index) => (
                    <div
                      key={news.id}
                      className="rounded-xl border border-green-200 bg-green-50/40 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-green-100 bg-green-50">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-green-800">저장된 뉴스</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            → Day {selectedDay + 1} 영향
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log("뉴스 수정:", news.id);
                            }}
                            disabled={editingNewsId === news.id || deletingNewsId === news.id}
                            className="h-7 px-2.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            {editingNewsId === news.id ? "수정 중..." : "수정"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNews(news.id)}
                            disabled={editingNewsId === news.id || deletingNewsId === news.id}
                            className="h-7 px-2.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50"
                          >
                            {deletingNewsId === news.id ? "삭제 중..." : "삭제"}
                          </Button>
                        </div>
                      </div>
                      <div className="px-4 py-3 space-y-2.5">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">제목</p>
                          <p className="text-sm font-semibold text-gray-900">{news.title}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">내용</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{news.content}</p>
                        </div>
                        {news.relatedStockIds && news.relatedStockIds.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">관련 종목</p>
                            <div className="flex flex-wrap gap-1">
                              {news.relatedStockIds.map((stockId) => {
                                const stock = stocks.find((s) => s.id === stockId);
                                return stock ? (
                                  <span key={stockId} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {stock.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 새 뉴스 작성 */}
              {!isLastDay && newsItems.length > 0 && (
                <div className="space-y-4">
                  {existingNews.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px bg-border flex-1"></div>
                      <span className="text-sm text-muted-foreground px-2">
                        새 뉴스 작성
                      </span>
                      <div className="h-px bg-border flex-1"></div>
                    </div>
                  )}
                  {newsItems.map((news, index) => (
                    <div key={index} className="rounded-xl border border-blue-200 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-blue-100 bg-blue-50">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-blue-800">새 뉴스 작성</span>
                          <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                            → Day {selectedDay + 1} 영향
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleSaveIndividualNews(index)}
                            disabled={savingNewsIndex === index || !news.title.trim() || !news.content.trim()}
                            className="h-7 px-3 text-xs"
                          >
                            {savingNewsIndex === index ? "저장 중..." : "저장"}
                          </Button>
                          {newsItems.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNewsItem(index)}
                              className="h-7 px-2.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50"
                            >
                              제거
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="px-4 py-3 space-y-3">
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">제목 <span className="text-red-500">*</span></Label>
                          <Input
                            value={news.title}
                            onChange={(e) => updateNewsItem(index, "title", e.target.value)}
                            placeholder="뉴스 제목을 입력하세요"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">내용 <span className="text-red-500">*</span></Label>
                          <Textarea
                            value={news.content}
                            onChange={(e) => updateNewsItem(index, "content", e.target.value)}
                            placeholder="뉴스 내용을 입력하세요"
                            rows={3}
                            className="resize-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-xs font-medium">관련 종목 <span className="text-gray-400 font-normal">(선택)</span></Label>
                          <div className="flex flex-wrap gap-1.5">
                            {stocks.map((stock) => (
                              <Button
                                key={stock.id}
                                variant={news.relatedStockIds.includes(stock.id) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleStockInNews(index, stock.id)}
                                className="h-7 text-xs"
                              >
                                {stock.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 뉴스가 없을 때 안내 메시지 */}
              {existingNews.length === 0 && newsItems.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  {isLastDay ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-orange-600">마지막 Day는 뉴스를 등록할 수 없습니다</p>
                      <p className="text-xs text-gray-400">가격 관리 탭에서 최종 가격만 설정해주세요.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">Day {selectedDay}에 작성된 뉴스가 없습니다</p>
                      <Button variant="outline" size="sm" onClick={addNewsItem}>
                        <Plus className="h-4 w-4 mr-1.5" />첫 번째 뉴스 작성하기
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
