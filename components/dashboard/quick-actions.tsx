"use client"

import type React from "react"

import type { User, UserRole } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, CheckSquare, BarChart3, Users, Settings, Calendar, Target } from "lucide-react"

interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  variant?: "default" | "outline" | "secondary"
}

interface QuickActionsProps {
  user: User
}

const getQuickActionsForRole = (role: UserRole): QuickAction[] => {
  switch (role) {
    case "HR":
      return [
        {
          title: "Create KPI Template",
          description: "Design new KPI templates for departments",
          icon: FileText,
          href: "/templates/create",
          variant: "default",
        },
        {
          title: "Open New Cycle",
          description: "Start a new KPI evaluation cycle",
          icon: Calendar,
          href: "/cycles/create",
          variant: "outline",
        },
        {
          title: "View Reports",
          description: "Access comprehensive KPI reports",
          icon: BarChart3,
          href: "/reports",
          variant: "outline",
        },
        {
          title: "Manage Users",
          description: "Add or modify user accounts",
          icon: Users,
          href: "/users",
          variant: "outline",
        },
      ]

    case "ADMIN":
      return [
        {
          title: "System Settings",
          description: "Configure system parameters",
          icon: Settings,
          href: "/settings",
          variant: "default",
        },
        {
          title: "User Management",
          description: "Manage user roles and permissions",
          icon: Users,
          href: "/users",
          variant: "outline",
        },
        {
          title: "Audit Logs",
          description: "Review system activity logs",
          icon: FileText,
          href: "/audit",
          variant: "outline",
        },
        {
          title: "Backup Data",
          description: "Create system backup",
          icon: BarChart3,
          href: "/backup",
          variant: "outline",
        },
      ]

    case "STAFF":
      return [
        {
          title: "Create New KPI",
          description: "Set up your KPIs for this cycle",
          icon: Plus,
          href: "/kpis/create",
          variant: "default",
        },
        {
          title: "Update Progress",
          description: "Log your KPI progress",
          icon: Target,
          href: "/kpis/update",
          variant: "outline",
        },
        {
          title: "Submit Evaluation",
          description: "Submit your self-evaluation",
          icon: CheckSquare,
          href: "/evaluation/submit",
          variant: "outline",
        },
        {
          title: "View My Reports",
          description: "Check your performance reports",
          icon: BarChart3,
          href: "/reports/personal",
          variant: "outline",
        },
      ]

    case "LINE_MANAGER":
      return [
        {
          title: "Review Approvals",
          description: "Approve pending KPIs from your team",
          icon: CheckSquare,
          href: "/approvals",
          variant: "default",
        },
        {
          title: "Team Overview",
          description: "View your team's KPI status",
          icon: Users,
          href: "/team",
          variant: "outline",
        },
        {
          title: "Create Team KPI",
          description: "Set team-level objectives",
          icon: Plus,
          href: "/kpis/team/create",
          variant: "outline",
        },
        {
          title: "Team Reports",
          description: "Generate team performance reports",
          icon: BarChart3,
          href: "/reports/team",
          variant: "outline",
        },
      ]

    case "HEAD_OF_DEPT":
      return [
        {
          title: "Department Approvals",
          description: "Review level 2 approvals",
          icon: CheckSquare,
          href: "/approvals/department",
          variant: "default",
        },
        {
          title: "Department Dashboard",
          description: "View department-wide metrics",
          icon: BarChart3,
          href: "/dashboard/department",
          variant: "outline",
        },
        {
          title: "Strategic Planning",
          description: "Set department strategic KPIs",
          icon: Target,
          href: "/strategy",
          variant: "outline",
        },
        {
          title: "Resource Allocation",
          description: "Manage department resources",
          icon: Users,
          href: "/resources",
          variant: "outline",
        },
      ]

    case "BOD":
      return [
        {
          title: "Final Approvals",
          description: "Review and approve strategic KPIs",
          icon: CheckSquare,
          href: "/approvals/final",
          variant: "default",
        },
        {
          title: "Executive Dashboard",
          description: "View company-wide performance",
          icon: BarChart3,
          href: "/dashboard/executive",
          variant: "outline",
        },
        {
          title: "Strategic Review",
          description: "Review company strategic objectives",
          icon: Target,
          href: "/strategy/review",
          variant: "outline",
        },
        {
          title: "Board Reports",
          description: "Generate executive reports",
          icon: FileText,
          href: "/reports/executive",
          variant: "outline",
        },
      ]

    default:
      return []
  }
}

export function QuickActions({ user }: QuickActionsProps) {
  const actions = getQuickActionsForRole(user.role)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant={action.variant || "outline"}
                className="h-auto p-4 flex flex-col items-start gap-2 text-left"
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
