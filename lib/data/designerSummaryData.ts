import { TrendingUp, Award, Target, Zap, type LucideIcon } from "lucide-react"

export interface SummaryData {
  title: string
  value: string | number
  icon: LucideIcon
  bgColor: string
  textColor: string
  iconColor: string
}

export const designerSummaryData: SummaryData[] = [
  {
    title: "Nivel Actual",
    value: "Senior",
    icon: TrendingUp,
    bgColor: "bg-gradient-to-br from-[#003366] to-[#002244]",
    textColor: "text-white",
    iconColor: "bg-[#003366]/80",
  },
  {
    title: "Racha Actual",
    value: "15 días",
    icon: Zap,
    bgColor: "bg-gradient-to-br from-emerald-700 to-emerald-800",
    textColor: "text-white",
    iconColor: "bg-emerald-600",
  },
  {
    title: "Badges",
    value: "8",
    icon: Award,
    bgColor: "bg-gradient-to-br from-[#FF6B35] to-[#E55A2B]",
    textColor: "text-white",
    iconColor: "bg-[#FF6B35]/80",
  },
  {
    title: "Skills Pendientes",
    value: "3",
    icon: Target,
    bgColor: "bg-gradient-to-br from-amber-700 to-amber-800",
    textColor: "text-white",
    iconColor: "bg-amber-600",
  },
]
