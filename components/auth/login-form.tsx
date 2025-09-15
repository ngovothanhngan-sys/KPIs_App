"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockAuthService } from "@/lib/mockdata"
import type { User } from "@/lib/types"

interface LoginFormProps {
  onLogin: (user: User) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await mockAuthService.login(email)
      if (user) {
        onLogin(user)
      } else {
        setError("Invalid email or not authorized. Please use an @intersnack.com.vn email address.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const quickLoginUsers = [
    { email: "john.smith@intersnack.com.vn", role: "HR" },
    { email: "sarah.johnson@intersnack.com.vn", role: "Admin" },
    { email: "mike.chen@intersnack.com.vn", role: "Staff" },
    { email: "lisa.wang@intersnack.com.vn", role: "Line Manager" },
    { email: "david.brown@intersnack.com.vn", role: "Head of Dept" },
    { email: "emma.wilson@intersnack.com.vn", role: "BOD" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">VICC KPI Management</CardTitle>
          <CardDescription>Sign in with your Intersnack email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@intersnack.com.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In with SSO"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="text-sm text-muted-foreground mb-3">Quick login for testing:</div>
            <div className="grid grid-cols-1 gap-2">
              {quickLoginUsers.map((user) => (
                <Button
                  key={user.email}
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail(user.email)}
                  className="text-xs justify-start"
                >
                  {user.role} - {user.email}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
