"use client"

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import SkillAssessmentCard from './SkillAssessmentCard'
import SkillAssessmentModal from './SkillAssessmentModal'

interface Skill {
  id: string
  title: string
  description?: string
  currentScore?: number | null
  comment?: string | null
  levels?: { level: number; label: string; description: string }[]
  status?: 'approved' | 'pending' | 'rejected'
  dbSkillId?: string
  rejectionReason?: string | null
  statusAt?: string | null
  approvedByName?: string | null
  rejectedByName?: string | null
}

interface CategoryMeta {
  slug: string
  label?: string
  description?: string
  image?: string
}

interface Props {
  slug: string
  meta?: CategoryMeta
  skills: Skill[]
}

function computeStats(skills: Skill[]) {
  const total = skills.length
  const completed = skills.filter((s) => s.currentScore != null).length
  // Promedio SOLO con evaluaciones aprobadas
  const approvedScores = skills.filter((s) => s.status === 'approved' && s.currentScore != null)
  const sumApproved = approvedScores.reduce((acc, s) => acc + (s.currentScore ?? 0), 0)
  const avgVal = approvedScores.length ? +(sumApproved / approvedScores.length).toFixed(1) : 0
  const approved = skills.filter(s => s.status === 'approved').length
  const pending = skills.filter(s => s.status === 'pending').length
  return { total, completed, avg: avgVal, approved, pending }
}

export default function CategoryAssessmentForm({ slug, meta, skills: initialSkills }: Props) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const persistKey = `assessment:${slug}`

  // hydration from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(persistKey)
      if (raw) {
        const entries: { skillId: string; score: number | null; comment: string; status?: 'pending'|'approved'|'rejected' }[] = JSON.parse(raw)
        if (Array.isArray(entries) && entries.length) {
          setSkills(prev => prev.map(s => {
            const last = [...entries].reverse().find(e => e.skillId === s.id)
            // Si hay estado local (pending) y no tenemos estado del server, mantenerlo para que el badge no desaparezca al refrescar
            return last
              ? { ...s, currentScore: last.score, comment: last.comment, status: s.status ?? last.status }
              : s
          }))
        }
      }
    } catch (e) {
      console.warn('Hydration failed', e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey])

  const stats = useMemo(() => computeStats(skills), [skills])

  const handleSave = useCallback(async (skillId: string, score: number | null, comment: string) => {
    // Update UI immediately (optimistic), mark as pending when user selects a level
    const next = skills.map((s) => (
      s.id === skillId
        ? { ...s, currentScore: score ?? null, status: typeof score === 'number' ? 'pending' : s.status }
        : s
    ))
    setSkills(next.map(s => s.id === skillId ? { ...s, comment } : s))

  const payload = { skillId, score, comment, status: typeof score === 'number' ? 'pending' as const : undefined, updatedAt: new Date().toISOString() }
    try {
      let existing = JSON.parse(localStorage.getItem(persistKey) || '[]')
      if (!Array.isArray(existing)) existing = []
  // remove previous entries for this skill to avoid unbounded growth
      existing = existing.filter((e: any) => e.skillId !== skillId)
      existing.push(payload)
      localStorage.setItem(persistKey, JSON.stringify(existing))
    } catch (e) {
      console.error('failed to persist', e)
    }

    // Persist to server (pending for approval)
    try {
      const skill = skills.find(s => s.id === skillId)
      if (skill && typeof score === 'number') {
        const res = await fetch('/api/assessments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: skill.title, skillId: skill.dbSkillId, numericLevel: score, justification: comment }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || data?.success === false) {
          // rollback pending flag if server failed
          setSkills(prev => prev.map(s => s.id === skillId ? { ...s, status: undefined } : s))
        }
      }
    } catch (e) {
      console.warn('Server save failed (kept local backup):', e)
    }
  }, [skills, persistKey])

  const [condensed, setCondensed] = useState(false)
  const headerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setCondensed(!entry.isIntersecting)
      },
      { root: null, threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const progressPct = (stats.completed / Math.max(1, stats.total)) * 100

  return (
    <div className="relative">
      {/* Sticky condensed header */}
      <div className={`sticky top-0 z-40 transition-all duration-300 ${condensed ? 'bg-white border-b shadow-md' : 'bg-transparent'} `}>
        <div className={`max-w-7xl mx-auto px-2 sm:px-4 ${condensed ? 'py-3' : 'py-0'} flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-6 min-w-0 w-full">
            <h1 className={`font-bold tracking-tight ${condensed ? 'text-lg whitespace-nowrap flex-shrink-0' : 'text-transparent h-0 overflow-hidden -mb-6'} `}>{meta?.label ?? slug}</h1>
            {condensed && (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{stats.completed} de {stats.total}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-2 bg-green-600 transition-all" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{Math.round(progressPct)}%</span>
              </div>
            )}
          </div>
          {condensed && (
            <div className="flex items-center gap-2 pr-2">
              <span className="text-2xl font-extrabold tabular-nums">{stats.avg}</span>
              <span className="text-xs text-gray-500">Promedio</span>
            </div>
          )}
        </div>
      </div>

      {/* Full header (observed for collapse trigger) now on gray background */}
      <div ref={headerRef} className="mt-2 mb-8">
        {/* Título + barra de progreso */}
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight">{meta?.label ?? slug}</h1>
          <div className="mt-4">
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-2 bg-green-600 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700 mt-2">
              <span>{stats.completed} de {stats.total}</span>
              <span className="text-gray-400">|</span>
              <span>{Math.round(progressPct)}% Completado</span>
            </div>
          </div>
        </div>
        {/* Imagen + descripción + promedio a la derecha */}
        <div className="mt-6 flex items-start justify-between gap-10">
          <div className="flex items-start gap-6 flex-1 min-w-0">
            {meta?.image ? (
              <img
                src={meta.image}
                alt={meta.label ?? slug}
                className="w-28 h-28 object-contain flex-shrink-0"
              />
            ) : null}
            <p className="text-base text-gray-700 leading-relaxed">
              {meta?.description ?? 'Completa las habilidades para esta categoría.'} <a href="#" className="text-indigo-600 underline font-medium">Quiero saber más</a>
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-3xl font-extrabold tabular-nums">{stats.avg}</div>
            <div className="text-sm text-gray-500">Promedio</div>
            <div className="text-[10px] text-gray-400">Solo evaluaciones aprobadas</div>
            <div className="mt-1 text-xs text-gray-500">✔︎ {stats.approved} aprobadas · ⏳ {stats.pending} pendientes</div>
          </div>
        </div>
      </div>

      {/* Question heading below header */}
      <h2 className="text-2xl font-semibold tracking-tight mb-6">
       Mapea tu experiencia con las siguientes habilidades:
      </h2>

      <SkillCardsList slug={slug} skills={skills} onSave={handleSave} />
    </div>
  )
}

function SkillCardsList({ skills, onSave, slug }: { skills: Skill[]; onSave: (id: string, score: number | null, comment: string) => Promise<void> | void; slug: string }) {
  const [active, setActive] = useState<Skill | null>(null)
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skills.map((s) => (
          <SkillAssessmentCard key={s.id} skill={s} onOpen={setActive as any} />
        ))}
      </div>
      <SkillAssessmentModal
        skill={active}
        open={!!active}
        onClose={() => setActive(null)}
        onSave={onSave}
      />
    </>
  )
}
