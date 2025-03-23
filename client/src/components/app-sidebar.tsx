import * as React from "react"
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  ClipboardList,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
      underConstruction: true,
      items: [
        { title: "All Tasks", url: "/tasks" },
        { title: "Today", url: "/tasks/today" },
        { title: "Upcoming", url: "/tasks/upcoming" },
        { title: "Completed", url: "/tasks/completed" },
      ],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
      underConstruction: true,
      items: [
        { title: "Month View", url: "/calendar/month" },
        { title: "Week View", url: "/calendar/week" },
        { title: "Day View", url: "/calendar/day" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      underConstruction: true,
      items: [
        { title: "Account", url: "/settings/account" },
        { title: "Preferences", url: "/settings/preferences" },
        { title: "Notifications", url: "/settings/notifications" },
      ],
    },
  ],
  navSecondary: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <ClipboardList className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Task Manager</span>
                  <span className="truncate text-xs">Organize your work</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects />
        {data.navSecondary.length > 0 && (
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
