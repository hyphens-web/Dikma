"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

const AREAS = ["RH", "TI", "Financeiro", "Marketing", "Vendas", "Operações", "Administrativo"]

interface User {
  id: number
  username: string
  userType: "admin_master" | "admin_limited"
}

export function AddCollaboratorForm({ onSuccess, user }: { onSuccess: () => void; user: User }) {
  const [formData, setFormData] = useState({
    name: "",
    area: AREAS[0],
    function: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("Nome é obrigatório")
      return
    }

    if (!formData.function.trim()) {
      setError("Função é obrigatória")
      return
    }

    setLoading(true)

    try {
      const newCollab = {
        id: Date.now(),
        name: formData.name,
        area: formData.area,
        function: formData.function,
        createdAt: new Date().toISOString(),
        createdBy: user.username,
      }

      const collaborators = JSON.parse(localStorage.getItem("collaborators") || "[]")
      collaborators.push(newCollab)
      localStorage.setItem("collaborators", JSON.stringify(collaborators))

      // Log the action
      const logs = JSON.parse(localStorage.getItem("logs") || "[]")
      logs.push({
        id: Date.now(),
        type: "collaborator_added",
        user: user.username,
        timestamp: new Date().toISOString(),
        details: `Colaborador "${formData.name}" adicionado à área "${formData.area}"`,
      })
      localStorage.setItem("logs", JSON.stringify(logs))

      setFormData({ name: "", area: AREAS[0], function: "" })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar colaborador")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nome</label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome do colaborador"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Área</label>
        <select
          value={formData.area}
          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
          className="input-field"
          disabled={loading}
          required
        >
          {AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Função</label>
        <Input
          type="text"
          value={formData.function}
          onChange={(e) => setFormData({ ...formData, function: e.target.value })}
          placeholder="Função do colaborador"
          required
          disabled={loading}
        />
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Salvando..." : "Adicionar Colaborador"}
        </Button>
      </div>
    </form>
  )
}
