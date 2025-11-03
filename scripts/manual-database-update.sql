-- Manual Database Update Script for Product Designer Skill Matrix
-- Execute this script in your Supabase SQL Editor

-- First, let's clean up existing data
DELETE FROM skill_assessments;
DELETE FROM skills;

-- Drop and recreate skill_categories table if it doesn't exist
DROP TABLE IF EXISTS skill_categories CASCADE;

CREATE TABLE skill_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update skills table structure
ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_category_check;
ALTER TABLE skills ALTER COLUMN category TYPE TEXT;

-- Insert new categories
INSERT INTO skill_categories (name, description) VALUES
('Facilitación', 'Habilidades para liderar y facilitar workshops y dinámicas grupales'),
('Experimentación', 'Capacidades para diseñar, ejecutar y analizar experimentos de usuario'),
('Diseño e Interacción', 'Competencias en prototipado, microinteracciones y documentación técnica'),
('Estrategia de Contenido', 'Habilidades para crear contenido estratégico, storytelling y microcopy'),
('Usabilidad', 'Capacidades para evaluar y mejorar la usabilidad de productos'),
('Negocio y Estrategia', 'Competencias para alinear diseño con objetivos de negocio'),
('Liderazgo UX', 'Habilidades de liderazgo, visión estratégica y desarrollo de equipos'),
('Investigación / Research', 'Capacidades para planificar, ejecutar y analizar investigación de usuarios'),
('Data Driven', 'Competencias para tomar decisiones basadas en datos y métricas'),
('Arquitectura de la Información', 'Habilidades para organizar y estructurar información'),
('Diseño Visual', 'Competencias en sistemas de diseño y visualización de datos'),
('Pensamiento de Producto', 'Capacidades para definir visión y estrategia de producto'),
('Sistemas de Diseño', 'Habilidades para crear y mantener sistemas de diseño escalables'),
('Accesibilidad', 'Competencias para diseñar productos inclusivos y accesibles'),
('IA y Tecnologías Emergentes', 'Habilidades para integrar IA y nuevas tecnologías en el diseño');

-- Clear existing skills and insert new ones
INSERT INTO skills (name, category, description) VALUES
-- Facilitación
('Diseñar workshops colaborativos', 'Facilitación', 'Preparar workshops con stakeholders y usuarios, incluyendo actividades y logística.'),
('Facilitación de workshops', 'Facilitación', 'Liderar workshops para alcanzar objetivos, gestionando dinámicas y tiempo.'),
('Toma de decisiones grupales', 'Facilitación', 'Usar métodos como consenso o mayoría para decisiones en equipo.'),
('Escucha activa', 'Facilitación', 'Sintetizar y reflejar ideas y emociones del grupo durante facilitaciones.'),

-- Experimentación
('Definición de hipótesis', 'Experimentación', 'Formular hipótesis claras, medibles y relevantes que orienten la toma de decisiones y validación de soluciones.'),
('Análisis de resultados', 'Experimentación', 'Interpretar datos de experimentos para validar hipótesis y obtener insights.'),
('Muestra y duración de experimentos', 'Experimentación', 'Determinar muestra representativa y duración metodológica de experimentos.'),

-- Diseño e Interacción
('Prototipado', 'Diseño e Interacción', 'Crear prototipos para validar ideas en etapas tempranas.'),
('Microinteracciones', 'Diseño e Interacción', 'Diseñar interacciones pequeñas para mejorar la experiencia de usuario.'),
('Documentación para desarrollo', 'Diseño e Interacción', 'Entregar guías claras para implementar diseños.'),

-- Estrategia de Contenido
('Storytelling', 'Estrategia de Contenido', 'Diseñar el relato antes de redactar el microcopy'),
('Propuesta de valor', 'Estrategia de Contenido', 'Incorporar los objetivos y propuesta de valor de mi producto en el diseño de contenido'),
('Guidelines', 'Estrategia de Contenido', 'Aplico los pilares JETS y los lineamientos del manual de estilos de LATAM'),
('Consistencia', 'Estrategia de Contenido', 'Busco la consistencia y coherencia entre lo que comunico en mi producto y el resto del ecosistema de LATAM'),
('Microcopy y jerarquía de información', 'Estrategia de Contenido', 'Escribir microcopy claros, aplicando jerarquía de información y adaptando el contenido a la interfaz donde se muestra'),

-- Usabilidad
('Pruebas de usabilidad', 'Usabilidad', 'Planificar y ejecutar tests para medir su éxito/fracaso'),
('Evaluación heurística', 'Usabilidad', 'Analizar interfaces con heurísticas de usabilidad (ej. Nielsen).'),

-- Negocio y Estrategia
('Comunicación con stakeholders', 'Negocio y Estrategia', 'Mantener alineación y gestionar expectativas con interesados.'),
('Balance usuario-negocio', 'Negocio y Estrategia', 'Equilibrar necesidades del usuario con objetivos de negocio.'),
('Definición de objetivos', 'Negocio y Estrategia', 'Establecer objetivos claros, medibles y alineados tanto con las necesidades del usuario como con las metas estratégicas del negocio, asegurando que las iniciativas de diseño y/o investigaciones generen un impacto significativo.'),
('Presentación resultados', 'Negocio y Estrategia', 'Preparo informe de resultados con accionables claros y de fácil comprensión para distintos roles.'),
('Evangelización UX', 'Negocio y Estrategia', 'Promover el valor de la experiencia de usuario en la organización.'),

-- Liderazgo UX
('Visión estratégica', 'Liderazgo UX', 'Se centra en la capacidad de liderar y establecer una dirección clara que alinee el diseño con los objetivos de negocio y las necesidades del usuario. Esto implica no solo entender el contexto, sino también inspirar al equipo hacia un impacto significativo.'),
('Coaching y mentoring', 'Liderazgo UX', 'Enfatiza el rol del liderazgo en el desarrollo del equipo mediante mentoría, coaching y retroalimentación, un aspecto clave para un liderazgo efectivo en UX. Se trata de empoderar a otros para que crezcan profesionalmente.'),
('Colaboración Interdisciplinaria', 'Liderazgo UX', 'Refleja la necesidad de trabajar con equipos de otras áreas (desarrollo, producto, negocio) para crear soluciones integrales, un pilar del diseño centrado en el usuario que requiere habilidades de comunicación y empatía.'),
('Madurez de Diseño', 'Liderazgo UX', 'Se enfoca en elevar la práctica del diseño dentro de la organización, promoviendo procesos maduros, estándares de calidad y una cultura centrada en el usuario, lo que impacta directamente en la percepción del diseño.'),

-- Investigación / Research
('Creación de preguntas de research', 'Investigación / Research', 'Redactar y elegir preguntas de investigación adecuadas en las distintas metodologías, que permitan validar mis objetivos, sin inducir a los usuarios.'),
('Análisis de datos', 'Investigación / Research', 'Interpretar datos cualitativos y cuantitativos, para generar insights.'),
('Generación de insights', 'Investigación / Research', 'Extraer hallazgos accionables a partir de investigaciones.'),
('Planificación de Investigación', 'Investigación / Research', 'Habilidad de diseñar un plan de investigación que seleccione los métodos cualitativos (ej. entrevistas, observaciones) y cuantitativos (ej. encuestas, análisis de datos) más adecuados para los objetivos del proyecto. Esto incluye definir el alcance, los participantes y las herramientas necesarias para garantizar hallazgos útiles y accionables.'),

-- Data Driven
('Métricas', 'Data Driven', 'Definir y seguir indicadores clave de UX y producto.'),
('Análisis de funnel', 'Data Driven', 'Identificar puntos críticos en flujos de usuario con datos.'),
('Decisiones basadas en datos', 'Data Driven', 'Usar datos y research para fundamentar decisiones de diseño.'),

-- Arquitectura de la Información
('Wireframes y taxonomías', 'Arquitectura de la Información', 'Diseñar estructuras y organizar información para interfaces intuitivas.'),

-- Diseño Visual
('Patrones y componentes', 'Diseño Visual', 'Usar Design Systems para crear interfaces coherentes y consistentes.'),
('Visualización de datos', 'Diseño Visual', 'Representar datos complejos de forma simple, clara y visual.'),

-- Pensamiento de Producto
('Definir visión del producto', 'Pensamiento de Producto', 'Establecer una visión clara y alineada con objetivos de negocio.'),
('Priorización de features', 'Pensamiento de Producto', 'Decidir qué funcionalidades desarrollar primero según impacto y esfuerzo.'),
('Alineación con objetivos de negocio', 'Pensamiento de Producto', 'Asegurar que el diseño apoye metas estratégicas de la empresa.'),

-- Sistemas de Diseño
('Crear sistemas de diseño', 'Sistemas de Diseño', 'Desarrollar sistemas escalables para consistencia en interfaces.'),
('Mantener consistencia en UI', 'Sistemas de Diseño', 'Asegurar que todos los componentes sigan las mismas pautas visuales.'),
('Documentar componentes', 'Sistemas de Diseño', 'Crear guías claras para el uso y desarrollo de componentes.'),

-- Accesibilidad
('Estándares WCAG', 'Accesibilidad', 'Diseñar interfaces cumpliendo pautas WCAG (A, AA, AAA).'),
('Diseño Universal', 'Accesibilidad', 'Aplicar los 7 principios para crear productos inclusivos.'),
('Test de accesibilidad', 'Accesibilidad', 'Evaluar productos con herramientas (ej. Axe, WAVE) y usuarios con discapacidad.'),
('Mínimo de accesibilidad', 'Accesibilidad', 'Garantizar contraste, tipografía legible y diseño adaptable al 200% de zoom.'),

-- IA y Tecnologías Emergentes
('Prototipado con IA', 'IA y Tecnologías Emergentes', 'Usar herramientas basadas en IA para crear prototipos interactivos.'),
('Uso de IA', 'IA y Tecnologías Emergentes', 'Usa IA para eficientar su trabajo diario'),
('Automatización de flujos de diseño con IA', 'IA y Tecnologías Emergentes', 'Utiliza herramientas de IA para automatizar tareas repetitivas o complejas en el proceso de diseño, como generar variantes de interfaces y contenido, optimizar wireframes o agilizar revisiones de usabilidad.');

-- Update skill_assessments table to use integer levels (0-5) instead of text
ALTER TABLE skill_assessments ALTER COLUMN level TYPE INTEGER USING 
  CASE 
    WHEN level = 'basic' THEN 1
    WHEN level = 'intermediate' THEN 3
    WHEN level = 'advanced' THEN 5
    ELSE 0
  END;

-- Add constraint for level values (0-5)
ALTER TABLE skill_assessments ADD CONSTRAINT skill_assessments_level_check 
  CHECK (level >= 0 AND level <= 5);

-- Update timestamps
UPDATE skill_categories SET updated_at = NOW();
UPDATE skills SET updated_at = NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user_id ON skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_skill_id ON skill_assessments(skill_id);

-- Refresh any views or functions that might depend on this data
-- (Add any specific refresh commands if needed)

SELECT 'Database update completed successfully!' as status;
