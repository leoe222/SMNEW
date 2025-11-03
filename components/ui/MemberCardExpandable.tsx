"use client"

import { useState, useEffect, useMemo } from 'react'
import categories from '@/data/categories'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Clock, CheckCircle, ChevronDown } from 'lucide-react'

interface EvaluatedSkill {
  id: string
  name: string
  category?: string
  numericLevel: number
  status?: string
}

interface MemberCardExpandableProps {
  member: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    squad?: string | null
    avatarUrl?: string | null
  }
  progress: number
  pendingSkills: number
  completedSkills: number
  autoOpen?: boolean
}

export default function MemberCardExpandable(props: MemberCardExpandableProps) {
  const { autoOpen } = props
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [skills, setSkills] = useState<EvaluatedSkill[]>([])

  const toggle = async () => {
  if (!open && skills.length === 0) {
      setLoading(true)
      try {
        const res = await fetch(`/api/team/member/${props.member.id}`)
  const json = await res.json()
  // Debug: log raw skills
  console.debug('Fetched member skills', props.member.id, json)
  setSkills(json.skills || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    setOpen(o => !o)
  }

  // Auto open first card if requested
  useEffect(() => {
    if (autoOpen && !open) {
      toggle()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'designer': return 'Product Designer'
      case 'leader': return 'Líder'
      case 'head_chapter': return 'Head Chapter'
      case 'admin': return 'Administrador'
      default: return role
    }
  }

  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-300'
    if (progress <= 20) return 'bg-gray-400'
    if (progress <= 40) return 'bg-green-400'
    if (progress <= 60) return 'bg-green-500'
    if (progress <= 80) return 'bg-green-600'
    return 'bg-green-700'
  }

  const { strengths, opportunities } = useMemo(() => {
    if (!skills.length) return { strengths: [], opportunities: [] as EvaluatedSkill[] }
  const sorted = [...skills].sort((a,b)=> b.numericLevel - a.numericLevel)
    return {
    strengths: sorted.slice(0,3),
    opportunities: [...sorted].reverse().slice(0,3)
    }
  }, [skills])

  return (
    <div className="relative bg-white rounded-lg border p-6 shadow-sm transition-colors">
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="absolute inset-0 w-full h-full cursor-pointer focus:outline-none rounded-lg"
        tabIndex={0}
      >
        <span className="sr-only">{open ? 'Ocultar detalles de miembro' : 'Mostrar detalles de miembro'}</span>
      </button>
      <div className="flex items-start justify-between mb-4 pointer-events-none">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            {props.member.avatarUrl && (
              <AvatarImage src={props.member.avatarUrl} alt={`${props.member.firstName} ${props.member.lastName}`} referrerPolicy="no-referrer" />
            )}
            <AvatarFallback className="bg-[#003366]/10 text-[#003366]">{getInitials(props.member.firstName, props.member.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{props.member.firstName} {props.member.lastName}</h3>
            <p className="text-sm text-gray-600">{props.member.email}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="inline-block bg-[#003366]/10 text-[#003366] text-xs px-2 py-1 rounded-full">{getRoleLabel(props.member.role)}</span>
              {props.member.squad && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{props.member.squad}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{props.progress}%</p>
          <p className="text-sm text-gray-600">Progreso</p>
        </div>
      </div>
      <div className="mb-6 pointer-events-none">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(props.progress)}`} style={{ width: `${props.progress}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-[#FF6B35]" />
          <div>
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-lg font-semibold text-[#FF6B35]">{props.pendingSkills}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-lg font-semibold text-green-600">{props.completedSkills}</p>
          </div>
        </div>
      </div>
      <div className={`absolute top-4 right-4 text-gray-400 transition-transform pointer-events-none ${open ? 'rotate-180' : ''}`}>
        <ChevronDown className="h-5 w-5" />
      </div>
      {open && (
        <div className="mt-8">
          {loading ? (
            <div className="text-sm text-gray-500">Cargando fortalezas y oportunidades...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Top 3 Fortalezas</h4>
                <ul className="space-y-4">
                  {strengths.map(s => (
                    <li key={s.id} className="space-y-1">
                      <div className="leading-snug">
                        {s.category && (
                          <div className="text-[12px] text-gray-500 font-medium">
                            {categories.find(c => c.slug === s.category)?.label || s.category}
                          </div>
                        )}
                        <div className="text-[12px] font-semibold text-gray-800">{s.name}</div>
                      </div>
                      <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: `${(s.numericLevel/5)*100}%` }} />
                      </div>
                    </li>
                  ))}
                  {!strengths.length && <li className="text-xs text-gray-400">Sin datos</li>}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Top 3 Oportunidades</h4>
                <ul className="space-y-4">
                  {opportunities.map(s => (
                    <li key={s.id} className="space-y-1">
                      <div className="leading-snug">
                        {s.category && (
                          <div className="text-[12px] text-gray-500 font-medium">
                            {categories.find(c => c.slug === s.category)?.label || s.category}
                          </div>
                        )}
                        <div className="text-[12px] font-semibold text-gray-800">{s.name}</div>
                      </div>
                      <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: `${(s.numericLevel/5)*100}%` }} />
                      </div>
                    </li>
                  ))}
                  {!opportunities.length && <li className="text-xs text-gray-400">Sin datos</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
