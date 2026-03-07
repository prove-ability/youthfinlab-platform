"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { deleteClass, updateClassStatus } from "@/actions/classActions";
import { CreateUserModal } from "./create-user-modal";
import { useRouter } from "next/navigation";
import { Class, Manager, Client } from "@/types";

interface ClassWithRelations extends Class {
  client: Client | null;
  manager: Manager | null;
}

interface ClassListItemProps {
  classItem: ClassWithRelations;
  onClassUpdated: () => void;
  onEditClass: (classItem: ClassWithRelations) => void;
}

export function ClassListItem({
  classItem,
  onClassUpdated,
  onEditClass,
}: ClassListItemProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const handleStatusChange = async () => {
    const currentStatus = classItem.status || "setting";

    let confirmMessage = "";
    let newStatus: "active" | "ended" = "active";

    if (currentStatus === "setting") {
      confirmMessage = "클래스를 '진행 중' 상태로 변경하시겠습니까?";
      newStatus = "active";
    } else if (currentStatus === "active") {
      confirmMessage =
        "클래스를 '종료' 상태로 변경하시겠습니까?\n종료된 클래스는 학생들이 접속할 수 없습니다.";
      newStatus = "ended";
    } else {
      alert("이미 종료된 클래스는 상태를 변경할 수 없습니다.");
      return;
    }

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const result = await updateClassStatus(classItem.id, newStatus);
      if (result.success) {
        alert(result.message);
        onClassUpdated();
      } else {
        alert(result.error || "상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating class status:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteClass = async (classId: string, className: string) => {
    if (
      !confirm(
        `"${className}" 수업을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.\n해당 수업에 속한 학생(guests), 뉴스, 주식 가격 정보도 함께 삭제됩니다.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteClass(classId);
      if ("error" in result && result.error) {
        alert("삭제 중 오류가 발생했습니다.");
      } else if ("success" in result && !result.success) {
        alert(result.message || "삭제 중 오류가 발생했습니다.");
      } else {
        onClassUpdated();
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const statusConfig = {
    ended: { label: "종료", className: "bg-gray-100 text-gray-700" },
    active: { label: "진행 중", className: "bg-green-100 text-green-700" },
    setting: { label: "설정 중", className: "bg-yellow-100 text-yellow-700" },
  };
  const status = statusConfig[classItem.status as keyof typeof statusConfig] ?? statusConfig.setting;

  return (
    <div className="border rounded-xl bg-white hover:shadow-md transition-shadow overflow-hidden">
      {/* 카드 헤더 */}
      <div
        className="px-5 pt-5 pb-4 cursor-pointer"
        onClick={() => router.push(`/protected/classes/${classItem.id}`)}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-semibold text-gray-900 leading-snug hover:text-blue-600 transition-colors">
            {classItem.name}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              classItem.programType === "finance_sim"
                ? "bg-blue-100 text-blue-700"
                : "bg-emerald-100 text-emerald-700"
            }`}>
              {classItem.programType === "finance_sim" ? "재무" : "주식"}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.className}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* 정보 그리드 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500">
          <div>
            <span className="text-gray-400">고객사</span>
            <p className="font-medium text-gray-700 mt-0.5">
              {classItem.client?.name || "—"}
            </p>
          </div>
          <div>
            <span className="text-gray-400">담당 매니저</span>
            <p className="font-medium text-gray-700 mt-0.5">
              {classItem.manager?.name || "—"}
            </p>
          </div>
          <div>
            <span className="text-gray-400">생성일</span>
            <p className="font-medium text-gray-700 mt-0.5">
              {new Date(classItem.createdAt).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <div>
            <span className="text-gray-400">현재 Day</span>
            <p className="font-medium text-gray-700 mt-0.5">
              {classItem.currentDay || 1}
              {'totalDays' in classItem && classItem.totalDays > 0 && (
                <span className="text-gray-400"> / {classItem.totalDays}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className="border-t bg-gray-50 px-4 py-2.5 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => router.push(`/protected/classes/${classItem.id}`)}
            className="text-xs text-blue-600 hover:bg-blue-50 h-7 px-2.5"
          >
            상세 보기
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsStudentModalOpen(true)}
            className="text-xs text-emerald-600 hover:bg-emerald-50 h-7 px-2.5"
          >
            학생 추가
          </Button>
        </div>
        <div className="flex items-center gap-1">
          {classItem.status !== "ended" && (
            <Button
              onClick={handleStatusChange}
              disabled={isUpdatingStatus}
              className={`text-xs h-7 px-2.5 ${
                classItem.status === "setting"
                  ? "text-green-600 hover:bg-green-50"
                  : "text-orange-600 hover:bg-orange-50"
              }`}
              variant="ghost"
            >
              {isUpdatingStatus
                ? "변경중..."
                : classItem.status === "setting"
                  ? "진행 시작"
                  : "수업 종료"}
            </Button>
          )}
          <Button
            onClick={() => onEditClass(classItem)}
            className="text-xs text-gray-500 hover:bg-gray-100 h-7 px-2.5"
            variant="ghost"
          >
            수정
          </Button>
          <Button
            onClick={() =>
              handleDeleteClass(classItem.id, classItem.name || "수업")
            }
            disabled={isDeleting}
            className="text-xs text-red-500 hover:bg-red-50 h-7 px-2.5"
            variant="ghost"
          >
            {isDeleting ? "삭제중..." : "삭제"}
          </Button>
        </div>
      </div>

      <CreateUserModal
        isOpen={isStudentModalOpen}
        setIsOpen={setIsStudentModalOpen}
        classId={classItem.id}
        clientId={classItem.clientId || ""}
        onUserCreated={onClassUpdated}
      />
    </div>
  );
}
