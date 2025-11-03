// Static skills dataset derived from provided CSV (partial implementation).
// levelLabels are consistent across all categories.

export const levelLabels = [
  'No familiarizado',
  'Comprendo',
  'En desarrollo',
  'Autónomo',
  'Promuevo',
  'Transformo',
]

export interface SkillLevelDetail {
  level: number
  label: string
  description: string
}

export interface SkillDefinition {
  id: string
  title: string
  description: string
  levels: SkillLevelDetail[]
}

export type SkillsByCategory = Record<string, SkillDefinition[]>

function buildLevels(descriptions: string[]): SkillLevelDetail[] {
  return descriptions.map((d, i) => ({ level: i, label: levelLabels[i], description: d }))
}

function makeId(category: string, title: string) {
  const norm = (s: string) => s.normalize('NFD').replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').toLowerCase()
  return `${norm(category)}_${norm(title)}`
}

export const skills: SkillsByCategory = {
  facilitacion: [
    {
      id: makeId('facilitacion', 'Diseñar workshops colaborativos'),
      title: 'Diseñar workshops colaborativos',
      description: 'Preparar workshops con stakeholders y usuarios, incluyendo actividades y logística.',
      levels: buildLevels([
        'No conoce el concepto de workshops colaborativos.',
        'Entiende su propósito y estructura básica.',
        'Diseña workshops simples con supervisión.',
        'Planea workshops personalizados sin ayuda.',
        'Guía a otros en diseño de workshops efectivos.',
        'Innova en metodologías de workshops.',
      ]),
    },
    {
      id: makeId('facilitacion', 'Facilitación de workshops'),
      title: 'Facilitación de workshops',
      description: 'Liderar workshops para alcanzar objetivos, gestionando dinámicas y tiempo.',
      levels: buildLevels([
        'No sabe cómo facilitar un taller.',
        'Reconoce la importancia de guiar grupos.',
        'Facilita con apoyo, ajustando dinámicas básicas.',
        'Ejecuta talleres adaptándose en tiempo real.',
        'Supervisa a facilitadores en el equipo.',
        'Redefine procesos de facilitación estratégica.',
      ]),
    },
    {
      id: makeId('facilitacion', 'Toma de decisiones grupales'),
      title: 'Toma de decisiones grupales',
      description: 'Usar métodos como consenso o mayoría para decisiones en equipo.',
      levels: buildLevels([
        'No conoce métodos de decisión grupal.',
        'Entiende conceptos como consenso o votación.',
        'Aplica métodos básicos con guía.',
        'Adapta métodos al contexto sin supervisión.',
        'Enseña métodos a otros en el equipo.',
        'Crea nuevos enfoques para decisiones complejas.',
      ]),
    },
    {
      id: makeId('facilitacion', 'Escucha activa'),
      title: 'Escucha activa',
      description: 'Sintetizar y reflejar ideas y emociones del grupo durante facilitaciones.',
      levels: buildLevels([
        'No familiarizado con escucha activa.',
        'Sabe que implica captar ideas y emociones.',
        'Toma notas básicas con apoyo.',
        'Sintetiza y refleja ideas de forma independiente.',
        'Entrena a otros en escucha activa efectiva.',
        'Transforma dinámicas grupales con insights profundos.',
      ]),
    },
  ],
  experimentacion: [
    {
      id: makeId('experimentacion', 'Definición de hipótesis'),
      title: 'Definición de hipótesis',
      description: 'Formular hipótesis claras, medibles y relevantes para orientar validación.',
      levels: buildLevels([
        'No sabe qué es una hipótesis.',
        'Entiende la importancia de tener hipótesis.',
        'Formula hipótesis simples con supervisión.',
        'Define hipótesis relevantes sin ayuda.',
        'Guía a otros en formular hipótesis.',
        'Innova en hipótesis estratégicas complejas.',
      ]),
    },
    {
      id: makeId('experimentacion', 'Análisis de resultados'),
      title: 'Análisis de resultados',
      description: 'Interpretar datos de experimentos para validar hipótesis y obtener insights.',
      levels: buildLevels([
        'No conoce análisis de datos experimentales.',
        'Reconoce su importancia para validar hipótesis.',
        'Lee resultados básicos con apoyo.',
        'Analiza datos y extrae insights autónomamente.',
        'Enseña análisis de resultados al equipo.',
        'Lidera análisis para decisiones de alto impacto.',
      ]),
    },
    {
      id: makeId('experimentacion', 'Muestra y duración de experimentos'),
      title: 'Muestra y duración de experimentos',
      description: 'Determinar muestra representativa y duración metodológica de experimentos.',
      levels: buildLevels([
        'No sabe qué implica definir muestras o duración.',
        'Entiende su importancia para experimentos válidos.',
        'Define muestras simples y duración con guía.',
        'Determina muestras y duración sin supervisión.',
        'Guía al equipo en diseño experimental óptimo.',
        'Innova en metodologías para muestras y tiempos.',
      ]),
    },
  ],
  'diseno-interaccion': [
    {
      id: makeId('diseno-interaccion', 'Prototipado'),
      title: 'Prototipado',
      description: 'Crear prototipos para validar ideas en etapas tempranas.',
      levels: buildLevels([
        'No familiarizado con prototipado.',
        'Entiende su propósito en diseño.',
        'Crea prototipos básicos con guía.',
        'Desarrolla prototipos interactivos sin ayuda.',
        'Supervisa prototipado en el equipo.',
        'Innova en prototipos de alta complejidad.',
      ]),
    },
    {
      id: makeId('diseno-interaccion', 'Microinteracciones'),
      title: 'Microinteracciones',
      description: 'Diseñar microinteracciones que mejoren la experiencia de usuario.',
      levels: buildLevels([
        'No sabe qué son microinteracciones.',
        'Conoce su rol en UX.',
        'Diseña microinteracciones básicas con apoyo.',
        'Crea microinteracciones contextuales autónomas.',
        'Guía a otros en diseño de microinteracciones.',
        'Redefine estándares de microinteracciones.',
      ]),
    },
    {
      id: makeId('diseno-interaccion', 'Documentación para desarrollo'),
      title: 'Documentación para desarrollo',
      description: 'Entregar guías claras para implementar diseños.',
      levels: buildLevels([
        'No conoce documentación para desarrollo.',
        'Entiende su importancia para colaboración.',
        'Documenta diseños básicos con supervisión.',
        'Entrega guías detalladas sin ayuda.',
        'Supervisa documentación en el equipo.',
        'Transforma procesos de entrega técnica.',
      ]),
    },
  ],
  'estrategia-contenido': [
    {
      id: makeId('estrategia-contenido', 'Storytelling'),
      title: 'Storytelling',
      description: 'Diseñar el relato antes de redactar el microcopy.',
      levels: buildLevels([
        'No sabe qué es storytelling en diseño.',
        'Reconoce su valor para conectar con usuarios.',
        'Escribe narrativas simples con apoyo.',
        'Desarrolla historias claras sin ayuda.',
        'Supervisa storytelling en el equipo.',
        'Transforma narrativas en estrategias de producto.',
      ]),
    },
    {
      id: makeId('estrategia-contenido', 'Propuesta de valor'),
      title: 'Propuesta de valor',
      description: 'Incorporar objetivos y propuesta de valor del producto en el diseño de contenido.',
      levels: buildLevels([
        'Desconoce los objetivos y propuesta de valor de su producto.',
        'Conoce los objetivos y propuesta de valor del producto.',
        'Diseña contenido que representa los objetivos y propuesta de valor de su producto con apoyo.',
        'Redacta contenido alineado a la propuesta de valor sin ayuda.',
        'Enseña cómo integrar la propuesta de valor y objetivos en la comunicación.',
        'Diseña nuevos frameworks para incorporar la propuesta de valor en el contenido.',
      ]),
    },
    {
      id: makeId('estrategia-contenido', 'Guidelines'),
      title: 'Guidelines',
      description: 'Aplicar pilares JETS y lineamientos del manual de estilos de LATAM.',
      levels: buildLevels([
        'Desconoce los pilares JETS y lineamientos.',
        'Conoce los pilares JETS y lineamientos de contenido.',
        'Aplica los lineamientos y pilares con guía.',
        'Aplica lineamientos y pilares sin ayuda.',
        'Enseña los lineamientos y cómo aplicarlos.',
        'Coordina creación y documentación de nuevos guidelines.',
      ]),
    },
    {
      id: makeId('estrategia-contenido', 'Consistencia'),
      title: 'Consistencia',
      description: 'Buscar coherencia entre el contenido del producto y el ecosistema LATAM.',
      levels: buildLevels([
        'Desconoce con qué otros touchpoints se relaciona su producto.',
        'Identifica touchpoints relevantes relacionados a su producto.',
        'Busca consistencia con otros productos con apoyo.',
        'Busca consistencia con otros productos sin apoyo.',
        'Enseña cómo buscar consistencia y coherencia.',
        'Diseña frameworks para consistencia de comunicación.',
      ]),
    },
    {
      id: makeId('estrategia-contenido', 'Microcopy y jerarquía de información'),
      title: 'Microcopy y jerarquía de información',
      description: 'Escribir microcopy claro aplicando jerarquía y adaptación a la interfaz.',
      levels: buildLevels([
        'No familiarizado con microcopy.',
        'Sabe qué es y su relevancia en UX.',
        'Redacta textos básicos con apoyo.',
        'Escribe microcopy claro sin supervisión.',
        'Enseña redacción efectiva al equipo.',
        'Define estrategias de contenido globales.',
      ]),
    },
  ],
  usabilidad: [
    {
      id: makeId('usabilidad', 'Pruebas de usabilidad'),
      title: 'Pruebas de usabilidad',
      description: 'Planificar y ejecutar tests para medir éxito/fracaso.',
      levels: buildLevels([
        'No familiarizado con pruebas de usabilidad.',
        'Sabe su propósito en UX.',
        'Asiste en pruebas simples con guía.',
        'Planea y ejecuta pruebas sin supervisión.',
        'Guía al equipo en pruebas efectivas.',
        'Innova en metodologías de pruebas avanzadas.',
      ]),
    },
    {
      id: makeId('usabilidad', 'Evaluación heurística'),
      title: 'Evaluación heurística',
      description: 'Analizar interfaces con heurísticas de usabilidad.',
      levels: buildLevels([
        'No conoce heurísticas.',
        'Entiende su rol en análisis UX.',
        'Identifica problemas básicos con apoyo.',
        'Realiza evaluaciones completas autónomamente.',
        'Enseña heurísticas al equipo.',
        'Transforma procesos de evaluación heurística.',
      ]),
    },
  ],
  'negocio-estrategia': [
    {
      id: makeId('negocio-estrategia', 'Comunicación con stakeholders'),
      title: 'Comunicación con stakeholders',
      description: 'Mantener alineación y gestionar expectativas con interesados.',
      levels: buildLevels([
        'No sabe cómo interactuar con stakeholders.',
        'Reconoce su importancia en proyectos.',
        'Comunica ideas básicas con apoyo.',
        'Gestiona expectativas sin supervisión.',
        'Lidera comunicación estratégica con el equipo.',
        'Innova en alineación con stakeholders clave.',
      ]),
    },
    {
      id: makeId('negocio-estrategia', 'Balance usuario-negocio'),
      title: 'Balance usuario-negocio',
      description: 'Equilibrar necesidades del usuario con objetivos de negocio.',
      levels: buildLevels([
        'No familiarizado con este balance.',
        'Entiende su relevancia para el diseño.',
        'Identifica necesidades básicas con guía.',
        'Encuentra soluciones equilibradas autónomas.',
        'Guía a otros en este balance.',
        'Diseña estrategias de largo plazo usuario-negocio.',
      ]),
    },
    {
      id: makeId('negocio-estrategia', 'Definición de objetivos'),
      title: 'Definición de objetivos',
      description: 'Establecer objetivos claros, medibles y alineados con usuario y negocio.',
      levels: buildLevels([
        'No sabe qué implica definir objetivos en diseño ni su relevancia.',
        'Entiende la importancia de establecer objetivos claros, pero no los aplica.',
        'Define objetivos básicos con apoyo.',
        'Establece objetivos claros y medibles independientemente.',
        'Guía al equipo en definición de objetivos estratégicos.',
        'Innova creando enfoques que alinean diseño y negocio a gran escala.',
      ]),
    },
    {
      id: makeId('negocio-estrategia', 'Presentación resultados'),
      title: 'Presentación resultados',
      description: 'Preparar informes con accionables claros y comprensibles.',
      levels: buildLevels([
        'No sabe cómo presentar resultados.',
        'Entiende la importancia de informes claros.',
        'Crea informes básicos con apoyo.',
        'Elabora informes claros y accionables de forma independiente.',
        'Guía al equipo en creación de informes estratégicos.',
        'Innova en formatos y métodos de presentación para maximizar impacto.',
      ]),
    },
    {
      id: makeId('negocio-estrategia', 'Evangelización UX'),
      title: 'Evangelización UX',
      description: 'Promover el valor de la experiencia de usuario en la organización.',
      levels: buildLevels([
        'No conoce evangelización UX.',
        'Sabe su importancia para el equipo.',
        'Explica beneficios básicos con apoyo.',
        'Aboga por UX con impacto tangible.',
        'Lidera iniciativas de evangelización.',
        'Transforma cultura organizacional con UX.',
      ]),
    },
  ],
  'liderazgo-ux': [
    {
      id: makeId('liderazgo-ux', 'Visión estratégica'),
      title: 'Visión estratégica',
      description: 'Liderar y establecer dirección clara alineada a negocio y usuarios.',
      levels: buildLevels([
        'No conoce el concepto de visión estratégica en diseño.',
        'Entiende la importancia de una visión estratégica en UX.',
        'Comienza a aplicar principios estratégicos con apoyo.',
        'Define y aplica una visión estratégica de forma independiente.',
        'Guía al equipo en la creación de una visión estratégica.',
        'Transforma la organización con visión referente en diseño.',
      ]),
    },
    {
      id: makeId('liderazgo-ux', 'Coaching y mentoring'),
      title: 'Coaching y mentoring',
      description: 'Desarrollar al equipo mediante mentoría y feedback.',
      levels: buildLevels([
        'No sabe qué implica coaching y mentoring en diseño.',
        'Reconoce su valor para el desarrollo del equipo.',
        'Ofrece coaching básico con supervisión.',
        'Brinda coaching y mentoring autónomo y efectivo.',
        'Fomenta cultura de coaching continuo.',
        'Transforma el crecimiento del equipo elevando madurez de diseño.',
      ]),
    },
    {
      id: makeId('liderazgo-ux', 'Colaboración Interdisciplinaria'),
      title: 'Colaboración Interdisciplinaria',
      description: 'Trabajar con otras áreas para soluciones integrales.',
      levels: buildLevels([
        'No conoce la importancia de colaborar con otros equipos.',
        'Entiende el valor de la colaboración interdisciplinaria.',
        'Colabora de forma básica con apoyo.',
        'Colabora efectiva y autónomamente con otros equipos.',
        'Promueve la colaboración interdisciplinaria.',
        'Lidera iniciativas que integran equipos y posicionan al diseño.',
      ]),
    },
    {
      id: makeId('liderazgo-ux', 'Madurez de Diseño'),
      title: 'Madurez de Diseño',
      description: 'Elevar prácticas, estándares y cultura centrada en el usuario.',
      levels: buildLevels([
        'No está familiarizado con el concepto de madurez de diseño.',
        'Reconoce la importancia de la madurez de diseño.',
        'Contribuye a la madurez de diseño con apoyo.',
        'Eleva la madurez de diseño de forma independiente.',
        'Promueve prácticas que incrementan la madurez.',
        'Transforma la industria posicionando referente en madurez.',
      ]),
    },
  ],
  investigacion: [
    {
      id: makeId('investigacion', 'Creación de preguntas de research'),
      title: 'Creación de preguntas de research',
      description: 'Redactar preguntas adecuadas que respondan objetivos sin inducir.',
      levels: buildLevels([
        'No sabe cómo conectar preguntas a objetivos.',
        'Entiende la conexión objetivo/pregunta pero no sabe ejecutarlo.',
        'Redacta preguntas con guía.',
        'Redacta preguntas que responden objetivos sin inducir.',
        'Supervisa la redacción de preguntas sin inducir.',
        'Genera guidelines que elevan la redacción de preguntas.',
      ]),
    },
    {
      id: makeId('investigacion', 'Análisis de datos'),
      title: 'Análisis de datos',
      description: 'Interpretar datos cualitativos y cuantitativos para insights.',
      levels: buildLevels([
        'No familiarizado con análisis de datos.',
        'Reconoce su valor para insights.',
        'Lee datos básicos con apoyo.',
        'Analiza datos autónomamente (incluye uso de IA).',
        'Enseña análisis de datos avanzado al equipo.',
        'Transforma datos en estrategias de producto.',
      ]),
    },
    {
      id: makeId('investigacion', 'Generación de insights'),
      title: 'Generación de insights',
      description: 'Extraer hallazgos accionables a partir de investigaciones.',
      levels: buildLevels([
        'No sabe qué son insights.',
        'Entiende su rol en UX.',
        'Identifica insights básicos con guía.',
        'Genera insights relevantes sin ayuda.',
        'Guía a otros en creación de insights.',
        'Lidera insights para decisiones estratégicas.',
      ]),
    },
    {
      id: makeId('investigacion', 'Planificación de Investigación'),
      title: 'Planificación de Investigación',
      description: 'Diseñar planes con métodos cualitativos y cuantitativos apropiados.',
      levels: buildLevels([
        'No sabe qué implica planificar una investigación.',
        'Entiende la importancia de un plan estructurado pero no lo aplica.',
        'Elabora planes básicos con apoyo.',
        'Crea planes efectivos y estructurados independientemente.',
        'Guía al equipo en planificación estratégica.',
        'Innova metodologías de planificación para máximo impacto.',
      ]),
    },
  ],
  'data-driven': [
    {
      id: makeId('data-driven', 'Métricas'),
      title: 'Métricas',
      description: 'Definir y seguir indicadores clave de UX y producto.',
      levels: buildLevels([
        'No conoce de métricas.',
        'Sabe su importancia.',
        'Usa métricas básicas con apoyo.',
        'Define métricas clave autónomamente.',
        'Enseña métricas al equipo.',
        'Innova en sistemas de métricas avanzados.',
      ]),
    },
    {
      id: makeId('data-driven', 'Análisis de funnel'),
      title: 'Análisis de funnel',
      description: 'Identificar puntos críticos en flujos de usuario con datos.',
      levels: buildLevels([
        'No familiarizado con funnels.',
        'Entiende su rol en UX.',
        'Lee funnels básicos con guía.',
        'Analiza funnels completos sin ayuda.',
        'Guía al equipo en análisis de funnels.',
        'Transforma flujos con datos estratégicos.',
      ]),
    },
    {
      id: makeId('data-driven', 'Decisiones basadas en datos'),
      title: 'Decisiones basadas en datos',
      description: 'Usar datos y research para fundamentar decisiones.',
      levels: buildLevels([
        'No sabe cómo usar datos en diseño.',
        'Reconoce su valor para decisiones.',
        'Usa datos básicos con apoyo.',
        'Toma decisiones con datos sin supervisión.',
        'Promueve decisiones basadas en datos.',
        'Innova estrategias de diseño data-driven.',
      ]),
    },
  ],
  'arquitectura-informacion': [
    {
      id: makeId('arquitectura-informacion', 'Wireframes y taxonomías'),
      title: 'Wireframes y taxonomías',
      description: 'Diseñar estructuras y organizar información para interfaces intuitivas.',
      levels: buildLevels([
        'No conoce wireframes ni taxonomías.',
        'Entiende su propósito en UX.',
        'Crea wireframes básicos con guía.',
        'Diseña estructuras efectivas sin ayuda.',
        'Enseña arquitectura al equipo.',
        'Innova en navegación y escalabilidad.',
      ]),
    },
  ],
  'diseno-visual': [
    {
      id: makeId('diseno-visual', 'Patrones y componentes'),
      title: 'Patrones y componentes',
      description: 'Usar Design Systems para interfaces coherentes y consistentes.',
      levels: buildLevels([
        'No sabe qué son Design Systems.',
        'Conoce su rol en diseño visual.',
        'Usa componentes básicos con apoyo.',
        'Aplica patrones autónomamente.',
        'Guía a otros en uso de Design Systems.',
        'Innova en estándares de diseño visual.',
      ]),
    },
    {
      id: makeId('diseno-visual', 'Visualización de datos'),
      title: 'Visualización de datos',
      description: 'Representar datos complejos de forma simple y clara.',
      levels: buildLevels([
        'No familiarizado con visualización de datos.',
        'Entiende su importancia en UX.',
        'Crea visualizaciones simples con guía.',
        'Diseña visualizaciones efectivas sin ayuda.',
        'Enseña visualización al equipo.',
        'Transforma datos en narrativas visuales avanzadas.',
      ]),
    },
  ],
  'pensamiento-producto': [
    {
      id: makeId('pensamiento-producto', 'Definir visión del producto'),
      title: 'Definir visión del producto',
      description: 'Establecer una visión clara alineada a objetivos de negocio.',
      levels: buildLevels([
        'No sabe qué es visión de producto.',
        'Reconoce su importancia estratégica.',
        'Describe visión básica con apoyo.',
        'Define visión clara sin supervisión.',
        'Guía al equipo en visión de producto.',
        'Innova visiones estratégicas globales.',
      ]),
    },
    {
      id: makeId('pensamiento-producto', 'Priorización de features'),
      title: 'Priorización de features',
      description: 'Decidir funcionalidades según impacto y esfuerzo.',
      levels: buildLevels([
        'No conoce priorización de features.',
        'Entiende su rol en desarrollo.',
        'Prioriza features simples con guía.',
        'Prioriza autónomamente con balance.',
        'Enseña priorización al equipo.',
        'Transforma roadmaps con estrategias avanzadas.',
      ]),
    },
    {
      id: makeId('pensamiento-producto', 'Alineación con objetivos de negocio'),
      title: 'Alineación con objetivos de negocio',
      description: 'Asegurar que el diseño apoye metas estratégicas.',
      levels: buildLevels([
        'No familiarizado con objetivos de negocio.',
        'Sabe su importancia para el diseño.',
        'Identifica objetivos básicos con apoyo.',
        'Alinea diseños con metas sin ayuda.',
        'Guía al equipo en alineación estratégica.',
        'Innova conexión diseño-negocio.',
      ]),
    },
  ],
  'sistemas-diseno': [
    {
      id: makeId('sistemas-diseno', 'Crear sistemas de diseño'),
      title: 'Crear sistemas de diseño',
      description: 'Desarrollar sistemas escalables y consistentes.',
      levels: buildLevels([
        'No conoce sistemas de diseño.',
        'Entiende su propósito en UX.',
        'Usa sistemas básicos con guía.',
        'Crea sistemas simples sin supervisión.',
        'Enseña creación de sistemas al equipo.',
        'Innova en sistemas escalables y complejos.',
      ]),
    },
    {
      id: makeId('sistemas-diseno', 'Mantener consistencia en UI'),
      title: 'Mantener consistencia en UI',
      description: 'Asegurar que componentes sigan pautas visuales.',
      levels: buildLevels([
        'No sabe qué es consistencia en UI.',
        'Reconoce su importancia en diseño.',
        'Aplica consistencia básica con apoyo.',
        'Mantiene consistencia autónomamente.',
        'Supervisa consistencia en el equipo.',
        'Transforma estándares de UI en la organización.',
      ]),
    },
    {
      id: makeId('sistemas-diseno', 'Documentar componentes'),
      title: 'Documentar componentes',
      description: 'Crear guías claras para uso y desarrollo.',
      levels: buildLevels([
        'No familiarizado con documentación de componentes.',
        'Entiende su valor para colaboración.',
        'Documenta componentes básicos con guía.',
        'Escribe guías detalladas sin ayuda.',
        'Guía al equipo en documentación efectiva.',
        'Innova procesos de documentación técnica.',
      ]),
    },
  ],
  accesibilidad: [
    {
      id: makeId('accesibilidad', 'Estándares WCAG'),
      title: 'Estándares WCAG',
      description: 'Diseñar interfaces cumpliendo pautas WCAG.',
      levels: buildLevels([
        'No conoce WCAG ni su propósito.',
        'Entiende qué es WCAG y su importancia.',
        'Aplica requisitos básicos con supervisión.',
        'Diseña con WCAG AA sin ayuda.',
        'Guía al equipo en cumplimiento WCAG.',
        'Lidera estrategias para WCAG AAA a gran escala.',
      ]),
    },
    {
      id: makeId('accesibilidad', 'Diseño Universal'),
      title: 'Diseño Universal',
      description: 'Aplicar los 7 principios para productos inclusivos.',
      levels: buildLevels([
        'No sabe qué es Diseño Universal.',
        'Conoce los 7 principios y su relevancia.',
        'Aplica principios básicos con apoyo.',
        'Diseña con principios en proyectos estándar.',
        'Enseña Diseño Universal al equipo.',
        'Innova en soluciones inclusivas globales.',
      ]),
    },
    {
      id: makeId('accesibilidad', 'Test de accesibilidad'),
      title: 'Test de accesibilidad',
      description: 'Evaluar productos con herramientas y usuarios con discapacidad.',
      levels: buildLevels([
        'No conoce herramientas ni tests de accesibilidad.',
        'Entiende su propósito y uso básico.',
        'Usa herramientas con guía para problemas obvios.',
        'Realiza tests completos sin supervisión.',
        'Supervisa pruebas y mejora procesos.',
        'Diseña frameworks de pruebas inclusivas.',
      ]),
    },
    {
      id: makeId('accesibilidad', 'Mínimo de accesibilidad'),
      title: 'Mínimo de accesibilidad',
      description: 'Garantizar contraste, legibilidad y diseño adaptable.',
      levels: buildLevels([
        'No familiarizado con requisitos mínimos.',
        'Sabe qué implica accesibilidad mínima.',
        'Aplica requisitos básicos con apoyo.',
        'Asegura accesibilidad mínima independientemente.',
        'Promueve estándares mínimos en el equipo.',
        'Optimiza accesibilidad como práctica estándar.',
      ]),
    },
  ],
  'ia-tecnologias': [
    {
      id: makeId('ia-tecnologias', 'Prototipado con IA'),
      title: 'Prototipado con IA',
      description: 'Usar IA para crear prototipos interactivos.',
      levels: buildLevels([
        'No conoce herramientas de IA para prototipado.',
        'Sabe su propósito en diseño.',
        'Usa IA básica con apoyo.',
        'Crea prototipos con IA sin supervisión.',
        'Enseña prototipado con IA al equipo.',
        'Innova flujos de prototipado con IA.',
      ]),
    },
    {
      id: makeId('ia-tecnologias', 'Uso de IA'),
      title: 'Uso de IA',
      description: 'Usar IA para eficientar trabajo diario.',
      levels: buildLevels([
        'No conoce herramientas para eficientar con IA.',
        'Entiende el potencial de la IA generativa.',
        'Conversa con IA / usa prompts básicos.',
        'Usa asistentes transversalmente en su trabajo.',
        'Encuentra oportunidades y comparte buenas prácticas.',
        'Innova soluciones avanzadas usando IA.',
      ]),
    },
    {
      id: makeId('ia-tecnologias', 'Automatización de flujos de diseño con IA'),
      title: 'Automatización de flujos de diseño con IA',
      description: 'Automatizar tareas repetitivas o complejas con IA en diseño.',
      levels: buildLevels([
        'No conoce herramientas de IA generativa ni considera su uso.',
        'Reconoce el potencial de la IA generativa pero no la usa.',
        'Usa IA generativa con ayuda para tareas puntuales.',
        'Integra IA generativa habitualmente para ahorrar tiempo.',
        'Comparte buenas prácticas e incorpora IA en rutinas del equipo.',
        'Reimagina procesos y diseña nuevas formas de trabajar con IA.',
      ]),
    },
  ],
}

export function getCategorySkills(slug: string): SkillDefinition[] {
  return skills[slug] || []
}
