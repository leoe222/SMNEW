"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface AssessmentModalProps {
  isOpen?: boolean
  onClose?: () => void
  inline?: boolean
}

interface SkillWithAssessment {
  id: string
  name: string
  description: string
  category: string
  currentLevel: number | null
  status?: 'approved' | 'pending' | 'rejected'
  rejectionReason?: string | null
}

const SKILL_CATEGORIES = [
  "Facilitación",
  "Experimentación",
  "Diseño e Interacción",
  "Estrategia de Contenido",
  "Usabilidad",
  "Negocio y Estrategia",
  "Liderazgo UX",
  "Investigación / Research",
  "Data Driven",
  "Arquitectura de la Información",
  "Diseño Visual",
  "Pensamiento de Producto",
  "Sistemas de Diseño",
  "Accesibilidad",
  "IA y Tecnologías Emergentes",
]

const CATEGORY_ICON_MAP: Record<string, string> = {
  Facilitación: "🧑‍🤝‍🧑",
  Experimentación: "⚗️",
  "Diseño e Interacción": "🖌️",
  "Estrategia de Contenido": "📚",
  Usabilidad: "🖱️",
  "Negocio y Estrategia": "📈",
  "Liderazgo UX": "👑",
  "Investigación / Research": "🔍",
  "Data Driven": "📊",
  "Arquitectura de la Información": "🗂️",
  "Diseño Visual": "🖼️",
  "Pensamiento de Producto": "🎯",
  "Sistemas de Diseño": "🧩",
  Accesibilidad: "♿",
  "IA y Tecnologías Emergentes": "🤖",
}

const LEVEL_OPTIONS = [
  { value: 0, label: "No familiarizado" },
  { value: 1, label: "Comprendo" },
  { value: 2, label: "En desarrollo" },
  { value: 3, label: "Autónomo" },
  { value: 4, label: "Promuevo" },
  { value: 5, label: "Transformo" },
]

export default function AssessmentModal({ isOpen = true, onClose = () => {}, inline = false }: AssessmentModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [skills, setSkills] = useState<SkillWithAssessment[]>([])
  const [loading, setLoading] = useState(false)
  const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, number>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen || inline) {
      const lastCategory = localStorage.getItem("lastSelectedCategory")
      if (lastCategory && SKILL_CATEGORIES.includes(lastCategory)) {
        setSelectedCategory(lastCategory)
      }
    }
  }, [isOpen, inline])

  const loadSkillsAndAssessmentsCallback = useCallback(async () => {
    await loadSkillsAndAssessments()
  }, [selectedCategory])

  useEffect(() => {
    if (selectedCategory) {
      loadSkillsAndAssessmentsCallback()
    }
  }, [selectedCategory, loadSkillsAndAssessmentsCallback])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadSkillsAndAssessments = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        toast({
          title: "Error de autenticación",
          description: "No se pudo obtener la información del usuario",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Query skills with left join to current user's skill_assessments (include status and rejection_reason)
      const { data, error } = await supabase
        .from("skills")
        .select(`
      id, name, description, category,
          skill_assessments!left(level, status, rejection_reason, user_id)
        `)
        .eq("category", selectedCategory.trim())
        .contains('skill_assessments', [{ user_id: user.id }])
        .order("name", { ascending: true })

      if (error) {
        console.error("Error al cargar skills:", error)
        toast({
          title: "Error al cargar competencias",
          description: "No se pudieron cargar las competencias de esta categoría",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const mappedSkills: SkillWithAssessment[] =
        data?.map((skill: any) => {
          const first = Array.isArray(skill.skill_assessments)
            ? skill.skill_assessments.find((a: any) => a?.user_id === user.id) || skill.skill_assessments[0]
            : null
          return {
            id: skill.id,
            name: skill.name,
            description: skill.description || "",
            category: skill.category,
            currentLevel: first?.level ?? null,
            status: first?.status ?? undefined,
            rejectionReason: first?.rejection_reason ?? null,
          }
        }) || []

      setSkills(mappedSkills)
    } catch (error) {
      console.error("Error al cargar skills y evaluaciones:", error)
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al cargar las competencias",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, toast])

  const handleLevelChange = async (skillId: string, newLevel: number) => {
    // Optimistic update
    setOptimisticUpdates((prev) => ({ ...prev, [skillId]: newLevel }))

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const { error } = await supabase.from("skill_assessments").upsert(
        {
          user_id: user.id,
          skill_id: skillId,
          level: newLevel,
          justification: "",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,skill_id",
        },
      )

      if (error) {
        throw error
      }

      // Update local state
      setSkills((prev) => prev.map((skill) => (skill.id === skillId ? { ...skill, currentLevel: newLevel } : skill)))

      // Remove optimistic update
      setOptimisticUpdates((prev) => {
        const updated = { ...prev }
        delete updated[skillId]
        return updated
      })

      toast({
        title: "Evaluación guardada",
        description: "Tu evaluación se ha guardado correctamente",
      })
    } catch (error) {
      console.error("Error saving assessment:", error)

      // Remove optimistic update on error
      setOptimisticUpdates((prev) => {
        const updated = { ...prev }
        delete updated[skillId]
        return updated
      })

      toast({
        title: "Error al guardar",
        description: "No se pudo guardar tu evaluación. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
 
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    localStorage.setItem("lastSelectedCategory", category)
  }

  const handleBackToCategories = () => {
    setSelectedCategory("")
    setSkills([])
    setOptimisticUpdates({})
    localStorage.removeItem("lastSelectedCategory")
  }

  if (!isOpen) return null

  if (loading) {
    const loader = (
      <div className="bg-white rounded-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando competencias...</p>
        </div>
      </div>
    )

    if (inline) return loader

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">{loader}</div>
    )
  }
  const innerContent = (
    <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-none overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {selectedCategory ? `${selectedCategory}` : "Auto-evaluación de Skills"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {selectedCategory
              ? "Evalúa cada competencia individualmente. Los cambios se guardan automáticamente."
              : "Selecciona una categoría de competencias para comenzar tu evaluación."}
          </p>
        </div>
        
      </div>

      {/* Content */}
      <div className="p-6">
        {!selectedCategory ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona una categoría de competencias:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SKILL_CATEGORIES.map((category) => {
                const Icon = CATEGORY_ICON_MAP[category] ?? "📘"
                return (
                  <Button
                    key={category}
                    variant="outline"
                    className="p-4 h-auto text-left justify-start hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-gray-50 flex items-center justify-center text-lg">
                          <span>{Icon}</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{category}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={handleBackToCategories}
              className="mb-4 bg-transparent hover:bg-gray-50"
            >
              ← Volver a categorías
            </Button>

            {skills.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay competencias registradas para esta categoría.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                        Competencia
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900">
                        Descripción
                      </th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-900 min-w-[260px]">Nivel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((skill) => {
                      const displayLevel = optimisticUpdates[skill.id] ?? skill.currentLevel
                      return (
                        <tr key={skill.id} className="hover:bg-gray-50">
                          <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">{skill.name}</td>
                          <td className="border border-gray-200 px-4 py-3 text-gray-700">{skill.description}</td>
                          <td className="border border-gray-200 px-4 py-3">
                            {skill.status === 'rejected' && skill.rejectionReason && (
                              <div className="mb-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2" role="alert">
                                Motivo de rechazo: {skill.rejectionReason}
                              </div>
                            )}
                            <select
                              value={displayLevel ?? ""}
                              onChange={(e) => handleLevelChange(skill.id, Number.parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Seleccionar nivel...</option>
                              {LEVEL_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {optimisticUpdates[skill.id] !== undefined && (
                              <div className="flex items-center mt-1 text-xs text-blue-600">
                                <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                                Guardando...
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (inline) return innerContent

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">{innerContent}</div>
  )
}
