"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PATH_LABELS: Record<string, string> = {
  dashboard: "대시보드",
  classes: "클래스 관리",
  clients: "고객사 관리",
  "stock-management": "주식 관리",
  "game-management": "게임 관리",
  "finance-sim": "재무 시뮬레이션",
  "seed-data": "시드 데이터",
};

function getPageTitle(pathname: string): { title: string; parent?: string } {
  const segments = pathname.replace("/protected/", "").split("/").filter(Boolean);

  if (segments.length === 0) return { title: "홈" };

  const root = segments[0] ?? "";
  const label = PATH_LABELS[root] ?? root;

  if (segments.length === 1) {
    return { title: label };
  }

  if (root === "classes") {
    return { title: "클래스 상세", parent: "클래스 관리" };
  }

  if (root === "finance-sim") {
    if (segments.length === 2) {
      return { title: "수업 결과", parent: "재무 시뮬레이션" };
    }
    if (segments.length >= 3) {
      return { title: "학생 리포트", parent: "재무 시뮬레이션" };
    }
  }

  return { title: label };
}

export function SiteHeader() {
  const pathname = usePathname();
  const { title, parent } = getPageTitle(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <nav className="flex items-center gap-1.5 text-sm">
          {parent && (
            <>
              <span className="text-muted-foreground">{parent}</span>
              <span className="text-muted-foreground/50">/</span>
            </>
          )}
          <span className={parent ? "font-medium text-foreground" : "text-muted-foreground"}>
            {title}
          </span>
        </nav>
      </div>
    </header>
  );
}
