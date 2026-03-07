"use client";

import {
  IconCalculator,
  IconChartLine,
  IconDashboard,
  IconFileAi,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers,
} from "@tabler/icons-react";
import { UserButton } from "@stackframe/stack";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "공통",
    items: [
      {
        title: "Dashboard",
        url: "protected/dashboard",
        icon: IconDashboard,
      },
      {
        title: "고객사 관리",
        url: "protected/clients",
        icon: IconListDetails,
      },
      {
        title: "클래스 관리",
        url: "protected/classes",
        icon: IconUsers,
      },
    ],
  },
  {
    label: "주식 투자 게임",
    items: [
      {
        title: "주식 관리",
        url: "protected/stock-management",
        icon: IconChartLine,
      },
      {
        title: "게임 관리",
        url: "protected/game-management",
        icon: IconFileAi,
      },
    ],
  },
  {
    label: "재무 시뮬레이션",
    items: [
      {
        title: "시뮬레이션 관리",
        url: "protected/finance-sim",
        icon: IconCalculator,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/protected/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">유스핀랩</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
