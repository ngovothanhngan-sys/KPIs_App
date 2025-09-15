"use client"

import { useState, useEffect } from "react"
import type { KpiType } from "@/lib/types"
import type { KpiTemplate } from "@/lib/kpi-utils"
import { KPI_TYPES, checkSmartCriteria, validateKpiWeights } from "@/lib/kpi-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, AlertTriangle, CheckCircle, Lightbulb, Sparkles } from "lucide-react"
import { AIKPISuggestions } from "@/components/ai/ai-kpi-suggestions"
import { AIService, type AIKPISuggestion } from "@/lib/ai-services"

interface KpiFormData {
  title: string
  type: KpiType
  unit: string
  target: number
  weight: number
  dataSource: string
  formula?: string
  description?: string
}

interface KpiFormProps {
  template?: KpiTemplate
  onSubmit: (kpis: KpiFormData[]) => void
  onCancel: () => void
}

export function KpiForm({ template, onSubmit, onCancel }: KpiFormProps) {
  const [kpis, setKpis] = useState<KpiFormData[]>([])
  const [currentKpiIndex, setCurrentKpiIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

  useEffect(() => {
    if (template) {
      const initialKpis = template.kpiFields.map((field) => ({
        title: field.title,
        type: field.type,
        unit: field.unit,
        target: field.targetRange?.recommended || 0,
        weight: field.weight,
        dataSource: field.dataSource || "",
        formula: field.formula,
        description: field.description,
      }))
      setKpis(initialKpis)
    } else {
      setKpis([
        {
          title: "",
          type: "QUANT_HIGHER_BETTER",
          unit: "",
          target: 0,
          weight: 0,
          dataSource: "",
          description: "",
        },
      ])
    }
  }, [template])

  const currentKpi = kpis[currentKpiIndex]
  const totalWeight = kpis.reduce((sum, kpi) => sum + kpi.weight, 0)
  const smartCheck = currentKpi ? checkSmartCriteria(currentKpi) : { score: 0, issues: [], suggestions: [] }

  const updateCurrentKpi = (updates: Partial<KpiFormData>) => {
    const newKpis = [...kpis]
    newKpis[currentKpiIndex] = { ...currentKpi, ...updates }
    setKpis(newKpis)

    const newErrors = { ...errors }
    Object.keys(updates).forEach((key) => {
      delete newErrors[`${currentKpiIndex}.${key}`]
    })
    setErrors(newErrors)
  }

  const addKpi = () => {
    setKpis([
      ...kpis,
      {
        title: "",
        type: "QUANT_HIGHER_BETTER",
        unit: "",
        target: 0,
        weight: 0,
        dataSource: "",
        description: "",
      },
    ])
    setCurrentKpiIndex(kpis.length)
  }

  const removeKpi = (index: number) => {
    if (kpis.length > 1) {
      const newKpis = kpis.filter((_, i) => i !== index)
      setKpis(newKpis)
      if (currentKpiIndex >= newKpis.length) {
        setCurrentKpiIndex(newKpis.length - 1)
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    kpis.forEach((kpi, index) => {
      if (!kpi.title.trim()) {
        newErrors[`${index}.title`] = "Title is required"
      }
      if (!kpi.unit.trim()) {
        newErrors[`${index}.unit`] = "Unit is required"
      }
      if (kpi.target <= 0) {
        newErrors[`${index}.target`] = "Target must be greater than 0"
      }
      if (kpi.weight <= 0) {
        newErrors[`${index}.weight`] = "Weight must be greater than 0"
      }
      if (!kpi.dataSource.trim()) {
        newErrors[`${index}.dataSource`] = "Data source is required"
      }
    })

    if (!validateKpiWeights(kpis)) {
      newErrors.totalWeight = "Total weight must equal 100%"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(kpis)
    }
  }

  const handleAISuggestion = (suggestion: AIKPISuggestion) => {
    const newKpi: KpiFormData = {
      title: suggestion.name,
      type: suggestion.type === "quantitative" ? "QUANT_HIGHER_BETTER" : "BOOLEAN",
      unit: suggestion.unit,
      target: suggestion.target,
      weight: suggestion.weight,
      dataSource: "AI Generated",
      formula: suggestion.formula,
      description: suggestion.description,
    }

    setKpis([...kpis, newKpi])
    setCurrentKpiIndex(kpis.length)
    setShowAISuggestions(false)
  }

  useEffect(() => {
    if (currentKpi && currentKpi.title && currentKpi.target > 0) {
      AIService.analyzeSMARTCriteria(currentKpi).then(setAiAnalysis)
    }
  }, [currentKpi])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {template ? `Create KPIs from ${template.name}` : "Create KPIs from Scratch"}
          </h2>
          <p className="text-muted-foreground">Define your Key Performance Indicators for this cycle</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAISuggestions(!showAISuggestions)}>
            <Sparkles className="h-4 w-4 mr-2" />
            AI Suggestions
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create KPIs ({kpis.length})</Button>
        </div>
      </div>

      {showAISuggestions && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="pt-6">
            <AIKPISuggestions
              department={template?.department || "General"}
              role="STAFF"
              onSelectSuggestion={handleAISuggestion}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">KPIs ({kpis.length})</CardTitle>
              <CardDescription>
                Total Weight: {totalWeight}%
                {totalWeight !== 100 && (
                  <Badge variant="destructive" className="ml-2">
                    Must equal 100%
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {kpis.map((kpi, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === currentKpiIndex ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setCurrentKpiIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{kpi.title || `KPI ${index + 1}`}</p>
                      <p className="text-xs text-muted-foreground">Weight: {kpi.weight}%</p>
                    </div>
                    {kpis.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeKpi(index)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addKpi} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add KPI
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>KPI Details</CardTitle>
              <CardDescription>
                Configure the selected KPI ({currentKpiIndex + 1} of {kpis.length})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">KPI Title *</Label>
                <Input
                  id="title"
                  value={currentKpi?.title || ""}
                  onChange={(e) => updateCurrentKpi({ title: e.target.value })}
                  placeholder="e.g., Reduce Internal NCR Cases"
                />
                {errors[`${currentKpiIndex}.title`] && (
                  <p className="text-sm text-destructive">{errors[`${currentKpiIndex}.title`]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">KPI Type *</Label>
                  <Select
                    value={currentKpi?.type}
                    onValueChange={(value: KpiType) => updateCurrentKpi({ type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(KPI_TYPES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    value={currentKpi?.unit || ""}
                    onChange={(e) => updateCurrentKpi({ unit: e.target.value })}
                    placeholder="e.g., cases, percentage, score"
                  />
                  {errors[`${currentKpiIndex}.unit`] && (
                    <p className="text-sm text-destructive">{errors[`${currentKpiIndex}.unit`]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Target *</Label>
                  <Input
                    id="target"
                    type="number"
                    value={currentKpi?.target || ""}
                    onChange={(e) => updateCurrentKpi({ target: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="Target value"
                  />
                  {errors[`${currentKpiIndex}.target`] && (
                    <p className="text-sm text-destructive">{errors[`${currentKpiIndex}.target`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (%) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={currentKpi?.weight || ""}
                    onChange={(e) => updateCurrentKpi({ weight: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="Weight percentage"
                  />
                  {errors[`${currentKpiIndex}.weight`] && (
                    <p className="text-sm text-destructive">{errors[`${currentKpiIndex}.weight`]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataSource">Data Source *</Label>
                <Input
                  id="dataSource"
                  value={currentKpi?.dataSource || ""}
                  onChange={(e) => updateCurrentKpi({ dataSource: e.target.value })}
                  placeholder="e.g., eQMS System, Financial System"
                />
                {errors[`${currentKpiIndex}.dataSource`] && (
                  <p className="text-sm text-destructive">{errors[`${currentKpiIndex}.dataSource`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentKpi?.description || ""}
                  onChange={(e) => updateCurrentKpi({ description: e.target.value })}
                  placeholder="Detailed description of this KPI..."
                  rows={3}
                />
              </div>

              {currentKpi?.type !== "BOOLEAN" && currentKpi?.type !== "BEHAVIOR" && (
                <div className="space-y-2">
                  <Label htmlFor="formula">Formula (Optional)</Label>
                  <Input
                    id="formula"
                    value={currentKpi?.formula || ""}
                    onChange={(e) => updateCurrentKpi({ formula: e.target.value })}
                    placeholder="e.g., (Actual / Target) * 100"
                  />
                </div>
              )}

              {aiAnalysis && (
                <Alert className="border-blue-200 bg-blue-50/50">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">AI SMART Analysis: {aiAnalysis.score}%</p>
                      {aiAnalysis.suggestions.length > 0 && (
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  SMART Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Score</span>
                    <Badge variant={smartCheck.score >= 80 ? "default" : "secondary"}>{smartCheck.score}%</Badge>
                  </div>
                  <Progress value={smartCheck.score} className="h-2" />

                  {smartCheck.issues.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        Issues
                      </div>
                      {smartCheck.issues.map((issue, index) => (
                        <p key={index} className="text-xs text-muted-foreground">
                          • {issue}
                        </p>
                      ))}
                    </div>
                  )}

                  {smartCheck.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Lightbulb className="h-4 w-4" />
                        Suggestions
                      </div>
                      {smartCheck.suggestions.map((suggestion, index) => (
                        <p key={index} className="text-xs text-muted-foreground">
                          • {suggestion}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {errors.totalWeight && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.totalWeight}</AlertDescription>
              </Alert>
            )}

            {totalWeight === 100 && Object.keys(errors).length === 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>All validations passed! Ready to create KPIs.</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
