"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Company } from "@/lib/data-store"
import { Plus } from "lucide-react"
import { CollaboratorForm } from "./collaborator-form"
import { CollaboratorList } from "./collaborator-list"

export function CollaboratorsTab({ company }: { company: Company }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Colaborador
        </Button>
      ) : (
        <CollaboratorForm companyId={company.id} onCancel={() => setShowForm(false)} />
      )}

      <CollaboratorList company={company} />
    </div>
  )
}
