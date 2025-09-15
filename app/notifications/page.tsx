"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Notification {
  id: string
  type: "approval" | "deadline" | "system" | "reminder"
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  priority: "low" | "medium" | "high"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "approval",
    title: "KPI Approval Required",
    message: "John Smith has submitted KPIs for Q4 2024 cycle requiring your approval",
    isRead: false,
    createdAt: new Date(2024, 11, 15),
    priority: "high",
  },
  {
    id: "2",
    type: "deadline",
    title: "KPI Submission Deadline",
    message: "KPI goals submission deadline is approaching (3 days remaining)",
    isRead: false,
    createdAt: new Date(2024, 11, 14),
    priority: "medium",
  },
  {
    id: "3",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur on Dec 20, 2024 from 2:00 AM to 4:00 AM",
    isRead: true,
    createdAt: new Date(2024, 11, 13),
    priority: "low",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "deadline":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "system":
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.isRead
    if (activeTab === "approval") return notif.type === "approval"
    if (activeTab === "deadline") return notif.type === "deadline"
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with important KPI management activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Badge variant="secondary">{unreadCount} unread</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="approval">Approvals</TabsTrigger>
          <TabsTrigger value="deadline">Deadlines</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications found</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(notification.priority) as any}>
                              {notification.priority}
                            </Badge>
                            {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {notification.createdAt.toLocaleDateString()} at {notification.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
