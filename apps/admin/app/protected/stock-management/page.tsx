"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import StockManagement from "@/components/game/StockManagement";
import { Stock } from "@/types";
import { getStocks } from "@/actions/stockActions";

export default function StockManagementPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const stocksData = await getStocks();
      setStocks(stocksData);
    } catch (error) {
      console.error("주식 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockCreated = (newStock: Stock) => {
    setStocks((prev) => [...prev, newStock]);
  };

  const handleStockUpdated = (updatedStock: Stock) => {
    setStocks((prev) =>
      prev.map((stock) => (stock.id === updatedStock.id ? updatedStock : stock))
    );
  };

  const handleStockDeleted = (deletedStockId: string) => {
    setStocks((prev) => prev.filter((stock) => stock.id !== deletedStockId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">종목 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">주식 관리</h1>
          <p className="text-sm text-muted-foreground">
            게임에서 사용할 주식 종목을 관리합니다 (모든 클래스 공통)
          </p>
        </div>
        <Button onClick={loadStocks} variant="outline" size="sm">새로고침</Button>
      </div>

      <StockManagement
        stocks={stocks}
        onStockCreated={handleStockCreated}
        onStockUpdated={handleStockUpdated}
        onStockDeleted={handleStockDeleted}
      />
    </div>
  );
}
