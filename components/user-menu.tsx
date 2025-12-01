"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface User {
  id: number
  username: string
  userType: "admin_master" | "admin_limited"
}

export function UserMenu({ user }: { user: User }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("session")

    // Log the logout
    const logs = JSON.parse(localStorage.getItem("logs") || "[]")
    logs.push({
      id: Date.now(),
      type: "logout",
      user: user.username,
      timestamp: new Date().toISOString(),
      details: `${user.username} fez logout`,
    })
    localStorage.setItem("logs", JSON.stringify(logs))

    router.push("/login")
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
      >
        {user.username.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <p className="font-semibold">{user.username}</p>
            <p className="text-xs text-muted-foreground">
              {user.userType === "admin_master" ? "Admin Master" : "Admin Limitado"}
            </p>
          </div>

          <div className="p-2 space-y-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 hover:bg-muted rounded-lg text-sm transition-colors"
            >
              Configurações
            </Link>

            {user.userType === "admin_master" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-muted rounded-lg text-sm transition-colors"
              >
                Administração
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive rounded-lg text-sm transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
