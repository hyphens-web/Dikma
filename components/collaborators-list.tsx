"use client"

import { Card } from "./ui/card"

interface Collaborator {
  id: number
  name: string
  area: string
  function: string
  createdAt: string
  createdBy: string
}

export function CollaboratorsList({ collaborators }: { collaborators: Collaborator[] }) {
  if (collaborators.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum colaborador cadastrado ainda</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {collaborators.map((collab) => (
        <Card key={collab.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{collab.name}</h3>
              <p className="text-sm text-muted-foreground">Área: {collab.area}</p>
              <p className="text-sm text-muted-foreground">Função: {collab.function}</p>
              <p className="text-xs text-muted-foreground mt-2">Cadastrado por: {collab.createdBy}</p>
            </div>
            <div className="text-xs text-muted-foreground text-right">
              {new Date(collab.createdAt).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
