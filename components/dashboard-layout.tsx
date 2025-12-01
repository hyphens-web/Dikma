"use client"

import type React from "react"
import { UserMenu } from "./user-menu"

interface User {
  id: number
  username: string
  user_type: "admin_master" | "admin_limited"
}

export function DashboardLayout({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-primary">Gestão Colaborativa</h1>
          </div>
          <UserMenu user={user} />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  )
}
