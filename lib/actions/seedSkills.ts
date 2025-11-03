"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface SkillData {
  name: string
  category: string
  description: string
}

export async function seedSkills() {
  const skillsData: SkillData[] = [
    // Facilitación
    {
      name: "Diseñar workshops colaborativos",
      category: "Facilitación",
      description: "Preparar workshops con stakeholders y usuarios, incluyendo actividades y logística.",
    },
    {
      name: "Facilitación de workshops",
      category: "Facilitación",
      description: "Liderar workshops para alcanzar objetivos, gestionando dinámicas y tiempo.",
    },
    {
      name: "Toma de decisiones grupales",
      category: "Facilitación",
      description: "Usar métodos como consenso o mayoría para decisiones en equipo.",
    },
    {
      name: "Escucha activa",
      category: "Facilitación",
      description: "Sintetizar y reflejar ideas y emociones del grupo durante facilitaciones.",
    },

    // Experimentación
    {
      name: "Definición de hipótesis",
      category: "Experimentación",
      description:
        "Formular hipótesis claras, medibles y relevantes que orienten la toma de decisiones y validación de soluciones.",
    },
    {
      name: "Análisis de resultados",
      category: "Experimentación",
      description: "Interpretar datos de experimentos para validar hipótesis y obtener insights.",
    },
    {
      name: "Muestra y duración de experimentos",
      category: "Experimentación",
      description: "Determinar muestra representativa y duración metodológica de experimentos.",
    },

    // Diseño e Interacción
    {
      name: "Prototipado",
      category: "Diseño e Interacción",
      description: "Crear prototipos para validar ideas en etapas tempranas.",
    },
    {
      name: "Microinteracciones",
      category: "Diseño e Interacción",
      description: "Diseñar interacciones pequeñas para mejorar la experiencia de usuario.",
    },
    {
      name: "Documentación para desarrollo",
      category: "Diseño e Interacción",
      description: "Entregar guías claras para implementar diseños.",
    },

    // Estrategia de Contenido
    {
      name: "Storytelling",
      category: "Estrategia de Contenido",
      description: "Diseñar el relato antes de redactar el microcopy",
    },
    {
      name: "Propuesta de valor",
      category: "Estrategia de Contenido",
      description: "Incorporar los objetivos y propuesta de valor de mi producto en el diseño de contenido",
    },
    {
      name: "Guidelines",
      category: "Estrategia de Contenido",
      description: "Aplico los pilares JETS y los lineamientos del manual de estilos de LATAM",
    },
    {
      name: "Consistencia",
      category: "Estrategia de Contenido",
      description:
        "Busco la consistencia y coherencia entre lo que comunico en mi producto y el resto del ecosistema de LATAM",
    },
    {
      name: "Microcopy y jerarquía de información",
      category: "Estrategia de Contenido",
      description:
        "Escribir microcopy claros, aplicando jerarquía de información y adaptando el contenido a la interfaz donde se muestra",
    },

    // Usabilidad
    {
      name: "Pruebas de usabilidad",
      category: "Usabilidad",
      description: "Planificar y ejecutar tests para medir su éxito/fracaso",
    },
    {
      name: "Evaluación heurística",
      category: "Usabilidad",
      description: "Analizar interfaces con heurísticas de usabilidad (ej. Nielsen).",
    },

    // Negocio y Estrategia
    {
      name: "Comunicación con stakeholders",
      category: "Negocio y Estrategia",
      description: "Mantener alineación y gestionar expectativas con interesados.",
    },
    {
      name: "Balance usuario-negocio",
      category: "Negocio y Estrategia",
      description: "Equilibrar necesidades del usuario con objetivos de negocio.",
    },
    {
      name: "Definición de objetivos",
      category: "Negocio y Estrategia",
      description:
        "Establecer objetivos claros, medibles y alineados tanto con las necesidades del usuario como con las metas estratégicas del negocio, asegurando que las iniciativas de diseño y/o investigaciones generen un impacto significativo.",
    },
    {
      name: "Presentación resultados",
      category: "Negocio y Estrategia",
      description: "Preparo informe de resultados con accionables claros y de fácil comprensión para distintos roles.",
    },
    {
      name: "Evangelización UX",
      category: "Negocio y Estrategia",
      description: "Promover el valor de la experiencia de usuario en la organización.",
    },

    // Liderazgo UX
    {
      name: "Visión estratégica",
      category: "Liderazgo UX",
      description:
        "Se centra en la capacidad de liderar y establecer una dirección clara que alinee el diseño con los objetivos de negocio y las necesidades del usuario. Esto implica no solo entender el contexto, sino también inspirar al equipo hacia un impacto significativo.",
    },
    {
      name: "Coaching y mentoring",
      category: "Liderazgo UX",
      description:
        "Enfatiza el rol del liderazgo en el desarrollo del equipo mediante mentoría, coaching y retroalimentación, un aspecto clave para un liderazgo efectivo en UX. Se trata de empoderar a otros para que crezcan profesionalmente.",
    },
    {
      name: "Colaboración Interdisciplinaria",
      category: "Liderazgo UX",
      description:
        "Refleja la necesidad de trabajar con equipos de otras áreas (desarrollo, producto, negocio) para crear soluciones integrales, un pilar del diseño centrado en el usuario que requiere habilidades de comunicación y empatía.",
    },
    {
      name: "Madurez de Diseño",
      category: "Liderazgo UX",
      description:
        "Se enfoca en elevar la práctica del diseño dentro de la organización, promoviendo procesos maduros, estándares de calidad y una cultura centrada en el usuario, lo que impacta directamente en la percepción del diseño.",
    },

    // Investigación / Research
    {
      name: "Creación de preguntas de research",
      category: "Investigación / Research",
      description:
        "Redactar y elegir preguntas de investigación adecuadas en las distintas metodologías, que permitan validar mis objetivos, sin inducir a los usuarios.",
    },
    {
      name: "Análisis de datos",
      category: "Investigación / Research",
      description: "Interpretar datos cualitativos y cuantitativos, para generar insights.",
    },
    {
      name: "Generación de insights",
      category: "Investigación / Research",
      description: "Extraer hallazgos accionables a partir de investigaciones.",
    },
    {
      name: "Planificación de Investigación",
      category: "Investigación / Research",
      description:
        "Habilidad de diseñar un plan de investigación que seleccione los métodos cualitativos (ej. entrevistas, observaciones) y cuantitativos (ej. encuestas, análisis de datos) más adecuados para los objetivos del proyecto. Esto incluye definir el alcance, los participantes y las herramientas necesarias para garantizar hallazgos útiles y accionables.",
    },

    // Data Driven
    {
      name: "Métricas",
      category: "Data Driven",
      description: "Definir y seguir indicadores clave de UX y producto.",
    },
    {
      name: "Análisis de funnel",
      category: "Data Driven",
      description: "Identificar puntos críticos en flujos de usuario con datos.",
    },
    {
      name: "Decisiones basadas en datos",
      category: "Data Driven",
      description: "Usar datos y research para fundamentar decisiones de diseño.",
    },

    // Arquitectura de la Información
    {
      name: "Wireframes y taxonomías",
      category: "Arquitectura de la Información",
      description: "Diseñar estructuras y organizar información para interfaces intuitivas.",
    },

    // Diseño Visual
    {
      name: "Patrones y componentes",
      category: "Diseño Visual",
      description: "Usar Design Systems para crear interfaces coherentes y consistentes.",
    },
    {
      name: "Visualización de datos",
      category: "Diseño Visual",
      description: "Representar datos complejos de forma simple, clara y visual.",
    },

    // Pensamiento de Producto
    {
      name: "Definir visión del producto",
      category: "Pensamiento de Producto",
      description: "Establecer una visión clara y alineada con objetivos de negocio.",
    },
    {
      name: "Priorización de features",
      category: "Pensamiento de Producto",
      description: "Decidir qué funcionalidades desarrollar primero según impacto y esfuerzo.",
    },
    {
      name: "Alineación con objetivos de negocio",
      category: "Pensamiento de Producto",
      description: "Asegurar que el diseño apoye metas estratégicas de la empresa.",
    },

    // Sistemas de Diseño
    {
      name: "Crear sistemas de diseño",
      category: "Sistemas de Diseño",
      description: "Desarrollar sistemas escalables para consistencia en interfaces.",
    },
    {
      name: "Mantener consistencia en UI",
      category: "Sistemas de Diseño",
      description: "Asegurar que todos los componentes sigan las mismas pautas visuales.",
    },
    {
      name: "Documentar componentes",
      category: "Sistemas de Diseño",
      description: "Crear guías claras para el uso y desarrollo de componentes.",
    },

    // Accesibilidad
    {
      name: "Estándares WCAG",
      category: "Accesibilidad",
      description: "Diseñar interfaces cumpliendo pautas WCAG (A, AA, AAA).",
    },
    {
      name: "Diseño Universal",
      category: "Accesibilidad",
      description: "Aplicar los 7 principios para crear productos inclusivos.",
    },
    {
      name: "Test de accesibilidad",
      category: "Accesibilidad",
      description: "Evaluar productos con herramientas (ej. Axe, WAVE) y usuarios con discapacidad.",
    },
    {
      name: "Mínimo de accesibilidad",
      category: "Accesibilidad",
      description: "Garantizar contraste, tipografía legible y diseño adaptable al 200% de zoom.",
    },

    // IA y Tecnologías Emergentes
    {
      name: "Prototipado con IA",
      category: "IA y Tecnologías Emergentes",
      description: "Usar herramientas basadas en IA para crear prototipos interactivos.",
    },
    {
      name: "Uso de IA",
      category: "IA y Tecnologías Emergentes",
      description: "Usa IA para eficientar su trabajo diario",
    },
    {
      name: "Automatización de flujos de diseño con IA",
      category: "IA y Tecnologías Emergentes",
      description:
        "Utiliza herramientas de IA para automatizar tareas repetitivas o complejas en el proceso de diseño, como generar variantes de interfaces y contenido, optimizar wireframes o agilizar revisiones de usabilidad.",
    },
  ]

  try {
    const { data, error } = await supabase
      .from("skills")
      .upsert(skillsData, {
        onConflict: "category,name",
        ignoreDuplicates: false,
      })
      .select()

    if (error) {
      console.error("Error seeding skills:", error)
      throw error
    }

    const insertedCount =
      data?.filter((record) => new Date(record.created_at).getTime() === new Date(record.updated_at).getTime())
        .length || 0

    const updatedCount = (data?.length || 0) - insertedCount

    return {
      success: true,
      message: `Seeding completed successfully. ${insertedCount} records inserted, ${updatedCount} records updated.`,
      inserted: insertedCount,
      updated: updatedCount,
      total: data?.length || 0,
    }
  } catch (error) {
    console.error("Error in seedSkills:", error)
    return {
      success: false,
      message: `Error seeding skills: ${error instanceof Error ? error.message : "Unknown error"}`,
      inserted: 0,
      updated: 0,
      total: 0,
    }
  }
}
