import { ClassList } from "./components/class-list";

export const metadata = { title: "클래스 관리" };

export default function ClassesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">클래스 관리</h1>
          <p className="text-sm text-muted-foreground">
            수업 클래스를 생성하고 관리합니다.
          </p>
        </div>
      </div>
      <ClassList />
    </div>
  );
}
