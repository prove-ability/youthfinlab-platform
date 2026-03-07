import { ClientList } from "./components/client-list";

export const metadata = { title: "고객사 관리" };

export default function ClientsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">고객사 및 매니저 관리</h1>
          <p className="text-sm text-muted-foreground">
            고객사와 담당 매니저 정보를 관리합니다.
          </p>
        </div>
      </div>
      <ClientList />
    </div>
  );
}
