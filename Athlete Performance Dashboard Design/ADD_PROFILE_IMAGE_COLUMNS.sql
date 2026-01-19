-- Add image URL columns and multi-sport support to profiles table
-- Uses existing bucket: make-eec32171-athlete-images

-- Add image URL columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

-- Add multi-sport/position support
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS sports JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS positions JSONB DEFAULT '[]'::jsonb;

-- Migrate existing single sport/position to arrays
UPDATE profiles
SET sports = jsonb_build_array(sport)
WHERE sport IS NOT NULL AND sport != '' AND (sports IS NULL OR sports = '[]'::jsonb);

UPDATE profiles
SET positions = jsonb_build_array(position)
WHERE position IS NOT NULL AND position != '' AND (positions IS NULL OR positions = '[]'::jsonb);

-- Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('profile_image_url', 'banner_image_url', 'sports', 'positions', 'sport', 'position');
