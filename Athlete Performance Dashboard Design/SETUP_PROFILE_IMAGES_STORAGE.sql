-- Setup Supabase Storage for Profile Images
-- Run this in Supabase SQL Editor

-- Step 1: Create storage bucket for profile images (if not exists)
-- Note: Buckets are created via Supabase Dashboard > Storage
-- Go to Storage > Create new bucket > Name: "profile-images" > Public bucket: YES

-- Step 2: Add image URL columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

-- Step 3: Set up Storage Policies (Run these in Supabase Dashboard > Storage > profile-images > Policies)
-- Or create via SQL if using service role:

-- Policy: Allow authenticated users to upload their own images
-- CREATE POLICY "Users can upload own images"
-- ON storage.objects
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Allow authenticated users to update their own images
-- CREATE POLICY "Users can update own images"
-- ON storage.objects
-- FOR UPDATE
-- TO authenticated
-- USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy: Allow public read access to all profile images
-- CREATE POLICY "Public can view profile images"
-- ON storage.objects
-- FOR SELECT
-- TO public
-- USING (bucket_id = 'profile-images');

-- Step 4: Update profiles table to support multi-sport and multi-position
-- Change sport and position to JSONB arrays to support multiple values
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS sports JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS positions JSONB DEFAULT '[]'::jsonb;

-- Migrate existing single sport/position data to arrays (if they exist)
UPDATE profiles
SET sports = jsonb_build_array(sport)
WHERE sport IS NOT NULL AND sport != '' AND (sports IS NULL OR sports = '[]'::jsonb);

UPDATE profiles
SET positions = jsonb_build_array(position)
WHERE position IS NOT NULL AND position != '' AND (positions IS NULL OR positions = '[]'::jsonb);

-- Step 5: Verify the changes
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('profile_image_url', 'banner_image_url', 'sports', 'positions')
ORDER BY column_name;
