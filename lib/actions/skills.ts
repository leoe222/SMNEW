import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export interface Skill {
  id: string
  name: string
  category_id: string
  category_name?: string
  description?: string
}

export interface SkillCategory {
  id: string
  name: string
  description?: string
}

export interface SkillAssessment {
  id: string
  user_id: string
  skill_id: string
  level: number // 0-5 scale
  justification: string
  evidence?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

// Cliente reutilizable para todas las funciones
async function getSupabaseClient() {
  return await createClient()
}

// Obtener skills de diseño para el modal
export async function getDesignSkillsForModal(): Promise<Skill[]> {
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
      .from("skills")
      .select("id, name, category_id, description, skill_categories(name)")
      .eq("skill_categories.name", "design")
      .order("name")

    if (error) {
      console.error("Error al obtener skills de diseño:", error)
      return []
    }

    return (
      data?.map((skill) => ({
        ...skill,
        category_name: skill.skill_categories?.[0]?.name,
      })) || []
    )
  } catch (error) {
    console.error("Error en getDesignSkillsForModal:", error)
    return []
  }
}

// Obtener skills de diseño
export async function getDesignSkills(): Promise<Skill[]> {
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
      .from("skills")
      .select("id, name, category_id, description, skill_categories(name)")
      .eq("skill_categories.name", "design")
      .order("name")

    if (error) {
      console.error("Error al obtener skills de diseño:", error)
      return []
    }

    return (
      data?.map((skill) => ({
        ...skill,
        category_name: skill.skill_categories?.[0]?.name,
      })) || []
    )
  } catch (error) {
    console.error("Error en getDesignSkills:", error)
    return []
  }
}

// Obtener skills por categoría
export async function getSkillsByCategory(categoryName: string): Promise<Skill[]> {
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
      .from("skills")
      .select("id, name, category_id, description, skill_categories(name)")
      .eq("skill_categories.name", categoryName)
      .order("name")

    if (error) {
      console.error("Error al obtener skills por categoría:", error)
      return []
    }

    return (
      data?.map((skill) => ({
        ...skill,
        category_name: skill.skill_categories?.[0]?.name,
      })) || []
    )
  } catch (error) {
    console.error("Error en getSkillsByCategory:", error)
    return []
  }
}

// Obtener todas las skills
export async function getAllSkills(): Promise<Skill[]> {
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
      .from("skills")
      .select("id, name, category_id, description, skill_categories(name)")
      .order("category_id, name")

    if (error) {
      console.error("Error al obtener skills:", error)
      return []
    }

    return (
      data?.map((skill) => ({
        ...skill,
        category_name: skill.skill_categories?.[0]?.name,
      })) || []
    )
  } catch (error) {
    console.error("Error en getAllSkills:", error)
    return []
  }
}

// Obtener todas las categorías de skills
export async function getSkillCategories(): Promise<SkillCategory[]> {
  try {
    const supabase = await getSupabaseClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect("/login")
    }

    const { data, error } = await supabase.from("skill_categories").select("id, name, description").order("name")

    if (error) {
      console.error("Error al obtener categorías:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error en getSkillCategories:", error)
    return []
  }
}
