import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Clock, CheckCircle } from "lucide-react"

interface MemberCardProps {
  member: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    avatarUrl?: string | null
  }
  progress: number
  pendingSkills: number
  completedSkills: number
}

export default function MemberCard({ member, progress, pendingSkills, completedSkills }: MemberCardProps) {
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

  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return "bg-gray-300"
    if (progress <= 20) return "bg-gray-400"
    if (progress <= 40) return "bg-green-400"
    if (progress <= 60) return "bg-green-500"
    if (progress <= 80) return "bg-green-600"
    return "bg-green-700"
  }

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            {member.avatarUrl && (
              <AvatarImage src={member.avatarUrl} alt={`${member.firstName} ${member.lastName}`} referrerPolicy="no-referrer" />
            )}
            <AvatarFallback className="bg-[#003366]/10 text-[#003366]">
              {getInitials(member.firstName, member.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {member.firstName} {member.lastName}
            </h3>
            <p className="text-sm text-gray-600">{member.email}</p>
            <span className="inline-block bg-[#003366]/10 text-[#003366] text-xs px-2 py-1 rounded-full mt-1">
              {getRoleLabel(member.role)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{progress}%</p>
          <p className="text-sm text-gray-600">Progreso</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(progress)}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Estadísticas de skills en formato row con iconos */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-[#FF6B35]" />
          <div>
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-lg font-semibold text-[#FF6B35]">{pendingSkills}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-lg font-semibold text-green-600">{completedSkills}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
