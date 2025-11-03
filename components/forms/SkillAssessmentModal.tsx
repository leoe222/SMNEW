"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface Skill {
  id: string
  title: string
  description?: string
  currentScore?: number | null
  comment?: string | null
  levels?: { level: number; label: string; description: string }[]
  status?: 'approved' | 'pending' | 'rejected'
  rejectionReason?: string | null
}

interface Props {
  skill: Skill | null
  open: boolean
  onClose: () => void
  onSave: (skillId: string, score: number | null, comment: string) => Promise<void> | void
}

const OPTIONS: { value: number; label: string; short: string }[] = [
  { value: 0, label: 'No familiarizado', short: 'No conozco el concepto.' },
  { value: 1, label: 'Comprendo', short: 'Entiendo propósito básico.' },
  { value: 2, label: 'En desarrollo', short: 'Aplico con guía ocasional.' },
  { value: 3, label: 'Autónomo', short: 'Ejecuto sin ayuda.' },
  { value: 4, label: 'Promuevo', short: 'Guío a otros.' },
  { value: 5, label: 'Transformo', short: 'Genero innovación.' },
]

export default function SkillAssessmentModal({ skill, open, onClose, onSave }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (skill) {
      // Si no tiene score previo, no seleccionamos nada.
      // Si tiene score previo (ya fue evaluada antes) lo mostramos.
      setSelected(skill.currentScore != null ? skill.currentScore : null)
      setComment(skill.comment ?? '')
    } else {
      setSelected(null)
      setComment('')
    }
  }, [skill])

  const contextualDescriptions = useMemo(
    () => skill?.levels?.reduce<Record<number, string>>((acc, l) => { acc[l.level] = l.description; return acc }, {}) || {},
    [skill?.levels]
  )

  const levelLabel = useMemo(() => {
    if (skill?.currentScore == null) return null
    const opt = OPTIONS.find(o => o.value === skill.currentScore)
    return opt ? `${opt.label} (${opt.value})` : `${skill.currentScore}`
  }, [skill?.currentScore])

  const statusDateText = useMemo(() => {
    const iso = (skill as any)?.statusAt as string | null | undefined
    if (!iso) return null
    try {
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return null
      return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return null
    }
  }, [skill])

  const handleSave = async () => {
    if (!skill) return
    setSaving(true)
    try { await onSave(skill.id, selected, comment) } finally { setSaving(false); onClose() }
  }

  if (!open || !skill) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !saving && onClose()} />
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-gray-200 animate-in fade-in zoom-in">
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{skill.title}</h2>
            {skill.description && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{skill.description}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={saving}>✕</button>
        </div>
        <div className="p-6 space-y-8">
          {/* Estado actual de la evaluación */}
          {skill.status && (
            <div>
      {skill.status === 'pending' && (
                <div className="flex items-start gap-3 p-3 rounded-md border border-amber-200 bg-amber-50 text-amber-900">
                  <Clock className="h-5 w-5 mt-0.5 text-amber-600" aria-hidden="true" />
                  <div className="text-sm">
                    <div className="font-medium">Pendiente de aprobación{levelLabel ? ` · Nivel actual: ${levelLabel}` : ''}{statusDateText ? ` · ${statusDateText}` : ''}</div>
                    <p className="mt-0.5">Tu líder aún no revisa esta autoevaluación. Puedes actualizar el nivel y se mantendrá pendiente.</p>
                  </div>
                </div>
              )}
              {skill.status === 'rejected' && (
                <div className="flex items-start gap-3 p-3 rounded-md border border-red-200 bg-red-50 text-red-900">
                  <XCircle className="h-5 w-5 mt-0.5 text-red-600" aria-hidden="true" />
                  <div className="text-sm">
        <div className="font-medium">Evaluación rechazada{levelLabel ? ` · Nivel actual: ${levelLabel}` : ''}{statusDateText ? ` · ${statusDateText}` : ''}{(skill as any).rejectedByName ? ` · por ${(skill as any).rejectedByName}` : ''}</div>
                    {skill.rejectionReason ? (
                      <p className="mt-0.5">Motivo: {skill.rejectionReason}</p>
                    ) : (
                      <p className="mt-0.5">Tu líder rechazó esta evaluación. Revisa y selecciona un nuevo nivel.</p>
                    )}
                  </div>
                </div>
              )}
              {skill.status === 'approved' && (
                <div className="flex items-start gap-3 p-3 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-900">
                  <CheckCircle className="h-5 w-5 mt-0.5 text-emerald-600" aria-hidden="true" />
                  <div className="text-sm">
        <div className="font-medium">Evaluación aprobada{levelLabel ? ` · Nivel actual: ${levelLabel}` : ''}{statusDateText ? ` · ${statusDateText}` : ''}{(skill as any).approvedByName ? ` · por ${(skill as any).approvedByName}` : ''}</div>
                    <p className="mt-0.5">Si actualizas el nivel, la evaluación pasará nuevamente a estado pendiente para aprobación.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Selecciona tu nivel</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {OPTIONS.map(opt => <LevelOption key={opt.value} opt={opt} selected={selected} setSelected={setSelected} contextual={contextualDescriptions[opt.value]} />)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cuéntanos un poco más</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full border rounded-md p-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej: He facilitado..." />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  )
}

function LevelOption({ opt, selected, setSelected, contextual }: { opt: { value: number; label: string; short: string }; selected: number | null; setSelected: (v: number) => void; contextual?: string }) {
  const prev = useRef<number | null>(null)
  const [flash, setFlash] = useState(false)
  const active = selected === opt.value
  useEffect(() => {
    if (prev.current !== selected && active) {
      setFlash(true); const t = setTimeout(() => setFlash(false), 350); return () => clearTimeout(t)
    }
    prev.current = selected
  }, [selected, active])
  return (
    <button
      type="button"
      onClick={() => setSelected(opt.value)}
      className={`text-left relative rounded-lg border p-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${active ? 'border-indigo-500 shadow-md bg-indigo-50' : 'border-gray-200 hover:border-indigo-400'} ${flash ? 'ring-2 ring-indigo-300' : ''}`}
    >
      <div className="font-semibold text-sm">{opt.label}</div>
      <div className="mt-1 text-xs text-gray-600 leading-relaxed">{contextual || opt.short}</div>
      {active && <span className="absolute top-2 right-2 text-[11px] inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white font-semibold">{opt.value}</span>}
    </button>
  )
}
