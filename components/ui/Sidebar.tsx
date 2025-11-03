"use client"

import Link from "next/link"
import { useLayoutEffect, useState } from "react"
import Image from "next/image"
import { Button } from "./button"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Home, ClipboardList, User, LogOut } from "lucide-react"

interface SidebarProps {
  user: {
    id: string
    email?: string
    // support both camelCase and snake_case and generic name
    firstName?: string
    lastName?: string
    first_name?: string
    last_name?: string
    name?: string
    role?: string
    avatar_url?: string | null
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const [pathname, setPathname] = useState<string>("")
  const [mounted, setMounted] = useState(false)
  // ensure we set pathname before first paint to avoid mismatch
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname)
    }
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (!error) {
        toast.success("Sesión cerrada exitosamente")
        if (typeof window !== 'undefined') {
          window.location.href = "/login"
        }
      } else {
        toast.error(error.message || "Error al cerrar sesión")
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast.error("Error al cerrar sesión")
    }
  }

  // derive display names with fallbacks
  const displayFirst = user?.firstName || user?.first_name || (user?.name ? user.name.split(" ")[0] : "") || ""
  const displayLast =
    user?.lastName ||
    user?.last_name ||
    (user?.name ? user.name.split(" ").slice(1).join(" ") : "") ||
    ""

  const displayFullName = [displayFirst, displayLast].filter(Boolean).join(" ")
  const avatarUrl = (user as any)?.avatar_url || (user as any)?.avatarUrl || undefined

  const getInitials = (first: string, last: string) => {
    const f = first?.charAt(0) || ""
    const l = last?.charAt(0) || ""
    const initials = `${f}${l}`.toUpperCase()
    return initials || (user?.email ? user.email.charAt(0).toUpperCase() : "")
  }

  const getRoleLabel = (role: string | undefined) => {
    switch (role) {
      case "designer":
        return "Product Designer"
      case "leader":
        return "Líder"
      case "head_chapter":
        return "Head Chapter"
      case "admin":
        return "Administrador"
      default:
        return role || "Usuario"
    }
  }

  const isActive = (path: string) => (mounted ? pathname?.startsWith(path) : false)

  return (
    <>
      <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r px-8 py-10 flex flex-col items-center z-50">
        {/* Logo + label */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-36 h-auto">
            <Image src="/images/latam-logo.svg" alt="LATAM Logo" width={144} height={40} priority />
          </div>
          <div className="mt-4 text-2xl font-extrabold text-gray-300 tracking-tight">SkillMatrix</div>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-full p-1 bg-gray-200">
            <Avatar className="h-28 w-28 ring-4 ring-white shadow-sm">
              {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" referrerPolicy="no-referrer" />}
              <AvatarFallback className="text-lg">{getInitials(displayFirst, displayLast)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-4 text-center">
            <div className="text-base font-semibold text-gray-900">{displayFullName || "Usuario"}</div>
            <div className="text-sm text-gray-500">{getRoleLabel(user?.role)}</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="w-full flex-1">
          <ul className="w-full space-y-4 mt-6">
            <li className="w-full">
              <Button asChild variant="ghost" className={`w-full justify-start gap-4 px-4 py-3 ${isActive("/dashboard") ? "bg-gray-50 rounded-md" : ""}`}>
                <Link href="/dashboard">
                  <Home className="w-5 h-5" />
                  <span className="text-base font-medium">Dashboard</span>
                </Link>
              </Button>
            </li>

            <li className="w-full">
              <Button asChild variant="ghost" className={`w-full justify-start gap-4 px-4 py-3 ${isActive("/auto-evaluaciones") ? "bg-gray-50 rounded-md" : ""}`}>
                <Link href="/auto-evaluaciones">
                  <ClipboardList className="w-5 h-5" />
                  <span className="text-base font-medium">Auto evaluaciones</span>
                </Link>
              </Button>
            </li>

            <li className="w-full">
              <Button asChild variant="ghost" className={`w-full justify-start gap-4 px-4 py-3 ${isActive("/profile") ? "bg-gray-50 rounded-md" : ""}`}>
                <Link href="/profile">
                  <User className="w-5 h-5" />
                  <span className="text-base font-medium">Mi Perfil</span>
                </Link>
              </Button>
            </li>
          </ul>
        </nav>

        {/* Divider */}
        <div className="w-full border-t mt-4 mb-4" />

        {/* Logout fixed at bottom of sidebar */}
        <div className="w-full">
          <Button variant="outline" className="w-full justify-start gap-4 px-4 py-3 text-red-600" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
            <span className="text-base">Cerrar sesión</span>
          </Button>
        </div>
      </aside>

      {/* mobile bar unchanged */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white border rounded-lg shadow-sm px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" referrerPolicy="no-referrer" />}
                <AvatarFallback className="text-xs">{getInitials(displayFirst, displayLast)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-gray-900">{displayFirst || "Usuario"}</div>
                <div className="text-xs text-gray-500">{getRoleLabel(user?.role)}</div>
              </div>
            </div>
            <div>
              <Button variant="outline" className="text-red-600" onClick={handleSignOut}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
