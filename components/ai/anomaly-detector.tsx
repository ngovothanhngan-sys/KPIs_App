"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingDown, TrendingUp, Activity, RefreshCw } from "lucide-react"
import { AIService, type AIAnomalyDetection } from "@/lib/ai-services"

interface AnomalyDetectorProps {
  kpiData: any[]
}

export function AnomalyDetector({ kpiData }: AnomalyDetectorProps) {
  const [anomalies, setAnomalies] = useState<AIAnomalyDetection[]>([])
  const [loading, setLoading] = useState(false)

  const detectAnomalies = async () => {
    setLoading(true)
    try {
      const detectedAnomalies = await AIService.detectAnomalies(kpiData)
      setAnomalies(detectedAnomalies)
    } catch (error) {
      console.error("Failed to detect anomalies:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (kpiData.length > 0) {
      detectAnomalies()
    }
  }, [kpiData])

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "sudden_drop":
        return <TrendingDown className="h-4 w-4" />
      case "sudden_spike":
        return <TrendingUp className="h-4 w-4" />
      case "trend_deviation":
        return <Activity className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">AI Anomaly Detection</h3>
          <p className="text-sm text-muted-foreground">Automatically detect unusual patterns in KPI performance</p>
        </div>
        <Button onClick={detectAnomalies} disabled={loading} size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh Analysis
        </Button>
      </div>

      {anomalies.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No anomalies detected in current KPI data</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {anomalies.map((anomaly, index) => (
            <Card key={index} className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getAnomalyIcon(anomaly.anomalyType)}
                    <CardTitle className="text-base">
                      {anomaly.anomalyType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(anomaly.severity) as any}>{anomaly.severity.toUpperCase()}</Badge>
                    <Badge variant="outline">{Math.round(anomaly.confidence * 100)}% confidence</Badge>
                  </div>
                </div>
                <CardDescription>{anomaly.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Suggested Actions:</h4>
                    <ul className="space-y-1">
                      {anomaly.suggestedActions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-500 mt-1">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
