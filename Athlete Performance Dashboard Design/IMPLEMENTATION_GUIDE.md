# GRIT Plan Phase 2 - Implementation Guide

## Overview
This guide will help you integrate the complete GRIT Plan system (all 8 onboarding steps + plan generation) into your existing AthleteHub application.

## Step 1: Create New Component Files

### 1.1 Create Onboarding Components Directory
First, create the new onboarding step components in your project:

```bash
# In your project root, create these files:
/components/onboarding/BodyProfileStep.tsx
/components/onboarding/ScheduleStep.tsx
/components/onboarding/ExperienceStep.tsx
/components/onboarding/MentalProfileStep.tsx
/components/onboarding/SummaryStep.tsx
```

**Copy the code from:**
- `/home/claude/BodyProfileStep.tsx` → `/components/onboarding/BodyProfileStep.tsx`
- `/home/claude/ScheduleStep.tsx` → `/components/onboarding/ScheduleStep.tsx`
- `/home/claude/ExperienceStep.tsx` → `/components/onboarding/ExperienceStep.tsx`
- `/home/claude/MentalProfileStep.tsx` → `/components/onboarding/MentalProfileStep.tsx`
- `/home/claude/SummaryStep.tsx` → `/components/onboarding/SummaryStep.tsx`

### 1.2 Update OnboardingWizard Component
**Replace** your existing `/components/onboarding/OnboardingWizard.tsx` with the complete version from `/home/claude/OnboardingWizardComplete.tsx`

### 1.3 Create Plan Generation Files
Create these new files in your project:

```bash
# Backend files
/supabase/functions/server/gritPlanGenerator.ts
/components/PlanView.tsx
```

**Copy the code from:**
- `/home/claude/gritPlanGenerator.ts` → `/supabase/functions/server/gritPlanGenerator.ts`
- `/home/claude/PlanView.tsx` → `/components/PlanView.tsx`

## Step 2: Update Backend Server

### 2.1 Update Server Index File
Open `/supabase/functions/server/index.tsx` and add the following:

1. **Add import at the top of the file:**
```typescript
import { generateGritPlan } from './gritPlanGenerator';
```

2. **Replace the existing `/onboarding/complete` endpoint** with the enhanced version from `/home/claude/gritPlanBackendEndpoints.ts`

3. **Add the new endpoints** from the same file:
   - `/plan/current-week`
   - `/plan/session/complete`
   - `/plan/advance-week`

4. **Add helper functions** at the bottom of your server file:
```typescript
// Helper functions from gritPlanBackendEndpoints.ts
function calculateWeeklyCompliance(sessions: any[]): number {
  const completedCount = sessions.filter(s => s.completed).length;
  return sessions.length > 0 ? Math.round((completedCount / sessions.length) * 100) : 0;
}

async function updateWorkoutStats(userId: string) {
  const statsKey = `stats:${userId}`;
  const stats = await getValue(statsKey) || {};
  
  const today = new Date().toISOString().split('T')[0];
  if (!stats.lastWorkoutDate || stats.lastWorkoutDate !== today) {
    stats.daysTrainedThisWeek = (stats.daysTrainedThisWeek || 0) + 1;
    stats.totalWorkouts = (stats.totalWorkouts || 0) + 1;
    stats.lastWorkoutDate = today;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastWorkoutDate === yesterdayStr) {
      stats.currentStreak = (stats.currentStreak || 0) + 1;
    } else {
      stats.currentStreak = 1;
    }
    
    await setValue(statsKey, stats);
  }
}
```

## Step 3: Update TrainingHub Component

### 3.1 Integrate PlanView into TrainingHub
Update `/components/TrainingHub.tsx` to include the GRIT Plan view:

```tsx
import React, { useState, useEffect } from 'react';
import { PlanView } from './PlanView';
// ... other imports

export function TrainingHub({ onSaveWorkout, accessToken }) {
  const [viewMode, setViewMode] = useState<'quick-log' | 'grit-plan'>('grit-plan');
  const [hasGritPlan, setHasGritPlan] = useState(false);

  useEffect(() => {
    checkForGritPlan();
  }, []);

  async function checkForGritPlan() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/plan/check`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setHasGritPlan(data.hasPlan);
      }
    } catch (error) {
      console.error('Error checking for GRIT plan:', error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Toggle */}
      {hasGritPlan && (
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-2 flex gap-2">
          <button
            onClick={() => setViewMode('grit-plan')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              viewMode === 'grit-plan'
                ? 'bg-[#03fd1c] text-black font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My GRIT Plan
          </button>
          <button
            onClick={() => setViewMode('quick-log')}
            className={`flex-1 py-2 px-4 rounded-lg transition-all ${
              viewMode === 'quick-log'
                ? 'bg-[#03fd1c] text-black font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Quick Log
          </button>
        </div>
      )}

      {/* Content based on view mode */}
      {viewMode === 'grit-plan' && hasGritPlan ? (
        <PlanView 
          accessToken={accessToken}
          onSessionClick={(session) => {
            // Handle session click - could open detailed view
            console.log('Session clicked:', session);
          }}
        />
      ) : (
        // Your existing TrainingHub content here
        <div>
          {/* Existing workout logging interface */}
        </div>
      )}
    </div>
  );
}
```

## Step 4: Update App.tsx

### 4.1 Pass accessToken to TrainingHub
Update your App.tsx to pass the accessToken to TrainingHub:

```tsx
{currentPage === 'training' && (
  <TrainingHub 
    onSaveWorkout={handleSaveWorkout}
    accessToken={accessToken || undefined}
  />
)}
```

## Step 5: Deploy Backend Changes

### 5.1 Deploy the Updated Edge Functions
After making all backend changes, you need to deploy the updated edge functions:

```bash
# If using Supabase CLI
supabase functions deploy server

# Or trigger deployment through your deployment pipeline
```

## Step 6: Test the Implementation

### 6.1 Testing Checklist
1. **Test Onboarding Flow:**
   - [ ] Navigate to dashboard
   - [ ] Click "Build My Plan" CTA
   - [ ] Complete all 8 steps
   - [ ] Verify data saves correctly
   - [ ] Check plan generation

2. **Test Plan Display:**
   - [ ] Navigate to Training Hub
   - [ ] Verify "My GRIT Plan" tab appears
   - [ ] Check week view displays sessions
   - [ ] Test month and year views
   - [ ] Verify session details

3. **Test Session Completion:**
   - [ ] Mark sessions as complete
   - [ ] Verify compliance updates
   - [ ] Check stats update
   - [ ] Test week advancement

4. **Test Edge Cases:**
   - [ ] Go back and edit steps
   - [ ] Close and reopen wizard
   - [ ] Test with minimal selections
   - [ ] Test with maximum selections

## Step 7: Database Considerations

### 7.1 No Supabase Schema Changes Required
Since you're using the KV Store, no database schema changes are needed. The new data will be stored with these keys:

```typescript
// New KV Store keys that will be created:
`grit-plan:${userId}` // Stores the generated plan
`grit-plan-tracking:${userId}` // Tracks progress
`session-log:${userId}:${sessionId}` // Individual session logs
`grit-plan-archive:${userId}:${timestamp}` // Archived old plans
```

### 7.2 Data Migration (Optional)
If you have existing users who need plans:
1. They can go through the onboarding flow naturally
2. Or you could create a migration script to generate plans for existing profiles

## Step 8: Environment Variables

No new environment variables are required. The system uses your existing:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

## Step 9: Production Deployment Checklist

Before deploying to production:

1. **Code Review:**
   - [ ] All components imported correctly
   - [ ] No TypeScript errors
   - [ ] Console.logs removed

2. **Testing:**
   - [ ] Full onboarding flow works
   - [ ] Plan displays correctly
   - [ ] Sessions can be completed
   - [ ] Week advancement works

3. **Performance:**
   - [ ] Page load times acceptable
   - [ ] API responses quick
   - [ ] Animations smooth

4. **Mobile:**
   - [ ] Responsive on all screen sizes
   - [ ] Touch interactions work
   - [ ] Forms usable on mobile

## Step 10: Optional Enhancements

After basic implementation, consider adding:

1. **Session Detail Modal:**
   - Show full exercise list
   - Allow workout customization
   - Add notes and feedback

2. **Progress Analytics:**
   - Compliance charts
   - Strength progression graphs
   - Goal achievement tracking

3. **Plan Customization:**
   - Modify individual sessions
   - Swap exercises
   - Adjust volume/intensity

4. **Export Features:**
   - Download plan as PDF
   - Export to calendar
   - Share with coach

## Troubleshooting

### Common Issues and Solutions

**Issue:** Onboarding wizard doesn't open
- Check navigation in App.tsx
- Verify 'planBuilder' route is set up

**Issue:** Plan doesn't generate
- Check server logs for errors
- Verify all required data is passed
- Check generateGritPlan function imports

**Issue:** Sessions don't mark as complete
- Verify accessToken is passed
- Check API endpoint response
- Ensure tracking data exists

**Issue:** Week doesn't advance
- Check current week vs total weeks
- Verify tracking data updates
- Check API response

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Review network tab for API failures
3. Check server logs in Supabase dashboard
4. Verify all imports are correct
5. Ensure all components are in the right directories

## Success Indicators

You'll know the implementation is successful when:
- ✅ Users can complete all 8 onboarding steps
- ✅ A personalized plan generates after onboarding
- ✅ The plan displays in the Training Hub
- ✅ Users can mark sessions complete
- ✅ Weekly compliance tracks correctly
- ✅ Users can advance through weeks
- ✅ Stats update when workouts complete

---

## Summary

The implementation involves:
1. Adding 5 new onboarding components
2. Updating the OnboardingWizard
3. Adding plan generation logic
4. Creating PlanView component
5. Updating backend endpoints
6. Integrating with TrainingHub
7. Testing thoroughly

No database schema changes are needed - everything works with your existing KV Store setup.

Estimated implementation time: 2-4 hours
Testing time: 1-2 hours
