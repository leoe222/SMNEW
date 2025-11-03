"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts"

interface ImprovementDatum {
  month: string
  value: number // percentage change
}

const mockImprovement: ImprovementDatum[] = [
  { month: 'ENE', value: 5 },
  { month: 'FEB', value: 20 },
  { month: 'MAR', value: 10 },
  { month: 'ABR', value: -10 },
  { month: 'MAY', value: 20 },
  { month: 'JUN', value: 50 },
]

interface TeamImprovementChartProps {
  data?: ImprovementDatum[]
}

export default function TeamImprovementChart({ data = mockImprovement }: TeamImprovementChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold mb-2">Mejora de Skills del Equipo</h2>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis hide domain={[ (dataMin: number) => Math.min(-15, dataMin), (dataMax: number) => Math.max(55, dataMax) ]} />
            <Tooltip formatter={(v: number) => `${v}%`} labelFormatter={(l: string) => `Mes: ${l}`} />
            <Line type="monotone" dataKey="value" stroke="#7E22CE" strokeWidth={3} dot={{ r: 5, strokeWidth: 2, stroke: '#7E22CE', fill: '#7E22CE' }}>
              <LabelList dataKey="value" position="top" formatter={(v:number)=> `${v}%`} className="text-sm fill-gray-800" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-xs text-gray-500">Variación porcentual promedio del nivel de skills del equipo respecto al mes anterior.</div>
    </div>
  )
}
