import { cookies } from "next/headers"

export interface UserSession {
  id: number
  username: string
  user_type: "admin_master" | "admin_limited"
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) return null

  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user_type !== "admin_master" && session.user_type !== "admin_limited") {
    throw new Error("Forbidden")
  }
  return session
}

export async function requireMasterAdmin() {
  const session = await requireAuth()
  if (session.user_type !== "admin_master") {
    throw new Error("Forbidden")
  }
  return session
}
