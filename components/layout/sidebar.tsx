"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User, UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Target,
  CheckSquare,
  BarChart3,
  Users,
  Settings,
  FileText,
  TrendingUp,
  Calendar,
  LogOut,
} from "lucide-react"

interface SidebarProps {
  user: User
  onLogout: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["HR", "ADMIN", "STAFF", "LINE_MANAGER", "HEAD_OF_DEPT", "BOD"],
  },
  {
    title: "My KPIs",
    href: "/kpis",
    icon: Target,
    roles: ["STAFF", "LINE_MANAGER", "HEAD_OF_DEPT", "BOD"],
  },
  {
    title: "Approvals",
    href: "/approvals",
    icon: CheckSquare,
    roles: ["LINE_MANAGER", "HEAD_OF_DEPT", "BOD"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["HR", "ADMIN", "LINE_MANAGER", "HEAD_OF_DEPT", "BOD"],
  },
  {
    title: "KPI Templates",
    href: "/templates",
    icon: FileText,
    roles: ["HR", "ADMIN"],
  },
  {
    title: "Cycles",
    href: "/cycles",
    icon: Calendar,
    roles: ["HR", "ADMIN"],
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
    roles: ["HR", "ADMIN"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
    roles: ["HR", "ADMIN", "HEAD_OF_DEPT", "BOD"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN"],
  },
]

export function Sidebar({ user, onLogout }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role))

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-primary">VICC KPI</h1>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.role.replace("_", " ")}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent" onClick={onLogout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
