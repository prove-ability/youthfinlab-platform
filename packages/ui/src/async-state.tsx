"use client";
import "./async-state.css";

export function LoadingState({
  label = "화면을 불러오는 중…",
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact ? "yfl-async-state yfl-async-compact" : "yfl-async-state"
      }
    >
      <progress className="yfl-loading-progress" aria-label={label} />
      <p role="status">{label}</p>
    </div>
  );
}

export function LoadError({
  onRetry,
  retrying = false,
  hasData = false,
}: {
  onRetry: () => unknown;
  retrying?: boolean;
  hasData?: boolean;
}) {
  return (
    <div className="yfl-load-error">
      <p role="alert">
        {hasData
          ? "최신 정보를 불러오지 못했습니다. 이전 내용을 표시하고 있습니다."
          : "정보를 불러오지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요."}
      </p>
      <button
        type="button"
        onClick={() => {
          if (!retrying) void onRetry();
        }}
        disabled={retrying}
        aria-busy={retrying}
      >
        {retrying ? "다시 불러오는 중…" : "다시 시도"}
      </button>
    </div>
  );
}

export function RefreshStatus({ active }: { active: boolean }) {
  return (
    <p className="yfl-refresh-status" role="status" aria-live="polite">
      {active ? "최신 정보를 불러오는 중…" : ""}
    </p>
  );
}
