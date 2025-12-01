import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { requireMasterAdmin } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await requireMasterAdmin()
    const { username, password, user_type } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getDb()
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const result = db
        .prepare(`
        INSERT INTO users (username, password, user_type)
        VALUES (?, ?, ?)
      `)
        .run(username, hashedPassword, user_type)

      db.prepare(`
        INSERT INTO audit_logs (action, entity_type, entity_id, user_id, details)
        VALUES (?, ?, ?, ?, ?)
      `).run("CREATE", "user", result.lastInsertRowid, session.id, JSON.stringify({ username, user_type }))

      const newUser = db
        .prepare("SELECT id, username, user_type, created_at FROM users WHERE id = ?")
        .get(result.lastInsertRowid)
      return NextResponse.json(newUser, { status: 201 })
    } catch (err: any) {
      if (err.message.includes("UNIQUE")) {
        return NextResponse.json({ error: "Usuário já existe" }, { status: 400 })
      }
      throw err
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
