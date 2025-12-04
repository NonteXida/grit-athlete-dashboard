-- First, let's check the structure of the exercises table
SELECT
    column_name,
    data_type,
    ordinal_position,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'exercises'
ORDER BY ordinal_position;