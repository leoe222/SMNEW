-- Migration: add squad column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS squad TEXT;

-- Optional: create index if you will filter by squad frequently
-- CREATE INDEX IF NOT EXISTS idx_profiles_squad ON public.profiles(squad);

-- Rollback (manual):
-- ALTER TABLE public.profiles DROP COLUMN squad;
