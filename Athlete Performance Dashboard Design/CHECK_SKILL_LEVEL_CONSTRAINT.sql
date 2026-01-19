-- Check the skill_level constraint
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass
AND conname = 'profiles_skill_level_check';
