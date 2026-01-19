import { useState } from 'react';
import { supabase, profileHelpers, workoutHelpers, journalHelpers, feedbackHelpers } from '../lib/supabase';

interface PlanGenerationOptions {
  planType: 'initial' | 'adjustment';
  adjustmentReason?: string;
  includeRecentData?: boolean;
}

export function useAIPlanGeneration() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (userId: string, options: PlanGenerationOptions) => {
    setGenerating(true);
    setError(null);

    try {
      // Fetch athlete profile
      const profile = await profileHelpers.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Prepare request data
      let requestData: any = {
        athleteProfile: profile,
        planType: options.planType,
        adjustmentReason: options.adjustmentReason
      };

      // Include recent performance data for adjustments
      if (options.includeRecentData || options.planType === 'adjustment') {
        const [workouts, journals, signals] = await Promise.all([
          workoutHelpers.getRecentWorkouts(userId, 7),
          journalHelpers.getRecentJournals(userId, 5),
          feedbackHelpers.getUnprocessedSignals(userId)
        ]);

        requestData = {
          ...requestData,
          recentWorkouts: workouts,
          recentJournals: journals,
          feedbackSignals: signals
        };
      }

      // Call the Edge Function
      const { data, error: functionError } = await supabase.functions.invoke(
        'generate-training-plan',
        {
          body: requestData
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      return data.plan;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  const adjustPlanBasedOnFeedback = async (userId: string) => {
    // Check if there are unprocessed signals
    const signals = await feedbackHelpers.getUnprocessedSignals(userId);

    if (signals.length === 0) {
      return null; // No adjustments needed
    }

    // Analyze signals to determine if adjustment is needed
    const needsAdjustment = analyzeSignals(signals);

    if (!needsAdjustment.shouldAdjust) {
      return null;
    }

    // Generate adjusted plan
    return generatePlan(userId, {
      planType: 'adjustment',
      adjustmentReason: needsAdjustment.reason,
      includeRecentData: true
    });
  };

  return {
    generatePlan,
    adjustPlanBasedOnFeedback,
    generating,
    error
  };
}

function analyzeSignals(signals: any[]): { shouldAdjust: boolean; reason: string } {
  const signalCounts = {
    too_hard: 0,
    too_easy: 0,
    high_fatigue: 0,
    injury: 0,
    great_progress: 0
  };

  signals.forEach(signal => {
    if (signalCounts[signal.signal_type as keyof typeof signalCounts] !== undefined) {
      signalCounts[signal.signal_type as keyof typeof signalCounts]++;
    }
  });

  // Determine if adjustment is needed based on signal patterns
  if (signalCounts.injury > 0) {
    return {
      shouldAdjust: true,
      reason: 'Injury reported - need to modify exercises to avoid affected areas'
    };
  }

  if (signalCounts.high_fatigue >= 2) {
    return {
      shouldAdjust: true,
      reason: 'Consistent high fatigue - reduce training volume and intensity'
    };
  }

  if (signalCounts.too_hard >= 3) {
    return {
      shouldAdjust: true,
      reason: 'Workouts consistently too difficult - reduce intensity'
    };
  }

  if (signalCounts.too_easy >= 3) {
    return {
      shouldAdjust: true,
      reason: 'Workouts consistently too easy - increase challenge'
    };
  }

  if (signalCounts.great_progress >= 3) {
    return {
      shouldAdjust: true,
      reason: 'Excellent progress - ready for progression'
    };
  }

  return {
    shouldAdjust: false,
    reason: ''
  };
}