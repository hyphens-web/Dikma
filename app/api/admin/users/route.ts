import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { requireMasterAdmin } from "@/lib/session"

export async function GET() {
  try {
    await requireMasterAdmin()

    const db = getDb()
    const users = db
      .prepare(`
      SELECT id, username, user_type, created_at
      FROM users
      ORDER BY created_at DESC
    `)
      .all()

    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
