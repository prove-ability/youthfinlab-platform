"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { verifyQRToken, createQRGuestSession } from "@/actions/qr-auth";

function QRLoginContent() {
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "verified" | "error">(
    "verifying"
  );
  const [error, setError] = useState<string | null>(null);
  const [classInfo, setClassInfo] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [urlParams] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return {
        token: params.get("token"),
        classId: params.get("classId"),
      };
    }
    return { token: null, classId: null };
  });

  useEffect(() => {
    const { token, classId } = urlParams;

    if (!token || !classId) {
      setStatus("error");
      setError("잘못된 QR 코드입니다.");
      return;
    }

    verifyQRToken(token, classId).then((result) => {
      if (result.success) {
        setStatus("verified");
        setClassInfo({ id: result.classId, name: result.className });
      } else {
        setStatus("error");
        switch (result.reason) {
          case "invalid_token":
            setError("유효하지 않은 QR 코드입니다.");
            break;
          case "expired_token":
            setError(
              "만료된 QR 코드입니다. 강사님께 새로운 QR 코드를 요청하세요."
            );
            break;
          case "class_not_active":
            setError("이 수업은 현재 진행 중이 아닙니다.");
            break;
          case "invalid_class":
            setError("수업을 찾을 수 없습니다.");
            break;
          default:
            setError("알 수 없는 오류가 발생했습니다.");
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    if (!classInfo) {
      setError("수업 정보를 찾을 수 없습니다.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createQRGuestSession(classInfo.id, nickname.trim());

      if (result.success) {
        router.push("/simulation/profile");
      } else {
        setError(result.error || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "verifying") {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-forest-700 mx-auto"></div>
          <p className="text-base text-gray-600">QR 코드 확인 중...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-dvh flex-col">
        <div className="bg-forest-700 px-6 pt-16 pb-12 text-center">
          <div className="text-5xl mb-3">&#x274C;</div>
          <h1 className="text-xl font-bold text-white mb-1">접속 실패</h1>
          <p className="text-sm text-red-300">{error}</p>
        </div>

        <div className="flex-1 px-6 -mt-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs">
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              강사님께 새로운 QR 코드를 요청하거나,
              <br />
              계정 로그인 방식을 이용해주세요.
            </p>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="w-full mt-4 py-3.5 bg-forest-700 hover:bg-forest-800 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="bg-forest-700 px-6 pt-16 pb-12 text-center">
        <div className="text-5xl mb-3">&#x2705;</div>
        <h1 className="text-xl font-bold text-white mb-1">환영합니다!</h1>
        <p className="text-sm text-white/70">
          <span className="font-semibold text-forest-200">
            {classInfo?.name}
          </span>{" "}
          수업에 접속하셨습니다
        </p>
      </div>

      <div className="flex-1 px-6 -mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-xs">
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              닉네임을 입력해주세요
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 김철수"
              required
              maxLength={20}
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent disabled:bg-gray-100 transition-shadow"
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              시뮬레이션에서 사용할 닉네임을 입력하세요 (최대 20자)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !nickname.trim()}
            className="w-full py-3.5 bg-forest-700 hover:bg-forest-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors"
          >
            {isSubmitting ? "접속 중..." : "시뮬레이션 시작하기"}
          </button>
        </form>

        <div className="bg-forest-50 border border-forest-100 rounded-xl p-4 mt-4">
          <p className="text-xs text-forest-800">
            <strong>팁:</strong> 닉네임은 수업 내에서 다른 학생들과 중복될 수
            없습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function QRLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center px-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-forest-700 mx-auto"></div>
            <p className="text-base text-gray-600">페이지 로딩 중...</p>
          </div>
        </div>
      }
    >
      <QRLoginContent />
    </Suspense>
  );
}
