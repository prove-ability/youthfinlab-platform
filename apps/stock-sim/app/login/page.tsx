"use client";

import { BrandIntro } from "@repo/ui/brand-intro";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { Label, Button, Input } from "@repo/ui";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        // 로그인 성공 시 setup 페이지로 리다이렉트
        // setup 페이지에서 필요 여부를 확인하고 자동으로 메인으로 이동
        router.push("/setup");
        router.refresh();
      }
    } catch (err) {
      // 예상치 못한 에러만 여기서 처리
      console.error("Login error:", err);
      setError("로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="yfl-entry">
      <div className="yfl-entry-inner">
        <BrandIntro title="모의 투자 게임" description="가상 돈으로 주식을 사고팔며 투자 판단을 연습하세요." />
        <form action={handleSubmit} className="space-y-4" aria-label="로그인 폼">
          <div className="yfl-entry-card space-y-4">
            <div>
              <h2 className="font-bold">반가워요!</h2>
              <p className="text-sm">수업 코드, 아이디, 비밀번호를 입력해주세요</p>
            </div>
            <div>
              <Label htmlFor="classCode" className="text-sm font-medium text-gray-700">
                수업 코드
              </Label>
              <Input
                id="classCode"
                name="classCode"
                type="text"
                required
                placeholder="수업 코드를 입력해주세요"
                className="mt-1.5 text-base! rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 uppercase"
                disabled={loading}
                aria-describedby={error ? "login-error" : undefined}
                maxLength={6}
              />
            </div>

            <div>
              <Label htmlFor="loginId" className="text-sm font-medium text-gray-700">
                아이디
              </Label>
              <Input
                id="loginId"
                name="loginId"
                type="text"
                required
                autoComplete="username"
                placeholder="아이디를 입력해주세요"
                className="mt-1.5 text-base! rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                disabled={loading}
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                비밀번호
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력해주세요"
                  className="h-11! pr-12 text-base! rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={loading}
                  aria-describedby={error ? "login-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-gray-400 hover:text-emerald-600 focus-visible:outline-2 focus-visible:outline-emerald-600 transition-colors"
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 p-3 border border-red-100" role="alert" id="login-error">
                <p className="text-sm text-red-900 font-medium">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-xl py-3 font-semibold text-white transition-colors" 
              disabled={loading}
            >
              {loading ? "로그인하는 중이에요..." : "로그인하기"}
            </Button>
          </div>
        </form>

        {/* 하단 안내 */}
        <p className="yfl-entry-note">
          교육 담당자에게 받은 계정 정보로 로그인하세요
        </p>
      </div>
    </div>
  );
}
