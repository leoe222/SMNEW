"use client"

import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface SkillRadarData {
  category: string;
  nivelActual: number;
  nivelObjetivo: number;
  promedioChapter: number;
  topChapter: number;
}

interface SkillRadarChartProps {
  data?: SkillRadarData[];
}

// Mock data for radar chart
const mockRadarData: SkillRadarData[] = [
  { category: "Facilitación", nivelActual: 4, nivelObjetivo: 5, promedioChapter: 3.5, topChapter: 5 },
  { category: "Experimentación", nivelActual: 3, nivelObjetivo: 4, promedioChapter: 3, topChapter: 4.5 },
  { category: "Arquitectura de la información", nivelActual: 4, nivelObjetivo: 4, promedioChapter: 3.8, topChapter: 5 },
  { category: "Diseño e Interacción", nivelActual: 3, nivelObjetivo: 4, promedioChapter: 3.2, topChapter: 4.7 },
  { category: "Estrategia de Contenido", nivelActual: 2, nivelObjetivo: 3, promedioChapter: 2.5, topChapter: 4 },
  { category: "Usabilidad", nivelActual: 3, nivelObjetivo: 4, promedioChapter: 3.1, topChapter: 4.8 },
  { category: "Negocio y Estrategia", nivelActual: 2, nivelObjetivo: 3, promedioChapter: 2.7, topChapter: 4.2 },
  { category: "Liderazgo UX", nivelActual: 1, nivelObjetivo: 2, promedioChapter: 1.5, topChapter: 3 },
  { category: "Investigación / Research", nivelActual: 3, nivelObjetivo: 4, promedioChapter: 3.3, topChapter: 4.9 },
  { category: "Data Driven", nivelActual: 2, nivelObjetivo: 3, promedioChapter: 2.2, topChapter: 4 },
  { category: "Diseño Visual", nivelActual: 4, nivelObjetivo: 5, promedioChapter: 3.9, topChapter: 5 },
  { category: "Pensamiento de Producto", nivelActual: 3, nivelObjetivo: 4, promedioChapter: 3.1, topChapter: 4.6 },
  { category: "Sistemas de Diseño", nivelActual: 4, nivelObjetivo: 5, promedioChapter: 4, topChapter: 5 },
  { category: "Accesibilidad", nivelActual: 2, nivelObjetivo: 3, promedioChapter: 2.5, topChapter: 4 },
  { category: "IA y Tecnologías Emergentes", nivelActual: 2, nivelObjetivo: 3, promedioChapter: 2.1, topChapter: 4 },
];

export default function SkillRadarChart({ data = mockRadarData }: SkillRadarChartProps) {
  const [visible, setVisible] = useState({
    nivelActual: true,
    nivelObjetivo: true,
    promedioChapter: true,
    topChapter: true,
  });

  const legendItems = [
    {
      key: "nivelActual",
      label: "Nivel actual",
      color: "#2196F3",
    },
    {
      key: "nivelObjetivo",
      label: "Nivel objetivo",
      color: "#E91E63",
    },
    {
      key: "promedioChapter",
      label: "Promedio del Chapter",
      color: "#FFC107",
    },
    {
      key: "topChapter",
      label: "Tops del Chapter",
      color: "#673AB7",
    },
  ];

  const toggleLayer = (key: string) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil de habilidades</h2>
      <div className="flex flex-col md:flex-row gap-8 items-start w-full">
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width={800} height={500}>
            <RadarChart cx={320} cy={250} outerRadius={200} width={600} height={500} data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 13 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} />
              {visible.nivelActual && (
                <Radar name="Nivel actual" dataKey="nivelActual" stroke="#2196F3" fill="#2196F3" fillOpacity={0.4} />
              )}
              {visible.nivelObjetivo && (
                <Radar name="Nivel objetivo" dataKey="nivelObjetivo" stroke="#E91E63" fill="#E91E63" fillOpacity={0.15} />
              )}
              {visible.promedioChapter && (
                <Radar name="Promedio del Chapter" dataKey="promedioChapter" stroke="#FFC107" fill="#FFC107" fillOpacity={0.15} dot={false} />
              )}
              {visible.topChapter && (
                <Radar name="Tops del Chapter" dataKey="topChapter" stroke="#673AB7" fill="#673AB7" fillOpacity={0.10} dot={false} />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </div>
        {/* Custom interactive legend */}
        <div className="flex flex-col gap-3 mt-8 md:mt-0 md:ml-4 min-w-[200px]">
          {legendItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleLayer(item.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded transition border text-left font-medium text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${item.color.replace('#','')} ${visible[item.key as keyof typeof visible] ? '' : 'opacity-40 border-gray-300 bg-gray-100'}`}
              style={{ color: item.color, borderColor: item.color, background: visible[item.key as keyof typeof visible] ? 'white' : '#f3f4f6' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: item.color,
                  opacity: visible[item.key as keyof typeof visible] ? 1 : 0.3,
                }}
              />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
