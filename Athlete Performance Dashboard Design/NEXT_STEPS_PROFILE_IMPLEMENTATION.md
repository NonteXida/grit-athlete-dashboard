# Next Steps: Profile Image & Edit Implementation

## ✅ Completed
1. Created `ADD_PROFILE_IMAGE_COLUMNS.sql` - Run this in Supabase to add required columns
2. Updated Profile interface in `src/lib/supabase.ts` with:
   - `profile_image_url` and `banner_image_url`
   - `sports` and `positions` arrays for multi-sport support
3. Added `imageHelpers` to `src/lib/supabase.ts` with:
   - `uploadProfileImage()` function
   - `uploadBannerImage()` function
   - Uses existing bucket: `make-eec32171-athlete-images`
4. Created `src/constants/sportsData.ts` with all sports and positions

## 🔨 Still To Do

### Step 1: Run SQL Script
```bash
# In Supabase SQL Editor, run:
ADD_PROFILE_IMAGE_COLUMNS.sql
```

### Step 2: Update AthleteProfile.tsx

Add these imports at the top:
```typescript
import { imageHelpers } from '../lib/supabase';
import { ALL_SPORTS, SKILL_LEVELS, getPositionsForSports } from '../constants/sportsData';
import { X } from 'lucide-react';
```

Add state for image uploads:
```typescript
const [uploadingProfile, setUploadingProfile] = useState(false);
const [uploadingBanner, setUploadingBanner] = useState(false);
```

Add image upload handlers:
```typescript
async function handleProfileImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file || !userData?.id) return;

  setUploadingProfile(true);
  const url = await imageHelpers.uploadProfileImage(userData.id, file);
  if (url) {
    await fetchFullProfile(); // Refresh to show new image
  }
  setUploadingProfile(false);
}

async function handleBannerImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file || !userData?.id) return;

  setUploadingBanner(true);
  const url = await imageHelpers.uploadBannerImage(userData.id, file);
  if (url) {
    await fetchFullProfile(); // Refresh to show new image
  }
  setUploadingBanner(false);
}
```

Update banner image section (around line 118):
```typescript
<div className="relative h-64 rounded-2xl overflow-hidden group">
  <ImageWithFallback
    src={displayProfile?.banner_image_url || "https://images.unsplash.com/photo-1747336406309-79970f9066b1?..."}
    alt="Cover"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
    <label htmlFor="banner-upload" className="cursor-pointer">
      <Button variant="secondary" size="sm" as="span" disabled={uploadingBanner}>
        <Camera className="w-4 h-4" />
        {uploadingBanner ? 'Uploading...' : 'Change Cover'}
      </Button>
    </label>
    <input
      id="banner-upload"
      type="file"
      accept="image/*"
      onChange={handleBannerImageUpload}
      className="hidden"
    />
  </div>
</div>
```

Update profile image section (around line 136):
```typescript
<div className="w-32 h-32 rounded-full border-4 border-[#0a0a0a] overflow-hidden bg-[#252525]">
  <ImageWithFallback
    src={displayProfile?.profile_image_url || "https://images.unsplash.com/photo-1657957746418-6a38df9e1ea7?..."}
    alt={userData.name}
    className="w-full h-full object-cover"
  />
</div>
<label htmlFor="profile-upload" className="absolute bottom-0 right-0 cursor-pointer">
  <button
    className="w-10 h-10 bg-[#03fd1c] rounded-full flex items-center justify-center"
    disabled={uploadingProfile}
  >
    <Camera className="w-5 h-5 text-black" />
  </button>
</label>
<input
  id="profile-upload"
  type="file"
  accept="image/*"
  onChange={handleProfileImageUpload}
  className="hidden"
/>
```

### Step 3: Create EditProfileModal Component

Create new file: `src/components/EditProfileModal.tsx`

This modal needs:
- Name input
- Multi-select sports dropdown
- Multi-select positions dropdown (filtered by selected sports)
- Height input (feet + inches)
- Weight input (validation: 60-400 lbs)
- Date of birth / Age display (validation: ≥12 years)
- Skill level dropdown
- School input
- Graduation year input
- Bio textarea
- Save/Cancel buttons

Validation:
```typescript
const validateForm = (data: any) => {
  const errors: string[] = [];

  // Age validation
  const age = calculateAge(data.date_of_birth);
  if (age && age < 12) errors.push('Age must be at least 12 years');

  // Weight validation
  if (data.weight_kg) {
    const lbs = data.weight_kg * 2.20462;
    if (lbs < 60 || lbs > 400) errors.push('Weight must be between 60 and 400 lbs');
  }

  // Required fields
  if (!data.name) errors.push('Name is required');
  if (!data.sports || data.sports.length === 0) errors.push('At least one sport required');
  if (!data.positions || data.positions.length === 0) errors.push('At least one position required');

  return errors;
};
```

### Step 4: Wire Up Edit Profile Button

In AthleteProfile.tsx, update the "Edit Profile" button to open the modal:
```typescript
const [showEditModal, setShowEditModal] = useState(false);

// In JSX:
<Button
  variant="outline"
  onClick={() => setShowEditModal(true)}
>
  Edit Profile
</Button>

{showEditModal && (
  <EditProfileModal
    profile={displayProfile}
    onClose={() => setShowEditModal(false)}
    onSave={async (updatedData) => {
      await profileHelpers.updateProfile(userData.id, updatedData);
      await fetchFullProfile();
      setShowEditModal(false);
    }}
  />
)}
```

## Summary

You now have:
1. ✅ Database migration SQL ready
2. ✅ TypeScript interfaces updated
3. ✅ Image upload helpers ready
4. ✅ Sports/positions constants file

Still need:
1. Run SQL script in Supabase
2. Update AthleteProfile.tsx with image upload handlers
3. Create EditProfileModal.tsx component
4. Wire up the Edit Profile button

The image upload functionality will work immediately once you add the handlers to AthleteProfile.tsx. The edit modal will take more time to build but I've provided all the structure needed.

Would you like me to continue implementing the EditProfileModal component?
