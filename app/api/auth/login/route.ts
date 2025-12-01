import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Usuário e senha são obrigatórios" }, { status: 400 })
    }

    const db = getDb()
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any

    if (!user) {
      return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 })
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 })
    }

    const response = NextResponse.json(
      { success: true, user: { id: user.id, username: user.username, user_type: user.user_type } },
      { status: 200 },
    )

    response.cookies.set(
      "session",
      JSON.stringify({
        id: user.id,
        username: user.username,
        user_type: user.user_type,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    )

    return response
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar login" }, { status: 500 })
  }
}
