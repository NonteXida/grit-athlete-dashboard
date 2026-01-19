# Profile Image Upload Implementation Guide

This guide outlines all the changes needed to add profile and banner image upload functionality to the Athlete Profile page.

## Overview of Changes Needed

### 1. Database Changes
- ✅ **Created**: `SETUP_PROFILE_IMAGES_STORAGE.sql`
- Add `profile_image_url` and `banner_image_url` columns to profiles table
- Add `sports` and `positions` as JSONB arrays for multi-sport/position support
- Migrate existing single sport/position data

### 2. Supabase Storage Setup
**Manual Step - Do this in Supabase Dashboard:**
1. Go to Storage section
2. Click "Create new bucket"
3. Name: `profile-images`
4. Set as **Public bucket** (so images are publicly accessible)
5. Click Create

**Storage Policies to Add:**
- Allow authenticated users to upload/update their own images
- Allow public read access to all profile images

### 3. TypeScript Type Updates Needed
Update `src/lib/supabase.ts` Profile interface:
```typescript
export interface Profile {
  // ... existing fields ...
  profile_image_url?: string;
  banner_image_url?: string;
  sports?: string[];  // Change from single sport to array
  positions?: string[]; // Change from single position to array
  // ... rest of fields ...
}
```

### 4. Image Upload Helper Functions Needed
Add to `src/lib/supabase.ts`:
```typescript
export const imageHelpers = {
  async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile.${fileExt}`;

    const { error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error('Error uploading profile image:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async uploadBannerImage(userId: string, file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/banner.${fileExt}`;

    const { error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error('Error uploading banner image:', error);
      return null;
    }

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
};
```

### 5. Profile Component Updates

#### A. Image Upload Functionality
- Add file input handlers for profile and banner images
- Handle image selection and upload
- Update profile with new image URLs
- Show loading state during upload

#### B. Edit Profile Modal/Form
Create a comprehensive edit form with:
- **Name** input (text)
- **Sports** multi-select dropdown (from predefined list)
- **Positions** multi-select dropdown (filtered by selected sports)
- **Height** input with feet/inches
- **Weight** input (60-400 lbs validation)
- **Age/DOB** input (≥12 years validation)
- **Skill Level** dropdown (from predefined list)
- **About/Bio** textarea

#### C. Validation Rules
```typescript
const validateProfileData = (data: any) => {
  const errors: string[] = [];

  // Age validation
  const age = calculateAge(data.date_of_birth);
  if (age && age < 12) {
    errors.push('Age must be at least 12 years old');
  }

  // Weight validation
  if (data.weight_kg) {
    const weightLbs = data.weight_kg * 2.20462;
    if (weightLbs < 60 || weightLbs > 400) {
      errors.push('Weight must be between 60 and 400 lbs');
    }
  }

  // Sports validation
  if (!data.sports || data.sports.length === 0) {
    errors.push('At least one sport is required');
  }

  // Positions validation
  if (!data.positions || data.positions.length === 0) {
    errors.push('At least one position is required');
  }

  return errors;
};
```

## Implementation Priority

### Phase 1: Database & Storage Setup (DO THIS FIRST)
1. ✅ Run `SETUP_PROFILE_IMAGES_STORAGE.sql` in Supabase SQL Editor
2. Create `profile-images` storage bucket in Supabase Dashboard
3. Set up storage policies

### Phase 2: Type Definitions & Helpers
1. Update Profile interface in `supabase.ts`
2. Add imageHelpers functions
3. ✅ Create sports data constants (`sportsData.ts`)

### Phase 3: UI Components
1. Add image upload buttons to AthleteProfile.tsx
2. Create EditProfileModal component
3. Add validation logic
4. Wire up image upload handlers

### Phase 4: Testing
1. Test profile image upload
2. Test banner image upload
3. Test edit profile form with validation
4. Test multi-sport/position selection

## Key Files to Modify

1. **`SETUP_PROFILE_IMAGES_STORAGE.sql`** ✅ Created
2. **`src/constants/sportsData.ts`** ✅ Created
3. **`src/lib/supabase.ts`** - Add image helpers and update Profile interface
4. **`src/components/AthleteProfile.tsx`** - Add image upload + edit modal
5. **`src/components/EditProfileModal.tsx`** - NEW: Create this component

## Next Steps

Would you like me to:
1. Continue with implementing the image upload functionality in the Profile component?
2. Create the EditProfileModal component with all validation?
3. Both?

Let me know and I'll proceed with the implementation!
