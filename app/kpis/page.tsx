"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Target, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface KPI {
  id: string
  title: string
  target: number
  actual: number
  unit: string
  weight: number
  status: "draft" | "pending" | "approved" | "in_progress" | "completed"
  dueDate: Date
  progress: number
}

const mockKPIs: KPI[] = [
  {
    id: "1",
    title: "Reduce Internal NCR Cases",
    target: 5,
    actual: 3,
    unit: "cases",
    weight: 25,
    status: "in_progress",
    dueDate: new Date(2024, 11, 31),
    progress: 75,
  },
  {
    id: "2",
    title: "Customer Satisfaction Score",
    target: 4.5,
    actual: 4.2,
    unit: "score",
    weight: 30,
    status: "in_progress",
    dueDate: new Date(2024, 11, 31),
    progress: 85,
  },
  {
    id: "3",
    title: "Process Improvement Projects",
    target: 3,
    actual: 2,
    unit: "projects",
    weight: 20,
    status: "in_progress",
    dueDate: new Date(2024, 11, 31),
    progress: 67,
  },
]

export default function KPIsPage() {
  const [activeTab, setActiveTab] = useState("current")
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in_progress":
        return "secondary"
      case "pending":
        return "outline"
      case "draft":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in_progress":
        return <TrendingUp className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">My KPIs</h1>
            <p className="text-muted-foreground mt-1">Track and manage your Key Performance Indicators</p>
          </div>
          <Button onClick={() => router.push("/kpis/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create KPI
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="current">Current Cycle</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="grid gap-4">
              {mockKPIs.map((kpi) => (
                <Card key={kpi.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{kpi.title}</CardTitle>
                        <CardDescription>
                          Target: {kpi.target} {kpi.unit} • Weight: {kpi.weight}%
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(kpi.status) as any} className="flex items-center gap-1">
                        {getStatusIcon(kpi.status)}
                        {kpi.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{kpi.progress}%</span>
                      </div>
                      <Progress value={kpi.progress} className="h-2" />

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Current</span>
                          <p className="font-medium">
                            {kpi.actual} {kpi.unit}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Target</span>
                          <p className="font-medium">
                            {kpi.target} {kpi.unit}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Due Date</span>
                          <p className="font-medium">{kpi.dueDate.toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          Update Progress
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
