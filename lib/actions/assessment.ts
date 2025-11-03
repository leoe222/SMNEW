"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export interface PendingAssessment {
  id: string
  memberName: string
  memberRole: string
  skillName: string
  category: string
  level: string
  justification: string
  evidence: string
  createdAt: string
  status: "pending"
  userId: string
  skillId: string
}

// Cliente reutilizable para todas las funciones
async function getSupabaseClient() {
  return await createClient()
}

// Obtener evaluaciones pendientes del equipo
export async function getPendingAssessments(): Promise<PendingAssessment[]> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect("/login")
    }

    // Obtener evaluaciones pendientes del equipo del líder
    const { data, error } = await supabase
      .from("skill_assessments")
      .select(`
        id,
        user_id,
        skill_id,
        level,
        justification,
        evidence,
        status,
        created_at
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener evaluaciones pendientes:", error)
      return []
    }

    // Filtrar solo las evaluaciones de miembros del equipo del líder
    const teamMembers = await getTeamMemberIds(user.id)
    const filteredData = data?.filter((assessment) => teamMembers.includes(assessment.user_id)) || []

    // Obtener información de usuarios y skills por separado
    const userIds = [...new Set(filteredData.map((a) => a.user_id))]
    const skillIds = [...new Set(filteredData.map((a) => a.skill_id))]

    // Obtener información de usuarios
    const { data: usersData, error: usersError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, role")
      .in("id", userIds)

    if (usersError) {
      console.error("Error al obtener usuarios:", usersError)
      return []
    }

    // Obtener información de skills
    const { data: skillsData, error: skillsError } = await supabase
      .from("skills")
      .select("id, name, category")
      .in("id", skillIds)

    if (skillsError) {
      console.error("Error al obtener skills:", skillsError)
      return []
    }

    // Crear mapas para búsqueda rápida
    const usersMap = new Map(usersData?.map((u) => [u.id, u]) || [])
    const skillsMap = new Map(skillsData?.map((s) => [s.id, s]) || [])

    return filteredData.map((assessment) => {
      const user = usersMap.get(assessment.user_id)
      const skill = skillsMap.get(assessment.skill_id)

      return {
        id: assessment.id,
        memberName: user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Usuario desconocido",
        memberRole: user?.role || "Diseñador",
        skillName: skill?.name || "Skill desconocida",
        category: skill?.category || "Sin categoría",
        level: assessment.level || "",
        justification: assessment.justification || "",
        evidence: assessment.evidence || "",
        createdAt: assessment.created_at,
        status: "pending" as const,
        userId: assessment.user_id,
        skillId: assessment.skill_id,
      }
    })
  } catch (error) {
    console.error("Error en getPendingAssessments:", error)
    return []
  }
}

// Obtener IDs de miembros del equipo
async function getTeamMemberIds(leaderId: string): Promise<string[]> {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("leader_id", leaderId)
      .eq("role", "designer")

    if (error) {
      console.error("Error al obtener miembros del equipo:", error)
      return []
    }

    return data?.map((member) => member.id) || []
  } catch (error) {
    console.error("Error en getTeamMemberIds:", error)
    return []
  }
}

// Aprobar evaluación
export async function approveAssessment(
  assessmentId: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // Verificar que el usuario es líder
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "leader") {
      return { success: false, error: "No tienes permisos para aprobar evaluaciones" }
    }

    // Actualizar la evaluación
    const { error } = await supabase
      .from("skill_assessments")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq("id", assessmentId)
      .eq("status", "pending")

    if (error) {
      console.error("Error al aprobar evaluación:", error)
      return { success: false, error: "Error al aprobar la evaluación" }
    }

    return { success: true, message: "Evaluación aprobada exitosamente" }
  } catch (error) {
    console.error("Error en approveAssessment:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

// Rechazar evaluación
export async function rejectAssessment(
  assessmentId: string,
  reason: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // Validar motivo obligatorio
    if (!reason || !reason.trim()) {
      return { success: false, error: "Debes ingresar un motivo para rechazar la evaluación" }
    }

    // Verificar que el usuario es líder
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (!profile || profile.role !== "leader") {
      return { success: false, error: "No tienes permisos para rechazar evaluaciones" }
    }

  // Actualizar la evaluación
    const { error } = await supabase
      .from("skill_assessments")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        rejected_by: user.id,
    rejection_reason: reason.trim(),
      })
      .eq("id", assessmentId)
      .eq("status", "pending")

    if (error) {
      console.error("Error al rechazar evaluación:", error)
      return { success: false, error: "Error al rechazar la evaluación" }
    }

    return { success: true, message: "Evaluación rechazada exitosamente" }
  } catch (error) {
    console.error("Error en rejectAssessment:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

// Guardar evaluaciones del diseñador
export async function saveAssessments(
  assessments: Array<{
    skillId: string
    level: "basic" | "intermediate" | "advanced"
    justification: string
    evidence?: string
  }>,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // Preparar los datos para insertar
    const assessmentsData = assessments.map((assessment) => ({
      user_id: user.id,
      skill_id: assessment.skillId,
      level: assessment.level,
      justification: assessment.justification,
      evidence: assessment.evidence || null,
      status: "pending",
    }))

    // Insertar las evaluaciones
    const { error } = await supabase.from("skill_assessments").upsert(assessmentsData)

    if (error) {
      console.error("Error al guardar evaluaciones:", error)
      return { success: false, error: "Error al guardar las evaluaciones" }
    }

    return { success: true, message: "Evaluaciones guardadas exitosamente" }
  } catch (error) {
    console.error("Error en saveAssessments:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

// Obtener evaluaciones del usuario actual
export async function getUserAssessments(): Promise<
  Array<{
    skillId: string
    skillName: string
    category: string
    level: string
    progress: number
    status: string
  }>
> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect("/login")
    }

    const { data, error } = await supabase
      .from("skill_assessments")
      .select(`
        skill_id,
        level,
        status,
        skills(name, category)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener evaluaciones del usuario:", error)
      return []
    }

    return (data || []).map((assessment: any) => {
      const numericLevel = Number(assessment.level) || 0
      const progress = (numericLevel / 5) * 100

      return {
        skillId: assessment.skill_id,
        skillName: assessment.skills?.name || "",
        category: assessment.skills?.category || "Sin categoría",
        level: assessment.level || "",
        progress,
        status: assessment.status || "",
      }
    })
  } catch (error) {
    console.error("Error en getUserAssessments:", error)
    return []
  }
}

// Obtener evaluaciones existentes del usuario para el modal
export async function getUserExistingAssessments(): Promise<
  Array<{
    skillId: string
    skillName: string
    level: "basic" | "intermediate" | "advanced" | ""
    justification: string
    evidence: string
  }>
> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return []
    }

    const { data, error } = await supabase
      .from("skill_assessments")
      .select(`
        skill_id,
        level,
        justification,
        evidence,
        skills(name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error al obtener evaluaciones existentes:", error)
      return []
    }

    return (data || []).map((assessment: any) => ({
      skillId: assessment.skill_id,
      skillName: assessment.skills?.name || "",
      level: (assessment.level as "basic" | "intermediate" | "advanced" | "") || "",
      justification: assessment.justification || "",
      evidence: assessment.evidence || "",
    }))
  } catch (error) {
    console.error("Error en getUserExistingAssessments:", error)
    return []
  }
}

// Actualizar evaluaciones existentes del usuario
export async function updateUserAssessments(
  assessments: Array<{
    skillId: string
    level: "basic" | "intermediate" | "advanced"
    justification: string
    evidence?: string
  }>,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Usuario no autenticado" }
    }

    // Preparar los datos para actualizar
    const assessmentsData = assessments.map((assessment) => ({
      user_id: user.id,
      skill_id: assessment.skillId,
      level: assessment.level,
      justification: assessment.justification,
      evidence: assessment.evidence || null,
      status: "pending",
      approved_by: null,
      approved_at: null,
      updated_at: new Date().toISOString(),
    }))

    // Usar upsert para actualizar o crear
    const { error } = await supabase.from("skill_assessments").upsert(assessmentsData, {
      onConflict: "user_id,skill_id",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("Error al actualizar evaluaciones:", error)
      return { success: false, error: "Error al actualizar las evaluaciones" }
    }

    return { success: true, message: "Evaluaciones actualizadas exitosamente. Pendientes de aprobación del líder." }
  } catch (error) {
    console.error("Error en updateUserAssessments:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

// Guardar/actualizar una evaluación individual (0-5) quedando en pending para aprobación
export async function upsertNumericAssessment(skillTitle: string, numericLevel: number, justification: string) {
  try {
    const supabase = await getSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Usuario no autenticado' }

    // Resolver skill_id por nombre (case & diacritics tolerant)
    const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
    const target = normalize(skillTitle)
    const { data: allSkills, error: skillsErr } = await supabase
      .from('skills')
      .select('id, name')

    if (skillsErr) return { success: false, error: skillsErr.message }
    const matched = (allSkills || []).find((sk: any) => normalize(sk.name) === target)
    const skillId = matched?.id
    if (!skillId) return { success: false, error: 'Skill no encontrada' }

    const toLegacy = (n: number) => (n <= 1 ? 'basic' : n <= 3 ? 'intermediate' : 'advanced')
    const payload = {
      user_id: user.id,
      skill_id: skillId,
      numeric_level: Math.max(0, Math.min(5, Math.round(numericLevel))),
      level: toLegacy(numericLevel),
      justification: justification || 'Sin comentario',
      status: 'pending' as const,
      approved_at: null,
      approved_by: null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('skill_assessments').upsert(payload, { onConflict: 'user_id,skill_id' })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e?.message || 'Error interno' }
  }
}
