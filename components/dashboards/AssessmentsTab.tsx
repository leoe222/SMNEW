"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Clock, ChevronRight, Info } from "lucide-react"

interface AssessmentCardProps {
  assessment: {
    id: string
    memberName: string
    memberRole: string
  memberAvatar?: string | null
    skillName: string
    category?: string
    level: string | number
    justification: string
    evidence: string
    createdAt: string
    status: "pending"
  }
  onAction: () => void
}

function AssessmentCard({ assessment, onAction }: AssessmentCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [reason, setReason] = useState("")
  const [showReject, setShowReject] = useState(false)

  const formatRole = (role: string) => {
    const r = role?.toLowerCase().trim()
    if (r === 'designer' || r === 'diseñador' || r === 'disenador') return 'Product Designer'
    return role
  }

  const callApi = async (path: string, payload: any) => {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    let data: any = null
    try { data = await res.json() } catch {}
    if (!res.ok) {
      throw new Error(data?.error || `HTTP ${res.status}`)
    }
    return data
  }

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const result = await callApi("/api/assessments/approve", { id: assessment.id })
      toast.success(result.message || "Evaluación aprobada exitosamente")
      onAction()
    } catch (e: any) {
      toast.error(e?.message || "Error inesperado al aprobar la evaluación")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenReject = () => {
    setShowReject(true)
  }

  const handleConfirmReject = async () => {
    const trimmed = reason.trim()
    if (!trimmed) {
      toast.error("Debes ingresar un motivo para rechazar")
      return
    }
    setIsLoading(true)
    try {
      const result = await callApi("/api/assessments/reject", { id: assessment.id, reason: trimmed })
      toast.success(result.message || "Evaluación rechazada exitosamente")
      onAction()
      setReason("")
      setShowReject(false)
    } catch (e: any) {
      toast.error(e?.message || "Error inesperado al rechazar la evaluación")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (typeof window === 'undefined') return ''
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getLevelColor = (level: string | number) => {
    const numLevel = typeof level === "string" ? Number.parseInt(level) : level
    switch (numLevel) {
      case 0:
        return "bg-gray-100 text-gray-600"
      case 1:
        return "bg-red-100 text-red-600"
      case 2:
        return "bg-[#FF6B35]/10 text-[#FF6B35]"
      case 3:
        return "bg-[#003366]/10 text-[#003366]"
      case 4:
        return "bg-blue-100 text-blue-600"
      case 5:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelLabel = (level: string | number) => {
    const numLevel = typeof level === "string" ? Number.parseInt(level) : level
    switch (numLevel) {
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
        return level.toString()
    }
  }

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm">
      {/* Header con información del miembro y skill */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-8">
                {assessment.memberAvatar ? (
                  <AvatarImage src={assessment.memberAvatar} alt={assessment.memberName} />
                ) : (
                  <AvatarFallback>
                    {assessment.memberName.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{assessment.memberName}</h3>
            </div>
            <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit">
              {formatRole(assessment.memberRole)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Categoría › Competencia */}
            <div className="text-sm text-gray-700 flex items-center">
              <span className="font-medium">{assessment.category || 'Sin categoría'}</span>
              <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />
              <span className="text-gray-900 font-medium">{assessment.skillName}</span>
            </div>
            <Badge variant="static" className={`${getLevelColor(assessment.level)} text-xs`}>{getLevelLabel(assessment.level)}</Badge>
          </div>
        </div>

        {/* Badge de pendiente y fecha */}
        <div className="flex flex-col items-start sm:items-end space-y-1">
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
          <p className="text-xs text-gray-500">{formatDate(assessment.createdAt)}</p>
        </div>
      </div>

      {/* Justificación */}
      <div className="mb-4">
        <h5 className="text-sm font-medium text-gray-700 mb-2">Justificación:</h5>
        {assessment.justification && assessment.justification.trim() ? (
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {assessment.justification}
          </p>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <Info className="h-4 w-4" aria-hidden />
            <span className="text-sm italic">No se proveyó justificación.</span>
          </div>
        )}
      </div>

      {/* Evidencias - solo si existen */}
      {assessment.evidence && assessment.evidence.trim() !== "" && (
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Evidencias:</h5>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{assessment.evidence}</p>
        </div>
      )}

      {/* Motivo de rechazo (visible al presionar Rechazar) */}
      {showReject && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de rechazo</label>
          <textarea
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            placeholder="Describe claramente el motivo del rechazo"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
          />
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-200 bg-transparent"
              onClick={() => setShowReject(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="text-white"
              onClick={handleConfirmReject}
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Confirmar rechazo"}
            </Button>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto bg-transparent"
          onClick={handleOpenReject}
          disabled={isLoading}
        >
          <XCircle className="h-4 w-4 mr-2" />
          {isLoading ? "Procesando..." : "Rechazar"}
        </Button>
        <Button
          size="sm"
          className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white w-full sm:w-auto"
          onClick={handleApprove}
          disabled={isLoading}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {isLoading ? "Procesando..." : "Aprobar"}
        </Button>
      </div>
    </div>
  )
}

export default function AssessmentsTab() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/assessments/pending")
      if (!res.ok) throw new Error("Error al cargar las evaluaciones pendientes")
      const data = await res.json()
      setAssessments(data)
    } catch (error) {
      console.error("Error al cargar evaluaciones:", error)
      toast.error("Error al cargar las evaluaciones pendientes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (assessments.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evaluaciones pendientes</h3>
        <p className="text-gray-600 text-sm sm:text-base">No hay skills pendientes de aprobación en tu equipo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-4 sm:px-0">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Evaluaciones Pendientes</h3>
        <p className="text-sm text-gray-600">Revisa y aprueba las evaluaciones de skills de tu equipo</p>
      </div>

      {assessments.map((assessment) => (
        <AssessmentCard key={assessment.id} assessment={assessment} onAction={fetchAssessments} />
      ))}
    </div>
  )
}
