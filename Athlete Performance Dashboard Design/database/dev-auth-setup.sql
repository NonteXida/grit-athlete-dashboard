-- Development Authentication Setup
-- Use this to simplify authentication during development

-- ============================================
-- OPTION 1: Disable Email Confirmation (Development Only)
-- ============================================
-- To disable email confirmation in Supabase:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Authentication > Settings
-- 3. Under "Email Auth" section
-- 4. Toggle OFF "Enable email confirmations"
-- 5. Save changes

-- ============================================
-- OPTION 2: Create Test User Directly
-- ============================================
-- You can create a test user directly in the database
-- Replace the email and ID with your test values

-- First, create an auth user (this usually requires using Supabase Dashboard)
-- Then create the profile:

/*
INSERT INTO profiles (
  id,
  date_of_birth,
  gender,
  sport,
  position,
  skill_level,
  onboarding_completed,
  created_at,
  updated_at
) VALUES (
  'YOUR-USER-ID-HERE', -- Get this from auth.users table after creating user
  '1995-01-01',
  'male',
  'Football',
  'Quarterback',
  'intermediate',
  false,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
*/

-- ============================================
-- OPTION 3: Update Existing User to Bypass Onboarding
-- ============================================
-- If you have a user but want to skip onboarding for testing:

/*
UPDATE profiles
SET onboarding_completed = true
WHERE id = 'YOUR-USER-ID-HERE';
*/

-- ============================================
-- OPTION 4: Clear All Test Data
-- ============================================
-- Use with caution! This will delete all data for a specific user:

/*
DELETE FROM practice_game_journals WHERE athlete_id = 'YOUR-USER-ID-HERE';
DELETE FROM workout_logs WHERE athlete_id = 'YOUR-USER-ID-HERE';
DELETE FROM training_plans WHERE athlete_id = 'YOUR-USER-ID-HERE';
DELETE FROM profiles WHERE id = 'YOUR-USER-ID-HERE';
*/

-- ============================================
-- Quick Check: See All Users and Their Status
-- ============================================
SELECT
  p.id,
  au.email,
  au.email_confirmed_at,
  p.sport,
  p.position,
  p.onboarding_completed,
  p.created_at
FROM profiles p
JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC;

-- ============================================
-- Development Note
-- ============================================
-- For the quickest development setup:
-- 1. Disable email confirmation in Supabase Dashboard
-- 2. Use a simple password like 'testpass123' for test accounts
-- 3. Create multiple test accounts for different scenarios:
--    - test-new@example.com (new user, needs onboarding)
--    - test-active@example.com (active user with data)
--    - test-coach@example.com (coach account for future features)