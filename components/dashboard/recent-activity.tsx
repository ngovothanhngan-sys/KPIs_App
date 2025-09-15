"use client"

import type { User, UserRole } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

interface ActivityItem {
  id: string
  type: "approval" | "submission" | "update" | "notification"
  title: string
  description: string
  timestamp: Date
  status?: "pending" | "approved" | "rejected" | "completed"
  user?: string
}

interface RecentActivityProps {
  user: User
}

const getActivitiesForRole = (role: UserRole): ActivityItem[] => {
  const baseActivities: ActivityItem[] = [
    {
      id: "1",
      type: "submission",
      title: "KPI Submitted",
      description: "Reduce Internal NCR Cases submitted for approval",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "pending",
      user: "Mike Chen",
    },
    {
      id: "2",
      type: "approval",
      title: "KPI Approved",
      description: "Cost Reduction Achievement approved by BOD",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: "approved",
      user: "Emma Wilson",
    },
    {
      id: "3",
      type: "update",
      title: "Cycle Opened",
      description: "Q1 2025 KPI Cycle has been opened",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: "completed",
      user: "John Smith",
    },
  ]

  switch (role) {
    case "HR":
    case "ADMIN":
      return [
        ...baseActivities,
        {
          id: "4",
          type: "notification",
          title: "System Maintenance",
          description: "Scheduled maintenance completed successfully",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: "completed",
        },
        {
          id: "5",
          type: "update",
          title: "Template Updated",
          description: "R&D KPI template updated with new metrics",
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          status: "completed",
          user: "Sarah Johnson",
        },
      ]

    case "LINE_MANAGER":
    case "HEAD_OF_DEPT":
    case "BOD":
      return [
        {
          id: "1",
          type: "approval",
          title: "Approval Required",
          description: "New Product Development KPI needs your approval",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          status: "pending",
          user: "Mike Chen",
        },
        ...baseActivities.slice(1),
      ]

    default:
      return baseActivities
  }
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500"
    case "approved":
    case "completed":
      return "bg-green-500"
    case "rejected":
      return "bg-red-500"
    default:
      return "bg-blue-500"
  }
}

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Pending
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="default" className="bg-green-600">
          Approved
        </Badge>
      )
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    default:
      return null
  }
}

export function RecentActivity({ user }: RecentActivityProps) {
  const activities = getActivitiesForRole(user.role)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <div className={`h-2 w-2 rounded-full mt-2 ${getStatusColor(activity.status)}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                  {activity.user && (
                    <>
                      <span>•</span>
                      <span>by {activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
