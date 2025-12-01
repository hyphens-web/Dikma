import { create } from "zustand"

export interface Collaborator {
  id: string
  name: string
  role: string
  area: string
  admissionDate: string
  contact: string
  companyId: string
  documents: Document[]
}

export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadDate: string
}

export interface Company {
  id: string
  name: string
  collaborators: Collaborator[]
  totalDocuments: number
  createdAt: string
}

interface AppState {
  companies: Company[]
  addCompany: (name: string) => void
  addCollaborator: (companyId: string, collaborator: Omit<Collaborator, "id">) => void
  addDocument: (companyId: string, collaboratorId: string, doc: Document) => void
  deleteCollaborator: (companyId: string, collaboratorId: string) => void
  deleteDocument: (companyId: string, collaboratorId: string, docId: string) => void
  getCompanyStats: () => { totalCompanies: number; totalCollaborators: number; totalDocuments: number }
}

const DEFAULT_COMPANIES = [
  { name: "Dikma", id: "dikma" },
  { name: "Arcelor", id: "arcelor" },
  { name: "Dikmaq", id: "dikmaq" },
  { name: "Caex", id: "caex" },
  { name: "Nemak", id: "nemak" },
]

const initializeCompanies = (): Company[] => {
  if (typeof window === "undefined") return []

  const stored = localStorage.getItem("companies")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return DEFAULT_COMPANIES.map((c) => ({
        id: c.id,
        name: c.name,
        collaborators: [],
        totalDocuments: 0,
        createdAt: new Date().toISOString(),
      }))
    }
  }

  return DEFAULT_COMPANIES.map((c) => ({
    id: c.id,
    name: c.name,
    collaborators: [],
    totalDocuments: 0,
    createdAt: new Date().toISOString(),
  }))
}

export const useAppStore = create<AppState>((set) => ({
  companies: initializeCompanies(),

  addCompany: (name: string) =>
    set((state) => {
      const newCompany: Company = {
        id: Date.now().toString(),
        name,
        collaborators: [],
        totalDocuments: 0,
        createdAt: new Date().toISOString(),
      }
      const updated = [...state.companies, newCompany]
      if (typeof window !== "undefined") {
        localStorage.setItem("companies", JSON.stringify(updated))
      }
      return { companies: updated }
    }),

  addCollaborator: (companyId: string, collaborator: Omit<Collaborator, "id">) =>
    set((state) => {
      const updated = state.companies.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            collaborators: [...c.collaborators, { ...collaborator, id: Date.now().toString() }],
          }
        }
        return c
      })
      if (typeof window !== "undefined") {
        localStorage.setItem("companies", JSON.stringify(updated))
      }
      return { companies: updated }
    }),

  addDocument: (companyId: string, collaboratorId: string, doc: Document) =>
    set((state) => {
      const updated = state.companies.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            collaborators: c.collaborators.map((col) => {
              if (col.id === collaboratorId) {
                return {
                  ...col,
                  documents: [...(col.documents || []), doc],
                }
              }
              return col
            }),
            totalDocuments: c.totalDocuments + 1,
          }
        }
        return c
      })
      if (typeof window !== "undefined") {
        localStorage.setItem("companies", JSON.stringify(updated))
      }
      return { companies: updated }
    }),

  deleteCollaborator: (companyId: string, collaboratorId: string) =>
    set((state) => {
      const updated = state.companies.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            collaborators: c.collaborators.filter((col) => col.id !== collaboratorId),
          }
        }
        return c
      })
      if (typeof window !== "undefined") {
        localStorage.setItem("companies", JSON.stringify(updated))
      }
      return { companies: updated }
    }),

  deleteDocument: (companyId: string, collaboratorId: string, docId: string) =>
    set((state) => {
      const updated = state.companies.map((c) => {
        if (c.id === companyId) {
          return {
            ...c,
            collaborators: c.collaborators.map((col) => {
              if (col.id === collaboratorId) {
                return {
                  ...col,
                  documents: (col.documents || []).filter((d) => d.id !== docId),
                }
              }
              return col
            }),
            totalDocuments: Math.max(0, c.totalDocuments - 1),
          }
        }
        return c
      })
      if (typeof window !== "undefined") {
        localStorage.setItem("companies", JSON.stringify(updated))
      }
      return { companies: updated }
    }),

  getCompanyStats: () => {
    // This will be called differently, stats are computed on the fly
    return { totalCompanies: 0, totalCollaborators: 0, totalDocuments: 0 }
  },
}))
