import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-y border-yfl-divider">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-[var(--yfl-forest)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--yfl-muted)] mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
}
