-- Check current RLS status and policies for profiles table

-- 1. Check if RLS is enabled
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';

-- 2. List all policies on profiles table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- 3. Check grants on profiles table
SELECT
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_name = 'profiles';
