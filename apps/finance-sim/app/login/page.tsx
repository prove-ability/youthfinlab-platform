"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/simulation/profile");
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {/* 상단 그린 헤더 */}
      <div className="bg-forest-700 px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">재무 시뮬레이션</h1>
        <p className="text-sm text-white/60 mt-2">
          나의 재무 상태를 점검하고 미래를 설계해보세요
        </p>
      </div>

      {/* 폼 영역 */}
      <div className="flex-1 px-6 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="classCode"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                수업 코드
              </label>
              <input
                id="classCode"
                name="classCode"
                type="text"
                required
                placeholder="수업 코드를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label
                htmlFor="loginId"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                아이디
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                required
                placeholder="아이디를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-forest-700 text-white font-semibold text-sm hover:bg-forest-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "로그인 중..." : "시작하기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
