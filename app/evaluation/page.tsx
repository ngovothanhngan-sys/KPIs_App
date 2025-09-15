"use client"

import { useState, useEffect } from "react"
import type { User, KpiDefinition, KpiActual, PerformanceEvaluation } from "@/lib/types"
import { mockAuthService, mockKpiDefinitions } from "@/lib/mockdata"
import { calculateOverallPerformance, validateEvaluation } from "@/lib/evaluation-utils"
import { KpiActualForm } from "@/components/evaluation/kpi-actual-form"
import { EvaluationSummary } from "@/components/evaluation/evaluation-summary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Target, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function EvaluationPage() {
  const [user, setUser] = useState<User | null>(null)
  const [kpiDefinitions, setKpiDefinitions] = useState<KpiDefinition[]>([])
  const [kpiActuals, setKpiActuals] = useState<KpiActual[]>([])
  const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const currentUser = mockAuthService.getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      // Get user's approved KPIs
      const userKpis = mockKpiDefinitions.filter((kpi) => kpi.userId === currentUser.id && kpi.status === "APPROVED")
      setKpiDefinitions(userKpis)

      // Mock existing actuals
      const mockActuals: KpiActual[] = [
        {
          id: "actual-1",
          kpiDefinitionId: "3",
          actualValue: 18,
          percentage: 120,
          score: 5,
          selfComment: "Exceeded target through process optimization and team collaboration.",
          evidenceFiles: [],
          status: "DRAFT",
          submittedAt: new Date(),
        },
      ]
      setKpiActuals(mockActuals)
    }
  }, [])

  const handleSaveActual = (actualData: Partial<KpiActual>) => {
    const existingIndex = kpiActuals.findIndex((a) => a.kpiDefinitionId === actualData.kpiDefinitionId)

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...kpiActuals]
      updated[existingIndex] = { ...updated[existingIndex], ...actualData } as KpiActual
      setKpiActuals(updated)
    } else {
      // Add new
      const newActual: KpiActual = {
        id: `actual-${Date.now()}`,
        ...actualData,
      } as KpiActual
      setKpiActuals([...kpiActuals, newActual])
    }

    setSelectedKpiId(null)
    setActiveTab("overview")
  }

  const handleSubmitEvaluation = () => {
    const validation = validateEvaluation(kpiDefinitions, kpiActuals)
    if (!validation.isValid) {
      alert(`Cannot submit: ${validation.errors.join(", ")}`)
      return
    }

    console.log("Submitting evaluation:", { kpiDefinitions, kpiActuals })
    alert("Evaluation submitted successfully!")
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to access evaluation.</p>
        </div>
      </div>
    )
  }

  const completedCount = kpiActuals.length
  const totalCount = kpiDefinitions.length
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const overallPerformance = calculateOverallPerformance(kpiDefinitions, kpiActuals)
  const mockEvaluation: PerformanceEvaluation = {
    id: "eval-1",
    cycleId: "1",
    userId: user.id,
    kpiActuals,
    ...overallPerformance,
    status: "DRAFT",
  }

  const validation = validateEvaluation(kpiDefinitions, kpiActuals)

  if (selectedKpiId) {
    const selectedKpi = kpiDefinitions.find((k) => k.id === selectedKpiId)
    const existingActual = kpiActuals.find((a) => a.kpiDefinitionId === selectedKpiId)

    if (selectedKpi) {
      return (
        <div className="container mx-auto py-6">
          <KpiActualForm
            kpiDefinition={selectedKpi}
            initialActual={existingActual}
            onSave={handleSaveActual}
            onCancel={() => setSelectedKpiId(null)}
          />
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Evaluation</h1>
          <p className="text-muted-foreground">Enter your actual achievements and review your performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {completedCount}/{totalCount} Completed
          </Badge>
          {validation.isValid && completedCount === totalCount && (
            <Button onClick={handleSubmitEvaluation}>Submit Evaluation</Button>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Evaluation Progress
          </CardTitle>
          <CardDescription>Complete all KPI evaluations to submit for review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount} of {totalCount} KPIs completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />

            {!validation.isValid && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{validation.errors.join(", ")}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="kpis">My KPIs ({totalCount})</TabsTrigger>
          {completedCount > 0 && <TabsTrigger value="summary">Performance Summary</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total KPIs</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCount}</div>
                <p className="text-xs text-muted-foreground">Approved for this cycle</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}</div>
                <p className="text-xs text-muted-foreground">Actuals entered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCount - completedCount}</div>
                <p className="text-xs text-muted-foreground">Still to complete</p>
              </CardContent>
            </Card>
          </div>

          {completedCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Current Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{overallPerformance.overallPercentage.toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">Achievement Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{overallPerformance.overallScore.toFixed(1)}/5</div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="kpis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {kpiDefinitions.map((kpi) => {
              const actual = kpiActuals.find((a) => a.kpiDefinitionId === kpi.id)
              const isCompleted = !!actual

              return (
                <Card key={kpi.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{kpi.title}</CardTitle>
                      <Badge variant={isCompleted ? "default" : "outline"}>
                        {isCompleted ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <CardDescription>
                      Target: {kpi.target} {kpi.unit} • Weight: {kpi.weight}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isCompleted && actual && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Actual:</span>
                          <span className="font-medium">
                            {actual.actualValue} {kpi.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Achievement:</span>
                          <span className="font-medium">{actual.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Score:</span>
                          <span className="font-medium">{actual.score}/5</span>
                        </div>
                      </div>
                    )}
                    <Button
                      variant={isCompleted ? "outline" : "default"}
                      className="w-full"
                      onClick={() => setSelectedKpiId(kpi.id)}
                    >
                      {isCompleted ? "Edit Actual" : "Enter Actual"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {completedCount > 0 && (
          <TabsContent value="summary">
            <EvaluationSummary evaluation={mockEvaluation} kpiDefinitions={kpiDefinitions} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
