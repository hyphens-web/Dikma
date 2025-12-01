import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { requireMasterAdmin } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    await requireMasterAdmin()

    const db = getDb()
    const searchParams = request.nextUrl.searchParams
    const filter = searchParams.get("filter") || ""

    let query = `
      SELECT l.id, l.action, l.entity_type, l.entity_id, l.user_id, l.details, l.created_at, u.username
      FROM audit_logs l
      LEFT JOIN users u ON l.user_id = u.id
    `

    if (filter) {
      query += ` WHERE u.username LIKE ? OR l.entity_type LIKE ? OR l.action LIKE ?`
    }

    query += ` ORDER BY l.created_at DESC LIMIT 100`

    const logs = filter ? db.prepare(query).all(`%${filter}%`, `%${filter}%`, `%${filter}%`) : db.prepare(query).all()

    return NextResponse.json(logs)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
