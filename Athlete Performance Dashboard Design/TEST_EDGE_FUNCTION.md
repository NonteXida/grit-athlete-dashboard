# Testing Edge Function

## Quick Diagnostic Steps:

### 1. Check if Edge Function is deployed
Go to: https://supabase.com/dashboard/project/svdznqczeedptnmwopem/functions

You should see `generate-training-plan` listed and deployed.

### 2. Check Edge Function Logs
Go to: https://supabase.com/dashboard/project/svdznqczeedptnmwopem/logs/edge-functions

Look for recent errors when you try to generate a plan.

### 3. Check Browser Console
1. Open browser Dev Tools (F12)
2. Go to Console tab
3. Try generating a plan
4. Look for error messages - especially:
   - "Failed to invoke function"
   - "Network error"
   - Any 400/500 errors

### 4. Common Issues to Check:

#### A. ANTHROPIC_API_KEY not set
- Go to: https://supabase.com/dashboard/project/svdznqczeedptnmwopem/settings/functions
- Check if `ANTHROPIC_API_KEY` is listed under "Secrets"

#### B. Profile data missing
- The Edge Function expects certain profile fields
- Check if your profile has: `sport`, `position`, `skill_level`, etc.

####C. Edge Function not deployed
- If function isn't deployed, deploy it:
```bash
npx supabase functions deploy generate-training-plan --project-ref svdznqczeedptnmwopem
```

### 5. Test with Sample Data

You can test the Edge Function directly using curl:

```bash
curl -i --location --request POST 'https://svdznqczeedptnmwopem.supabase.co/functions/v1/generate-training-plan' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "athleteProfile": {
      "id": "test-user-id",
      "sport": "Football",
      "position": "Running Back",
      "skill_level": "intermediate",
      "date_of_birth": "2005-01-01",
      "gender": "male",
      "equipment_available": ["barbell", "dumbbells"],
      "training_days": ["Monday", "Wednesday", "Friday"],
      "session_duration_minutes": 60,
      "injuries": [],
      "medical_conditions": [],
      "primary_goals": ["Increase strength", "Improve speed"]
    },
    "planType": "initial"
  }'
```

Replace `YOUR_ANON_KEY` with your anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZHpucWN6ZWVkcHRubXdvcGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3MzY1MjksImV4cCI6MjA0NDMxMjUyOX0.9u0Qh-3zZ0pOGqCHRq38OuB9VpCBxmNUvYgPULHudHg`

##6. Check What Error is Returned

The most likely issues are:
1. **ANTHROPIC_API_KEY not configured** - Edge Function can't call Claude API
2. **Profile missing required fields** - athleteProfile is incomplete
3. **Edge Function not deployed** - Function doesn't exist on Supabase
4. **CORS issue** - Browser blocking the request
5. **Database permissions** - Can't query exercises or save plan

Please check the browser console and paste any errors you see!