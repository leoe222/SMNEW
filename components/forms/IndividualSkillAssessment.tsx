"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Save, Check } from "lucide-react"
import { saveAssessments, updateUserAssessments } from "@/lib/actions/assessment"
import { toast } from "sonner"

interface Skill {
  id: string
  name: string
  category: string
  description?: string
}

interface ExistingAssessment {
  skillId: string
  level: 0 | 1 | 2 | 3 | 4 | 5
  justification: string
  evidence: string
}

interface IndividualSkillAssessmentProps {
  skill: Skill
  existingAssessment?: ExistingAssessment
  onAssessmentSaved: () => void
}

export default function IndividualSkillAssessment({
  skill,
  existingAssessment,
  onAssessmentSaved,
}: IndividualSkillAssessmentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [level, setLevel] = useState<0 | 1 | 2 | 3 | 4 | 5 | "">(existingAssessment?.level || "")
  const [justification, setJustification] = useState(existingAssessment?.justification || "")
  const [evidence, setEvidence] = useState(existingAssessment?.evidence || "")
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const hasExistingAssessment = !!existingAssessment

  const handleSave = async () => {
    if (!level || !justification.trim()) {
      toast.error("Por favor completa el nivel y la justificación")
      return
    }

    setIsSaving(true)
    try {
      const mapLevel = (lvl: number) => {
        if (lvl <= 2) return "basic"
        if (lvl <= 4) return "intermediate"
        return "advanced"
      }

      const assessmentData = {
        skillId: skill.id,
        level: mapLevel(level as number) as "basic" | "intermediate" | "advanced",
        justification,
        evidence,
      }

      let result
      if (hasExistingAssessment) {
        result = await updateUserAssessments([assessmentData])
      } else {
        result = await saveAssessments([assessmentData])
      }

      if (result.success) {
        toast.success("Evaluación guardada exitosamente")
        setIsSaved(true)
        onAssessmentSaved()
        setTimeout(() => setIsSaved(false), 2000)
      } else {
        toast.error(result.error || "Error al guardar la evaluación")
      }
    } catch (error) {
      console.error("Error al guardar evaluación:", error)
      toast.error("Error al guardar la evaluación")
    } finally {
      setIsSaving(false)
    }
  }

  const getLevelColor = (levelValue: number | string) => {
    switch (levelValue) {
      case 0:
        return "border-gray-400 bg-gray-50 text-gray-600"
      case 1:
        return "border-gray-400 bg-gray-50 text-gray-600"
      case 2:
        return "border-green-400 bg-green-50 text-green-600"
      case 3:
        return "border-green-500 bg-green-100 text-green-700"
      case 4:
        return "border-green-600 bg-green-200 text-green-800"
      case 5:
        return "border-green-700 bg-green-300 text-green-900"
      default:
        return "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
    }
  }

  const getLevelLabel = (levelValue: number) => {
    switch (levelValue) {
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

  const isComplete = level !== "" && justification.trim()
  const hasChanges = hasExistingAssessment
    ? level !== existingAssessment.level ||
      justification !== existingAssessment.justification ||
      evidence !== existingAssessment.evidence
    : isComplete

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Skill Header */}
      <div
        className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{skill.name}</h4>
            {skill.description && <p className="text-sm text-gray-600 mt-1">{skill.description}</p>}
          </div>
          <div className="flex items-center space-x-3">
            {/* Current Level Badge */}
            {level !== "" && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
                {getLevelLabel(level as number)}
              </span>
            )}
            {/* Status Indicator */}
            {isComplete && (
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4" />
              </div>
            )}
            {/* Expand/Collapse Icon */}
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Assessment Form */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-gray-200">
          {/* Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Cuál consideras que es tu nivel actual?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((levelValue) => (
                <button
                  key={levelValue}
                  onClick={() => setLevel(levelValue as 0 | 1 | 2 | 3 | 4 | 5)}
                  disabled={isSaving}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 text-sm ${getLevelColor(levelValue)} ${
                    level === levelValue ? "ring-2 ring-offset-2 ring-[#10004f]" : ""
                  }`}
                >
                  {getLevelLabel(levelValue)}
                </button>
              ))}
            </div>
          </div>

          {/* Justification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Justifica tu autoevaluación *</label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explica por qué consideras que tienes este nivel en esta competencia..."
              className="w-full min-h-[80px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-[#10004f] focus:border-[#10004f]"
              disabled={isSaving}
            />
          </div>

          {/* Evidence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Evidencias de proyectos (opcional)</label>
            <textarea
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="Menciona proyectos, certificaciones o experiencias que respalden tu autoevaluación..."
              className="w-full min-h-[60px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-[#10004f] focus:border-[#10004f]"
              disabled={isSaving}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`flex items-center space-x-2 ${isSaved ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : isSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Guardado</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{hasExistingAssessment ? "Actualizar" : "Guardar"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
