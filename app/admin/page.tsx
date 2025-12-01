"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
  id: number
  username: string
  userType: "admin_master" | "admin_limited"
}

interface AdminUser {
  id: number
  username: string
  userType: string
  createdAt: string
}

interface Log {
  id: number
  type: string
  user: string
  timestamp: string
  details: string
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [createForm, setCreateForm] = useState({
    username: "",
    password: "",
    userType: "admin_limited",
  })
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    setMounted(true)
    const session = localStorage.getItem("session")
    if (!session) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(session)

      if (userData.userType !== "admin_master") {
        router.push("/dashboard")
        return
      }

      setUser(userData)

      const users = JSON.parse(localStorage.getItem("users") || "[]")
      setAdminUsers(
        users.map((u: any) => ({
          id: u.id,
          username: u.username,
          userType: u.userType,
          createdAt: u.createdAt || new Date().toISOString(),
        })),
      )

      const logsData = JSON.parse(localStorage.getItem("logs") || "[]")
      setLogs(logsData)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      localStorage.removeItem("session")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!createForm.username || !createForm.password) {
      setError("Usuário e senha são obrigatórios")
      return
    }

    if (createForm.username.length < 3) {
      setError("Usuário deve ter pelo menos 3 caracteres")
      return
    }

    if (createForm.password.length < 4) {
      setError("Senha deve ter pelo menos 4 caracteres")
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      if (users.some((u: any) => u.username === createForm.username)) {
        setError("Este usuário já existe")
        return
      }

      const newUser: AdminUser = {
        id: Date.now(),
        username: createForm.username,
        userType: createForm.userType,
        createdAt: new Date().toISOString(),
      }

      users.push({
        id: newUser.id,
        username: createForm.username,
        password: createForm.password,
        userType: createForm.userType,
        createdAt: newUser.createdAt,
      })

      localStorage.setItem("users", JSON.stringify(users))
      setAdminUsers([...adminUsers, newUser])

      // Log the action
      const logsData = JSON.parse(localStorage.getItem("logs") || "[]")
      logsData.push({
        id: Date.now(),
        type: "user_created",
        user: user?.username,
        timestamp: new Date().toISOString(),
        details: `Usuário administrativo "${createForm.username}" criado (${createForm.userType})`,
      })
      localStorage.setItem("logs", JSON.stringify(logsData))
      setLogs(logsData)

      setCreateForm({ username: "", password: "", userType: "admin_limited" })
      setMessage("Usuário criado com sucesso")
      setShowCreateUser(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar usuário")
    }
  }

  const handleDeleteUser = (userId: number) => {
    if (!confirm("Deseja realmente excluir este usuário?")) return
    if (userId === user?.id) {
      setError("Você não pode excluir sua própria conta")
      return
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const deletedUser = users.find((u: any) => u.id === userId)
      const updatedUsers = users.filter((u: any) => u.id !== userId)

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      setAdminUsers(adminUsers.filter((u) => u.id !== userId))

      // Log the action
      const logsData = JSON.parse(localStorage.getItem("logs") || "[]")
      logsData.push({
        id: Date.now(),
        type: "user_deleted",
        user: user?.username,
        timestamp: new Date().toISOString(),
        details: `Usuário administrativo "${deletedUser?.username}" excluído`,
      })
      localStorage.setItem("logs", JSON.stringify(logsData))
      setLogs(logsData)

      setMessage("Usuário excluído com sucesso")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir usuário")
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

  if (!user || user.userType !== "admin_master") {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Administração</h1>
          <p className="text-muted-foreground mt-2">Painel administrativo do sistema</p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">Usuários Administrativos</TabsTrigger>
            <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            {!showCreateUser ? (
              <Button onClick={() => setShowCreateUser(true)} className="btn-primary">
                + Criar Usuário Administrativo
              </Button>
            ) : (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Novo Usuário Administrativo</h2>
                <form onSubmit={handleCreateUser} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-2">Usuário</label>
                    <Input
                      type="text"
                      value={createForm.username}
                      onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                      placeholder="Nome de usuário"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Senha</label>
                    <Input
                      type="password"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      placeholder="Senha"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo</label>
                    <select
                      value={createForm.userType}
                      onChange={(e) => setCreateForm({ ...createForm, userType: e.target.value })}
                      className="input-field"
                    >
                      <option value="admin_master">Administrador Master</option>
                      <option value="admin_limited">Administrador Limitado</option>
                    </select>
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" className="btn-primary">
                      Criar Usuário
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setShowCreateUser(false)
                        setError("")
                      }}
                      className="btn-secondary"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-4">Usuários Administrativos</h2>
              {adminUsers.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum usuário administrativo cadastrado</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {adminUsers.map((u) => (
                    <Card key={u.id} className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{u.username}</h3>
                        <p className="text-sm text-muted-foreground">
                          Tipo: {u.userType === "admin_master" ? "Master" : "Limitado"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Criado em: {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      {u.id !== user.id && (
                        <Button
                          onClick={() => handleDeleteUser(u.id)}
                          className="bg-destructive text-destructive-foreground hover:opacity-90"
                        >
                          Excluir
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">Logs do Sistema</h2>
              {logs.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum log registrado</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <Card key={log.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold">{log.type.replace(/_/g, " ").toUpperCase()}</h3>
                          <p className="text-sm text-muted-foreground">Usuário: {log.user}</p>
                          <p className="text-xs text-muted-foreground">{log.details}</p>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {new Date(log.timestamp).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
