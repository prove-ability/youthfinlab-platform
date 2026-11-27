"use client";

import { Newspaper } from "lucide-react";
import StockBadge from "./StockBadge";

interface RelatedStock {
  id: string;
  name: string;
}

interface NewsItem {
  id: string;
  title: string | null;
  content: string | null;
  day: number | null;
  relatedStocks: RelatedStock[];
}

interface NewsListProps {
  news: NewsItem[];
  currentDay: number;
}

export default function NewsList({ news, currentDay }: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <Newspaper className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">오늘의 뉴스가 아직 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-yfl-divider">
      {news.map((newsItem, index) => (
        <div
          key={newsItem.id}
          className="py-7"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-7 pt-1 flex items-start justify-center">
              <span className="text-sm font-bold text-[var(--yfl-muted)]">
                {index + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg leading-snug font-semibold text-[var(--yfl-forest)] mb-2">
                {newsItem.title}
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                {newsItem.content}
              </p>
              {newsItem.relatedStocks && newsItem.relatedStocks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {newsItem.relatedStocks.map((stock) => (
                    <StockBadge
                      key={stock.id}
                      stockId={stock.id}
                      stockName={stock.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
