# AI-Driven Training Plan Setup Guide

## Overview
The GRIT Athlete Dashboard now includes AI-powered training plan generation and dynamic adjustments using Claude 3.5 Sonnet. The system learns from athlete performance data and automatically adjusts training plans based on feedback.

## Quick Setup Steps

### 1. Fix Authentication (Choose One)

#### Option A: Disable Email Confirmation (Recommended for Development)
1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Settings**
3. Under **Email Auth** section
4. Toggle **OFF** "Enable email confirmations"
5. Save changes

#### Option B: Use Email Confirmation
- Check your email (including spam) after signup
- Click the confirmation link before logging in

### 2. Deploy the AI Edge Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ID)
supabase link --project-ref svdznqczeedptnmwopem

# Deploy the Edge Function
supabase functions deploy generate-training-plan
```

### 3. Add Environment Variables

In your Supabase Dashboard:
1. Go to **Settings > Edge Functions**
2. Add these environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key from anthropic.com
   - `SUPABASE_URL`: Your project URL (already set)
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (already set)

### 4. Test the System

1. **Create a new account** or use existing test account
2. **Complete onboarding** - The AI will generate your initial plan
3. **Log workouts** with RPE and completion status
4. **Create journal entries** after practices/games
5. **Watch the AI adapt** - Plans adjust based on your feedback

## How the AI System Works

### Initial Plan Generation
When an athlete completes onboarding, the system:
1. Analyzes their profile (sport, position, fitness level, goals)
2. Considers equipment availability and schedule
3. Generates a personalized 4-week training plan
4. Costs approximately $0.02 per plan

### Dynamic Adjustments
The AI monitors and adjusts based on:

#### Feedback Signals
- **Too Hard** (RPE > 8): Reduces intensity
- **Too Easy** (RPE < 4): Increases difficulty
- **High Fatigue** (>7/10): Adds recovery focus
- **Failed Workouts**: Modifies exercise selection
- **Great Performance** (≥9/10): Progresses to next level

#### Adjustment Triggers
The system automatically adjusts when:
- 3+ workouts rated "too hard" → Reduce intensity
- 3+ workouts rated "too easy" → Increase challenge
- 2+ high fatigue reports → Increase recovery
- Any injury reported → Modify to avoid affected areas
- Consistent great performance → Progress difficulty

### Data Flow

```
Athlete Actions → Database → Feedback Signals → AI Analysis → Plan Adjustment
     ↓                ↓            ↓                  ↓              ↓
Log Workout    Store in DB   Auto-generated    Claude 3.5      New Plan
Journal Entry  workout_logs  feedback_signals  Processes      Generated
               journals      Table             Data
```

## Features Implemented

### ✅ Complete Features
1. **Enhanced Onboarding** (10 steps)
   - Demographics & medical info
   - Sport/position selection
   - Performance baselines
   - Mental assessment

2. **Workout Logging**
   - Pre-workout assessment
   - Exercise tracking
   - RPE and performance metrics
   - Completion status
   - Recovery tracking

3. **Practice/Game Journaling**
   - Performance ratings
   - Reflection sections
   - Physical/mental state
   - Fatigue tracking
   - Soreness mapping

4. **AI Plan Generation**
   - Initial plan creation
   - Dynamic adjustments
   - Safety considerations
   - Sport-specific exercises
   - Progressive overload

5. **Feedback Loop**
   - Automatic signal generation
   - Performance trend analysis
   - Adjustment tracking
   - Cost monitoring

## Database Tables

### Core Tables
- `profiles` - Athlete information
- `exercises` - Exercise library (40+ exercises)
- `training_plans` - AI-generated plans
- `workout_logs` - Completed workouts
- `practice_game_journals` - Event journals
- `feedback_signals` - Auto-generated signals
- `plan_adjustments` - AI adjustment history
- `performance_trends` - Aggregated metrics

## Cost Analysis

### Per Plan Costs
- Initial plan: ~$0.02
- Adjustment: ~$0.01-0.02
- Monthly cost per active user: ~$0.10-0.30

### Cost Optimization
- Template-based adjustments for minor changes
- Batch processing for multiple athletes
- Caching common patterns
- Progressive disclosure (only regenerate affected weeks)

## Testing Checklist

- [ ] Create test account
- [ ] Complete onboarding
- [ ] Verify initial plan generated
- [ ] Log 3-5 workouts with varying RPE
- [ ] Create 2-3 journal entries
- [ ] Check feedback_signals table for auto-generated signals
- [ ] Manually trigger plan adjustment (if signals present)
- [ ] Verify plan_adjustments table has new record
- [ ] Check training_plans for updated plan

## Troubleshooting

### Can't Login/Signup
- Check email confirmation settings in Supabase
- Verify Supabase project is active (not paused)
- Check browser console for specific errors

### Edge Function Not Working
- Verify ANTHROPIC_API_KEY is set
- Check Edge Function logs in Supabase Dashboard
- Ensure function is deployed: `supabase functions list`

### No AI Plan Generated
- Check browser console for errors
- Verify Edge Function is deployed
- Check Supabase logs for API errors
- Ensure profile has required fields (sport, position, etc.)

### Plans Not Adjusting
- Verify feedback_signals are being generated
- Check that enough signals exist (3+ for most triggers)
- Manually call `adjustPlanBasedOnFeedback()` from console

## Next Steps

### Immediate Enhancements
1. Add loading states during plan generation
2. Display generated plans in UI
3. Show adjustment history
4. Add manual plan regeneration button

### Future Features
1. Coach review workflow
2. Team/group training plans
3. Nutrition plan generation
4. Competition prep protocols
5. Injury rehabilitation plans
6. Video exercise demonstrations
7. Progress analytics dashboard

## API Keys Required

1. **Anthropic (Claude)**: https://console.anthropic.com
   - Sign up for API access
   - Generate API key
   - Add to Supabase Edge Functions environment

## Support

For issues or questions:
- Check Supabase logs: Dashboard > Logs
- Check Edge Function logs: Dashboard > Edge Functions > Logs
- Review browser console for client-side errors
- Verify all SQL migrations have been run

---

**Remember**: The app is now feature-complete for MVP with intelligent AI coaching that adapts to each athlete's unique response to training!