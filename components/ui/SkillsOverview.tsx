"use client"

import { useEffect, useState } from "react"
import { Palette } from "lucide-react"
import SectionHeader from "./SectionHeader"
import SectionContainer from "./SectionContainer"
import ProgressBar from "./ProgressBar"
import { getUserAssessments } from "@/lib/actions/assessment"

const ALL_CATEGORIES = [
  "Facilitación",
  "Experimentación",
  "Diseño e Interacción",
  "Estrategia de Contenido",
  "Usabilidad",
  "Negocio y Estrategia",
  "Liderazgo UX",
  "Investigación / Research",
  "Data Driven",
  "Arquitectura de la Información",
  "Diseño Visual",
  "Pensamiento de Producto",
  "Sistemas de Diseño",
  "Accesibilidad",
  "IA y Tecnologías Emergentes",
]

const CHAPTER_DATA = {
  Facilitación: { chapterAverage: 2.8, chapterTop: 4.5 },
  Experimentación: { chapterAverage: 2.9, chapterTop: 4.2 },
  "Diseño e Interacción": { chapterAverage: 3.1, chapterTop: 4.3 },
  "Estrategia de Contenido": { chapterAverage: 2.7, chapterTop: 4.1 },
  Usabilidad: { chapterAverage: 3.0, chapterTop: 4.6 },
  "Negocio y Estrategia": { chapterAverage: 2.5, chapterTop: 4.8 },
  "Liderazgo UX": { chapterAverage: 2.9, chapterTop: 4.7 },
  "Investigación / Research": { chapterAverage: 3.2, chapterTop: 5.0 },
  "Data Driven": { chapterAverage: 2.6, chapterTop: 4.4 },
  "Arquitectura de la Información": { chapterAverage: 2.8, chapterTop: 4.5 },
  "Diseño Visual": { chapterAverage: 3.0, chapterTop: 4.2 },
  "Pensamiento de Producto": { chapterAverage: 2.7, chapterTop: 4.6 },
  "Sistemas de Diseño": { chapterAverage: 2.9, chapterTop: 4.8 },
  Accesibilidad: { chapterAverage: 2.3, chapterTop: 4.1 },
  "IA y Tecnologías Emergentes": { chapterAverage: 2.1, chapterTop: 4.3 },
}

// Componente para mostrar el loading
function SkillsOverviewLoading() {
  return (
    <SectionContainer>
      <SectionHeader
        icon={Palette}
        title="Progreso de Skills de Design"
        subtitle="Tu evolución en las competencias clave de Product Design"
      />
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando evaluaciones...</p>
      </div>
    </SectionContainer>
  )
}

// Componente para mostrar el contenido de las skills
function SkillsOverviewContent() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getUserAssessments()
        setAssessments(data)
      } catch (error) {
        console.error("Error fetching assessments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [])

  if (loading) {
    return <SkillsOverviewLoading />
  }

  const userCategoryAverages = assessments.reduce(
    (acc, assessment) => {
      const category = assessment.category
      if (!category || !ALL_CATEGORIES.includes(category)) return acc

      if (!acc[category]) {
        acc[category] = { totalLevel: 0, count: 0 }
      }

      const level = Number(assessment.level)
      if (!isNaN(level) && level >= 0 && level <= 5) {
        acc[category].totalLevel += level
        acc[category].count += 1
      }

      return acc
    },
    {} as Record<string, { totalLevel: number; count: number }>,
  )

  const categoriesWithProgress = ALL_CATEGORIES.map((category) => {
    const userData = userCategoryAverages[category]
    const userAverage = userData ? userData.totalLevel / userData.count : 0
    const chapterData = CHAPTER_DATA[category as keyof typeof CHAPTER_DATA]

    return {
      category,
      userAverage: isNaN(userAverage) ? 0 : userAverage,
      chapterAverage: chapterData.chapterAverage,
      chapterTop: chapterData.chapterTop,
      userProgress: isNaN(userAverage) ? 0 : (userAverage / 5) * 100,
      chapterAvgProgress: (chapterData.chapterAverage / 5) * 100,
      chapterTopProgress: (chapterData.chapterTop / 5) * 100,
    }
  })

  return (
    <SectionContainer>

      <div className="space-y-4">
        {categoriesWithProgress.map((categoryData) => (
          <div key={categoryData.category} className="space-y-2">
            <h3 className="font-medium text-gray-900 text-sm">{categoryData.category}</h3>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Tu Promedio</span>
              </div>
              <ProgressBar progress={categoryData.userProgress} color="red" level="" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Chapter Top</span>
              </div>
              <ProgressBar progress={categoryData.chapterTopProgress} color="green" level="" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Chapter Average</span>
              </div>
              <ProgressBar progress={categoryData.chapterAvgProgress} color="gray" level="" />
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

// Componente principal
export default function SkillsOverview() {
  return <SkillsOverviewContent />
}
