"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveAssessments, updateUserAssessments } from "@/lib/actions/assessment"
import { toast } from "sonner"

interface AssessmentFormProps {
  isOpen: boolean
  onClose: () => void
  skills: Array<{
    id: string
    name: string
    category: string
    description?: string
  }>
  existingAssessments: Array<{
    skillId: string
    skillName: string
    level: 0 | 1 | 2 | 3 | 4 | 5 | ""
    justification: string
    evidence: string
  }>
}

interface AssessmentData {
  skillId: string
  skillName: string
  level: 0 | 1 | 2 | 3 | 4 | 5 | ""
  justification: string
  evidence: string
}

// Payload que espera el backend (según actions/assessment):
interface BackendAssessmentInput {
  skillId: string
  level: "basic" | "intermediate" | "advanced"
  justification: string
  evidence?: string
}

export default function AssessmentForm({ isOpen, onClose, skills, existingAssessments }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [assessments, setAssessments] = useState<AssessmentData[]>(() => {
    // Inicializar con datos existentes o vacíos
    if (existingAssessments.length > 0) {
      return skills.map((skill) => {
        const existingAssessment = existingAssessments.find((assessment) => assessment.skillId === skill.id)

        return {
          skillId: skill.id,
          skillName: skill.name,
          level: existingAssessment?.level || "",
          justification: existingAssessment?.justification || "",
          evidence: existingAssessment?.evidence || "",
        }
      })
    } else {
      return skills.map((skill) => ({
        skillId: skill.id,
        skillName: skill.name,
        level: "",
        justification: "",
        evidence: "",
      }))
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasExistingAssessments = existingAssessments.length > 0

  const currentSkill = skills[currentStep]
  const currentAssessment = assessments[currentStep]

  const handleLevelChange = (level: 0 | 1 | 2 | 3 | 4 | 5) => {
    const updatedAssessments = [...assessments]
    updatedAssessments[currentStep].level = level
    setAssessments(updatedAssessments)
  }

  const handleJustificationChange = (value: string) => {
    const updatedAssessments = [...assessments]
    updatedAssessments[currentStep].justification = value
    setAssessments(updatedAssessments)
  }

  const handleEvidenceChange = (value: string) => {
    const updatedAssessments = [...assessments]
    updatedAssessments[currentStep].evidence = value
    setAssessments(updatedAssessments)
  }

  const handleNext = async () => {
    // Validar que el nivel y justificación estén completos
    if (!currentAssessment?.level || !currentAssessment?.justification.trim()) {
      toast.error("Por favor completa el nivel y la justificación antes de continuar")
      return
    }

    if (currentStep < skills.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Es el último paso, enviar todas las evaluaciones
      await handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Filtrar solo las evaluaciones completas
      const completedAssessments = assessments
        .filter((assessment) => assessment.level !== "" && assessment.justification.trim())
        .map((assessment) => ({
          skillId: assessment.skillId,
          level: assessment.level as 0 | 1 | 2 | 3 | 4 | 5,
          justification: assessment.justification,
          evidence: assessment.evidence,
        }))

      if (completedAssessments.length === 0) {
        toast.error("No hay evaluaciones completas para enviar")
        return
      }

      // Map numeric levels (0..5) to backend enum: basic | intermediate | advanced
      const mapLevel = (level: number): BackendAssessmentInput["level"] => {
        if (level <= 2) return "basic" // 0,1,2
        if (level <= 4) return "intermediate" // 3,4
        return "advanced" // 5
      }

      const payload: BackendAssessmentInput[] = completedAssessments.map((assessment) => {
        const base: BackendAssessmentInput = {
          skillId: assessment.skillId,
          level: mapLevel(assessment.level as number),
          justification: assessment.justification,
        }
        if (assessment.evidence && assessment.evidence.trim()) {
          base.evidence = assessment.evidence.trim()
        }
        return base
      })

      let result

      if (hasExistingAssessments) {
        // Actualizar evaluaciones existentes
        result = await updateUserAssessments(payload)
      } else {
        // Crear nuevas evaluaciones
        result = await saveAssessments(payload)
      }

      if (result.success) {
        const message = hasExistingAssessments
          ? "¡Autoevaluación actualizada exitosamente! Pendiente de aprobación del líder."
          : "¡Autoevaluación enviada exitosamente!"
        toast.success(message)
        onClose()

        // Resetear el formulario
        setCurrentStep(0)
      } else {
        toast.error(result.error || "Error al enviar la autoevaluación")
      }
    } catch (error) {
      console.error("Error al enviar evaluaciones:", error)
      toast.error("Error al enviar la autoevaluación. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLevelColor = (level: number | string) => {
    switch (level) {
      case 0:
        return "border-gray-400 bg-gray-50 text-gray-600"
      case 1:
        return "border-red-400 bg-red-50 text-red-600"
      case 2:
        return "border-[#FF6B35] bg-[#FF6B35]/10 text-[#FF6B35]"
      case 3:
        return "border-[#003366] bg-[#003366]/10 text-[#003366]"
      case 4:
        return "border-blue-500 bg-blue-50 text-blue-600"
      case 5:
        return "border-green-500 bg-green-50 text-green-700"
      default:
        return "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
    }
  }

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0:
        return "No familiarizado"
      case 1:
        return "Comprendo"
      case 2:
        return "En desarrollo"
      case 3:
        return "Autónomo"
      case 4:
        return "Promuevo"
      case 5:
        return "Transformo"
      default:
        return ""
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Auto-evaluación de Skills - {currentStep + 1} de {skills.length}
            </h2>
            {hasExistingAssessments && (
              <p className="text-sm text-blue-600 mt-1">Cargando datos de tu evaluación anterior...</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Skill Name */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentSkill?.name}</h3>
          </div>

          {/* Level Selection */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">¿Cuál consideras que es tu nivel actual?</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level as 0 | 1 | 2 | 3 | 4 | 5)}
                  disabled={isSubmitting}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${getLevelColor(level)} ${
                    currentAssessment?.level === level ? "ring-2 ring-offset-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold text-sm">{getLevelLabel(level)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Justification */}
          <div>
            <label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-2">
              Justifica tu autoevaluación *
            </label>
            <textarea
              id="justification"
              value={currentAssessment?.justification || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleJustificationChange(e.target.value)}
              placeholder="Explica por qué consideras que tienes este nivel en esta skill..."
              className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-[#003366] focus:border-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Evidence */}
          <div>
            <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-2">
              Evidencias de proyectos (opcional)
            </label>
            <textarea
              id="evidence"
              value={currentAssessment?.evidence || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleEvidenceChange(e.target.value)}
              placeholder="Menciona proyectos, certificaciones o experiencias que respalden tu autoevaluación..."
              className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-[#003366] focus:border-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <div className="text-sm text-gray-500">
            Parte {currentStep + 1} de {skills.length}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>

            <Button onClick={handleNext} disabled={isSubmitting} className="flex items-center space-x-2">
              <span>{currentStep === skills.length - 1 ? "Enviar" : "Siguiente"}</span>
              {currentStep < skills.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
