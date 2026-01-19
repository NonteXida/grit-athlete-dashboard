import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlanRequest {
  athleteProfile: any;
  recentWorkouts?: any[];
  recentJournals?: any[];
  feedbackSignals?: any[];
  planType: 'initial' | 'adjustment';
  adjustmentReason?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get request data
    const {
      athleteProfile,
      recentWorkouts,
      recentJournals,
      feedbackSignals,
      planType,
      adjustmentReason
    } = await req.json() as PlanRequest;

    // Get available exercises from database
    const { data: exercises } = await supabase
      .from('exercises')
      .select('*')
      .order('category');

    // Build the prompt for Claude
    const systemPrompt = `You are an expert sports performance coach specializing in personalized training plans for athletes.
You create safe, progressive, and sport-specific training programs based on athlete data and performance feedback.

Key principles:
1. Safety first - avoid exercises that conflict with injuries or limitations
2. Progressive overload - gradual intensity increases
3. Recovery is crucial - include rest days and deload weeks
4. Sport-specific - prioritize exercises relevant to the athlete's sport and position
5. Adaptive - adjust based on performance data and feedback

Available exercises database:
${JSON.stringify(exercises, null, 2)}`;

    const userPrompt = buildUserPrompt(
      athleteProfile,
      recentWorkouts,
      recentJournals,
      feedbackSignals,
      planType,
      adjustmentReason
    );

    // Call Claude API via Anthropic
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: userPrompt
        }],
        temperature: 0.7
      })
    });

    const claudeResponse = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.error?.message || 'Unknown error'}`);
    }

    // Parse the training plan from Claude's response
    const planContent = claudeResponse.content[0].text;
    const trainingPlan = parsePlanFromResponse(planContent);

    // Calculate cost (Claude 3.5 Sonnet pricing)
    const inputTokens = claudeResponse.usage?.input_tokens || 0;
    const outputTokens = claudeResponse.usage?.output_tokens || 0;
    const cost = (inputTokens * 0.003 + outputTokens * 0.015) / 1000; // $3/$15 per million tokens

    // Save the plan to database
    const { data: savedPlan, error: saveError } = await supabase
      .from('training_plans')
      .insert({
        athlete_id: athleteProfile.id,
        name: trainingPlan.name,
        description: trainingPlan.description,
        duration_weeks: trainingPlan.duration_weeks,
        plan_type: trainingPlan.plan_type,
        periodization_phase: trainingPlan.periodization_phase,
        ai_generated: true,
        ai_model: 'claude-3.5-sonnet',
        generation_cost: cost,
        plan_data: trainingPlan,
        status: 'active'
      })
      .select()
      .single();

    if (saveError) {
      throw new Error(`Failed to save plan: ${saveError.message}`);
    }

    // If this is an adjustment, create an adjustment record
    if (planType === 'adjustment' && savedPlan) {
      await supabase
        .from('plan_adjustments')
        .insert({
          plan_id: savedPlan.id,
          athlete_id: athleteProfile.id,
          adjustment_type: 'ai_suggested',
          adjustment_reason: adjustmentReason || 'Performance-based adjustment',
          trigger_source: 'feedback_signals',
          changes_summary: trainingPlan.adjustments || [],
          ai_model: 'claude-3.5-sonnet',
          ai_confidence_score: 0.85,
          ai_reasoning: trainingPlan.reasoning || '',
          status: 'applied'
        });

      // Mark feedback signals as processed
      if (feedbackSignals && feedbackSignals.length > 0) {
        const signalIds = feedbackSignals.map(s => s.id);
        await supabase
          .from('feedback_signals')
          .update({
            processed: true,
            processed_at: new Date().toISOString(),
            applied_to_plan_id: savedPlan.id
          })
          .in('id', signalIds);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        plan: savedPlan,
        cost: cost.toFixed(4)
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error generating training plan:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});

function buildUserPrompt(
  profile: any,
  workouts: any[],
  journals: any[],
  signals: any[],
  planType: string,
  adjustmentReason?: string
): string {
  const prompt = `
Generate a ${planType === 'initial' ? 'comprehensive 4-week' : 'adjusted'} training plan for this athlete:

ATHLETE PROFILE:
- Sport: ${profile.sport}
- Position: ${profile.position}
- Skill Level: ${profile.skill_level}
- Age: ${calculateAge(profile.date_of_birth)} years old
- Gender: ${profile.gender}
- Equipment Available: ${JSON.stringify(profile.equipment_available || [])}
- Training Days: ${JSON.stringify(profile.training_days || [])}
- Session Duration: ${profile.session_duration_minutes || 60} minutes
- Injuries/Limitations: ${JSON.stringify(profile.injuries || [])}
- Medical Conditions: ${JSON.stringify(profile.medical_conditions || [])}
- Goals: ${JSON.stringify(profile.primary_goals || [])}

PERFORMANCE BASELINES:
${JSON.stringify(profile.fitness_metrics || {}, null, 2)}

${workouts && workouts.length > 0 ? `
RECENT WORKOUT PERFORMANCE:
${workouts.map(w => `
- Date: ${w.workout_date}
- Status: ${w.completion_status}
- RPE: ${w.rpe}/10
- Energy: ${w.energy_level}/10
- Notes: ${w.notes || 'None'}
`).join('\n')}
` : ''}

${journals && journals.length > 0 ? `
RECENT PRACTICE/GAME FEEDBACK:
${journals.map(j => `
- Event: ${j.event_type} on ${j.event_date}
- Performance: ${j.performance_rating}/10
- Fatigue: ${j.fatigue_level}/10
- What went well: ${j.what_went_well || 'Not specified'}
- Needs improvement: ${j.what_to_improve || 'Not specified'}
`).join('\n')}
` : ''}

${signals && signals.length > 0 ? `
FEEDBACK SIGNALS:
${signals.map(s => `- ${s.signal_type}: ${s.signal_strength}`).join('\n')}
` : ''}

${adjustmentReason ? `REASON FOR ADJUSTMENT: ${adjustmentReason}` : ''}

Create a training plan that:
1. Is appropriate for their ${profile.sport} ${profile.position} position
2. Matches their ${profile.skill_level} skill level
3. Works within their equipment and time constraints
4. Addresses their goals while respecting limitations
5. ${planType === 'adjustment' ? 'Adjusts based on recent performance data' : 'Provides progressive overload'}

Format the response as JSON with this structure:
{
  "name": "Plan name",
  "description": "Brief description",
  "duration_weeks": 4,
  "plan_type": "strength|skill|hybrid|endurance",
  "periodization_phase": "preparation|accumulation|intensification",
  "weeks": [
    {
      "week_number": 1,
      "focus": "Week focus",
      "workouts": [
        {
          "day": "Monday",
          "name": "Workout name",
          "type": "strength|cardio|skill|recovery",
          "duration_minutes": 60,
          "exercises": [
            {
              "name": "Exercise name from database",
              "sets": 3,
              "reps": "10-12",
              "rest_seconds": 60,
              "notes": "Form cues or modifications"
            }
          ],
          "warmup": "Description of warmup",
          "cooldown": "Description of cooldown"
        }
      ]
    }
  ],
  "progression_notes": "How to progress over the 4 weeks",
  "recovery_protocol": "Recovery recommendations",
  ${planType === 'adjustment' ? `"adjustments": ["List of changes made"],` : ''}
  ${planType === 'adjustment' ? `"reasoning": "Why these adjustments were made",` : ''}
  "safety_notes": "Important safety considerations"
}`;

  return prompt;
}

function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 20; // Default age if not specified
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function parsePlanFromResponse(response: string): any {
  try {
    // Extract JSON from the response (Claude might include explanatory text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      // Fix common JSON issues: trailing commas
      let jsonStr = jsonMatch[0]
        .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas before } or ]
        .replace(/\n/g, ' ');           // Remove newlines that might break parsing

      return JSON.parse(jsonStr);
    }
    // If no JSON found, try to parse the entire response with fixes
    let cleanResponse = response
      .replace(/,(\s*[}\]])/g, '$1')
      .replace(/\n/g, ' ');

    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error('Error parsing plan response:', error);
    console.error('Raw response:', response.substring(0, 500));
    // Return a basic structure if parsing fails
    return {
      name: 'Generated Training Plan',
      description: 'AI-generated training plan',
      duration_weeks: 4,
      plan_type: 'hybrid',
      raw_response: response.substring(0, 1000)
    };
  }
}