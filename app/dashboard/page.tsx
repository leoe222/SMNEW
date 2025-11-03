export const dynamic = 'force-dynamic'

import { getCurrentUserProfile } from '@/lib/actions/auth';
import Sidebar from '@/components/ui/Sidebar';
import DesignerDashboard from '@/components/dashboards/DesignerDashboard';
import LeaderDashboard from '@/components/dashboards/LeaderDashboard';
import HeadChapterDashboard from '@/components/dashboards/HeadChapterDashboard';
import StatsRow from "@/components/dashboards/StatsRow"
import SkillRadarChart from '@/components/charts/SkillRadarChart'
import { redirect } from 'next/navigation';
import Tabs from '@/components/ui/Tabs';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  // optional fields used in various parts of the dashboard
  stats?: {
    averageScore?: number
    maxScore?: number
    deltaText?: string
    objectivesCount?: number
    validatedCount?: number
    validatedTotal?: number
    lastUpdated?: string
  }
  averageScore?: number
  validatedCount?: number
  updatedAt?: string
  name?: string
  firstName?: string
  lastName?: string
}

interface NavbarUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default async function DashboardPage() {
  // Obtener el perfil del usuario de forma optimizadaaaaaaaa
  const userProfile = await getCurrentUserProfile();

  // Si no hay usuario autenticado, redirigir al login
  if (!userProfile) {
    redirect('/login');
  }

  // Objeto para el Navbar (con firstName, lastName)
  const userForNavbar: NavbarUser = {
    id: userProfile.id,
    email: userProfile.email,
    firstName: userProfile.first_name,
    lastName: userProfile.last_name,
    role: userProfile.role,
  };

  // Objeto para los dashboards que usan first_name, last_name
  const userForDashboards: UserProfile = {
    id: userProfile.id,
    email: userProfile.email,
    first_name: userProfile.first_name,
    last_name: userProfile.last_name,
    role: userProfile.role,
    avatar_url: userProfile.avatar_url,
    bio: userProfile.bio,
  };

  // prepare values (intenta leer datos reales, sino fallback)
  const average = userProfile?.stats?.averageScore ?? userProfile?.averageScore ?? 0
  const averageMax = userProfile?.stats?.maxScore ?? 5
  const delta = userProfile?.stats?.deltaText // dejamos delta undefined si no hay cálculo real

  const objectivesCount = userProfile?.stats?.objectivesCount ?? 4
  const validatedCount = userProfile?.stats?.validatedCount ?? userProfile?.validatedCount ?? 2
  const validatedTotal = userProfile?.stats?.validatedTotal ?? 15

  const lastUpdated = userProfile?.stats?.lastUpdated
    ? new Date(userProfile.stats.lastUpdated).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })
    : userProfile?.updatedAt
    ? new Date(userProfile.updatedAt).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })
    : "—"

  // derive display name for hero
  const displayFirst = userProfile?.firstName || userProfile?.first_name || (userProfile?.name ? userProfile.name.split(" ")[0] : "") || ""
  const displayFull = [userProfile?.firstName || userProfile?.first_name || (userProfile?.name ? userProfile.name.split(" ")[0] : ""), userProfile?.lastName || userProfile?.last_name || (userProfile?.name ? userProfile.name.split(" ").slice(1).join(" ") : "")].filter(Boolean).join(" ")

  const isLeader = userProfile.role === 'leader'

  // Renderizar dashboard para roles que no son líder
  const renderNonLeaderDashboard = () => {
    switch (userProfile.role) {
      case 'designer':
        return <DesignerDashboard user={userForDashboards} />
      case 'head_chapter':
        return <HeadChapterDashboard user={userForDashboards} />
      default:
        return <DesignerDashboard user={userForDashboards} />
    }
  }
  console.log("test")
  return (
    <>
      <Sidebar user={userProfile} />

      <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero (single instance) */}
          <header className="mb-8">
            <div className="bg-transparent">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                ¡Hola, {displayFirst || "Usuario"}!
              </h1>
              <p className="mt-2 text-lg text-gray-600 max-w-3xl">
                Explora tu crecimiento profesional y descubre nuevas oportunidades de aprendizaje
              </p>
            </div>
          </header>

          {isLeader ? (
            <Tabs
              defaultActiveTab="mi-equipo"
              tabs={[
                {
                  id: 'mi-equipo',
                  label: 'Mi Equipo',
                  iconName: 'Users',
                  content: <LeaderDashboard />
                },
                {
                  id: 'mi-perfil',
                  label: 'Mi Perfil',
                  iconName: 'User',
                  content: (
                    <div>
                      <StatsRow
                        average={average}
                        averageMax={averageMax}
                        delta={delta}
                        objectivesCount={objectivesCount}
                        validatedCount={validatedCount}
                        validatedTotal={validatedTotal}
                        lastUpdated={lastUpdated}
                      />
                      <div className="my-8">
                        <SkillRadarChart />
                      </div>
                    </div>
                  )
                }
              ]}
            />
          ) : (
            <>
              <StatsRow
                average={average}
                averageMax={averageMax}
                delta={delta}
                objectivesCount={objectivesCount}
                validatedCount={validatedCount}
                validatedTotal={validatedTotal}
                lastUpdated={lastUpdated}
              />
              <div className="my-8">
                <SkillRadarChart />
              </div>
              {renderNonLeaderDashboard()}
            </>
          )}
        </div>
      </main>
    </>
  );
}
