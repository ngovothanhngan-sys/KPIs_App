"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar, Users, Target, BarChart3 } from "lucide-react"
import { mockCycles } from "@/lib/mockdata"

export default function CyclesPage() {
  const [activeTab, setActiveTab] = useState("active")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "DRAFT":
        return "secondary"
      case "CLOSED":
        return "outline"
      default:
        return "secondary"
    }
  }

  const activeCycles = mockCycles.filter((c) => c.status === "ACTIVE")
  const draftCycles = mockCycles.filter((c) => c.status === "DRAFT")
  const closedCycles = mockCycles.filter((c) => c.status === "CLOSED")

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-balance">Performance Cycles</h1>
            <p className="text-muted-foreground mt-1">Manage KPI performance cycles and evaluation periods</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Cycle
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active ({activeCycles.length})</TabsTrigger>
            <TabsTrigger value="draft">Draft ({draftCycles.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedCycles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4">
              {activeCycles.map((cycle) => (
                <Card key={cycle.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{cycle.name}</CardTitle>
                        <CardDescription>
                          {cycle.periodStart.toLocaleDateString()} - {cycle.periodEnd.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={getStatusColor(cycle.status) as any}>{cycle.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold">156</p>
                        <p className="text-sm text-muted-foreground">Participants</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                          <Target className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold">89%</p>
                        <p className="text-sm text-muted-foreground">Goals Set</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-2 mx-auto">
                          <BarChart3 className="h-6 w-6 text-orange-600" />
                        </div>
                        <p className="text-2xl font-bold">67%</p>
                        <p className="text-sm text-muted-foreground">Progress</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-2 mx-auto">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold">45</p>
                        <p className="text-sm text-muted-foreground">Days Left</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Manage Participants
                      </Button>
                      <Button variant="outline" size="sm">
                        Export Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="grid gap-4">
              {draftCycles.length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No draft cycles</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                draftCycles.map((cycle) => (
                  <Card key={cycle.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{cycle.name}</CardTitle>
                          <CardDescription>
                            {cycle.periodStart.toLocaleDateString()} - {cycle.periodEnd.toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">DRAFT</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button size="sm">Activate</Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            <div className="grid gap-4">
              {closedCycles.map((cycle) => (
                <Card key={cycle.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{cycle.name}</CardTitle>
                        <CardDescription>
                          {cycle.periodStart.toLocaleDateString()} - {cycle.periodEnd.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">CLOSED</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        Export Data
                      </Button>
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
