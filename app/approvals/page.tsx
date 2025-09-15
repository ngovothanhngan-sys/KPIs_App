"use client"

import { useState, useEffect } from "react"
import type { User, KpiDefinition } from "@/lib/types"
import { getPendingApprovalsForUser } from "@/lib/approval-utils"
import { mockAuthService } from "@/lib/mockdata"
import { ApprovalCard } from "@/components/approval/approval-card"
import { ApprovalDialog } from "@/components/approval/approval-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckSquare, Clock, TrendingUp } from "lucide-react"

export default function ApprovalsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [pendingApprovals, setPendingApprovals] = useState<KpiDefinition[]>([])
  const [selectedKpi, setSelectedKpi] = useState<KpiDefinition | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const currentUser = mockAuthService.getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      const approvals = getPendingApprovalsForUser(currentUser.id)
      setPendingApprovals(approvals)
    }
  }, [])

  const handleApprove = (kpiId: string, comment?: string) => {
    console.log("Approving KPI:", kpiId, "Comment:", comment)
    // Here you would typically call your API
    setPendingApprovals((prev) => prev.filter((kpi) => kpi.id !== kpiId))
    alert("KPI approved successfully!")
  }

  const handleReject = (kpiId: string, comment: string) => {
    console.log("Rejecting KPI:", kpiId, "Reason:", comment)
    // Here you would typically call your API
    setPendingApprovals((prev) => prev.filter((kpi) => kpi.id !== kpiId))
    alert("KPI rejected successfully!")
  }

  const handleViewDetails = (kpiId: string) => {
    const kpi = pendingApprovals.find((k) => k.id === kpiId)
    if (kpi) {
      setSelectedKpi(kpi)
      setIsDialogOpen(true)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view approvals.</p>
        </div>
      </div>
    )
  }

  const levelCounts = {
    level1: pendingApprovals.filter((kpi) => kpi.status === "PENDING_LM").length,
    level2: pendingApprovals.filter((kpi) => kpi.status === "PENDING_HOD").length,
    level3: pendingApprovals.filter((kpi) => kpi.status === "PENDING_BOD").length,
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground">Review and approve KPIs that require your attention</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pendingApprovals.length} Pending
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level 1 (Line Manager)</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{levelCounts.level1}</div>
            <p className="text-xs text-muted-foreground">Pending your approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level 2 (Head of Dept)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{levelCounts.level2}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level 3 (BOD)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{levelCounts.level3}</div>
            <p className="text-xs text-muted-foreground">Final approval needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Approval Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Pending ({pendingApprovals.length})</TabsTrigger>
          <TabsTrigger value="level1">Level 1 ({levelCounts.level1})</TabsTrigger>
          <TabsTrigger value="level2">Level 2 ({levelCounts.level2})</TabsTrigger>
          <TabsTrigger value="level3">Level 3 ({levelCounts.level3})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Approvals</h3>
                <p className="text-muted-foreground text-center">
                  All KPIs have been processed. Check back later for new submissions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingApprovals.map((kpi) => (
                <ApprovalCard
                  key={kpi.id}
                  kpi={kpi}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="level1" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingApprovals
              .filter((kpi) => kpi.status === "PENDING_LM")
              .map((kpi) => (
                <ApprovalCard
                  key={kpi.id}
                  kpi={kpi}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="level2" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingApprovals
              .filter((kpi) => kpi.status === "PENDING_HOD")
              .map((kpi) => (
                <ApprovalCard
                  key={kpi.id}
                  kpi={kpi}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="level3" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingApprovals
              .filter((kpi) => kpi.status === "PENDING_BOD")
              .map((kpi) => (
                <ApprovalCard
                  key={kpi.id}
                  kpi={kpi}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <ApprovalDialog
        kpi={selectedKpi}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedKpi(null)
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
