-- =====================================================
-- SKILL MATRIX - ESQUEMA COMPLETO DE BASE DE DATOS
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
    squad TEXT,
    avatar_url TEXT,
    bio TEXT,
    leader_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de skills/categorías
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'design',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de evaluaciones de skills
CREATE TABLE IF NOT EXISTS public.skill_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('basic', 'intermediate', 'advanced')),
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

-- Índices para skills
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);

-- Índices para skill_assessments
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user_id ON public.skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_skill_id ON public.skill_assessments(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_status ON public.skill_assessments(status);
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
-- DATOS INICIALES
-- =====================================================

-- Insertar skills de diseño por defecto
INSERT INTO public.skills (name, category, description) VALUES
('User Research', 'design', 'Investigación de usuarios y metodologías de investigación'),
('Wireframing', 'design', 'Creación de wireframes y estructuras de información'),
('Prototyping', 'design', 'Prototipado y creación de prototipos interactivos'),
('Design Systems', 'design', 'Sistemas de diseño y componentes reutilizables'),
('Usability Testing', 'design', 'Pruebas de usabilidad y testing de productos'),
('Figma', 'design', 'Herramientas de diseño y colaboración'),
('Information Architecture', 'design', 'Arquitectura de información y estructuras de navegación'),
('Interaction Design', 'design', 'Diseño de interacciones y micro-interacciones')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- FUNCIONES DE UTILIDAD
-- =====================================================

-- Función para obtener estadísticas del equipo (para líderes)
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
                WHEN ta.level = 'basic' THEN 33
                WHEN ta.level = 'intermediate' THEN 67
                WHEN ta.level = 'advanced' THEN 100
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
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con información personal y roles';
COMMENT ON TABLE public.skills IS 'Skills y competencias que pueden ser evaluadas';
COMMENT ON TABLE public.skill_assessments IS 'Evaluaciones de skills realizadas por usuarios';

COMMENT ON COLUMN public.profiles.role IS 'Rol del usuario: designer, leader, head_chapter, admin';
COMMENT ON COLUMN public.profiles.leader_id IS 'ID del líder asignado (solo para designers)';
COMMENT ON COLUMN public.skill_assessments.level IS 'Nivel de competencia: basic, intermediate, advanced';
COMMENT ON COLUMN public.skill_assessments.status IS 'Estado de la evaluación: pending, approved, rejected';

-- =====================================================
-- VERIFICACIONES FINALES
-- =====================================================

-- Verificar que las tablas se crearon correctamente
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
UNION ALL
SELECT 'skills' as table_name, COUNT(*) as row_count FROM public.skills
UNION ALL
SELECT 'skill_assessments' as table_name, COUNT(*) as row_count FROM public.skill_assessments;

-- Verificar que las políticas están activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
