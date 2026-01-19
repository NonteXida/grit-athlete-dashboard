-- Add school and graduation_year fields to profiles table

-- Add school column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS school TEXT;

-- Add graduation_year column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS graduation_year TEXT;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('school', 'graduation_year');
