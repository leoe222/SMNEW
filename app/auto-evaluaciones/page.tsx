export const dynamic = 'force-dynamic'

import { getCurrentUserProfile } from '@/lib/actions/auth'
import Sidebar from '@/components/ui/Sidebar'
import CategoryCardsGrid from '@/components/ui/CategoryCardsGrid'
// import AssessmentTab from '@/components/dashboards/AssessmentTab'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AutoEvaluacionesPage() {
  const userProfile = await getCurrentUserProfile()

  if (!userProfile) {
    redirect('/login')
  }

  // Calcular promedio general aprobado del usuario (0-5)
  let overallAvg = 0
  let overallCount = 0
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('skill_assessments')
        .select('skill_id, numeric_level, level, status, approved_at, updated_at, created_at')
        .eq('user_id', user.id)
        .eq('status', 'approved')

      if (!error && data) {
        // Mantener el último registro aprobado por skill_id
        type Row = { skill_id: string; numeric_level: number | null; level: number | string | null; approved_at: string | null; updated_at: string | null; created_at: string | null }
        const latestBySkill = new Map<string, Row>()
        for (const r of data as any[]) {
          const key = String(r.skill_id)
          const prev = latestBySkill.get(key)
          const currDate = new Date(r.approved_at || r.updated_at || r.created_at || 0).getTime()
          const prevDate = prev ? new Date(prev.approved_at || prev.updated_at || prev.created_at || 0).getTime() : -1
          if (!prev || currDate >= prevDate) {
            latestBySkill.set(key, r as Row)
          }
        }

        let sum = 0
        let count = 0
        for (const r of latestBySkill.values()) {
          let lvl: number | null = null
          if (typeof r.numeric_level === 'number') lvl = r.numeric_level
          else if (typeof r.level === 'number') lvl = r.level
          else if (typeof r.level === 'string') {
            const m = r.level.toLowerCase()
            lvl = m === 'advanced' ? 5 : m === 'intermediate' ? 3 : m === 'basic' ? 1 : null
          }
          if (typeof lvl === 'number' && !Number.isNaN(lvl)) {
            sum += lvl
            count += 1
          }
        }
        overallCount = count
        overallAvg = count ? +(sum / count).toFixed(1) : 0
      }
    }
  } catch {
    // Ignorar errores para no bloquear la vista
  }

  return (
    <>
      <Sidebar user={userProfile} />

      <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-6">
            <header className="mb-2 flex items-start justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold">Auto evaluación de habilidades</h1>
                <p className="text-gray-600 mt-2">Selecciona una categoría de competencias para comenzar tu auto evaluación.</p>
              </div>
              <div className="ml-auto">
                <div className="text-sm text-gray-500 text-right">Promedio general (aprobado)</div>
                <div className="text-3xl font-extrabold text-black text-right">{overallAvg.toFixed(1)}</div>
                <div className="text-xs text-gray-400 text-right">Solo evaluaciones aprobadas{overallCount ? ` • ${overallCount} skills` : ''}</div>
              </div>
            </header>
          </div>

          <section>
            <CategoryCardsGrid />
          </section>
        </div>
      </main>
    </>
  )
}
