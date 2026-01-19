# Setting Up Anthropic API Key for AI Training Plan Generation

## The Issue
Your AI training plan generation is not working because the Supabase Edge Function needs an Anthropic API key to call Claude for generating personalized training plans.

## Quick Fix - Add Your Anthropic API Key

### Step 1: Get Your Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create Key**
5. Copy the API key (it starts with `sk-ant-api...`)

### Step 2: Add the Key to Your Supabase Project

#### Option A: Via Supabase Dashboard (Easiest)
1. Go to https://supabase.com/dashboard
2. Select your project: `svdznqczeedptnmwopem`
3. Navigate to **Edge Functions** in the left sidebar
4. Click on the **generate-training-plan** function
5. Go to the **Settings** tab
6. Under **Environment Variables**, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: [Your API key from Step 1]
7. Click **Save**

#### Option B: Via Supabase CLI
```bash
npx supabase secrets set ANTHROPIC_API_KEY="sk-ant-api-YOUR-KEY-HERE" --project-ref svdznqczeedptnmwopem
```

### Step 3: Verify It's Working
1. Go back to your app at http://localhost:3000
2. Click on "Training" in the sidebar
3. Click "Build My Plan" button
4. Complete the onboarding questionnaire
5. The AI plan should generate successfully!

## What Happens When It Works

When the API key is properly configured:
1. After completing the onboarding, you'll see "Generating personalized training plan..." in the console
2. A success message will appear: "Your personalized GRIT training plan has been created!"
3. The dashboard will show "Your AI Plan is Active!" instead of "Ready to Level Up?"
4. In the Training Hub, you'll see your complete AI-generated workout plan

## Cost Information
- Each plan generation costs approximately $0.02-$0.03
- Claude 3.5 Sonnet is used (most cost-effective for quality)
- The cost is calculated and stored with each plan for tracking

## Troubleshooting

### If you see "AI training plan generation is not configured yet"
- The Edge Function couldn't find the ANTHROPIC_API_KEY
- Double-check the environment variable is set correctly in Supabase

### If you see "Failed to generate your training plan"
- Check the browser console for detailed error messages
- Check Edge Function logs in Supabase Dashboard → Functions → Logs

### To Check if the Edge Function is Deployed
```bash
npx supabase functions list --project-ref svdznqczeedptnmwopem
```

### To View Edge Function Logs
```bash
npx supabase functions logs generate-training-plan --project-ref svdznqczeedptnmwopem
```

## Alternative: Create Mock Plans (For Testing Without API Key)

If you want to test without setting up the API key, we can create a mock plan generator that creates sample plans without calling Claude. Let me know if you'd prefer this approach for testing.

## Important Notes
- Keep your API key secure - never commit it to Git
- The key is stored securely in Supabase's environment variables
- Each user's plan is generated based on their onboarding data
- Plans are saved to the database and persist across sessions