export interface CategoryMeta {
  slug: string
  label: string
  description: string
  image?: string
}

export const categories: CategoryMeta[] = [
  {
    slug: 'facilitacion',
    label: 'Facilitación',
    description: 'Habilidades para diseñar, liderar y gestionar workshops colaborativos, promoviendo dinámicas efectivas y toma de decisiones grupales.',
    image: '/images/auto-eval/facilitacion.png',
  },
  {
    slug: 'experimentacion',
    label: 'Experimentación',
  description: 'Capacidad de formular hipótesis, diseñar experimentos y analizar resultados para validar soluciones y generar aprendizajes.',
  image: '/images/auto-eval/experimentacion.png',
  },
  {
    slug: 'diseno-interaccion',
    label: 'Diseño e Interacción',
  description: 'Creación de prototipos, microinteracciones y documentación para desarrollo que permitan validar ideas y mejorar la experiencia del usuario.',
  image: '/images/auto-eval/diseno-interaccion.png',
  },
  {
    slug: 'estrategia-contenido',
    label: 'Estrategia de Contenido',
  description: 'Uso de storytelling, consistencia, propuesta de valor y microcopy para comunicar mensajes claros y alineados con la estrategia del producto.',
  image: '/images/auto-eval/estrategia-contenido.png',
  },
  {
    slug: 'usabilidad',
    label: 'Usabilidad',
  description: 'Planificación y ejecución de pruebas de usabilidad y evaluaciones heurísticas para asegurar experiencias intuitivas y eficientes.',
  image: '/images/auto-eval/usabilidad.png',
  },
  {
    slug: 'negocio-estrategia',
    label: 'Negocio y Estrategia',
  description: 'Integración del diseño con objetivos de negocio y necesidades de usuario, gestionando comunicación con stakeholders y presentando resultados accionables.',
  image: '/images/auto-eval/negocio-estrategia.png',
  },
  {
    slug: 'liderazgo-ux',
    label: 'Liderazgo UX',
  description: 'Capacidad de inspirar, guiar y desarrollar equipos a través de visión estratégica, mentoring y promoción de madurez de diseño en la organización.',
  image: '/images/auto-eval/liderazgo-ux.png',
  },
  {
    slug: 'investigacion',
    label: 'Investigación / Research',
  description: 'Planeación y ejecución de investigaciones cualitativas y cuantitativas, desde la formulación de preguntas hasta la generación de insights.',
  image: '/images/auto-eval/investigacion.png',
  },
  {
    slug: 'data-driven',
    label: 'Data Driven',
  description: 'Uso de métricas, análisis de funnels y decisiones basadas en datos para fundamentar el diseño y optimizar productos.',
  image: '/images/auto-eval/data-driven.png',
  },
  {
    slug: 'arquitectura-informacion',
    label: 'Arquitectura de la Información',
  description: 'Organización de contenidos mediante wireframes y taxonomías que construyan interfaces claras y navegables.',
  image: '/images/auto-eval/arquitectura-informacion.png',
  },
  {
    slug: 'diseno-visual',
    label: 'Diseño Visual',
  description: 'Aplicación de design systems, patrones visuales y visualización de datos para lograr interfaces coherentes y efectivas.',
  image: '/images/auto-eval/diseno-visual.png',
  },
  {
    slug: 'pensamiento-producto',
    label: 'Pensamiento de Producto',
  description: 'Definición de visión, priorización de funcionalidades y alineación del diseño con objetivos estratégicos de la empresa.',
  image: '/images/auto-eval/pensamiento-producto.png',
  },
  {
    slug: 'sistemas-diseno',
    label: 'Sistemas de Diseño',
  description: 'Creación, documentación y mantenimiento de sistemas de diseño escalables que aseguren consistencia en interfaces.',
  image: '/images/auto-eval/sistemas-diseno.png',
  },
  {
    slug: 'accesibilidad',
    label: 'Accesibilidad',
  description: 'Diseño inclusivo basado en estándares WCAG, principios de diseño universal y pruebas de accesibilidad para garantizar experiencias accesibles.',
  image: '/images/auto-eval/accesibilidad.png',
  },
  {
    slug: 'ia-tecnologias',
    label: 'IA y Tecnologías Emergentes',
  description: 'Uso de herramientas de inteligencia artificial para prototipado, automatización y eficiencia en el flujo de diseño.',
  image: '/images/auto-eval/ia-tecnologias.png',
  },
]

export function findCategory(slug: string) {
  return categories.find((c) => c.slug === slug) || null
}

export default categories
