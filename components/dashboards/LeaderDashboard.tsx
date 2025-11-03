// Server component: compute stats on the server and render content
import { ActivityIcon, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { leaderSummaryData } from "@/lib/data/leaderSummaryData"
import { getTeamStats } from "@/lib/actions/team"
import InteractiveTabs from "./InteractiveTabs"
import ChapterRadarChart from "@/components/charts/ChapterRadarChart"
import TeamImprovementChart from "@/components/charts/TeamImprovementChart"

function LeaderDashboardContent({ teamStats }: { teamStats: any }) {
  // Actualizar los datos con información real
  const updatedSummaryData = leaderSummaryData.map((card) => {
    switch (card.id) {
      case "team-members":
        return { ...card, value: teamStats.totalMembers.toString() }
      case "pending-approvals":
        return { ...card, value: teamStats.pendingApprovals.toString() }
      case "average-progress":
        return { ...card, value: `${teamStats.averageProgress}%` }
      case "approved-skills":
        return { ...card, value: teamStats.approvedSkills.toString() }
      default:
        return card
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left">
        <div className="flex items-center mb-2">
          <ActivityIcon className="h-8 w-8 text-[#003366] mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Liderazgo </h1>
        </div>
        <p className="text-lg text-gray-600 mb-6">Gestiona el desarrollo de tu equipo de Product Designers</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            <FileText className="h-4 w-4" />
            Generar Reporte
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            <Calendar className="h-4 w-4" />
            Agendar Reunión de Equipo
          </Button>
        </div>
      </div>

      {/* Summary Cards estilo perfil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {updatedSummaryData.map(card => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              className={`bg-white rounded-lg p-6 shadow-sm border-b-4 ${card.borderColor || 'border-gray-300'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">{card.title}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="text-3xl font-extrabold text-gray-900">{card.value}</div>
                    {card.subtitle && <div className="text-sm text-gray-500">{card.subtitle}</div>}
                  </div>
                </div>
                <div className={`p-2 rounded-full ${card.iconColor}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive Tabs + persistent right charts */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          <InteractiveTabs />
        </div>
        <div className="w-full lg:w-[520px] xl:w-[560px] flex flex-col gap-8 sticky top-4 self-start">
          <ChapterRadarChart />
          <TeamImprovementChart />
        </div>
      </div>
    </div>
  )
}

export default async function LeaderDashboard() {
  const teamStats = await getTeamStats()
  return <LeaderDashboardContent teamStats={teamStats} />
}
