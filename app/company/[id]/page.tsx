"use client"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/data-store"
import { ArrowLeft, Users, Eye, Settings } from "lucide-react"
import { CompanyOverview } from "@/components/company/overview"
import { CollaboratorsTab } from "@/components/company/collaborators-tab"
import { useEffect, useState } from "react"

export default function CompanyPage() {
  const params = useParams()
  const router = useRouter()
  const { companies } = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const companyId = params.id as string
  const company = companies.find((c) => c.id === companyId)

  if (!mounted) {
    return null
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Empresa não encontrada</h1>
          <Button onClick={() => router.push("/")}>Voltar ao Dashboard</Button>
        </div>
      </div>
    )
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
            <div>
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <p className="text-sm text-muted-foreground">Dashboard da empresa</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Eye className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="collaborators" className="gap-2">
              <Users className="w-4 h-4" />
              Colaboradores
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CompanyOverview company={company} />
          </TabsContent>

          <TabsContent value="collaborators">
            <CollaboratorsTab company={company} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Configurações em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
