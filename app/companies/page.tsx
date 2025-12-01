"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/lib/data-store"
import { ArrowLeft, Plus } from "lucide-react"

export default function CompaniesPage() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const { companies, addCompany } = useAppStore()
  const router = useRouter()

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Nome da empresa é obrigatório")
      return
    }
    if (companies.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setError("Empresa já cadastrada")
      return
    }
    addCompany(name.trim())
    setName("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Empresas</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Adicionar Nova Empresa</CardTitle>
            <CardDescription>Cadastre uma nova empresa no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <Input
                  placeholder="Nome da empresa"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError("")
                  }}
                  className="w-full"
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Cadastrar Empresa
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma empresa cadastrada</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => router.push(`/company/${company.id}`)}
                    className="p-4 border border-border rounded-lg hover:bg-muted transition-all text-left"
                  >
                    <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Colaboradores: {company.collaborators.length}</p>
                      <p>Documentos: {company.totalDocuments}</p>
                      <p className="text-xs mt-2">{new Date(company.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
