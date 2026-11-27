"use client";

import { BrandIntro } from "@repo/ui/brand-intro";
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
    <div className="yfl-entry">
      <div className="yfl-entry-inner">
        <BrandIntro title="재무 시뮬레이션" description="나의 수입과 지출을 살펴보고 저축과 투자를 비교해 보세요." />
        <form onSubmit={handleSubmit} className="yfl-entry-card space-y-4">
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
              aria-describedby={error ? "login-error" : undefined}
              required
              placeholder="수업 코드를 입력하세요"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow"
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
              autoComplete="username"
              type="text"
              aria-describedby={error ? "login-error" : undefined}
              required
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow"
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
              autoComplete="current-password"
              type="password"
              aria-describedby={error ? "login-error" : undefined}
              required
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-shadow"
            />
          </div>

          {error && (
            <p id="login-error" role="alert" className="text-sm text-red-700 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-forest-700 text-white font-semibold text-sm hover:bg-forest-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "로그인 중…" : "로그인하기"}
          </button>
        </form>
        <p className="yfl-entry-note">교육 담당자에게 받은 계정 정보로 로그인하세요</p>
      </div>
    </div>
  );
}
