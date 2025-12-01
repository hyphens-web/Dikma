"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  id: number
  username: string
  userType: "admin_master" | "admin_limited"
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    setMounted(true)
    const session = localStorage.getItem("session")
    if (!session) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(session)
      setUser(userData)
    } catch (error) {
      localStorage.removeItem("session")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (newPassword.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres")
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const userIndex = users.findIndex((u: any) => u.id === user?.id)

      if (userIndex === -1) {
        setError("Usuário não encontrado")
        return
      }

      users[userIndex].password = newPassword
      localStorage.setItem("users", JSON.stringify(users))

      // Log the action
      const logs = JSON.parse(localStorage.getItem("logs") || "[]")
      logs.push({
        id: Date.now(),
        type: "password_changed",
        user: user?.username,
        timestamp: new Date().toISOString(),
        details: `Senha alterada por ${user?.username}`,
      })
      localStorage.setItem("logs", JSON.stringify(logs))

      setMessage("Senha alterada com sucesso")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar senha")
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-2">Gerencie suas configurações de conta</p>
        </div>

        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">Dados da Conta</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Usuário</label>
              <div className="p-3 bg-muted rounded-lg text-foreground font-mono">{user.username}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <div className="p-3 bg-muted rounded-lg text-foreground">
                {user.userType === "admin_master" ? "Administrador Master" : "Administrador Limitado"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-bold mb-4">Alterar Senha</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nova Senha</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                required
              />
            </div>

            {message && (
              <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="btn-primary">
              Alterar Senha
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
