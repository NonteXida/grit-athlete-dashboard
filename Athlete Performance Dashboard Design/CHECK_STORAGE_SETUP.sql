-- Check if storage bucket exists
SELECT * FROM storage.buckets WHERE name = 'profile-images';

-- Check if profile table already has image columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('profile_image_url', 'banner_image_url', 'avatar_url', 'cover_image_url', 'profile_photo', 'banner_photo');

-- Check existing storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'profile-images';

-- Check what columns profiles table actually has
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
