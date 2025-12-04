-- Check how many exercises are already in the database
SELECT COUNT(*) as total_exercises FROM exercises;

-- Show first 10 exercises to verify
SELECT id, name, category, difficulty_level FROM exercises LIMIT 10;