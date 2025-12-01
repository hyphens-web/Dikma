import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getSession } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { newPassword } = await request.json()

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: "Senha inválida" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const db = getDb()

    db.prepare("UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
      hashedPassword,
      session.id,
    )

    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, user_id, details)
      VALUES (?, ?, ?, ?, ?)
    `).run("UPDATE", "user", session.id, session.id, "Password changed")

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
