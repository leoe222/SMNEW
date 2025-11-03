"use server"

import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from "next/navigation"

export interface TeamMember {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  leaderId: string | null
  squad?: string | null
  avatarUrl?: string | null
}

export interface TeamStats {
  totalMembers: number
  pendingApprovals: number
  averageProgress: number
  approvedSkills: number
}

export interface MemberAssessment {
  userId: string
  firstName: string
  lastName: string
  skillName: string
  level: string | number
  status: string
  progress: number // 0-100
}

// Cliente reutilizable para todas las funciones
async function getSupabaseClient() {
  return await createClient()
}

// Obtener miembros del equipo
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
  // Ensure fresh data (avoid cached response hiding newly added squad column)
  noStore()
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect("/login")
    }

    let { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, leader_id, squad, avatar_url")
      .eq("leader_id", user.id)
      .order("first_name")

    // Fallback si todavía no existe la columna squad en el entorno
    if (error && (error as any).code === '42703') {
      console.warn('[team] Columna squad no encontrada (getTeamMembers). Reintentando sin ella.')
      const fallback = await supabase
        .from("profiles")
  .select("id, first_name, last_name, email, role, leader_id")
        .eq("leader_id", user.id)
        .order("first_name")
      data = fallback.data as any[] | null
      error = fallback.error as any
    }

    if (error) {
      console.error("Error al obtener miembros del equipo:", error)
      return []
    }

    return (data || []).map(
      (member: {
        id: string
        first_name: string
        last_name: string
        email: string
        role: string
        leader_id: string | null
        squad?: string | null
        avatar_url?: string | null
      }) => ({
        id: member.id,
        firstName: member.first_name || "",
        lastName: member.last_name || "",
        email: member.email || "",
        role: member.role,
        leaderId: member.leader_id,
        squad: member.squad || null,
        avatarUrl: member.avatar_url || null,
      }),
    )
  } catch (error) {
    console.error("Error en getTeamMembers:", error)
    return []
  }
}

// Obtener evaluaciones de un miembro específico
export async function getMemberAssessments(memberId: string): Promise<MemberAssessment[]> {
  try {
    const supabase = await getSupabaseClient()

    const { data, error } = await supabase
      .from("skill_assessments")
      .select(`
        user_id,
        level,
        numeric_level,
        status,
        skills(name)
      `)
      .eq("user_id", memberId)

    if (error) {
      console.error("Error al obtener evaluaciones del miembro:", error)
      return []
    }

    return (data || []).map((assessment: any) => ({
      userId: assessment.user_id,
      firstName: "",
      lastName: "",
      skillName: assessment.skills?.name || "",
      level: assessment.level || "",
      status: assessment.status || "",
      progress: typeof assessment.numeric_level === "number"
        ? Math.round(assessment.numeric_level * 20)
        : (typeof assessment.level === "number" ? Math.round(assessment.level * 20) : 0),
    }))
  } catch (error) {
    console.error("Error en getMemberAssessments:", error)
    return []
  }
}

// Obtener estadísticas del equipo
export async function getTeamStats(): Promise<TeamStats> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect("/login")
    }

    // Obtener miembros del equipo directamente aquí para evitar llamadas duplicadas (incluye squad con fallback)
    let { data: teamMembers, error: teamError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, leader_id, squad, avatar_url")
      .eq("leader_id", user.id)
      .order("first_name")

    if (teamError && (teamError as any).code === '42703') {
      console.warn('[team] Columna squad no encontrada (getTeamStats). Reintentando sin ella.')
      const fallback = await supabase
        .from("profiles")
  .select("id, first_name, last_name, email, role, leader_id")
        .eq("leader_id", user.id)
        .order("first_name")
      teamMembers = fallback.data as any[] | null
      teamError = fallback.error as any
    }

    if (teamError) {
      console.error("Error al obtener miembros del equipo:", teamError)
      return {
        totalMembers: 0,
        pendingApprovals: 0,
        averageProgress: 0,
        approvedSkills: 0,
      }
    }

    const members = teamMembers || []

    if (members.length === 0) {
      return {
        totalMembers: 0,
        pendingApprovals: 0,
        averageProgress: 0,
        approvedSkills: 0,
      }
    }

    const teamMemberIds = members.map((member) => member.id)

    // Obtener todas las evaluaciones en una sola consulta
    const { data: allAssessments, error } = await supabase
      .from("skill_assessments")
      .select(`
        user_id,
        level,
        numeric_level,
        status,
        skills(name)
      `)
      .in("user_id", teamMemberIds)

    if (error) {
      console.error("Error al obtener evaluaciones del equipo:", error)
      return {
        totalMembers: members.length,
        pendingApprovals: 0,
        averageProgress: 0,
        approvedSkills: 0,
      }
    }

    const assessments = allAssessments || []

  const pendingAssessments = assessments.filter((a: { status: string }) => a.status === "pending")
    const approvedAssessments = assessments.filter((a: { status: string }) => a.status === "approved")

    let totalProgress = 0
    let totalAssessments = 0

    for (const member of members) {
      const memberAssessments = assessments.filter((a: { user_id: string }) => a.user_id === member.id)
      const memberProgress = memberAssessments.reduce((sum: number, assessment: { numeric_level?: any; level?: any }) => {
        const progress = typeof (assessment as any).numeric_level === 'number'
          ? Math.round((assessment as any).numeric_level * 20)
          : (typeof (assessment as any).level === 'number' ? Math.round((assessment as any).level * 20) : 0)
        return sum + progress
      }, 0)
      totalProgress += memberProgress
      totalAssessments += memberAssessments.length
    }

    const averageProgress = totalAssessments > 0 ? Math.round(totalProgress / totalAssessments) : 0

    return {
      totalMembers: members.length,
      pendingApprovals: pendingAssessments.length,
      averageProgress,
      approvedSkills: approvedAssessments.length,
    }
  } catch (error) {
    console.error("Error en getTeamStats:", error)
    return {
      totalMembers: 0,
      pendingApprovals: 0,
      averageProgress: 0,
      approvedSkills: 0,
    }
  }
}

// Obtener miembros del equipo con estadísticas optimizadas
export async function getTeamMembersWithStats(): Promise<
  Array<
    TeamMember & {
      progress: number
      pendingSkills: number
      completedSkills: number
    }
  >
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

    // Obtener miembros del equipo
    let { data: teamMembers, error: teamError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, leader_id, squad, avatar_url")
      .eq("leader_id", user.id)
      .order("first_name")

    if (teamError && (teamError as any).code === '42703') {
      console.warn('[team] Columna squad no encontrada (getTeamMembersWithStats). Reintentando sin ella.')
      const fallback = await supabase
        .from("profiles")
  .select("id, first_name, last_name, email, role, leader_id")
        .eq("leader_id", user.id)
        .order("first_name")
      teamMembers = fallback.data as any[] | null
      teamError = fallback.error as any
    }

    if (teamError) {
      console.error("Error al obtener miembros del equipo:", teamError)
      return []
    }

    const members = teamMembers || []

    if (members.length === 0) {
      return []
    }

    const teamMemberIds = members.map((member) => member.id)

    // Obtener todas las evaluaciones en una sola consulta
    const { data: allAssessments, error: assessmentsError } = await supabase
      .from("skill_assessments")
      .select(`
        user_id,
        level,
        numeric_level,
        status,
        skills(name)
      `)
      .in("user_id", teamMemberIds)

    if (assessmentsError) {
      console.error("Error al obtener evaluaciones del equipo:", assessmentsError)
      return members.map((member) => ({
        id: member.id,
        firstName: member.first_name || "",
        lastName: member.last_name || "",
        email: member.email || "",
        role: member.role,
        leaderId: member.leader_id,
        progress: 0,
        pendingSkills: 0,
        completedSkills: 0,
      }))
    }

    const assessments = allAssessments || []

    // Calcular estadísticas para cada miembro
  return members.map((member: any) => {
      const memberAssessments = assessments.filter((a: { user_id: string }) => a.user_id === member.id)

      const totalProgress = memberAssessments.reduce((sum: number, assessment: any) => {
        const val = typeof assessment.numeric_level === 'number'
          ? assessment.numeric_level
          : (typeof assessment.level === 'number' ? assessment.level : 0)
        const progress = val * 20 // Convert 0-5 to 0-100
        return sum + progress
      }, 0)

      const averageProgress = memberAssessments.length > 0 ? Math.round(totalProgress / memberAssessments.length) : 0

      // Contar skills por estado
      const pendingSkills = memberAssessments.filter((a: { status: string }) => a.status === "pending").length
      const completedSkills = memberAssessments.filter((a: { status: string }) => a.status === "approved").length

  return {
        id: member.id,
        firstName: member.first_name || "",
        lastName: member.last_name || "",
        email: member.email || "",
        role: member.role,
        leaderId: member.leader_id,
        squad: member.squad || null,
        avatarUrl: member.avatar_url || null,
        progress: averageProgress,
        pendingSkills,
        completedSkills,
      }
    })
  } catch (error) {
    console.error("Error en getTeamMembersWithStats:", error)
    return []
  }
}
