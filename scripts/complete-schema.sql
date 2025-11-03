-- =====================================================
-- SKILL MATRIX - ESQUEMA COMPLETO DE BASE DE DATOS
-- ACTUALIZADO PARA PRODUCT DESIGNER SKILL MATRIX
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'designer' CHECK (role IN ('designer', 'leader', 'head_chapter', 'admin')),
    avatar_url TEXT,
    bio TEXT,
    leader_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nueva tabla de categorías de skills
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de skills actualizada con referencia a categorías
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, category_id)
);

-- Tabla de evaluaciones de skills actualizada con niveles 0-5
CREATE TABLE IF NOT EXISTS public.skill_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 5),
    justification TEXT NOT NULL,
    evidence TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejected_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    UNIQUE(user_id, skill_id)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_leader_id ON public.profiles(leader_id);

-- Índices para skill_categories
CREATE INDEX IF NOT EXISTS idx_skill_categories_name ON public.skill_categories(name);

-- Índices actualizados para skills
CREATE INDEX IF NOT EXISTS idx_skills_category_id ON public.skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);

-- Índices actualizados para skill_assessments
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user_id ON public.skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_skill_id ON public.skill_assessments(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_status ON public.skill_assessments(status);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_level ON public.skill_assessments(level);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_created_at ON public.skill_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_approved_at ON public.skill_assessments(approved_at);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_approved_by ON public.skill_assessments(approved_by);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_rejected_at ON public.skill_assessments(rejected_at);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_rejected_by ON public.skill_assessments(rejected_by);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar timestamp de aprobación/rechazo
CREATE OR REPLACE FUNCTION update_skill_assessment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' THEN
        NEW.approved_at = NOW();
        NEW.approved_by = auth.uid();
    ELSIF NEW.status = 'rejected' THEN
        NEW.rejected_at = NOW();
        NEW.rejected_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'designer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at en profiles
DROP TRIGGER IF EXISTS trigger_update_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para skill_categories
DROP TRIGGER IF EXISTS trigger_update_skill_categories_updated_at ON public.skill_categories;
CREATE TRIGGER trigger_update_skill_categories_updated_at
    BEFORE UPDATE ON public.skill_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en skills
DROP TRIGGER IF EXISTS trigger_update_skills_updated_at ON public.skills;
CREATE TRIGGER trigger_update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar updated_at en skill_assessments
DROP TRIGGER IF EXISTS trigger_update_skill_assessments_updated_at ON public.skill_assessments;
CREATE TRIGGER trigger_update_skill_assessments_updated_at
    BEFORE UPDATE ON public.skill_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar timestamps de aprobación/rechazo
DROP TRIGGER IF EXISTS trigger_update_skill_assessment_timestamp ON public.skill_assessments;
CREATE TRIGGER trigger_update_skill_assessment_timestamp
    BEFORE UPDATE ON public.skill_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_skill_assessment_timestamp();

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS trigger_handle_new_user ON auth.users;
CREATE TRIGGER trigger_handle_new_user
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_assessments ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Leaders can view their team members" ON public.profiles
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE role = 'leader'
        ) AND leader_id = auth.uid()
    );

CREATE POLICY "Head chapters can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('head_chapter', 'admin')
        )
    );

-- Políticas para skill_categories
CREATE POLICY "Everyone can view skill categories" ON public.skill_categories
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage skill categories" ON public.skill_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para skills
CREATE POLICY "Everyone can view skills" ON public.skills
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage skills" ON public.skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Políticas para skill_assessments
CREATE POLICY "Users can view their own assessments" ON public.skill_assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" ON public.skill_assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" ON public.skill_assessments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Leaders can view their team assessments" ON public.skill_assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'leader'
        ) AND user_id IN (
            SELECT id FROM public.profiles WHERE leader_id = auth.uid()
        )
    );

CREATE POLICY "Leaders can approve/reject team assessments" ON public.skill_assessments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'leader'
        ) AND user_id IN (
            SELECT id FROM public.profiles WHERE leader_id = auth.uid()
        )
    );

CREATE POLICY "Head chapters can view all assessments" ON public.skill_assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('head_chapter', 'admin')
        )
    );

-- =====================================================
-- DATOS INICIALES - PRODUCT DESIGNER SKILL MATRIX
-- =====================================================

-- Insertar categorías de Product Designer
INSERT INTO public.skill_categories (name, description) VALUES
('Facilitación', 'Habilidades para diseñar y liderar workshops colaborativos, gestionar dinámicas grupales y facilitar la toma de decisiones'),
('Experimentación', 'Capacidades para definir hipótesis, diseñar experimentos y analizar resultados para validar soluciones'),
('Diseño e Interacción', 'Competencias en prototipado, microinteracciones y documentación técnica para desarrollo'),
('Estrategia de Contenido', 'Habilidades para crear narrativas, aplicar guidelines y mantener consistencia en la comunicación'),
('Usabilidad', 'Capacidades para planificar y ejecutar pruebas de usabilidad y evaluaciones heurísticas'),
('Negocio y Estrategia', 'Competencias para alinear diseño con objetivos de negocio y comunicarse efectivamente con stakeholders'),
('Liderazgo UX', 'Habilidades de liderazgo, visión estratégica y desarrollo de equipos en experiencia de usuario'),
('Investigación / Research', 'Competencias en metodologías de investigación, análisis de datos y generación de insights'),
('Data Driven', 'Capacidades para definir métricas, analizar datos y tomar decisiones basadas en evidencia'),
('Arquitectura de la Información', 'Habilidades para diseñar estructuras de información y organizar contenido de manera intuitiva'),
('Diseño Visual', 'Competencias en sistemas de diseño, patrones visuales y visualización de datos'),
('Pensamiento de Producto', 'Capacidades para definir visión de producto, priorizar features y alinear con objetivos de negocio'),
('Sistemas de Diseño', 'Habilidades para crear, mantener y documentar sistemas de diseño escalables'),
('Accesibilidad', 'Competencias en estándares WCAG, diseño universal y pruebas de accesibilidad'),
('IA y Tecnologías Emergentes', 'Habilidades para integrar IA en flujos de trabajo y automatizar procesos de diseño')
ON CONFLICT (name) DO NOTHING;

-- Insertar skills de Product Designer por categoría
WITH category_ids AS (
    SELECT id, name FROM public.skill_categories
)
INSERT INTO public.skills (name, category_id, description) 
SELECT skill_name, cat.id, skill_description
FROM (VALUES
    -- Facilitación
    ('Diseñar workshops colaborativos', 'Facilitación', 'Preparar workshops con stakeholders y usuarios, incluyendo actividades y logística'),
    ('Facilitación de workshops', 'Facilitación', 'Liderar workshops para alcanzar objetivos, gestionando dinámicas y tiempo'),
    ('Toma de decisiones grupales', 'Facilitación', 'Usar métodos como consenso o mayoría para decisiones en equipo'),
    ('Escucha activa', 'Facilitación', 'Sintetizar y reflejar ideas y emociones del grupo durante facilitaciones'),
    
    -- Experimentación
    ('Definición de hipótesis', 'Experimentación', 'Formular hipótesis claras, medibles y relevantes que orienten la toma de decisiones y validación de soluciones'),
    ('Análisis de resultados', 'Experimentación', 'Interpretar datos de experimentos para validar hipótesis y obtener insights'),
    ('Muestra y duración de experimentos', 'Experimentación', 'Determinar muestra representativa y duración metodológica de experimentos'),
    
    -- Diseño e Interacción
    ('Prototipado', 'Diseño e Interacción', 'Crear prototipos para validar ideas en etapas tempranas'),
    ('Microinteracciones', 'Diseño e Interacción', 'Diseñar interacciones pequeñas para mejorar la experiencia de usuario'),
    ('Documentación para desarrollo', 'Diseño e Interacción', 'Entregar guías claras para implementar diseños'),
    
    -- Estrategia de Contenido
    ('Storytelling', 'Estrategia de Contenido', 'Diseñar el relato antes de redactar el microcopy'),
    ('Propuesta de valor', 'Estrategia de Contenido', 'Incorporar los objetivos y propuesta de valor de mi producto en el diseño de contenido'),
    ('Guidelines', 'Estrategia de Contenido', 'Aplico los pilares JETS y los lineamientos del manual de estilos de LATAM'),
    ('Consistencia', 'Estrategia de Contenido', 'Busco la consistencia y coherencia entre lo que comunico en mi producto y el resto del ecosistema de LATAM'),
    ('Microcopy y jerarquía de información', 'Estrategia de Contenido', 'Escribir microcopy claros, aplicando jerarquía de información y adaptando el contenido a la interfaz donde se muestra'),
    
    -- Usabilidad
    ('Pruebas de usabilidad', 'Usabilidad', 'Planificar y ejecutar tests para medir su éxito/fracaso'),
    ('Evaluación heurística', 'Usabilidad', 'Analizar interfaces con heurísticas de usabilidad (ej. Nielsen)'),
    
    -- Negocio y Estrategia
    ('Comunicación con stakeholders', 'Negocio y Estrategia', 'Mantener alineación y gestionar expectativas con interesados'),
    ('Balance usuario-negocio', 'Negocio y Estrategia', 'Equilibrar necesidades del usuario con objetivos de negocio'),
    ('Definición de objetivos', 'Negocio y Estrategia', 'Establecer objetivos claros, medibles y alineados tanto con las necesidades del usuario como con las metas estratégicas del negocio'),
    ('Presentación resultados', 'Negocio y Estrategia', 'Preparo informe de resultados con accionables claros y de fácil comprensión para distintos roles'),
    ('Evangelización UX', 'Negocio y Estrategia', 'Promover el valor de la experiencia de usuario en la organización'),
    
    -- Liderazgo UX
    ('Visión estratégica', 'Liderazgo UX', 'Se centra en la capacidad de liderar y establecer una dirección clara que alinee el diseño con los objetivos de negocio y las necesidades del usuario'),
    ('Coaching y mentoring', 'Liderazgo UX', 'Enfatiza el rol del liderazgo en el desarrollo del equipo mediante mentoría, coaching y retroalimentación'),
    ('Colaboración Interdisciplinaria', 'Liderazgo UX', 'Refleja la necesidad de trabajar con equipos de otras áreas (desarrollo, producto, negocio) para crear soluciones integrales'),
    ('Madurez de Diseño', 'Liderazgo UX', 'Se enfoca en elevar la práctica del diseño dentro de la organización, promoviendo procesos maduros, estándares de calidad y una cultura centrada en el usuario'),
    
    -- Investigación / Research
    ('Creación de preguntas de research', 'Investigación / Research', 'Redactar y elegir preguntas de investigación adecuadas en las distintas metodologías, que permitan validar mis objetivos, sin inducir a los usuarios'),
    ('Análisis de datos', 'Investigación / Research', 'Interpretar datos cualitativos y cuantitativos, para generar insights'),
    ('Generación de insights', 'Investigación / Research', 'Extraer hallazgos accionables a partir de investigaciones'),
    ('Planificación de Investigación', 'Investigación / Research', 'Habilidad de diseñar un plan de investigación que seleccione los métodos cualitativos y cuantitativos más adecuados para los objetivos del proyecto'),
    
    -- Data Driven
    ('Métricas', 'Data Driven', 'Definir y seguir indicadores clave de UX y producto'),
    ('Análisis de funnel', 'Data Driven', 'Identificar puntos críticos en flujos de usuario con datos'),
    ('Decisiones basadas en datos', 'Data Driven', 'Usar datos y research para fundamentar decisiones de diseño'),
    
    -- Arquitectura de la Información
    ('Wireframes y taxonomías', 'Arquitectura de la Información', 'Diseñar estructuras y organizar información para interfaces intuitivas'),
    
    -- Diseño Visual
    ('Patrones y componentes', 'Diseño Visual', 'Usar Design Systems para crear interfaces coherentes y consistentes'),
    ('Visualización de datos', 'Diseño Visual', 'Representar datos complejos de forma simple, clara y visual'),
    
    -- Pensamiento de Producto
    ('Definir visión del producto', 'Pensamiento de Producto', 'Establecer una visión clara y alineada con objetivos de negocio'),
    ('Priorización de features', 'Pensamiento de Producto', 'Decidir qué funcionalidades desarrollar primero según impacto y esfuerzo'),
    ('Alineación con objetivos de negocio', 'Pensamiento de Producto', 'Asegurar que el diseño apoye metas estratégicas de la empresa'),
    
    -- Sistemas de Diseño
    ('Crear sistemas de diseño', 'Sistemas de Diseño', 'Desarrollar sistemas escalables para consistencia en interfaces'),
    ('Mantener consistencia en UI', 'Sistemas de Diseño', 'Asegurar que todos los componentes sigan las mismas pautas visuales'),
    ('Documentar componentes', 'Sistemas de Diseño', 'Crear guías claras para el uso y desarrollo de componentes'),
    
    -- Accesibilidad
    ('Estándares WCAG', 'Accesibilidad', 'Diseñar interfaces cumpliendo pautas WCAG (A, AA, AAA)'),
    ('Diseño Universal', 'Accesibilidad', 'Aplicar los 7 principios para crear productos inclusivos'),
    ('Test de accesibilidad', 'Accesibilidad', 'Evaluar productos con herramientas (ej. Axe, WAVE) y usuarios con discapacidad'),
    ('Mínimo de accesibilidad', 'Accesibilidad', 'Garantizar contraste, tipografía legible y diseño adaptable al 200% de zoom'),
    
    -- IA y Tecnologías Emergentes
    ('Prototipado con IA', 'IA y Tecnologías Emergentes', 'Usar herramientas basadas en IA para crear prototipos interactivos'),
    ('Uso de IA', 'IA y Tecnologías Emergentes', 'Usa IA para eficientar su trabajo diario'),
    ('Automatización de flujos de diseño con IA', 'IA y Tecnologías Emergentes', 'Utiliza herramientas de IA para automatizar tareas repetitivas o complejas en el proceso de diseño')
) AS skills_data(skill_name, category_name, skill_description)
JOIN category_ids cat ON cat.name = skills_data.category_name
ON CONFLICT (name, category_id) DO NOTHING;

-- =====================================================
-- FUNCIONES DE UTILIDAD ACTUALIZADAS
-- =====================================================

-- Función actualizada para obtener estadísticas del equipo con niveles 0-5
CREATE OR REPLACE FUNCTION get_team_stats(leader_user_id UUID)
RETURNS TABLE(
    total_members BIGINT,
    pending_approvals BIGINT,
    average_progress NUMERIC,
    approved_skills BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH team_members AS (
        SELECT id FROM public.profiles 
        WHERE leader_id = leader_user_id
    ),
    team_assessments AS (
        SELECT sa.*, s.name as skill_name
        FROM public.skill_assessments sa
        JOIN public.skills s ON sa.skill_id = s.id
        WHERE sa.user_id IN (SELECT id FROM team_members)
    ),
    stats AS (
        SELECT 
            COUNT(DISTINCT tm.id) as total_members,
            COUNT(CASE WHEN ta.status = 'pending' THEN 1 END) as pending_approvals,
            COUNT(CASE WHEN ta.status = 'approved' THEN 1 END) as approved_skills,
            AVG(CASE 
                WHEN ta.level = 0 THEN 0
                WHEN ta.level = 1 THEN 20
                WHEN ta.level = 2 THEN 40
                WHEN ta.level = 3 THEN 60
                WHEN ta.level = 4 THEN 80
                WHEN ta.level = 5 THEN 100
                ELSE 0
            END) as avg_progress
        FROM team_members tm
        LEFT JOIN team_assessments ta ON tm.id = ta.user_id
    )
    SELECT 
        stats.total_members,
        stats.pending_approvals,
        COALESCE(stats.avg_progress, 0),
        stats.approved_skills
    FROM stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN ACTUALIZADOS
-- =====================================================

COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con información personal y roles';
COMMENT ON TABLE public.skill_categories IS 'Categorías de competencias del Product Designer Skill Matrix';
COMMENT ON TABLE public.skills IS 'Skills y competencias que pueden ser evaluadas, organizadas por categorías';
COMMENT ON TABLE public.skill_assessments IS 'Evaluaciones de skills realizadas por usuarios con escala 0-5';

COMMENT ON COLUMN public.profiles.role IS 'Rol del usuario: designer, leader, head_chapter, admin';
COMMENT ON COLUMN public.profiles.leader_id IS 'ID del líder asignado (solo para designers)';
COMMENT ON COLUMN public.skill_assessments.level IS 'Nivel de competencia: 0=No familiarizado, 1=Comprendo, 2=En desarrollo, 3=Autónomo, 4=Promuevo, 5=Transformo';
COMMENT ON COLUMN public.skill_assessments.status IS 'Estado de la evaluación: pending, approved, rejected';

-- =====================================================
-- VERIFICACIONES FINALES
-- =====================================================

-- Verificar que las tablas se crearon correctamente
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
UNION ALL
SELECT 'skill_categories' as table_name, COUNT(*) as row_count FROM public.skill_categories
UNION ALL
SELECT 'skills' as table_name, COUNT(*) as row_count FROM public.skills
UNION ALL
SELECT 'skill_assessments' as table_name, COUNT(*) as row_count FROM public.skill_assessments;

-- Verificar que las políticas están activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
