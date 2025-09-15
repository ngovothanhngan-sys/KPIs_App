"use client"

import { useState, useEffect } from "react"
import type { User, ReportFilter } from "@/lib/types"
import { mockAuthService, mockUsers, mockKpiDefinitions } from "@/lib/mockdata"
import { generateReportData, exportToExcel, getReportPermissions } from "@/lib/reporting-utils"
import { ReportFilters } from "@/components/reports/report-filters"
import { ReportDashboard } from "@/components/reports/report-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Shield } from "lucide-react"

export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [filters, setFilters] = useState<ReportFilter>({})
  const [reportData, setReportData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const currentUser = mockAuthService.getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      // Generate initial report data
      generateReport({})
    }
  }, [])

  const generateReport = async (newFilters: ReportFilter) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock performance evaluations
    const mockEvaluations = [
      {
        id: "eval-1",
        cycleId: "1",
        userId: "3",
        kpiActuals: [
          {
            id: "actual-1",
            kpiDefinitionId: "3",
            actualValue: 18,
            percentage: 120,
            score: 5,
            selfComment: "Exceeded target through process optimization",
            evidenceFiles: [],
            status: "COMPLETED" as const,
            submittedAt: new Date(),
          },
        ],
        overallScore: 4.2,
        overallPercentage: 105,
        totalWeight: 100,
        status: "COMPLETED" as const,
        submittedAt: new Date(),
        completedAt: new Date(),
      },
      {
        id: "eval-2",
        cycleId: "1",
        userId: "4",
        kpiActuals: [
          {
            id: "actual-2",
            kpiDefinitionId: "1",
            actualValue: 10,
            percentage: 83,
            score: 3,
            selfComment: "Met most targets with some challenges",
            evidenceFiles: [],
            status: "COMPLETED" as const,
            submittedAt: new Date(),
          },
        ],
        overallScore: 3.8,
        overallPercentage: 95,
        totalWeight: 100,
        status: "COMPLETED" as const,
        submittedAt: new Date(),
        completedAt: new Date(),
      },
    ]

    const data = generateReportData(mockUsers, mockKpiDefinitions, mockEvaluations, newFilters)
    setReportData(data)
    setIsLoading(false)
  }

  const handleFiltersChange = (newFilters: ReportFilter) => {
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    generateReport(filters)
  }

  const handleResetFilters = () => {
    const emptyFilters = {}
    setFilters(emptyFilters)
    generateReport(emptyFilters)
  }

  const handleExportExcel = () => {
    if (reportData) {
      exportToExcel(reportData, "KPI Performance Report")
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to access reports.</p>
        </div>
      </div>
    )
  }

  const permissions = getReportPermissions(user.role)

  if (!permissions.canViewAll && !permissions.canViewDepartment && !permissions.canViewTeam) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to view organizational reports. You can only view your personal performance data.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Performance Reports
          </h1>
          <p className="text-muted-foreground">Comprehensive analysis and insights into KPI performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{user.role.replace("_", " ")}</Badge>
          {permissions.canViewAll && <Badge variant="default">Full Access</Badge>}
          {permissions.canViewDepartment && !permissions.canViewAll && (
            <Badge variant="secondary">Department Access</Badge>
          )}
          {permissions.canViewTeam && !permissions.canViewDepartment && <Badge variant="secondary">Team Access</Badge>}
        </div>
      </div>

      {/* Access Level Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Access Level
          </CardTitle>
          <CardDescription>Based on your role, you have access to the following data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${permissions.canViewAll ? "bg-green-500" : "bg-gray-300"}`} />
              <span>Organization-wide</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${permissions.canViewDepartment ? "bg-green-500" : "bg-gray-300"}`}
              />
              <span>Department data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${permissions.canViewTeam ? "bg-green-500" : "bg-gray-300"}`} />
              <span>Team data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${permissions.canExport ? "bg-green-500" : "bg-gray-300"}`} />
              <span>Export capability</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Filters */}
      <ReportFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Generating report...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Dashboard */}
      {reportData && !isLoading && (
        <ReportDashboard reportData={reportData} onExportExcel={permissions.canExport ? handleExportExcel : () => {}} />
      )}
    </div>
  )
}
