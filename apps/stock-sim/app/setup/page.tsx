"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateNickname,
  updatePassword,
  checkNeedsSetup,
} from "@/actions/profile";
import { Button, Input, Label } from "@repo/ui";
import { Lock, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<
    "loading" | "nickname" | "password" | "complete"
  >("loading");
  const [nickname, setNickname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNicknameConfirm, setShowNicknameConfirm] = useState(false);

  useEffect(() => {
    checkSetupStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function checkSetupStatus() {
    const result = await checkNeedsSetup();

    if (!result.needsSetup) {
      router.push("/");
      return;
    }

    if (result.needsNickname) {
      setStep("nickname");
    } else if (result.needsPasswordChange) {
      setStep("password");
    }
  }

  async function handleNicknameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // 닉네임 유효성 검사 (영어, 숫자, 한글만 허용)
    const nicknameRegex = /^[a-zA-Z0-9가-힣]+$/;
    if (!nicknameRegex.test(nickname)) {
      setError("닉네임은 영어, 숫자, 한글만 사용할 수 있어요");
      return;
    }

    // 확인 모달 표시
    setShowNicknameConfirm(true);
  }

  async function confirmNicknameSubmit() {
    setShowNicknameConfirm(false);
    setLoading(true);

    // 닉네임 저장 (중복 체크 포함)
    const result = await updateNickname(nickname);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // 닉네임 설정 완료 후 비밀번호 변경 필요 여부 확인
    const setupStatus = await checkNeedsSetup();

    if (setupStatus.needsPasswordChange) {
      setStep("password");
      setLoading(false);
    } else {
      setStep("complete");
      setTimeout(() => {
        router.push("/onboarding");
      }, 1500);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    // 초기 설정이므로 빈 문자열 전달 (서버에서 자동 처리)
    const result = await updatePassword("", newPassword);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setStep("complete");
    setTimeout(() => {
      router.push("/onboarding");
    }, 1500);
  }

  if (step === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19391f] mx-auto"></div>
          <p className="mt-4 text-gray-600">계정 설정을 확인하는 중…</p>
        </div>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">설정 완료!</h2>
          <p className="text-gray-600">이제 시작해볼까요? 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 px-4">
      <div className="w-full max-w-md">
        {/* 진행 상태 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "nickname"
                  ? "bg-[var(--yfl-forest)] text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {step === "nickname" ? "1" : "✓"}
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "password"
                  ? "bg-[var(--yfl-forest)] text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            {step === "nickname" ? "닉네임 설정" : "비밀번호 변경"}
          </p>
        </div>

        {step === "nickname" && (
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                닉네임을 정해볼까요?
              </h1>
              <p className="text-sm text-gray-600 mb-2">
                친구들과 랭킹을 겨룰 때 보여질 이름이에요
              </p>
              <p className="text-xs text-gray-500">
                예시: 투자왕, 주식천재, 돈버는고양이, 재테크왕
              </p>
            </div>

            <form onSubmit={handleNicknameSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  maxLength={20}
                  required
                  disabled={loading}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  영어, 숫자, 한글만 가능 • {nickname.length}/20자
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  개인정보는 피해주세요
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !nickname.trim()}
              >
                {loading ? "설정 중…" : "다음"}
              </Button>
            </form>
          </div>
        )}

        {step === "password" && (
          <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 mb-3">
                <Lock className="h-6 w-6 text-emerald-700" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                비밀번호를 설정해볼까요?
              </h1>
              <p className="text-sm text-gray-600">
                나만 알고 있는 비밀번호를 정해주세요
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  새로운 비밀번호
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="비밀번호 (4자 이상)"
                    minLength={4}
                    required
                    disabled={loading}
                    className="pr-10 rounded-xl border-yfl-divider focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 focus:outline-none transition-colors"
                    aria-label={
                      showNewPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  비밀번호 다시 한번
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="같은 비밀번호를 한 번 더 입력해주세요"
                    required
                    disabled={loading}
                    className="pr-10 rounded-xl border-yfl-divider focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 focus:outline-none transition-colors"
                    aria-label={
                      showConfirmPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-3 border border-red-100">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[var(--yfl-forest)] hover:bg-[var(--yfl-emphasis)] focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-xl py-3 font-semibold text-white transition-colors"
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? "설정하는 중이에요..." : "완료하기"}
              </Button>
            </form>
          </div>
        )}

        {/* 닉네임 확인 모달 */}
        {showNicknameConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  이 닉네임으로 할까요?
                </h3>
                
                <p className="text-sm text-gray-500 mb-6 text-center">
                  한 번 정하면 바꿀 수 없어요
                </p>
                
                <div className="w-full p-5 bg-emerald-50 rounded-2xl mb-6">
                  <p className="text-3xl font-bold text-emerald-700 text-center">
                    {nickname}
                  </p>
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowNicknameConfirm(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    다시 생각할래요
                  </button>
                  <button
                    onClick={confirmNicknameSubmit}
                    className="flex-1 py-3 bg-[var(--yfl-forest)] text-white rounded-xl font-bold hover:bg-[var(--yfl-emphasis)] transition-colors"
                  >
                    좋아요!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
