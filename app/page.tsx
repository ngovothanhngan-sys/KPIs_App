"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { Sidebar } from "@/components/layout/sidebar"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import type { User } from "@/lib/types"
import { mockAuthService, getRoleDisplayName } from "@/lib/mockdata"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = mockAuthService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    mockAuthService.logout()
    setUser(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-balance">Welcome back, {user.name}</h1>
            <p className="text-muted-foreground mt-1">
              {getRoleDisplayName(user.role)} • {user.email}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your KPIs and track performance across the organization
            </p>
          </div>

          <DashboardStats user={user} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity user={user} />
            <QuickActions user={user} />
          </div>
        </div>
      </main>
    </div>
  )
}
