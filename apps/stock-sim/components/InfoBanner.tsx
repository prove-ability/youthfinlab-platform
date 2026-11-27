"use client";

interface InfoBannerProps {
  icon?: string;
  title: string;
  description: string;
  onClose?: () => void;
}

export default function InfoBanner({
  icon = "👆",
  title,
  description,
  onClose,
}: InfoBannerProps) {
  return (
    <div className="bg-[#f3f6f5] border-l-4 border-[var(--yfl-forest)] rounded-r-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--yfl-forest)] mb-1">
            {title}
          </p>
          <p className="text-sm leading-relaxed text-[var(--yfl-muted)]">
            {description}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            type="button"
            aria-label="안내 닫기"
            className="text-[var(--yfl-forest)] text-xl flex-shrink-0 min-w-10 min-h-10"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
