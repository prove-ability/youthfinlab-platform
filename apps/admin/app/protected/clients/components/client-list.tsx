"use client";
import { LoadingState, LoadError, RefreshStatus } from "@repo/ui/async-state";

import "../../list-refinement.css";

import { deleteClientAction } from "@/actions/clientActions";
import { useState } from "react";
import { type Client } from "@/types/client";
import { type Manager } from "@/types/manager";
import { CreateClientModal } from "@/components/dialog/create-client-modal";
import { Button } from "@repo/ui";
import { AddManagerForm } from "./add-manager-form";
import { ManagerListItem } from "./manager-list-item";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients } from "@/actions/clientActions";

// page.tsx에서 내려준 타입 (Client와 Manager 배열을 포함)
type ClientWithManagers = Client & {
  managers: Manager[];
};

export function ClientList() {
  const queryClient = useQueryClient();
  const { data, isLoading, error, isFetching, refetch } = useQuery<ClientWithManagers[]>({
    queryKey: ["clients", "list"],
    queryFn: async () => {
      const res = await getClients();
      if (!res.success || !("data" in res)) throw new Error("고객사 조회 실패");
      return res.data as ClientWithManagers[];
    },
  });
  const clients = data ?? [];
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);

  const toggleManagers = (clientId: string) => {
    setSelectedClientId(selectedClientId === clientId ? null : clientId);
  };

  const handleManagerAdded = (clientId: string, newManager: Manager) => {
    queryClient.setQueryData<ClientWithManagers[]>(["clients", "list"], (prev) => {
      const arr = prev ?? [];
      return arr.map((client) =>
        client.id === clientId
          ? { ...client, managers: [...client.managers, newManager] }
          : client
      );
    });
    // 캐시 무효화로 서버 최신화 동기화
    queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
  };

  const handleManagerDeleted = (managerId: string) => {
    queryClient.setQueryData<ClientWithManagers[]>(["clients", "list"], (prev) => {
      const arr = prev ?? [];
      return arr.map((client) =>
        client.managers.some((m) => m.id === managerId)
          ? { ...client, managers: client.managers.filter((m) => m.id !== managerId) }
          : client
      );
    });
    // 캐시 무효화로 서버 최신화 동기화
    queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
  };

  const handleClientCreated = (newClient: ClientWithManagers) => {
    queryClient.setQueryData<ClientWithManagers[]>(["clients", "list"], (prev) => {
      const arr = prev ?? [];
      return [newClient, ...arr];
    });
    // 캐시 무효화로 서버 최신화 동기화
    queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
  };

  const handleClientDelete = async (clientId: string, clientName: string) => {
    if (
      !confirm(
        `${clientName} 고객사를 삭제하시겠습니까?\n\n주의: 해당 고객사의 모든 매니저 정보도 함께 삭제됩니다.`
      )
    ) {
      return;
    }

    setDeletingClientId(clientId);
    try {
      const result = await deleteClientAction(clientId);
      if (result.success) {
        alert(result.message);
        queryClient.setQueryData<ClientWithManagers[]>(["clients", "list"], (prev) => {
          const arr = prev ?? [];
          return arr.filter((client) => client.id !== clientId);
        });
        // 삭제된 클라이언트가 현재 선택된 클라이언트라면 선택 해제
        if (selectedClientId === clientId) {
          setSelectedClientId(null);
        }
        // 캐시 무효화로 서버 최신화 동기화
        queryClient.invalidateQueries({ queryKey: ["clients", "list"] });
      } else {
        alert("삭제 실패: " + result.message);
      }
    } catch (error) {
      console.error("삭제 중 오류가 발생했습니다.", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeletingClientId(null);
    }
  };

  if (isLoading && !data) return <LoadingState label="고객사 목록을 불러오는 중…" />;
  if (error && !data) return <LoadError onRetry={() => refetch()} retrying={isFetching} />;

  return (
    <div className="yfl-client-list yfl-client-refined space-y-4">
      {error ? <LoadError onRetry={() => refetch()} retrying={isFetching} hasData /> : <RefreshStatus active={isFetching} />}
      <div className="yfl-list-toolbar">
        <p>고객사 <strong>{clients.length}</strong>곳</p>
        <Button
          onClick={() => setIsCreateClientModalOpen(true)}
          className="h-9 px-4 text-sm"
        >
          + 고객사 추가
        </Button>
      </div>
      <CreateClientModal
        isOpen={isCreateClientModalOpen}
        setIsOpen={setIsCreateClientModalOpen}
        onClientCreated={handleClientCreated}
      />
      {clients.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-gray-50">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">등록된 고객사가 없습니다</p>
          <p className="text-xs text-gray-400">위의 버튼을 눌러 고객사를 추가하세요.</p>
        </div>
      )}
      {clients.map((client) => {
        const isOpen = selectedClientId === client.id;
        return (
          <div key={client.id} className="yfl-client-record">
            {/* 고객사 헤더 */}
            <div
              className="yfl-client-heading flex items-center justify-between gap-3"
            >
              <button type="button" aria-expanded={isOpen} aria-controls={`managers-${client.id}`} onClick={() => toggleManagers(client.id)} className="yfl-client-toggle flex items-center gap-3 text-left">
                <span className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </span>
                <span>
                  <span className="yfl-client-name block font-semibold text-gray-900">{client.name}</span>
                  <span className="block text-xs text-gray-400 mt-0.5">
                    매니저 {client.managers.length}명
                  </span>
                </span>
              </button>
              <div className="yfl-client-controls">
                <details className="yfl-secondary-actions">
                  <summary aria-label={`${client.name} 고객사 관리`}>관리</summary>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClientDelete(client.id, client.name);
                  }}
                  disabled={deletingClientId === client.id}
                  className="text-xs text-red-500 hover:bg-red-50 h-7 px-2.5"
                  variant="ghost"
                >
                  {deletingClientId === client.id ? "삭제 중..." : "삭제"}
                </Button>
                </details>
                <button type="button" onClick={() => toggleManagers(client.id)} aria-label={`${client.name} 매니저 ${isOpen ? "접기" : "보기"}`} aria-expanded={isOpen} className={`w-6 h-6 rounded-md flex items-center justify-center text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 매니저 목록 (펼쳐진 경우) */}
            {isOpen && (
              <div id={`managers-${client.id}`} className="yfl-client-details">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    담당 매니저
                    <span className="ml-1.5 text-xs font-normal text-gray-400">
                      ({client.managers.length}명)
                    </span>
                  </h4>
                </div>
                {client.managers.length > 0 ? (
                  <ul className="space-y-2 mb-4">
                    {client.managers.map((manager) => (
                      <ManagerListItem
                        key={manager.id}
                        manager={manager}
                        handleManagerDeleted={handleManagerDeleted}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 mb-4 py-2">
                    등록된 매니저가 없습니다.
                  </p>
                )}
                <details className="yfl-manager-add">
                  <summary>매니저 추가</summary>
                <AddManagerForm
                  clientId={client.id}
                  onManagerAdded={(manager) =>
                    handleManagerAdded(client.id, manager)
                  }
                />
                </details>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
