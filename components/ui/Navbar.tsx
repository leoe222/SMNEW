"use client"

import { useRouter } from "next/navigation"
import { Button } from "./button"
import { Avatar, AvatarFallback } from "./avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { signOut } from "@/lib/actions/auth"
import { toast } from "sonner"
import Image from "next/image"

interface NavbarProps {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const result = await signOut()

      if (result.success) {
        toast.success("Sesión cerrada exitosamente")
        router.push(result.redirect || "/login")
      } else {
        toast.error(result.error || "Error al cerrar sesión")
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast.error("Error al cerrar sesión")
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || ""
    const last = lastName?.charAt(0) || ""
    return `${first}${last}`.toUpperCase()
  }

  const getRoleLabel = (role: string) => {
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
        return role
    }
  }

  return (
    <nav className="bg-[#10004f] border-b px-4 py-3 sticky top-0 z-50 shadow border-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/images/latam-logo.svg" alt="LATAM Logo" width={120} height={32} className="mr-3" />
          <h1 className="text-xl font-bold text-white text-left mx-5">Skill Matrix    </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end mr-3">
            <p className="text-sm font-medium text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-300">{getRoleLabel(user.role)}</p>
          </div>

          {/* Avatar y dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => router.push("/profile")}>Mi Perfil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
