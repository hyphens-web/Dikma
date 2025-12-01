"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initialize default users if not exists
    const users = localStorage.getItem("users")
    if (!users) {
      const defaultUsers = [
        {
          id: 1,
          username: "admin",
          password: "admin",
          userType: "admin_master",
          createdAt: new Date().toISOString(),
        },
      ]
      localStorage.setItem("users", JSON.stringify(defaultUsers))
    }
    // Initialize logs array
    if (!localStorage.getItem("logs")) {
      localStorage.setItem("logs", JSON.stringify([]))
    }
    // Initialize collaborators array
    if (!localStorage.getItem("collaborators")) {
      localStorage.setItem("collaborators", JSON.stringify([]))
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find((u: any) => u.username === username && u.password === password)

      if (!user) {
        throw new Error("Usuário ou senha inválidos")
      }

      localStorage.setItem(
        "session",
        JSON.stringify({
          id: user.id,
          username: user.username,
          userType: user.userType,
        }),
      )

      // Log the login
      const logs = JSON.parse(localStorage.getItem("logs") || "[]")
      logs.push({
        id: Date.now(),
        type: "login",
        user: user.username,
        timestamp: new Date().toISOString(),
        details: `${user.username} fez login`,
      })
      localStorage.setItem("logs", JSON.stringify(logs))

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-card flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Gestão</h1>
            <p className="text-muted-foreground text-sm mt-1">Sistema de Colaboradores</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Usuário</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
            <p className="text-xs text-muted-foreground font-medium mb-2">Credenciais Padrão:</p>
            <p className="text-xs">
              Usuário: <span className="font-mono font-semibold">admin</span>
            </p>
            <p className="text-xs">
              Senha: <span className="font-mono font-semibold">admin</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
