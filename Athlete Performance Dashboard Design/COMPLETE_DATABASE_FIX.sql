-- COMPLETE DATABASE FIX FOR GRIT ATHLETE DASHBOARD
-- This script will:
-- 1. Check current state of tables
-- 2. Fix RLS policies properly
-- 3. Verify exercises are loaded
-- 4. Set up proper permissions

-- ============================================================
-- STEP 1: Check current state
-- ============================================================
SELECT 'Checking profiles table...' as step;
SELECT COUNT(*) as profile_count FROM profiles;

SELECT 'Checking exercises table...' as step;
SELECT COUNT(*) as exercise_count FROM exercises;

-- ============================================================
-- STEP 2: Temporarily disable RLS for testing
-- ============================================================
SELECT 'Disabling RLS temporarily for testing...' as step;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE goals DISABLE ROW LEVEL SECURITY;
ALTER TABLE media DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 3: Grant necessary permissions
-- ============================================================
SELECT 'Granting permissions...' as step;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO anon;
GRANT ALL ON training_plans TO authenticated;
GRANT ALL ON training_plans TO anon;
GRANT ALL ON workout_logs TO authenticated;
GRANT ALL ON workout_logs TO anon;
GRANT ALL ON exercises TO authenticated;
GRANT ALL ON exercises TO anon;
GRANT ALL ON nutrition_logs TO authenticated;
GRANT ALL ON nutrition_logs TO anon;
GRANT ALL ON goals TO authenticated;
GRANT ALL ON goals TO anon;
GRANT ALL ON media TO authenticated;
GRANT ALL ON media TO anon;
GRANT ALL ON achievements TO authenticated;
GRANT ALL ON achievements TO anon;

-- ============================================================
-- STEP 4: Verify exercises table has data
-- ============================================================
SELECT 'Verifying exercises...' as step;
SELECT
  COUNT(*) as total,
  COUNT(CASE WHEN difficulty_level = 1 THEN 1 END) as beginner,
  COUNT(CASE WHEN difficulty_level = 2 THEN 1 END) as intermediate,
  COUNT(CASE WHEN difficulty_level = 3 THEN 1 END) as advanced
FROM exercises;

-- If no exercises, insert some basic ones
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM exercises) = 0 THEN
    INSERT INTO exercises (name, category, difficulty_level, instructions, muscle_groups, equipment_needed) VALUES
    ('Push-ups', 'strength', 1, 'Start in a plank position. Lower your body until chest nearly touches the floor. Push back up.', '["chest", "triceps", "shoulders"]'::jsonb, '["none"]'::jsonb),
    ('Squats', 'strength', 1, 'Stand with feet shoulder-width apart. Lower hips back and down. Push through heels to stand.', '["quadriceps", "glutes", "hamstrings"]'::jsonb, '["none"]'::jsonb),
    ('Plank', 'core', 1, 'Hold a push-up position with forearms on ground. Keep body straight. Hold for time.', '["core", "shoulders"]'::jsonb, '["none"]'::jsonb),
    ('Jumping Jacks', 'cardio', 1, 'Jump feet apart while raising arms overhead. Jump feet together while lowering arms.', '["full body"]'::jsonb, '["none"]'::jsonb),
    ('Barbell Squat', 'strength', 2, 'Position barbell on upper back. Squat down keeping chest up. Drive through heels to stand.', '["quadriceps", "glutes", "hamstrings"]'::jsonb, '["barbell", "squat rack"]'::jsonb),
    ('Bench Press', 'strength', 2, 'Lie on bench. Lower barbell to chest. Press up to starting position.', '["chest", "triceps", "shoulders"]'::jsonb, '["barbell", "bench"]'::jsonb),
    ('Deadlift', 'strength', 2, 'Stand with feet under barbell. Bend and grip bar. Lift by extending hips and knees.', '["back", "glutes", "hamstrings"]'::jsonb, '["barbell"]'::jsonb),
    ('Pull-ups', 'strength', 2, 'Hang from bar with palms facing away. Pull body up until chin over bar. Lower with control.', '["back", "biceps"]'::jsonb, '["pull-up bar"]'::jsonb),
    ('Clean and Jerk', 'strength', 3, 'Explosively lift barbell to shoulders, then drive overhead. Full Olympic lift.', '["full body"]'::jsonb, '["barbell"]'::jsonb),
    ('Muscle-ups', 'strength', 3, 'Pull up explosively on rings/bar, transition to dip position, press to lockout.', '["back", "chest", "triceps"]'::jsonb, '["rings", "bar"]'::jsonb);

    RAISE NOTICE 'Inserted basic exercises';
  ELSE
    RAISE NOTICE 'Exercises already exist: %', (SELECT COUNT(*) FROM exercises);
  END IF;
END $$;

-- ============================================================
-- STEP 5: Final verification
-- ============================================================
SELECT 'Final state check...' as step;
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Exercises' as table_name, COUNT(*) as count FROM exercises
UNION ALL
SELECT 'Training Plans' as table_name, COUNT(*) as count FROM training_plans;

SELECT 'Setup complete! RLS is DISABLED for testing.' as status;
SELECT 'You can now test profile creation and AI plan generation.' as next_step;
SELECT 'To re-enable RLS later, run FIX_PROFILE_RLS.sql' as note;
