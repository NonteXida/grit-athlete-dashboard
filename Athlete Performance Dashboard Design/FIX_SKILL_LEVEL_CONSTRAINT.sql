-- Drop the overly restrictive skill_level check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_skill_level_check;

-- Optionally, add a more flexible one that allows common values
-- ALTER TABLE profiles ADD CONSTRAINT profiles_skill_level_check
-- CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'elite', 'professional', 'youth', 'varsity', 'collegiate', 'semi-pro'));
