"use client";

import { useState } from "react";
import { getStockInfo } from "@/actions/stocks";

interface StockBadgeProps {
  stockId: string;
  stockName: string;
}

interface StockInfo {
  id: string;
  name: string;
  sector: string;
  remarks: string | null;
  marketCountry: string;
}

// 국가 코드 매핑
const COUNTRY_NAMES: Record<string, string> = {
  KR: "대한민국",
  US: "미국",
  JP: "일본",
  CN: "중국",
  GB: "영국",
  DE: "독일",
  FR: "프랑스",
};

export default function StockBadge({ stockId, stockName }: StockBadgeProps) {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMouseEnter = async () => {
    if (stockInfo) return; // 이미 로드된 경우 재요청 안 함
    
    setIsLoading(true);
    try {
      const info = await getStockInfo([stockId]);
      if (info.length > 0 && info[0]) {
        setStockInfo(info[0]);
      }
    } catch (error) {
      console.error("Failed to fetch stock info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block group">
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
        onMouseEnter={handleMouseEnter}
      >
        📈 {stockName}
      </span>

      {/* 툴팁 */}
      <div className="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl border-2 border-blue-200 p-4 min-w-[280px]">
          {isLoading ? (
            <div className="text-center py-2">
              <div className="inline-block w-4 h-4 border-2 border-[#19391f] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 mt-2">종목 정보를 불러오는 중…</p>
            </div>
          ) : stockInfo ? (
            <div className="space-y-3">
              {/* 헤더 */}
              <div className="border-b pb-2">
                <h4 className="font-bold text-gray-900 text-base">{stockInfo.name}</h4>
              </div>

              {/* 섹터 */}
              <div>
                <p className="text-xs text-gray-500 mb-1">섹터</p>
                <p className="text-sm font-semibold text-gray-900">
                  {stockInfo.sector}
                </p>
              </div>

              {/* 시장 국가 */}
              <div>
                <p className="text-xs text-gray-500 mb-1">시장 국가</p>
                <p className="text-sm font-semibold text-gray-900">
                  {COUNTRY_NAMES[stockInfo.marketCountry] || stockInfo.marketCountry}
                </p>
              </div>

              {/* 비고 */}
              {stockInfo.remarks && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-1">비고</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {stockInfo.remarks}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-2">
              정보를 불러올 수 없습니다
            </p>
          )}
        </div>
        {/* 툴팁 화살표 */}
        <div className="absolute left-4 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-200"></div>
      </div>
    </div>
  );
}
