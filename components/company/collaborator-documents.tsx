"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Company, Collaborator } from "@/lib/data-store"
import { useAppStore } from "@/lib/data-store"
import { FileUp, Download, Trash2, X } from "lucide-react"

export function CollaboratorDocuments({ company, collaborator }: { company: Company; collaborator: Collaborator }) {
  const [showUpload, setShowUpload] = useState(false)
  const [docName, setDocName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { addDocument, deleteDocument } = useAppStore()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!docName || !selectedFile) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      addDocument(company.id, collaborator.id, {
        id: Date.now().toString(),
        name: docName,
        type: selectedFile.type,
        url: base64,
        uploadDate: new Date().toISOString(),
      })
      setDocName("")
      setSelectedFile(null)
      setShowUpload(false)
    }
    reader.readAsDataURL(selectedFile)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Documentos</h4>
        {!showUpload && (
          <Button size="sm" onClick={() => setShowUpload(true)} className="gap-2">
            <FileUp className="w-4 h-4" />
            Enviar
          </Button>
        )}
      </div>

      {showUpload && (
        <form onSubmit={handleUpload} className="space-y-2 p-3 bg-card border border-border rounded-lg">
          <Input
            placeholder="Nome do documento (ex: RG, CPF, ASO)"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            required
          />
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1">
              Enviar
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setShowUpload(false)
                setDocName("")
                setSelectedFile(null)
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {collaborator.documents && collaborator.documents.length > 0 ? (
          collaborator.documents.map((doc) => (
            <div key={doc.id} className="flex justify-between items-center p-2 bg-card border border-border rounded">
              <div>
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{new Date(doc.uploadDate).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = doc.url
                    link.download = doc.name
                    link.click()
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteDocument(company.id, collaborator.id, doc.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground py-2">Nenhum documento enviado</p>
        )}
      </div>
    </div>
  )
}
