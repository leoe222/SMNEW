import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function debugCategories() {
  try {
    const { data, error } = await supabase.from("skills").select("category").order("category")

    if (error) {
      console.error("Error fetching categories:", error)
      return { success: false, error: error.message }
    }

    // Get distinct categories
    const distinctCategories = [...new Set(data.map((item) => item.category))].sort()

    console.log("=== CATEGORÍAS EN LA TABLA SKILLS ===")
    distinctCategories.forEach((category, index) => {
      console.log(`${index + 1}. "${category}"`)
    })
    console.log(`Total: ${distinctCategories.length} categorías`)

    return {
      success: true,
      categories: distinctCategories,
      total: distinctCategories.length,
    }
  } catch (error) {
    console.error("Error in debugCategories:", error)
    return { success: false, error: "Failed to fetch categories" }
  }
}
