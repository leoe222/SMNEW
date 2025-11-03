import SummaryCard from "@/components/ui/SummaryCard"
// Tabs removed — dashboard simplified per request
import { Palette } from "lucide-react"

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

interface DesignerDashboardProps {
  user: UserProfile
}

// Tabs removed. Show overview content directly.

export default function DesignerDashboard({ user }: DesignerDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header removed per request */}

  {/* Resumen eliminado */}

  {/* SkillsOverview removed per request */}
    </div>
  )
}
