import { Users, Clock, TrendingUp, CheckCircle, type LucideIcon } from "lucide-react"

export interface LeaderSummaryCard {
  id: string
  title: string
  value: string
  icon: LucideIcon
  bgColor: string
  textColor: string
  iconColor: string
  subtitle?: string
  borderColor?: string
}

export const leaderSummaryData: LeaderSummaryCard[] = [
  {
    id: "team-members",
    title: "Miembros del Equipo",
    value: "0",
  icon: Users,
  bgColor: "bg-white",
  textColor: "text-gray-800",
  iconColor: "bg-green-500",
  subtitle: "en tu equipo",
  borderColor: "border-indigo-500",
  },
  {
    id: "pending-approvals",
    title: "Aprobaciones Pendientes",
    value: "0",
  icon: Clock,
  bgColor: "bg-white",
  textColor: "text-gray-800",
  iconColor: "bg-amber-500",
  subtitle: "por revisar",
  borderColor: "border-amber-500",
  },
  {
    id: "average-progress",
    title: "Promedio de Progreso",
    value: "0%",
  icon: TrendingUp,
  bgColor: "bg-white",
  textColor: "text-gray-800",
  iconColor: "bg-blue-500",
  subtitle: "global del equipo",
  borderColor: "border-emerald-500",
  },
  {
    id: "approved-skills",
    title: "Skills Aprobadas",
    value: "0",
  icon: CheckCircle,
  bgColor: "bg-white",
  textColor: "text-gray-800",
  iconColor: "bg-purple-500",
  subtitle: "totales",
  borderColor: "border-violet-500",
  },
]
