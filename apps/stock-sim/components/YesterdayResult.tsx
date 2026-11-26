"use client";

interface NewsResult {
  newsTitle: string;
  stockName: string;
  priceChange: number;
  changeRate: number;
}

interface YesterdayResultProps {
  currentDay: number;
  results: NewsResult[];
}

export default function YesterdayResult({
  currentDay,
  results,
}: YesterdayResultProps) {
  // Day 2 미만이거나 결과가 없으면 표시 안 함
  if (currentDay < 2 || results.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-yfl-divider mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">📊 어제의 결과</h3>
        <span className="text-xs text-gray-500">Day {currentDay - 1}</span>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-yfl-canvas rounded-2xl p-4 border border-yfl-divider"
          >
            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
              {result.newsTitle}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                {result.stockName}
              </span>
              <div
                className={`flex items-center gap-1 text-sm font-bold ${
                  result.changeRate >= 0 ? "text-red-600" : "text-blue-600"
                }`}
              >
                <span>{result.changeRate >= 0 ? "↑" : "↓"}</span>
                <span>
                  {result.changeRate >= 0 ? "+" : ""}
                  {result.changeRate.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 링크는 나중에 뉴스 탭으로 연결 */}
    </div>
  );
}
