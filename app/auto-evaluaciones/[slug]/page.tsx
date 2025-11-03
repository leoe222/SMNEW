export const dynamic = 'force-dynamic'

import { getCurrentUserProfile } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/ui/Sidebar'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CategoryAssessmentForm from '@/components/forms/CategoryAssessmentForm'
import { findCategory } from '@/data/categories'
import { getCategorySkills } from '@/data/skills'

// Next.js App Router page: accept params directly as part of the PageProps shape
// Relajar tipado para evitar conflicto con constraint PageProps durante el build
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // En Next.js 15 los params pueden ser una Promise: se deben await antes de usarlos
  const { slug } = await params
  const userProfile = await getCurrentUserProfile()

  if (!userProfile) {
    redirect('/login')
  }

  const raw = slug ?? ''
  const title = raw.replace(/-/g, ' ')
  const displayTitle = title
    .split(' ')
    .map((s: string) => (s.length ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ')

  const safeSlug = slug ?? 'unknown'

  const sampleMeta = findCategory(safeSlug) || {
    slug: safeSlug,
  label: displayTitle.replace(/\b\w/g, (c: string) => c.toUpperCase()),
    description: 'Completa las habilidades para esta categoría.',
  image: `/images/auto-eval/${slug}.png`,
  }

  const sampleSkills = getCategorySkills(safeSlug).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    currentScore: null,
    levels: s.levels,
  }))

  // Prefetch user assessments (approved and pending) and map by title
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Mapear skills de DB por nombre para obtener skill_id aunque no existan evaluaciones previas
      const { data: allSkills } = await supabase.from('skills').select('id, name')
      const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
      const skillIdByTitle = new Map<string, string>()
      for (const sk of (allSkills || []) as any[]) {
        if (sk?.name) skillIdByTitle.set(norm(sk.name), sk.id)
      }

      const { data, error } = await supabase
    .from('skill_assessments')
        .select('skill_id, numeric_level, level, status, rejection_reason, approved_at, approved_by, rejected_at, rejected_by, created_at, updated_at, skills(name)')
        .eq('user_id', user.id)
      if (!error && data) {
        // Resolver nombres de aprobadores/rechazadores
        const peopleIds = Array.from(new Set((data as any[]).flatMap(r => [r.approved_by, r.rejected_by]).filter(Boolean)))
        const nameById = new Map<string, string>()
        if (peopleIds.length) {
          const { data: people } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', peopleIds)
          if (people) {
            for (const p of people as any[]) {
              nameById.set(p.id, `${p.first_name || ''} ${p.last_name || ''}`.trim() || '—')
            }
          }
        }

        // Mapear por skill_id para evitar problemas de títulos
  const byId = new Map<string, { level: number | null; status: string; rejection_reason?: string; status_at?: string | null; approved_by_name?: string | null; rejected_by_name?: string | null }>()
        for (const row of data as any[]) {
          if (!row?.skill_id) continue
          // Tomar primero numeric_level; si no existe, usar level si es entero (0-5); si es texto, mapear a 0-5
          let lvl: number | null = null
          if (typeof row.numeric_level === 'number') {
            lvl = row.numeric_level
          } else if (typeof row.level === 'number') {
            lvl = row.level
          } else if (typeof row.level === 'string') {
            const m = String(row.level).toLowerCase()
            lvl = m === 'advanced' ? 5 : m === 'intermediate' ? 3 : m === 'basic' ? 1 : null
          }
      // Determinar fecha relevante según estado
      let statusAt: string | null = null
      if (row.status === 'approved' && row.approved_at) statusAt = row.approved_at
      else if (row.status === 'rejected' && row.rejected_at) statusAt = row.rejected_at
      else if (row.status === 'pending') statusAt = row.updated_at || row.created_at || null
          byId.set(String(row.skill_id), {
            level: lvl,
            status: row.status,
            rejection_reason: row.rejection_reason,
            status_at: statusAt,
            approved_by_name: row.approved_by ? (nameById.get(row.approved_by) || null) : null,
            rejected_by_name: row.rejected_by ? (nameById.get(row.rejected_by) || null) : null,
          })
        }
        for (const sk of sampleSkills) {
          // asegurar dbSkillId aún si no tenía evaluaciones
          if (!(sk as any).dbSkillId) {
            const maybeId = skillIdByTitle.get(norm(sk.title))
            if (maybeId) (sk as any).dbSkillId = maybeId
          }
          const dbId = (sk as any).dbSkillId as string | undefined
          const hit = dbId ? byId.get(dbId) : undefined
          if (hit) {
            if (typeof hit.level === 'number') sk.currentScore = hit.level as any
            ;(sk as any).status = hit.status
            if (hit.status === 'rejected' && hit.rejection_reason) {
              ;(sk as any).rejectionReason = hit.rejection_reason
            }
            if (hit.status_at) {
              ;(sk as any).statusAt = hit.status_at
            }
            if (hit.approved_by_name) {
              ;(sk as any).approvedByName = hit.approved_by_name
            }
            if (hit.rejected_by_name) {
              ;(sk as any).rejectedByName = hit.rejected_by_name
            }
          }
        }
      }
    }
  } catch (e) {
    // no bloquear la página por stats
  }

  return (
    <>
      <Sidebar user={userProfile} />

      <main className="flex-1 md:ml-64 bg-gray-50 min-h-screen">
  <div className="max-w-7xl w-full mx-auto px-6 py-10">
          <Link href="/auto-evaluaciones" className="text-sm text-indigo-600 underline">← Volver a Auto-evaluaciones</Link>

          <CategoryAssessmentForm slug={safeSlug} meta={sampleMeta} skills={sampleSkills} />
        </div>
      </main>
    </>
  )
}
