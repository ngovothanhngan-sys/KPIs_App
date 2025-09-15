"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { AnomalyDetector } from "@/components/ai/anomaly-detector"
import { mockAuthService, getRoleDisplayName } from "@/lib/mockdata"

export default function DashboardPage() {
  const user = mockAuthService.getCurrentUser()

  if (!user) {
    return null
  }

  const mockKpiData = [
    { id: "1", name: "Revenue Growth", actualValue: 12, targetValue: 15 },
    { id: "2", name: "Customer Satisfaction", actualValue: 4.2, targetValue: 4.5 },
    { id: "3", name: "Employee Retention", actualValue: 88, targetValue: 85 },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground mt-1">
            {getRoleDisplayName(user.role)} • {user.email}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your KPIs and track performance across the organization
          </p>
        </div>

        <DashboardStats user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity user={user} />
          <QuickActions user={user} />
        </div>

        <div className="mt-8">
          <AnomalyDetector kpiData={mockKpiData} />
        </div>
      </div>
    </AppLayout>
  )
}
