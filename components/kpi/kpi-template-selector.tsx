"use client"

import { useState } from "react"
import type { KpiTemplate } from "@/lib/kpi-utils"
import { mockKpiTemplates } from "@/lib/mockdata"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Users, Calendar } from "lucide-react"

interface KpiTemplateSelectorProps {
  onSelectTemplate: (template: KpiTemplate) => void
  onCreateFromScratch: () => void
}

export function KpiTemplateSelector({ onSelectTemplate, onCreateFromScratch }: KpiTemplateSelectorProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  const departments = Array.from(new Set(mockKpiTemplates.map((t) => t.department)))
  const filteredTemplates =
    selectedDepartment === "all"
      ? mockKpiTemplates
      : mockKpiTemplates.filter((t) => t.department === selectedDepartment)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create KPIs</h2>
          <p className="text-muted-foreground">Choose a template or start from scratch</p>
        </div>
        <Button onClick={onCreateFromScratch} variant="outline">
          Create from Scratch
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by Department:</label>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileText className="h-5 w-5 text-primary" />
                <Badge variant="secondary">{template.department}</Badge>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{template.kpiFields.length} KPI fields</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {template.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.kpiFields.slice(0, 3).map((field) => (
                    <Badge key={field.id} variant="outline" className="text-xs">
                      {field.title.length > 20 ? field.title.substring(0, 20) + "..." : field.title}
                    </Badge>
                  ))}
                  {template.kpiFields.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.kpiFields.length - 3} more
                    </Badge>
                  )}
                </div>
                <Button className="w-full mt-4" onClick={() => onSelectTemplate(template)}>
                  Use This Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">No templates available for the selected department.</p>
          <Button onClick={onCreateFromScratch}>Create from Scratch</Button>
        </div>
      )}
    </div>
  )
}
