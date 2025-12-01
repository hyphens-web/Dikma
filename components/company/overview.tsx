"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Company } from "@/lib/data-store"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, FileText, Clock } from "lucide-react"

export function CompanyOverview({ company }: { company: Company }) {
  const collaboratorsByRole = company.collaborators.reduce(
    (acc, col) => {
      const existing = acc.find((item) => item.name === col.role)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: col.role, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const recentCollaborators = company.collaborators.slice(-5).reverse()

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Total de Colaboradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.collaborators.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Documentos Cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.totalDocuments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Cadastrada em
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{new Date(company.createdAt).toLocaleDateString("pt-BR")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {collaboratorsByRole.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Colaboradores por Função</CardTitle>
            <CardDescription>Distribuição de funções dos colaboradores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collaboratorsByRole}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Collaborators */}
      {recentCollaborators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Últimos Colaboradores Adicionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCollaborators.map((col) => (
                <div
                  key={col.id}
                  className="flex justify-between items-start py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{col.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {col.role} • {col.area}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(col.admissionDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
