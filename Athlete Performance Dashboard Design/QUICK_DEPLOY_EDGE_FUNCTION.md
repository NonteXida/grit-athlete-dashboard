# Quick Edge Function Deployment Guide

## IMPORTANT: Login Issues First!

**The login issue is NOT related to the Edge Function!** The Edge Function is only for AI plan generation. Let's fix login first:

### Fix Login/Signup Issues:

1. **Go to Supabase Dashboard**
2. **Authentication > Settings**
3. **Turn OFF "Enable email confirmations"** (for development)
4. **Save changes**

### Also check:
- Is your Supabase project active (not paused)?
- Are you using the correct project URL and anon key?

---

## Deploy Edge Function (After Login Works)

### Method 1: Via Dashboard (Easiest)

1. **Go to your Supabase Dashboard**
2. Navigate to **Edge Functions** (in left sidebar)
3. Click **"New Function"**
4. Name it: `generate-training-plan`
5. **Copy and paste** the entire content from:
   ```
   supabase/functions/generate-training-plan/index.ts
   ```
6. Click **Deploy**

### Method 2: Via CLI

```bash
# If not logged in to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref svdznqczeedptnmwopem

# Deploy the function
npx supabase functions deploy generate-training-plan

# If you get errors, try with explicit path
npx supabase functions deploy generate-training-plan --no-verify-jwt
```

### Add Environment Variables (Required for AI)

1. In Supabase Dashboard, go to **Settings > Edge Functions**
2. Add these environment variables:
   - `ANTHROPIC_API_KEY`: Get from https://console.anthropic.com
   - This is ONLY needed for AI plan generation, not for login!

---

## Debugging Login Issues

Open browser console (F12) and try to login. Look for errors like:

- **"Email not confirmed"** → Disable email confirmation in Supabase
- **"Invalid login credentials"** → Wrong email/password
- **"Failed to fetch"** → Check project URL and anon key
- **"Project paused"** → Reactivate project in Supabase

### Test Basic Supabase Connection

In browser console, run:
```javascript
// Check if Supabase is connected
const testConnection = async () => {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    'https://svdznqczeedptnmwopem.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZHpucWN6ZWVkcHRubXdvcGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzA1NDAsImV4cCI6MjA3ODA0NjU0MH0.osZK03Zyt_NrbrBV0Andv-VSEbEQVA-U5J0BqmDCIDI'
  );

  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'testpass123'
  });

  console.log('Signup result:', { data, error });
};

testConnection();
```

---

## The Edge Function is Only For:

- Generating AI training plans after onboarding
- Adjusting plans based on performance
- NOT required for basic app functionality
- NOT required for login/signup

## Priority:

1. ✅ Fix login/signup first (disable email confirmation)
2. ✅ Test basic app functionality
3. ⏳ Deploy Edge Function later for AI features