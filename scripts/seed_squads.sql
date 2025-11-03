-- Seed squads for existing profiles
-- Reglas solicitadas:
-- 1. Todos los líderes (role = leader, head_chapter, admin) => "Transversal"
-- 2. Asignar miembro Irio => "Alpha"
-- 3. Asignar miembro Juana => "Delta"
-- 4. El resto (sin squad) => "Transversal"
-- Script idempotente (seguro de re-ejecutar)

BEGIN;

-- 1. Asegurar campo squad para líderes
UPDATE public.profiles
SET squad = 'Transversal'
WHERE role IN ('leader','head_chapter','admin')
  AND (squad IS DISTINCT FROM 'Transversal');

-- 2. Mapping específico (ajustar correos si cambian)
WITH mapping AS (
  SELECT * FROM (VALUES
    ('Alpha',  'iriojgomezv@gmail.com'),
    ('Delta',  'rasin18294@aravites.com')
  ) AS m(squad,email)
)
UPDATE public.profiles p
SET squad = m.squad
FROM mapping m
WHERE p.email = m.email
  AND (p.squad IS DISTINCT FROM m.squad);

-- 3. Resto sin squad => Transversal
UPDATE public.profiles
SET squad = 'Transversal'
WHERE (squad IS NULL OR squad = '')
  AND email NOT IN ('iriojgomezv@gmail.com','rasin18294@aravites.com');

COMMIT;

-- Verificación
-- SELECT email, role, squad FROM public.profiles ORDER BY role, email;

-- Rollback manual (opcional)
-- UPDATE public.profiles SET squad = NULL;
