-- Migration: add numeric_level (0-5) to skill_assessments for 6-level scale
-- 0 = No familiarizado, 1 = Comprendo, 2 = En desarrollo, 3 = Autónomo, 4 = Promuevo, 5 = Transformo

ALTER TABLE public.skill_assessments ADD COLUMN IF NOT EXISTS numeric_level INT;

-- Backfill numeric_level from old 3-bucket textual level if column is null
UPDATE public.skill_assessments
SET numeric_level = CASE
  -- Si level ya es numérico (o un string numérico), usarlo y limitar a 0–5
  WHEN (level::text ~ '^[0-9]+$') THEN LEAST(5, GREATEST(0, (level::text)::INT))
  -- Si level es texto del esquema legacy, mapear a 0–5
  WHEN LOWER(level::text) = 'basic' THEN 1        -- approx between 0–2
  WHEN LOWER(level::text) = 'intermediate' THEN 3 -- midpoint
  WHEN LOWER(level::text) = 'advanced' THEN 5     -- top
  ELSE 0
END
WHERE numeric_level IS NULL;

-- Optional: constrain numeric_level
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE c.conname = 'skill_assessments_numeric_level_check'
      AND t.relname = 'skill_assessments'
      AND n.nspname = 'public'
  ) THEN
    ALTER TABLE public.skill_assessments
      ADD CONSTRAINT skill_assessments_numeric_level_check CHECK (numeric_level BETWEEN 0 AND 5);
  END IF;
END $$;

-- (Future) If moving away from textual column, could mark level deprecated or create trigger to sync.
