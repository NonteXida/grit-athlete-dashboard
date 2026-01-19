-- Re-enable RLS with Proper Policies for Production (Clean Version)
-- This script drops all existing policies first, then re-enables RLS with appropriate policies

-- ======================
-- DROP ALL EXISTING POLICIES
-- ======================

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Training Plans
DROP POLICY IF EXISTS "Users can view own training plans" ON training_plans;
DROP POLICY IF EXISTS "Users can insert own training plans" ON training_plans;
DROP POLICY IF EXISTS "Users can update own training plans" ON training_plans;
DROP POLICY IF EXISTS "Users can delete own training plans" ON training_plans;

-- Workout Logs
DROP POLICY IF EXISTS "Users can view own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can insert own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can update own workout logs" ON workout_logs;
DROP POLICY IF EXISTS "Users can delete own workout logs" ON workout_logs;

-- Nutrition Logs
DROP POLICY IF EXISTS "Users can view own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can insert own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can update own nutrition logs" ON nutrition_logs;
DROP POLICY IF EXISTS "Users can delete own nutrition logs" ON nutrition_logs;

-- Practice/Game Journals
DROP POLICY IF EXISTS "Users can view own journals" ON practice_game_journals;
DROP POLICY IF EXISTS "Users can insert own journals" ON practice_game_journals;
DROP POLICY IF EXISTS "Users can update own journals" ON practice_game_journals;
DROP POLICY IF EXISTS "Users can delete own journals" ON practice_game_journals;

-- Goals
DROP POLICY IF EXISTS "Users can view own goals" ON goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON goals;
DROP POLICY IF EXISTS "Users can update own goals" ON goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON goals;

-- Media
DROP POLICY IF EXISTS "Users can view own media" ON media;
DROP POLICY IF EXISTS "Users can insert own media" ON media;
DROP POLICY IF EXISTS "Users can update own media" ON media;
DROP POLICY IF EXISTS "Users can delete own media" ON media;

-- Achievements
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can delete own achievements" ON achievements;

-- Exercises
DROP POLICY IF EXISTS "Authenticated users can view exercises" ON exercises;
DROP POLICY IF EXISTS "All users can view exercises" ON exercises;

-- ======================
-- PROFILES TABLE
-- ======================

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ======================
-- TRAINING_PLANS TABLE
-- ======================

-- Enable RLS on training_plans
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own training plans
CREATE POLICY "Users can view own training plans" ON training_plans
  FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policy: Users can insert their own training plans
CREATE POLICY "Users can insert own training plans" ON training_plans
  FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can update their own training plans
CREATE POLICY "Users can update own training plans" ON training_plans
  FOR UPDATE
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can delete their own training plans
CREATE POLICY "Users can delete own training plans" ON training_plans
  FOR DELETE
  USING (auth.uid() = athlete_id);

-- ======================
-- WORKOUT_LOGS TABLE
-- ======================

-- Enable RLS on workout_logs
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own workout logs
CREATE POLICY "Users can view own workout logs" ON workout_logs
  FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policy: Users can insert their own workout logs
CREATE POLICY "Users can insert own workout logs" ON workout_logs
  FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can update their own workout logs
CREATE POLICY "Users can update own workout logs" ON workout_logs
  FOR UPDATE
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can delete their own workout logs
CREATE POLICY "Users can delete own workout logs" ON workout_logs
  FOR DELETE
  USING (auth.uid() = athlete_id);

-- ======================
-- NUTRITION_LOGS TABLE
-- ======================

-- Enable RLS on nutrition_logs
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own nutrition logs
CREATE POLICY "Users can view own nutrition logs" ON nutrition_logs
  FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policy: Users can insert their own nutrition logs
CREATE POLICY "Users can insert own nutrition logs" ON nutrition_logs
  FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can update their own nutrition logs
CREATE POLICY "Users can update own nutrition logs" ON nutrition_logs
  FOR UPDATE
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can delete their own nutrition logs
CREATE POLICY "Users can delete own nutrition logs" ON nutrition_logs
  FOR DELETE
  USING (auth.uid() = athlete_id);

-- ======================
-- PRACTICE_GAME_JOURNALS TABLE
-- ======================

-- Enable RLS on practice_game_journals
ALTER TABLE practice_game_journals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own journals
CREATE POLICY "Users can view own journals" ON practice_game_journals
  FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policy: Users can insert their own journals
CREATE POLICY "Users can insert own journals" ON practice_game_journals
  FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can update their own journals
CREATE POLICY "Users can update own journals" ON practice_game_journals
  FOR UPDATE
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can delete their own journals
CREATE POLICY "Users can delete own journals" ON practice_game_journals
  FOR DELETE
  USING (auth.uid() = athlete_id);

-- ======================
-- GOALS TABLE
-- ======================

-- Enable RLS on goals
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own goals
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policy: Users can insert their own goals
CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can update their own goals
CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can delete their own goals
CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE
  USING (auth.uid() = athlete_id);

-- ======================
-- MEDIA TABLE
-- ======================

-- Enable RLS on media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own media
CREATE POLICY "Users can view own media" ON media
  FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policy: Users can insert their own media
CREATE POLICY "Users can insert own media" ON media
  FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can update their own media
CREATE POLICY "Users can update own media" ON media
  FOR UPDATE
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can delete their own media
CREATE POLICY "Users can delete own media" ON media
  FOR DELETE
  USING (auth.uid() = athlete_id);

-- ======================
-- ACHIEVEMENTS TABLE
-- ======================

-- Enable RLS on achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own achievements
CREATE POLICY "Users can view own achievements" ON achievements
  FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policy: Users can insert their own achievements
CREATE POLICY "Users can insert own achievements" ON achievements
  FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can update their own achievements
CREATE POLICY "Users can update own achievements" ON achievements
  FOR UPDATE
  USING (auth.uid() = athlete_id)
  WITH CHECK (auth.uid() = athlete_id);

-- Policy: Users can delete their own achievements
CREATE POLICY "Users can delete own achievements" ON achievements
  FOR DELETE
  USING (auth.uid() = athlete_id);

-- ======================
-- EXERCISES TABLE (READ-ONLY FOR ALL USERS)
-- ======================

-- Enable RLS on exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view exercises
CREATE POLICY "Authenticated users can view exercises" ON exercises
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ======================
-- VERIFICATION
-- ======================

-- Verify RLS is enabled on all tables
SELECT
  schemaname,
  tablename,
  rowsecurity
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

-- List all policies for verification
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
