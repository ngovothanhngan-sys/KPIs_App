import type { User, KpiDefinition, PerformanceEvaluation, UserRole } from "./types"
import { mockOrgUnits } from "./mockdata"

export interface ReportFilter {
  cycleId?: string
  orgUnitId?: string
  userId?: string
  department?: string
  dateRange?: {
    start: Date
    end: Date
  }
  scoreRange?: {
    min: number
    max: number
  }
}

export interface ReportData {
  summary: {
    totalEmployees: number
    totalKpis: number
    averageScore: number
    completionRate: number
    onTimeSubmission: number
  }
  departmentBreakdown: {
    department: string
    employeeCount: number
    averageScore: number
    completionRate: number
    topPerformers: number
    needsImprovement: number
  }[]
  individualPerformance: {
    userId: string
    userName: string
    department: string
    role: string
    kpiCount: number
    averageScore: number
    completionRate: number
    status: string
  }[]
  kpiAnalysis: {
    kpiTitle: string
    department: string
    averageAchievement: number
    participantCount: number
    topPerformer: string
    commonChallenges: string[]
  }[]
  trends: {
    month: string
    averageScore: number
    completionRate: number
    submissionRate: number
  }[]
}

export const generateReportData = (
  users: User[],
  kpiDefinitions: KpiDefinition[],
  evaluations: PerformanceEvaluation[],
  filters?: ReportFilter,
): ReportData => {
  // Filter data based on criteria
  let filteredUsers = users
  const filteredKpis = kpiDefinitions
  const filteredEvaluations = evaluations

  if (filters?.orgUnitId) {
    filteredUsers = users.filter((u) => u.orgUnitId === filters.orgUnitId)
  }

  if (filters?.userId) {
    filteredUsers = users.filter((u) => u.id === filters.userId)
  }

  // Generate summary
  const summary = {
    totalEmployees: filteredUsers.length,
    totalKpis: filteredKpis.length,
    averageScore:
      filteredEvaluations.length > 0
        ? filteredEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / filteredEvaluations.length
        : 0,
    completionRate:
      filteredUsers.length > 0
        ? (filteredEvaluations.filter((e) => e.status === "COMPLETED").length / filteredUsers.length) * 100
        : 0,
    onTimeSubmission: 85, // Mock data
  }

  // Department breakdown
  const departments = Array.from(new Set(mockOrgUnits.filter((ou) => ou.type === "DEPARTMENT").map((ou) => ou.name)))
  const departmentBreakdown = departments.map((dept) => {
    const deptUsers = filteredUsers.filter((u) => {
      const orgUnit = mockOrgUnits.find((ou) => ou.id === u.orgUnitId)
      return orgUnit?.name === dept || mockOrgUnits.find((ou) => ou.id === orgUnit?.parentId)?.name === dept
    })

    const deptEvaluations = filteredEvaluations.filter((e) => deptUsers.some((u) => u.id === e.userId))

    return {
      department: dept,
      employeeCount: deptUsers.length,
      averageScore:
        deptEvaluations.length > 0
          ? deptEvaluations.reduce((sum, e) => sum + e.overallScore, 0) / deptEvaluations.length
          : 0,
      completionRate:
        deptUsers.length > 0
          ? (deptEvaluations.filter((e) => e.status === "COMPLETED").length / deptUsers.length) * 100
          : 0,
      topPerformers: deptEvaluations.filter((e) => e.overallScore >= 4.5).length,
      needsImprovement: deptEvaluations.filter((e) => e.overallScore < 3.0).length,
    }
  })

  // Individual performance
  const individualPerformance = filteredUsers.map((user) => {
    const userEvaluation = filteredEvaluations.find((e) => e.userId === user.id)
    const userKpis = filteredKpis.filter((k) => k.userId === user.id)
    const orgUnit = mockOrgUnits.find((ou) => ou.id === user.orgUnitId)
    const department = mockOrgUnits.find((ou) => ou.id === orgUnit?.parentId)?.name || orgUnit?.name || "Unknown"

    return {
      userId: user.id,
      userName: user.name,
      department,
      role: user.role.replace("_", " "),
      kpiCount: userKpis.length,
      averageScore: userEvaluation?.overallScore || 0,
      completionRate: userKpis.length > 0 ? ((userEvaluation?.kpiActuals.length || 0) / userKpis.length) * 100 : 0,
      status: userEvaluation?.status || "NOT_STARTED",
    }
  })

  // KPI Analysis
  const kpiAnalysis = Array.from(new Set(filteredKpis.map((k) => k.title))).map((title) => {
    const kpisWithTitle = filteredKpis.filter((k) => k.title === title)
    const relatedActuals = filteredEvaluations.flatMap((e) =>
      e.kpiActuals.filter((a) => kpisWithTitle.some((k) => k.id === a.kpiDefinitionId)),
    )

    const avgAchievement =
      relatedActuals.length > 0 ? relatedActuals.reduce((sum, a) => sum + a.percentage, 0) / relatedActuals.length : 0

    const topPerformerActual = relatedActuals.reduce(
      (best, current) => (current.percentage > best.percentage ? current : best),
      relatedActuals[0] || { percentage: 0 },
    )

    const topPerformerKpi = kpisWithTitle.find((k) =>
      relatedActuals.some((a) => a.kpiDefinitionId === k.id && a.percentage === topPerformerActual.percentage),
    )
    const topPerformerUser = topPerformerKpi ? filteredUsers.find((u) => u.id === topPerformerKpi.userId) : null

    return {
      kpiTitle: title,
      department: "Multiple", // Could be refined
      averageAchievement: avgAchievement,
      participantCount: relatedActuals.length,
      topPerformer: topPerformerUser?.name || "N/A",
      commonChallenges: ["Resource constraints", "Timeline pressure", "Technical complexity"], // Mock data
    }
  })

  // Trends (mock data for demonstration)
  const trends = [
    { month: "Jan 2025", averageScore: 3.8, completionRate: 85, submissionRate: 92 },
    { month: "Feb 2025", averageScore: 4.0, completionRate: 88, submissionRate: 94 },
    { month: "Mar 2025", averageScore: 4.1, completionRate: 90, submissionRate: 96 },
  ]

  return {
    summary,
    departmentBreakdown,
    individualPerformance,
    kpiAnalysis,
    trends,
  }
}

export const exportToExcel = (reportData: ReportData, reportTitle: string): void => {
  // In a real application, you would use a library like xlsx or exceljs
  // For this demo, we'll create a CSV-like structure and download it

  const csvContent = generateCSVContent(reportData, reportTitle)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${reportTitle.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const generateCSVContent = (reportData: ReportData, reportTitle: string): string => {
  let csv = `${reportTitle}\n`
  csv += `Generated on: ${new Date().toLocaleString()}\n\n`

  // Summary Section
  csv += "SUMMARY\n"
  csv += "Metric,Value\n"
  csv += `Total Employees,${reportData.summary.totalEmployees}\n`
  csv += `Total KPIs,${reportData.summary.totalKpis}\n`
  csv += `Average Score,${reportData.summary.averageScore.toFixed(2)}\n`
  csv += `Completion Rate,${reportData.summary.completionRate.toFixed(1)}%\n`
  csv += `On-time Submission,${reportData.summary.onTimeSubmission}%\n\n`

  // Department Breakdown
  csv += "DEPARTMENT BREAKDOWN\n"
  csv += "Department,Employee Count,Average Score,Completion Rate,Top Performers,Needs Improvement\n"
  reportData.departmentBreakdown.forEach((dept) => {
    csv += `${dept.department},${dept.employeeCount},${dept.averageScore.toFixed(2)},${dept.completionRate.toFixed(1)}%,${dept.topPerformers},${dept.needsImprovement}\n`
  })
  csv += "\n"

  // Individual Performance
  csv += "INDIVIDUAL PERFORMANCE\n"
  csv += "Name,Department,Role,KPI Count,Average Score,Completion Rate,Status\n"
  reportData.individualPerformance.forEach((perf) => {
    csv += `${perf.userName},${perf.department},${perf.role},${perf.kpiCount},${perf.averageScore.toFixed(2)},${perf.completionRate.toFixed(1)}%,${perf.status}\n`
  })
  csv += "\n"

  // KPI Analysis
  csv += "KPI ANALYSIS\n"
  csv += "KPI Title,Department,Average Achievement,Participant Count,Top Performer\n"
  reportData.kpiAnalysis.forEach((kpi) => {
    csv += `${kpi.kpiTitle},${kpi.department},${kpi.averageAchievement.toFixed(1)}%,${kpi.participantCount},${kpi.topPerformer}\n`
  })

  return csv
}

export const getReportPermissions = (userRole: UserRole) => {
  const permissions = {
    canViewAll: false,
    canViewDepartment: false,
    canViewTeam: false,
    canViewPersonal: true,
    canExport: false,
    canViewSalaryData: false,
  }

  switch (userRole) {
    case "HR":
    case "ADMIN":
      permissions.canViewAll = true
      permissions.canViewDepartment = true
      permissions.canViewTeam = true
      permissions.canExport = true
      permissions.canViewSalaryData = true
      break
    case "BOD":
      permissions.canViewAll = true
      permissions.canViewDepartment = true
      permissions.canExport = true
      break
    case "HEAD_OF_DEPT":
      permissions.canViewDepartment = true
      permissions.canViewTeam = true
      permissions.canExport = true
      break
    case "LINE_MANAGER":
      permissions.canViewTeam = true
      permissions.canExport = true
      break
    case "STAFF":
      // Only personal view
      break
  }

  return permissions
}
