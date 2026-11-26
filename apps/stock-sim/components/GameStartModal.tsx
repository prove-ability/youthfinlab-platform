"use client";

import { useEffect, useState } from "react";

export default function GameStartModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // localStorage에서 모달을 본 적이 있는지 확인
    const hasSeenModal = localStorage.getItem("hasSeenGameStartModal");
    
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = (dontShowAgain: boolean = false) => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenGameStartModal", "true");
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-slide-up">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            투자 게임 시작!
          </h2>
          <p className="text-sm text-gray-600">
            지원금 200만원으로 주식투자를<br />시작해보세요!
          </p>
        </div>

        <div className="bg-yfl-canvas rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            📖 게임 방법
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">뉴스 읽고 투자 종목 골라보기</p>
                <p className="text-xs text-gray-600">뉴스 탭에서 오늘의 뉴스를 확인해보세요</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">마음에 드는 주식 사보기</p>
                <p className="text-xs text-gray-600">투자 탭에서 분석 후 투자해보세요</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">내일 오전 9시에 결과와 랭킹 확인하기</p>
                <p className="text-xs text-gray-600">주가 변동과 내 순위를 확인해보세요</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleClose(true)}
            className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors"
          >
            시작하기
          </button>
          <button
            onClick={() => handleClose(false)}
            className="w-full text-gray-500 py-2 text-sm font-medium hover:text-gray-700"
          >
            나중에 다시 보기
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
