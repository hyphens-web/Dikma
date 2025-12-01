"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CollaboratorsList } from "@/components/collaborators-list"
import { AddCollaboratorForm } from "@/components/add-collaborator-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface User {
  id: number
  username: string
  userType: "admin_master" | "admin_limited"
}

interface Collaborator {
  id: number
  name: string
  area: string
  function: string
  createdAt: string
  createdBy: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [mounted, setMounted] = useState(false)

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

      const collabData = localStorage.getItem("collaborators")
      if (collabData) {
        setCollaborators(JSON.parse(collabData))
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      localStorage.removeItem("session")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleAddCollaborator = (data: any) => {
    const newCollab: Collaborator = {
      id: Date.now(),
      ...data,
      createdBy: user?.username || "unknown",
      createdAt: new Date().toISOString(),
    }

    const updated = [...collaborators, newCollab]
    setCollaborators(updated)
    localStorage.setItem("collaborators", JSON.stringify(updated))

    // Log the action
    const logs = JSON.parse(localStorage.getItem("logs") || "[]")
    logs.push({
      id: Date.now(),
      type: "collaborator_added",
      user: user?.username,
      timestamp: new Date().toISOString(),
      details: `Colaborador "${data.name}" adicionado à área "${data.area}"`,
    })
    localStorage.setItem("logs", JSON.stringify(logs))

    setShowAddForm(false)
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

  if (!user) {
    return null
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bem-vindo, {user.username}</h1>
            <p className="text-muted-foreground mt-2">
              Tipo: {user.userType === "admin_master" ? "Administrador Master" : "Administrador Limitado"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Total de Colaboradores</div>
            <div className="text-3xl font-bold mt-2">{collaborators.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Seu Tipo</div>
            <div className="text-lg font-bold mt-2">{user.userType === "admin_master" ? "Master" : "Limitado"}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="text-lg font-bold mt-2 text-green-600">Ativo</div>
          </Card>
        </div>

        {!showAddForm ? (
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            + Adicionar Colaborador
          </Button>
        ) : (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Novo Colaborador</h2>
            <AddCollaboratorForm
              onSuccess={() => {
                setShowAddForm(false)
                const collabData = localStorage.getItem("collaborators")
                if (collabData) {
                  setCollaborators(JSON.parse(collabData))
                }
              }}
              user={user}
            />
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">Colaboradores Cadastrados</h2>
          <CollaboratorsList collaborators={collaborators} />
        </div>
      </div>
    </DashboardLayout>
  )
}
