"use client"

import { Users, ClipboardCheck, TrendingUp, BarChart3, Trophy } from "lucide-react"

interface TabButtonProps {
  id: string
  label: string
  iconName: string
  isActive: boolean
  onClick: () => void
}

export default function TabButton({ id: _id, label, iconName, isActive, onClick }: TabButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getIcon = (name: string) => {
    switch (name) {
      case "Users":
        return <Users className="h-4 w-4" />
      case "ClipboardCheck":
        return <ClipboardCheck className="h-4 w-4" />
      case "TrendingUp":
        return <TrendingUp className="h-4 w-4" />
      case "BarChart3":
        return <BarChart3 className="h-4 w-4" />
      case "Trophy":
        return <Trophy className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive ? "bg-white text-[#003366] shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {getIcon(iconName)}
      <span>{label}</span>
    </button>
  )
}
