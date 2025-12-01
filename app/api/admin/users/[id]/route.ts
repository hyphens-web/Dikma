import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { requireMasterAdmin } from "@/lib/session"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireMasterAdmin()
    const userId = Number.parseInt(params.id)

    if (userId === session.id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
    }

    const db = getDb()
    db.prepare("DELETE FROM users WHERE id = ?").run(userId)

    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, user_id, details)
      VALUES (?, ?, ?, ?, ?)
    `).run("DELETE", "user", userId, session.id, "")

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
