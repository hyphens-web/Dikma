"use client"

import bcrypt from "bcryptjs"

export interface User {
  id: number
  username: string
  user_type: "admin_master" | "admin_limited"
  created_at: string
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getUserFromSession(session: string | null): User | null {
  if (!session) return null
  try {
    const user = JSON.parse(session)
    return user
  } catch {
    return null
  }
}

export function encodeUserSession(user: User): string {
  return JSON.stringify(user)
}
