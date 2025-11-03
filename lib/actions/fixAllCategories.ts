import { createClient } from "@supabase/supabase-js"

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // ojo: este nombre exacto
if (!url || !key) throw new Error('Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
export const supabase = createClient(url, key);

export async function fixAllCategories() {
  "use server"

  try {
    console.log("🔧 Iniciando normalización de categorías...")

    // Normalización básica
    console.log("📝 Aplicando normalización básica...")
    await supabase.rpc("exec_sql", {
      sql: "update skills set category = trim(category)",
    })

    await supabase.rpc("exec_sql", {
      sql: "update skills set category = regexp_replace(category, '\\s+', ' ', 'g')",
    })

    // Mapeos específicos
    console.log("🎯 Aplicando correcciones específicas...")

    const fixes = [
      "update skills set category = 'Facilitación' where category in ('Facilitacion','facilitación','facilitacion')",
      "update skills set category = 'Experimentación' where category in ('Experimentacion','experimentación','experimentacion')",
      "update skills set category = 'Diseño e Interacción' where category in ('Diseno e Interaccion','Diseño e Interaccion','Diseno e Interacción','diseño e interacción')",
      "update skills set category = 'Estrategia de Contenido' where lower(category) in ('estrategia de contenido')",
      "update skills set category = 'Usabilidad' where lower(category) in ('usabilidad')",
      "update skills set category = 'Negocio y Estrategia' where lower(category) in ('negocio y estrategia')",
      "update skills set category = 'Liderazgo UX' where lower(category) in ('liderazgo ux','liderasgo ux')",
      "update skills set category = 'Investigación / Research' where category in ('Investigacion / Research','Investigación/Research','Investigacion/Research','investigación / research')",
      "update skills set category = 'Data Driven' where lower(category) in ('data driven','datadriven')",
      "update skills set category = 'Arquitectura de la Información' where category in ('Arquitectura de la Informacion','arquitectura de la información','arquitectura de la informacion')",
      "update skills set category = 'Diseño Visual' where category in ('Diseno Visual','diseño visual','diseno visual')",
      "update skills set category = 'Pensamiento de Producto' where lower(category) in ('pensamiento de producto')",
      "update skills set category = 'Sistemas de Diseño' where category in ('Sistemas de Diseno','sistemas de diseño','sistemas de diseno')",
      "update skills set category = 'Accesibilidad' where lower(category) in ('accesibilidad')",
      "update skills set category = 'IA y Tecnologías Emergentes' where category in ('IA y Tecnologias Emergentes','ia y tecnologías emergentes','ia y tecnologias emergentes')",
    ]

    for (const fix of fixes) {
      const { error } = await supabase.rpc("exec_sql", { sql: fix })
      if (error) {
        console.error(`Error ejecutando: ${fix}`, error)
      }
    }

    // Verificar resultado final
    console.log("✅ Verificando resultado final...")
    const { data: finalCategories, error: finalError } = await supabase
      .from("skills")
      .select("category")
      .then(async (result) => {
        if (result.error) return result

        // Agrupar y contar manualmente
        const counts: Record<string, number> = {}
        result.data?.forEach((row) => {
          counts[row.category] = (counts[row.category] || 0) + 1
        })

        return {
          data: Object.entries(counts)
            .map(([category, n]) => ({ category, n }))
            .sort((a, b) => a.category.localeCompare(b.category)),
          error: null,
        }
      })

    if (finalError) {
      console.error("Error obteniendo categorías finales:", finalError)
      return { success: false, error: finalError.message }
    }

    console.log("📊 Categorías finales:")
    console.table(finalCategories)

    return {
      success: true,
      categories: finalCategories,
      message: `Normalización completada. ${finalCategories?.length || 0} categorías encontradas.`,
    }
  } catch (error) {
    console.error("Error en fixAllCategories:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}
