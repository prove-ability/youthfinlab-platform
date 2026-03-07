import { type Manager } from "@/types/manager";
import { Button } from "@repo/ui";
import { deleteManager } from "@/actions/managerActions";
import { useState } from "react";

interface ManagerListItemProps {
  manager: Manager;
  handleManagerDeleted: (managerId: string) => void;
}

export function ManagerListItem({
  manager,
  handleManagerDeleted,
}: ManagerListItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`${manager.name} 매니저를 삭제하시겠습니까?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteManager(manager.id);
      if (!result.success) {
        alert("삭제 실패: " + result.message);
      } else {
        alert(result.message);
        handleManagerDeleted(manager.id);
      }
    } catch (error) {
      console.error("매니저 삭제 중 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <li className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-3.5 py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{manager.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {manager.mobilePhone && (
              <span className="text-xs text-gray-400">{manager.mobilePhone}</span>
            )}
            {manager.mobilePhone && manager.email && (
              <span className="text-gray-200 text-xs">·</span>
            )}
            {manager.email && (
              <span className="text-xs text-gray-400">{manager.email}</span>
            )}
          </div>
        </div>
      </div>
      <Button
        className="text-xs text-red-400 hover:bg-red-50 h-7 px-2.5 shrink-0"
        variant="ghost"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "삭제 중..." : "삭제"}
      </Button>
    </li>
  );
}
