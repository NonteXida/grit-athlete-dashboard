-- Verify RLS Status and Policies
-- This script checks if RLS is properly configured without making changes

-- Check RLS status on all tables
SELECT
  tablename,
  CASE
    WHEN rowsecurity THEN '✓ ENABLED'
    ELSE '✗ DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'training_plans',
    'workout_logs',
    'nutrition_logs',
    'practice_game_journals',
    'goals',
    'media',
    'achievements',
    'exercises'
  )
ORDER BY tablename;

-- Count policies per table
SELECT
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- List all policies (detailed view)
SELECT
  tablename,
  policyname,
  cmd as operation,
  CASE
    WHEN roles = '{public}' THEN 'Public'
    ELSE array_to_string(roles, ', ')
  END as applies_to
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;
