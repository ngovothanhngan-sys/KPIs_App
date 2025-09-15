"use client"

import type React from "react"

import type { User, UserRole } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Target, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface DashboardStatsProps {
  user: User
}

interface StatCard {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon: React.ComponentType<{ className?: string }>
  description?: string
  progress?: number
}

const getStatsForRole = (role: UserRole): StatCard[] => {
  switch (role) {
    case "HR":
      return [
        {
          title: "Total Employees",
          value: 245,
          change: "+12",
          trend: "up",
          icon: Target,
          description: "Active employees in KPI system",
        },
        {
          title: "KPI Completion Rate",
          value: "87%",
          change: "+5%",
          trend: "up",
          icon: CheckCircle,
          progress: 87,
        },
        {
          title: "Pending Approvals",
          value: 23,
          change: "-8",
          trend: "down",
          icon: Clock,
          description: "Across all approval levels",
        },
        {
          title: "Overdue Submissions",
          value: 7,
          change: "+2",
          trend: "up",
          icon: AlertTriangle,
          description: "Require immediate attention",
        },
      ]

    case "ADMIN":
      return [
        {
          title: "System Users",
          value: 245,
          change: "+3",
          trend: "up",
          icon: Target,
          description: "Active system users",
        },
        {
          title: "Active Cycles",
          value: 2,
          trend: "neutral",
          icon: CheckCircle,
          description: "Currently running KPI cycles",
        },
        {
          title: "System Health",
          value: "99.8%",
          trend: "up",
          icon: TrendingUp,
          description: "System uptime this month",
        },
        {
          title: "Data Integrity",
          value: "100%",
          trend: "neutral",
          icon: CheckCircle,
          description: "No data issues detected",
        },
      ]

    case "STAFF":
      return [
        {
          title: "My KPIs",
          value: 4,
          trend: "neutral",
          icon: Target,
          description: "Active KPIs this cycle",
        },
        {
          title: "Completion Rate",
          value: "75%",
          change: "+10%",
          trend: "up",
          icon: CheckCircle,
          progress: 75,
        },
        {
          title: "Pending Actions",
          value: 2,
          trend: "neutral",
          icon: Clock,
          description: "Items requiring your attention",
        },
        {
          title: "Average Score",
          value: "4.2",
          change: "+0.3",
          trend: "up",
          icon: TrendingUp,
          description: "Based on completed KPIs",
        },
      ]

    case "LINE_MANAGER":
      return [
        {
          title: "Team Members",
          value: 8,
          trend: "neutral",
          icon: Target,
          description: "Direct reports",
        },
        {
          title: "Pending Approvals",
          value: 5,
          change: "-2",
          trend: "down",
          icon: Clock,
          description: "Level 1 approvals needed",
        },
        {
          title: "Team Performance",
          value: "4.1",
          change: "+0.2",
          trend: "up",
          icon: TrendingUp,
          description: "Average team score",
        },
        {
          title: "On-Track KPIs",
          value: "82%",
          change: "+5%",
          trend: "up",
          icon: CheckCircle,
          progress: 82,
        },
      ]

    case "HEAD_OF_DEPT":
      return [
        {
          title: "Department Size",
          value: 45,
          change: "+3",
          trend: "up",
          icon: Target,
          description: "Total department members",
        },
        {
          title: "Pending Approvals",
          value: 12,
          change: "-5",
          trend: "down",
          icon: Clock,
          description: "Level 2 approvals needed",
        },
        {
          title: "Dept Performance",
          value: "4.0",
          change: "+0.1",
          trend: "up",
          icon: TrendingUp,
          description: "Department average score",
        },
        {
          title: "Budget Efficiency",
          value: "94%",
          change: "+2%",
          trend: "up",
          icon: CheckCircle,
          progress: 94,
        },
      ]

    case "BOD":
      return [
        {
          title: "Company Performance",
          value: "4.1",
          change: "+0.2",
          trend: "up",
          icon: TrendingUp,
          description: "Overall company score",
        },
        {
          title: "Strategic KPIs",
          value: 15,
          trend: "neutral",
          icon: Target,
          description: "Board-level KPIs",
        },
        {
          title: "Final Approvals",
          value: 8,
          change: "-3",
          trend: "down",
          icon: Clock,
          description: "Level 3 approvals needed",
        },
        {
          title: "Goal Achievement",
          value: "89%",
          change: "+7%",
          trend: "up",
          icon: CheckCircle,
          progress: 89,
        },
      ]

    default:
      return []
  }
}

export function DashboardStats({ user }: DashboardStatsProps) {
  const stats = getStatsForRole(user.role)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <Badge
                    variant={stat.trend === "up" ? "default" : stat.trend === "down" ? "secondary" : "outline"}
                    className="ml-2"
                  >
                    {stat.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                    {stat.trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </Badge>
                )}
              </div>
              {stat.description && <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>}
              {stat.progress !== undefined && (
                <div className="mt-3">
                  <Progress value={stat.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
