"use client"
import React from 'react'
import {
  FlaskConical,
  BarChart2,
  Users,
  Target,
  Layers,
  Sparkles,
  FileText,
  BookOpen,
  Accessibility,
  Lightbulb,
  GraduationCap,
  Megaphone,
  Puzzle,
  Cpu,
  Brain,
  Circle,
  Ear,
  Filter,
  Database,
  CalendarPlus,
  Presentation,
  ClipboardList,
  PenTool,
  Code2,
  Compass,
  Gauge,
  Rocket,
  Workflow,
  ShieldCheck,
  ChartPie,
  ChartSpline,
  FlaskRound,
  BookOpenText,
  Layers3,
  Clock,
  XCircle,
  CheckCircle2,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Skill {
  id: string
  title: string
  description?: string
  currentScore?: number | null
  status?: 'approved' | 'pending' | 'rejected'
  rejectionReason?: string | null
  statusAt?: string | null
}
interface Props {
  skill: Skill
  onOpen: (skill: Skill) => void
}

// Normalización básica para coincidencia exacta de títulos (remueve tildes y pasa a minúsculas)
const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()

// Mapeo semántico explícito (un ícono único por título conocido)
const exactTitleIcons: Record<string, React.ComponentType<any>> = {
  [normalize('Diseñar workshops colaborativos')]: CalendarPlus,
  [normalize('Facilitación de workshops')]: Users,
  [normalize('Toma de decisiones grupales')]: Target,
  [normalize('Escucha activa')]: Ear,
  [normalize('Métricas')]: BarChart2,
  [normalize('Análisis de funnel')]: Filter,
  [normalize('Decisiones basadas en datos')]: Database,
  [normalize('Definición de hipótesis')]: FlaskConical,
  [normalize('Análisis de resultados')]: Gauge,
  [normalize('Muestra y duración de experimentos')]: FlaskRound || FlaskConical,
  [normalize('Prototipado')]: Layers,
  [normalize('Microinteracciones')]: Sparkles,
  [normalize('Documentación para desarrollo')]: FileText,
  [normalize('Storytelling')]: BookOpen,
  [normalize('Propuesta de valor')]: Lightbulb,
  [normalize('Guidelines')]: ClipboardList,
  [normalize('Consistencia')]: Puzzle,
  [normalize('Microcopy y jerarquía de información')]: PenTool,
  [normalize('Pruebas de usabilidad')]: Presentation,
  [normalize('Evaluación heurística')]: Compass,
  [normalize('Comunicación con stakeholders')]: Megaphone,
  [normalize('Balance usuario-negocio')]: Target,
  [normalize('Definición de objetivos')]: Target,
  [normalize('Presentación resultados')]: Presentation,
  [normalize('Evangelización UX')]: Rocket,
  [normalize('Visión estratégica')]: Lightbulb,
  [normalize('Coaching y mentoring')]: GraduationCap,
  [normalize('Colaboración Interdisciplinaria')]: Workflow,
  [normalize('Madurez de Diseño')]: ShieldCheck,
  [normalize('Creación de preguntas de research')]: BookOpenText || BookOpen,
  [normalize('Análisis de datos')]: ChartSpline || BarChart2,
  [normalize('Generación de insights')]: Brain,
  [normalize('Planificación de Investigación')]: ClipboardList,
  [normalize('Wireframes y taxonomías')]: Layers3 || Layers,
  [normalize('Patrones y componentes')]: Layers,
  [normalize('Visualización de datos')]: ChartPie,
  [normalize('Definir visión del producto')]: Lightbulb,
  [normalize('Priorización de features')]: Gauge,
  [normalize('Alineación con objetivos de negocio')]: Target,
  [normalize('Crear sistemas de diseño')]: Puzzle,
  [normalize('Mantener consistencia en UI')]: Layers3 || Layers,
  [normalize('Documentar componentes')]: FileText,
  [normalize('Estándares WCAG')]: Accessibility,
  [normalize('Diseño Universal')]: Accessibility,
  [normalize('Test de accesibilidad')]: Accessibility,
  [normalize('Mínimo de accesibilidad')]: Accessibility,
  [normalize('Prototipado con IA')]: Cpu,
  [normalize('Uso de IA')]: Cpu,
  [normalize('Automatización de flujos de diseño con IA')]: Cpu,
}

// Reglas de palabras clave (fallback semántico)
const keywordRules: { keywords: string[]; Icon: React.ComponentType<any> }[] = [
  { keywords: ['hipotesis', 'hipótesis'], Icon: FlaskConical },
  { keywords: ['funnel'], Icon: Filter },
  { keywords: ['muestra', 'duracion', 'duración'], Icon: FlaskRound || FlaskConical },
  { keywords: ['prototip'], Icon: Layers },
  { keywords: ['microinteracciones'], Icon: Sparkles },
  { keywords: ['guidelines', 'documentacion', 'documentación'], Icon: FileText },
  { keywords: ['storytelling'], Icon: BookOpen },
  { keywords: ['accesibilidad', 'wcag'], Icon: Accessibility },
  { keywords: ['insight'], Icon: Brain },
  { keywords: ['mentoring', 'coaching'], Icon: GraduationCap },
  { keywords: ['evangelizacion', 'evangelización'], Icon: Megaphone },
  { keywords: ['sistemas', 'componentes'], Icon: Puzzle },
  { keywords: ['automatizacion', 'automatización', 'ia '], Icon: Cpu },
  { keywords: ['metricas', 'métricas', 'datos'], Icon: BarChart2 },
  { keywords: ['funnel'], Icon: Filter },
  { keywords: ['decisiones'], Icon: Target },
]

// Pool para garantizar unicidad si aún hubiera colisiones
const uniquePool: React.ComponentType<any>[] = [
  BarChart2, Users, Target, Layers, Sparkles, FileText, BookOpen, Accessibility, Lightbulb,
  GraduationCap, Megaphone, Puzzle, Cpu, Brain, Ear, Filter, Database, CalendarPlus, Presentation,
  ClipboardList, PenTool, Code2, Compass, Gauge, Rocket, Workflow, ShieldCheck, ChartPie, ChartSpline,
]

const assigned: Record<string, React.ComponentType<any>> = {}
function pickIcon(title: string): React.ComponentType<any> {
  const key = normalize(title)
  if (assigned[key]) return assigned[key]
  if (exactTitleIcons[key]) {
    assigned[key] = exactTitleIcons[key]
    return assigned[key]
  }
  const lower = key
  for (const rule of keywordRules) {
    if (rule.keywords.some(k => lower.includes(k))) {
      // asegurar unicidad
      const already = new Set(Object.values(assigned))
      let icon = rule.Icon
      if (already.has(icon)) {
        icon = uniquePool.find(i => !already.has(i)) || icon
      }
      assigned[key] = icon
      return icon
    }
  }
  // Fallback determinístico: hash simple para distribuir en el pool
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  const icon = uniquePool[hash % uniquePool.length] || Circle
  assigned[key] = icon
  return icon
}

const statusConfig: Record<NonNullable<Skill['status']>, {
  Icon: React.ComponentType<any>
  tooltip: string
  bubbleClasses: string
  iconClasses: string
  srLabel: string
  label: string
}> = {
  pending: {
    Icon: Clock,
    tooltip: 'Pendiente de aprobación del líder',
    bubbleClasses: 'bg-amber-500 text-white shadow-[0_6px_16px_rgba(245,158,11,0.22)]',
    iconClasses: 'text-white',
    srLabel: 'Pendiente de aprobación',
    label: 'Pendiente'
  },
  rejected: {
    Icon: XCircle,
    tooltip: 'Solicitud rechazada por el líder',
    bubbleClasses: 'bg-red-600 text-white shadow-[0_6px_18px_rgba(239,68,68,0.26)]',
    iconClasses: 'text-white',
    srLabel: 'Solicitud rechazada',
    label: 'Rechazado'
  },
  approved: {
    Icon: CheckCircle2,
    tooltip: 'Aprobado por tu líder',
    bubbleClasses: 'bg-emerald-500 text-white shadow-[0_6px_18px_rgba(16,185,129,0.24)]',
    iconClasses: 'text-white',
    srLabel: 'Nivel aprobado',
    label: 'Aprobado'
  }
}

const MIN_COLLAPSED_HEIGHT = 150

export default function SkillAssessmentCard({ skill, onOpen }: Props) {
  const Icon = pickIcon(skill.title)
  const score = skill.currentScore ?? '-'
  const statusInfo = skill.status ? statusConfig[skill.status] : null
  const StatusIcon = statusInfo?.Icon
  const [isHovering, setIsHovering] = React.useState(false)
  const [showDescription, setShowDescription] = React.useState(false)
  const [isFloating, setIsFloating] = React.useState(false)
  const [baseHeight, setBaseHeight] = React.useState<number | null>(null)

  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const collapseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const buttonRef = React.useRef<HTMLButtonElement | null>(null)

  const clearHoverTimeout = React.useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }, [])

  const clearCollapseTimeout = React.useCallback(() => {
    if (collapseTimeoutRef.current) {
      clearTimeout(collapseTimeoutRef.current)
      collapseTimeoutRef.current = null
    }
  }, [])

  const handleHoverStart = React.useCallback(() => {
    setIsHovering(true)
    if (!hoverTimeoutRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowDescription(true)
        setIsFloating(true)
        hoverTimeoutRef.current = null
      }, 2000)
    }
  }, [])

  const handleHoverEnd = React.useCallback(() => {
    setIsHovering(false)
    clearHoverTimeout()
    setShowDescription(false)
    clearCollapseTimeout()
    collapseTimeoutRef.current = setTimeout(() => {
      setIsFloating(false)
      collapseTimeoutRef.current = null
      if (buttonRef.current) {
        setBaseHeight(Math.max(buttonRef.current.offsetHeight, MIN_COLLAPSED_HEIGHT))
      }
    }, 260)
  }, [clearCollapseTimeout, clearHoverTimeout])

  React.useLayoutEffect(() => {
    if (!isFloating && buttonRef.current) {
      setBaseHeight(Math.max(buttonRef.current.offsetHeight, MIN_COLLAPSED_HEIGHT))
    }
  }, [isFloating, score, skill.description])

  React.useEffect(() => {
    return () => {
      clearHoverTimeout()
      clearCollapseTimeout()
    }
  }, [clearCollapseTimeout, clearHoverTimeout])

  const statusBadge = statusInfo ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`absolute -top-4 left-1/2 z-20 flex h-11 min-w-[44px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full px-0 transition-all duration-300 ease-out hover:scale-105 hover:px-4 group-hover:px-4 group-focus-visible:px-4 ${statusInfo.bubbleClasses}`}
          >
            {StatusIcon && (
              <StatusIcon
                className={`h-5 w-5 ${statusInfo.iconClasses}`}
                aria-hidden="true"
              />
            )}
            <span
              aria-hidden="true"
              className="ml-0 max-w-0 translate-y-1 overflow-hidden text-xs font-semibold uppercase tracking-wide opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[120px] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:ml-2 group-focus-visible:max-w-[120px] group-focus-visible:translate-y-0 group-focus-visible:opacity-100 hover:ml-2 hover:max-w-[120px] hover:translate-y-0 hover:opacity-100"
            >
              {statusInfo.label}
            </span>
            <span className="sr-only">
              {skill.status === 'rejected'
                ? `Motivo de rechazo: ${skill.rejectionReason || '—'}`
                : statusInfo.srLabel}
            </span>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {skill.status === 'rejected'
            ? `Motivo de rechazo: ${skill.rejectionReason || '—'}`
            : statusInfo.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null
  const baseBtn = "group w-full text-left bg-white rounded-2xl border border-gray-200 p-5 shadow-sm transition-all duration-300 ease-out relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
  const floatingTransform = isFloating
    ? "scale3d(1.08,1.05,1)"
    : isHovering
      ? "scale3d(1.03,1.02,1)"
      : "scale3d(1,1,1)"
  const floatingClasses = isFloating
    ? "z-30 shadow-xl border-indigo-200 ring-2 ring-indigo-100"
    : isHovering
      ? "z-20 shadow-md border-indigo-300"
      : ""
  const measuredHeight = baseHeight != null ? Math.max(baseHeight, MIN_COLLAPSED_HEIGHT) : MIN_COLLAPSED_HEIGHT
  const containerStyle = baseHeight != null ? { height: measuredHeight } : { minHeight: MIN_COLLAPSED_HEIGHT }

  return (
    <div className="relative rounded-2xl overflow-visible h-full" style={containerStyle}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onOpen(skill)}
  className={`${baseBtn} ${floatingClasses} flex flex-col ${isFloating ? 'absolute inset-0 rounded-2xl' : ''}`}
  style={{ transform: floatingTransform, minHeight: MIN_COLLAPSED_HEIGHT }}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        onFocus={handleHoverStart}
        onBlur={handleHoverEnd}
      >
      <div className="absolute top-5 left-5 h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      {statusBadge}
      <div className="absolute top-5 right-5 flex flex-col items-end leading-tight">
        <span className="text-3xl font-bold tabular-nums leading-none text-indigo-600">{score}</span>
        <span className="text-[11px] uppercase tracking-wide text-gray-500 mt-1 whitespace-nowrap">Nivel</span>
      </div>
      <div className="mt-16 flex flex-col">
        <h3 className="text-lg font-semibold tracking-tight group-hover:text-indigo-700 break-words leading-tight">{skill.title}</h3>
        {skill.description && (
          <div
            className={`text-sm text-gray-600 transition-all duration-300 ease-out overflow-hidden ${showDescription ? 'opacity-100 translate-y-0 max-h-40 pt-2' : 'opacity-0 -translate-y-1 max-h-0 pointer-events-none'}`}
            aria-hidden={!showDescription}
          >
            <p className="break-words leading-relaxed">{skill.description}</p>
          </div>
        )}
      </div>
  <span className="absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-indigo-200 pointer-events-none" />
      </button>
    </div>
  )
}
