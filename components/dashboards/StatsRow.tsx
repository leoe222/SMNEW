"use client"

import { BarChart2, Target, Users, RotateCw } from "lucide-react"

interface StatsRowProps {
  average: number
  averageMax?: number
  delta?: string
  objectivesCount: number
  validatedCount: number
  validatedTotal: number
  lastUpdated?: string
}

export default function StatsRow({
  average,
  averageMax = 4.9,
  delta,
  objectivesCount,
  validatedCount,
  validatedTotal,
  lastUpdated,
}: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg p-6 shadow-sm border-b-4 border-purple-600">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Tú promedio general</h3>
            <div className="mt-3 flex items-baseline gap-3">
              <div className="text-3xl font-extrabold text-gray-900">{average?.toFixed(1)}</div>
              <div className="text-sm text-gray-500">De máximo {averageMax}</div>
            </div>
            {delta && (
              <div className="mt-2 text-sm text-green-600 font-medium">{delta} <span className="text-gray-500 text-sm">vs mes anterior</span></div>
            )}
          </div>
          <BarChart2 className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border-b-4 border-teal-500">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Habilidades en crecimiento</h3>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-gray-900">{objectivesCount}</div>
              <div className="text-sm text-gray-500">Objetivos definidos</div>
            </div>
          </div>
          <Target className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border-b-4 border-sky-500">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Habilidades Validadas</h3>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-gray-900">{validatedCount}</div>
              <div className="text-sm text-gray-500">de {validatedTotal} totales</div>
            </div>
          </div>
          <Users className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border-b-4 border-pink-500">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Ultima actualización</h3>
            <div className="mt-3 text-sm text-gray-700">{lastUpdated || "—"}</div>
          </div>
          <RotateCw className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  )
}