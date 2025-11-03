import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function fixCategories() {
  try {
    console.log("=== INICIANDO CORRECCIÓN DE CATEGORÍAS ===")

    // Mapeo de categorías incorrectas a correctas
    const categoryFixes = [
      { from: "Facilitacion", to: "Facilitación" },
      { from: "Experimentacion", to: "Experimentación" },
      { from: "Diseño e Interaccion", to: "Diseño e Interacción" },
      { from: "Usabilidad", to: "Usabilidad" }, // Ya está bien
      { from: "Negocio y Estrategia", to: "Negocio y Estrategia" }, // Ya está bien
      { from: "Investigacion / Research", to: "Investigación / Research" },
      { from: "Arquitectura de la Informacion", to: "Arquitectura de la Información" },
      { from: "Pensamiento de Producto", to: "Pensamiento de Producto" }, // Ya está bien
      { from: "Sistemas de Diseño", to: "Sistemas de Diseño" }, // Ya está bien
      { from: "Accesibilidad", to: "Accesibilidad" }, // Ya está bien
      { from: "IA y Tecnologias Emergentes", to: "IA y Tecnologías Emergentes" },
    ]

    let totalUpdated = 0

    // Aplicar cada corrección
    for (const fix of categoryFixes) {
      const { data, error } = await supabase
        .from("skills")
        .update({ category: fix.to })
        .eq("category", fix.from)
        .select()

      if (error) {
        console.error(`Error updating ${fix.from} to ${fix.to}:`, error)
        continue
      }

      if (data && data.length > 0) {
        console.log(`✅ Actualizado "${fix.from}" → "${fix.to}" (${data.length} registros)`)
        totalUpdated += data.length
      }
    }

    console.log(`\n=== TOTAL ACTUALIZADO: ${totalUpdated} registros ===\n`)

    // Mostrar categorías finales
    const { data: finalData, error: finalError } = await supabase.from("skills").select("category").order("category")

    if (finalError) {
      console.error("Error fetching final categories:", finalError)
      return { success: false, error: finalError.message }
    }

    const distinctCategories = [...new Set(finalData.map((item) => item.category))].sort()

    console.log("=== CATEGORÍAS FINALES EN LA TABLA SKILLS ===")
    distinctCategories.forEach((category, index) => {
      console.log(`${index + 1}. "${category}"`)
    })
    console.log(`Total: ${distinctCategories.length} categorías`)

    return {
      success: true,
      updated: totalUpdated,
      finalCategories: distinctCategories,
      total: distinctCategories.length,
    }
  } catch (error) {
    console.error("Error in fixCategories:", error)
    return { success: false, error: "Failed to fix categories" }
  }
}
