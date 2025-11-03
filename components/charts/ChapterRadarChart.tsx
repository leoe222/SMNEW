"use client"

import { useState } from "react"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface ChapterRadarDatum {
  category: string
  teamAverage: number
  chapterAverage: number
  clusterTop: number
}

const mockChapterRadar: ChapterRadarDatum[] = [
  { category: "Facilitación", teamAverage: 3.2, chapterAverage: 3.8, clusterTop: 4.7 },
  { category: "Experimentación", teamAverage: 2.9, chapterAverage: 3.4, clusterTop: 4.5 },
  { category: "Arquitectura de la información", teamAverage: 3.1, chapterAverage: 3.6, clusterTop: 4.8 },
  { category: "Diseño e Interacción", teamAverage: 3.4, chapterAverage: 3.9, clusterTop: 4.9 },
  { category: "Estrategia de Contenido", teamAverage: 2.7, chapterAverage: 3.2, clusterTop: 4.4 },
  { category: "Usabilidad", teamAverage: 3.0, chapterAverage: 3.5, clusterTop: 4.9 },
  { category: "Negocio y Estrategia", teamAverage: 2.6, chapterAverage: 3.1, clusterTop: 4.3 },
  { category: "Liderazgo UX", teamAverage: 2.2, chapterAverage: 2.9, clusterTop: 4.0 },
  { category: "Investigación / Research", teamAverage: 3.0, chapterAverage: 3.7, clusterTop: 5.0 },
  { category: "Data Driven", teamAverage: 2.5, chapterAverage: 3.1, clusterTop: 4.6 },
  { category: "Diseño Visual", teamAverage: 3.3, chapterAverage: 3.9, clusterTop: 5.0 },
  { category: "Pensamiento de Producto", teamAverage: 2.8, chapterAverage: 3.3, clusterTop: 4.6 },
  { category: "Sistemas de Diseño", teamAverage: 3.1, chapterAverage: 3.7, clusterTop: 4.9 },
  { category: "Accesibilidad", teamAverage: 2.4, chapterAverage: 2.9, clusterTop: 4.2 },
  { category: "IA y Tecnologías Emergentes", teamAverage: 2.1, chapterAverage: 2.7, clusterTop: 4.1 },
]

interface ChapterRadarChartProps {
  data?: ChapterRadarDatum[]
}

export default function ChapterRadarChart({ data = mockChapterRadar }: ChapterRadarChartProps) {
  const [visible, setVisible] = useState({
    teamAverage: true,
    chapterAverage: true,
    clusterTop: true,
  })

  const legend = [
    { key: 'teamAverage', label: 'Team average', color: '#1D4ED8' },
    { key: 'chapterAverage', label: 'Chapter average', color: '#EAB308' },
    { key: 'clusterTop', label: 'Cluster TOP', color: '#7E22CE' },
  ] as const

  const toggle = (k: keyof typeof visible) => setVisible(v => ({ ...v, [k]: !v[k] }))

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Comparación del Chapter</h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-3">
          {legend.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggle(item.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition bg-white ${visible[item.key] ? '' : 'opacity-40'}`}
              style={{ borderColor: item.color }}
            >
              <span className="inline-flex items-center justify-center" style={{ width: 18, height: 18 }}>
                <span
                  className="rounded-full"
                  style={{
                    display: 'inline-block',
                    width: 14,
                    height: 14,
                    background: item.color,
                    opacity: visible[item.key] ? 1 : 0.25,
                  }}
                />
              </span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="w-full h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius={170} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} />
              {visible.teamAverage && (
                <Radar dataKey="teamAverage" name="Team average" stroke="#1D4ED8" fill="#1D4ED8" fillOpacity={0.35} />
              )}
              {visible.chapterAverage && (
                <Radar dataKey="chapterAverage" name="Chapter average" stroke="#EAB308" fill="#EAB308" fillOpacity={0.1} strokeDasharray="5 5" />
              )}
              {visible.clusterTop && (
                <Radar dataKey="clusterTop" name="Cluster TOP" stroke="#7E22CE" fill="#7E22CE" fillOpacity={0.08} strokeDasharray="2 6" />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
