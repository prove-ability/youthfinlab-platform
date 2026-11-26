"use client";

import { useState, useEffect } from "react";

interface BenefitNotificationBannerProps {
  benefit: {
    amount: number;
    day: number;
    createdAt: Date;
  } | null;
}

export default function BenefitNotificationBanner({
  benefit,
}: BenefitNotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!benefit) return;

    // localStorage에서 확인한 지원금 정보 가져오기
    const confirmedBenefits = JSON.parse(
      localStorage.getItem("confirmedBenefits") || "[]"
    );

    // 이미 확인한 지원금인지 체크 (Day + 시간으로 고유 식별)
    const benefitId = `${benefit.day}-${new Date(benefit.createdAt).getTime()}`;
    const isConfirmed = confirmedBenefits.includes(benefitId);

    if (!isConfirmed) {
      setIsVisible(true);
    }
  }, [benefit]);

  const handleConfirm = () => {
    if (!benefit) return;

    const benefitId = `${benefit.day}-${new Date(benefit.createdAt).getTime()}`;
    const confirmedBenefits = JSON.parse(
      localStorage.getItem("confirmedBenefits") || "[]"
    );
    
    // 확인한 지원금 목록에 추가
    confirmedBenefits.push(benefitId);
    localStorage.setItem("confirmedBenefits", JSON.stringify(confirmedBenefits));
    
    setIsVisible(false);
  };

  // Day 1이거나 benefit이 없거나 보이지 않으면 표시하지 않음
  if (!benefit || !isVisible || benefit.day === 1) return null;

  return (
    <div className="bg-white border border-yfl-divider rounded-3xl p-5 shadow-sm animate-slide-down">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="bg-emerald-50 rounded-full p-2.5 flex-shrink-0">
            <span className="text-xl">💰</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-sm mb-0.5">
              Day {benefit.day} 지원금 지급!
            </h3>
            <p className="text-gray-600 text-xs">
              <span className="font-semibold text-emerald-700 text-base">
                {benefit.amount.toLocaleString()}원
              </span>{" "}
              입금완료
            </p>
          </div>
        </div>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 active:scale-95 transition-all font-bold text-xs flex-shrink-0"
        >
          확인
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
