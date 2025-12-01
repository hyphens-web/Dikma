"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/data-store"
import { X } from "lucide-react"

export function CollaboratorForm({ companyId, onCancel }: { companyId: string; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    area: "",
    admissionDate: new Date().toISOString().split("T")[0],
    contact: "",
  })
  const { addCollaborator } = useAppStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.role || !formData.area) return

    addCollaborator(companyId, {
      ...formData,
      id: "",
      companyId,
      documents: [],
    })
    onCancel()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Novo Colaborador</CardTitle>
          <CardDescription>Adicione um novo colaborador à empresa</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              placeholder="Função"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            />
            <Input
              placeholder="Área/Setor"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />
            <Input
              placeholder="Data de admissão"
              type="date"
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            />
            <Input
              placeholder="Contato"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="md:col-span-2"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Adicionar Colaborador
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
