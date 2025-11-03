"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Cell } from "recharts"
import getInterpolatedColor from "../../lib/colors"

interface SkillComparisonData {
  category: string
  yourAverage: number
  chapterAverage: number
  chapterTop: number
}

interface SkillComparisonChartProps {
  data?: SkillComparisonData[]
}

// Mock data based on the categories from the skill matrix
const mockData: SkillComparisonData[] = [
  { category: "Facilitación", yourAverage: 1.2, chapterAverage: 2.8, chapterTop: 4.5 },
  { category: "Experimentación", yourAverage: 2.1, chapterAverage: 2.9, chapterTop: 4.2 },
  { category: "Diseño e Interacción", yourAverage: 2.8, chapterAverage: 3.1, chapterTop: 4.3 },
  { category: "Estrategia de Contenido", yourAverage: 1.9, chapterAverage: 2.7, chapterTop: 4.1 },
  { category: "Usabilidad", yourAverage: 2.3, chapterAverage: 3.0, chapterTop: 4.6 },
  { category: "Negocio y Estrategia", yourAverage: 1.5, chapterAverage: 2.5, chapterTop: 4.8 },
  { category: "Liderazgo UX", yourAverage: 1.8, chapterAverage: 2.9, chapterTop: 4.7 },
  { category: "Investigación / Research", yourAverage: 2.4, chapterAverage: 3.2, chapterTop: 5.0 },
  { category: "Data Driven", yourAverage: 1.7, chapterAverage: 2.6, chapterTop: 4.4 },
  { category: "Arquitectura de la Información", yourAverage: 2.0, chapterAverage: 2.8, chapterTop: 4.5 },
  { category: "Diseño Visual", yourAverage: 2.6, chapterAverage: 3.0, chapterTop: 4.2 },
  { category: "Pensamiento de Producto", yourAverage: 1.8, chapterAverage: 2.7, chapterTop: 4.6 },
  { category: "Sistemas de Diseño", yourAverage: 2.2, chapterAverage: 2.9, chapterTop: 4.8 },
  { category: "Accesibilidad", yourAverage: 1.4, chapterAverage: 2.3, chapterTop: 4.1 },
  { category: "IA y Tecnologías Emergentes", yourAverage: 1.6, chapterAverage: 2.1, chapterTop: 4.3 },
]

export default function SkillComparisonChart({ data = mockData }: SkillComparisonChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal" margin={{ top: 20, right: 30, left: 120, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 5]} tickCount={6} stroke="#666" />
            <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 12 }} stroke="#666" />
            <Legend verticalAlign="bottom" height={36} iconType="rect" />
            {/* Chapter Average: coral scale from light (#FBE9E7) to dark (#BF360C) */}
            <Bar dataKey="chapterAverage" name="Chapter Average" radius={[0, 2, 2, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-chapterAverage-${index}`}
                  fill={getInterpolatedColor('#FBE9E7', '#BF360C', entry.chapterAverage, 5)}
                />
              ))}
            </Bar>

            {/* Chapter Top: indigo scale from light (#E8EAF6) to dark (#1A237E) */}
            <Bar dataKey="chapterTop" name="Chapter Top" radius={[0, 2, 2, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-chapterTop-${index}`}
                  fill={getInterpolatedColor('#E8EAF6', '#1A237E', entry.chapterTop, 5)}
                />
              ))}
            </Bar>

            {/* Your Average: green scale from light (#E0F2F1) to dark (#00695C) */}
            <Bar dataKey="yourAverage" name="Your Average" radius={[0, 2, 2, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-yourAverage-${index}`}
                  fill={getInterpolatedColor('#E0F2F1', '#00695C', entry.yourAverage, 5)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
