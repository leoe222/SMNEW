-- Migration script to fix skill_assessments level constraint
-- This script converts the level column from text to integer and updates constraints

BEGIN;

-- Step 1: Remove the old constraint
ALTER TABLE skill_assessments DROP CONSTRAINT IF EXISTS skill_assessments_level_check;

-- Step 2: Convert existing data from text to integer
UPDATE skill_assessments SET level = 
  CASE 
    WHEN level = 'basic' THEN '1'
    WHEN level = 'intermediate' THEN '3'
    WHEN level = 'advanced' THEN '5'
    ELSE '0'
  END
WHERE level IN ('basic', 'intermediate', 'advanced');

-- Step 3: Change column type to integer
ALTER TABLE skill_assessments ALTER COLUMN level TYPE INTEGER USING level::integer;

-- Step 4: Add new constraint for 0-5 range
ALTER TABLE skill_assessments ADD CONSTRAINT skill_assessments_level_check 
  CHECK (level >= 0 AND level <= 5);

-- Step 5: Update any remaining null or invalid values to 0
UPDATE skill_assessments SET level = 0 WHERE level IS NULL OR level < 0 OR level > 5;

COMMIT;

-- Verify the changes
SELECT 'Migration completed successfully!' as status;
SELECT DISTINCT level FROM skill_assessments ORDER BY level;
