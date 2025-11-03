"use client"

import { Avatar, AvatarFallback } from "./avatar"
import { CheckCircle, Clock } from "lucide-react"
import { useMemo } from "react"

export interface EvaluatedSkill {
  id: string
  name: string
  numericLevel: number
  status?: string
}

export interface TeamMemberProfileCardProps {
  member: {
    id: string
    firstName: string
    lastName: string
    email?: string
    role: string
    squad?: string | null
    avatarUrl?: string | null
  }
  skills: EvaluatedSkill[]
}

function roleLabel(role: string) {
  switch (role) {
    case 'designer': return 'Product Designer'
    case 'leader': return 'Líder'
    case 'head_chapter': return 'Head Chapter'
    case 'admin': return 'Administrador'
    default: return role
  }
}

function progressColor(percent: number) {
  if (percent === 0) return 'bg-gray-300'
  if (percent <= 20) return 'bg-gray-400'
  if (percent <= 40) return 'bg-green-400'
  if (percent <= 60) return 'bg-green-500'
  if (percent <= 80) return 'bg-green-600'
  return 'bg-green-700'
}

export default function TeamMemberProfileCard({ member, skills }: TeamMemberProfileCardProps) {
  const initials = `${member.firstName?.[0] || ''}${member.lastName?.[0] || ''}`.toUpperCase()

  const { progressPercent, completedCount, pendingCount, strengths, opportunities } = useMemo(() => {
    if (!skills.length) return { progressPercent: 0, completedCount: 0, pendingCount: 0, strengths: [], opportunities: [] }
    const completed = skills.filter(s => s.status === 'approved')
    const pending = skills.filter(s => s.status === 'pending')
    const averageNumeric = skills.reduce((sum, s) => sum + (s.numericLevel || 0), 0) / skills.length
    const progressPercent = Math.round((averageNumeric / 5) * 100)
    const sorted = [...skills].sort((a,b)=> b.numericLevel - a.numericLevel)
    const strengths = sorted.slice(0,3)
    const opportunities = [...sorted].reverse().slice(0,3)
    return {
      progressPercent,
      completedCount: completed.length,
      pendingCount: pending.length,
      strengths,
      opportunities
    }
  }, [skills])

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-gray-200 text-[#003366] font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 leading-tight">{member.firstName} {member.lastName}</h3>
            {member.email && (<p className="text-sm text-gray-600">{member.email}</p>)}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-block bg-[#003366]/10 text-[#003366] text-xs px-2 py-1 rounded-full">{roleLabel(member.role)}</span>
              {member.squad && <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{member.squad}</span>}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{progressPercent}%</p>
          <p className="text-sm text-gray-600">Progreso</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className={`h-3 rounded-full ${progressColor(progressPercent)} transition-all`} style={{ width: `${progressPercent}%`}} />
        </div>
      </div>

      <div className="flex items-center gap-10 mb-8">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#FF6B35]" />
          <div>
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-lg font-semibold text-[#FF6B35]">{pendingCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-lg font-semibold text-green-600">{completedCount}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Top 3 Fortalezas</h4>
          <ul className="space-y-4">
            {strengths.map(s => (
              <li key={s.id} className="space-y-1">
                <div className="text-sm font-medium text-gray-800 leading-snug">{s.name}</div>
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
                <div className="text-sm font-medium text-gray-800 leading-snug">{s.name}</div>
                <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${(s.numericLevel/5)*100}%` }} />
                </div>
              </li>
            ))}
            {!opportunities.length && <li className="text-xs text-gray-400">Sin datos</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
