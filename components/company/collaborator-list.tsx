"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Company } from "@/lib/data-store"
import { useAppStore } from "@/lib/data-store"
import { Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { CollaboratorDocuments } from "./collaborator-documents"

export function CollaboratorList({ company }: { company: Company }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { deleteCollaborator } = useAppStore()

  if (company.collaborators.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Nenhum colaborador cadastrado. Adicione um para começar!
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {company.collaborators.map((collaborator) => (
        <Card key={collaborator.id}>
          <div
            className="p-4 cursor-pointer hover:bg-muted transition-colors flex justify-between items-center"
            onClick={() => setExpandedId(expandedId === collaborator.id ? null : collaborator.id)}
          >
            <div>
              <h3 className="font-semibold">{collaborator.name}</h3>
              <p className="text-sm text-muted-foreground">
                {collaborator.role} • {collaborator.area}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Admissão: {new Date(collaborator.admissionDate).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteCollaborator(company.id, collaborator.id)
                }}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
              {expandedId === collaborator.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>

          {expandedId === collaborator.id && (
            <div className="border-t border-border p-4 bg-muted">
              <CollaboratorDocuments company={company} collaborator={collaborator} />
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
