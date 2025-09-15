"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import type { User } from "@/lib/types"
import { mockAuthService } from "@/lib/mockdata"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = mockAuthService.getCurrentUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    mockAuthService.logout()
    setUser(null)
    router.push("/")
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
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
