import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getDb()
    const collaborators = db
      .prepare(`
      SELECT c.id, c.name, c.area, c.function, c.created_at, c.created_by, u.username as created_by_username
      FROM collaborators c
      LEFT JOIN users u ON c.created_by = u.id
      ORDER BY c.created_at DESC
    `)
      .all()

    return NextResponse.json(collaborators)
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, area, function: func } = await request.json()

    if (!name || !area || !func) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = getDb()
    const result = db
      .prepare(`
      INSERT INTO collaborators (name, area, function, created_by)
      VALUES (?, ?, ?, ?)
    `)
      .run(name, area, func, session.id)

    // Log this action
    db.prepare(`
      INSERT INTO audit_logs (action, entity_type, entity_id, user_id, details)
      VALUES (?, ?, ?, ?, ?)
    `).run("CREATE", "collaborator", result.lastInsertRowid, session.id, JSON.stringify({ name, area, function: func }))

    const collaborator = db.prepare("SELECT * FROM collaborators WHERE id = ?").get(result.lastInsertRowid)
    return NextResponse.json(collaborator, { status: 201 })
  } catch (error) {
    console.error("Error creating collaborator:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
