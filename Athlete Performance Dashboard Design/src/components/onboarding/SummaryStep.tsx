import React, { useState } from 'react';
import { Button } from '../Button';
import { ChevronLeft, Sparkles, Check, Edit, Target, Calendar, Dumbbell, Brain, User } from 'lucide-react';

interface SummaryStepProps {
  data: any;
  onComplete: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export function SummaryStep({ data, onComplete, onBack, onEdit }: SummaryStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    // Simulate plan generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    onComplete();
  };

  // Format data for display
  const getBodyTypeLabel = (type: string) => {
    const types: any = {
      ectomorph: 'Lean/Slim',
      mesomorph: 'Athletic',
      endomorph: 'Powerful',
      combination: 'Combination'
    };
    return types[type] || type;
  };

  const getExperienceLabel = (exp: string) => {
    const levels: any = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      elite: 'Elite'
    };
    return levels[exp] || exp;
  };

  const getTimePreferenceLabel = (time: string) => {
    const times: any = {
      'early-morning': 'Early Morning (5-8 AM)',
      'morning': 'Morning (8 AM-12 PM)',
      'afternoon': 'Afternoon (12-5 PM)',
      'evening': 'Evening (5-9 PM)'
    };
    return times[time] || time;
  };

  const sections = [
    {
      title: 'Sport & Goals',
      icon: Target,
      stepNumber: 2,
      items: [
        { label: 'Sport', value: data.sport },
        { label: 'Position', value: data.position },
        { label: 'Level', value: data.level },
        { label: 'Goals', value: `${data.goals?.length || 0} selected across ${[...new Set(data.goals?.map((g: any) => g.category) || [])].length} categories` },
        { label: 'Timeline', value: data.goals?.[0]?.timeline || 'Not set' }
      ]
    },
    {
      title: 'Physical Profile',
      icon: User,
      stepNumber: 3,
      items: [
        { label: 'Height', value: data.height ? `${data.height.feet}'${data.height.inches}"` : 'Not set' },
        { label: 'Weight', value: data.weight ? `${data.weight} lbs` : 'Not set' },
        { label: 'Body Type', value: getBodyTypeLabel(data.bodyType) },
        { label: 'Equipment', value: data.equipmentAccess?.join(', ') || 'Not set' },
        { label: 'Injuries', value: data.injuries?.length ? `${data.injuries.length} noted` : 'None' }
      ]
    },
    {
      title: 'Training Schedule',
      icon: Calendar,
      stepNumber: 4,
      items: [
        { label: 'Days/Week', value: data.trainingDays?.length || 0 },
        { label: 'Session Length', value: `${data.sessionDuration} minutes` },
        { label: 'Preferred Time', value: getTimePreferenceLabel(data.preferredTime) },
        { label: 'Season Phase', value: data.competitionSchedule },
        { label: 'Weekly Volume', value: `${data.weeklyVolume} minutes` }
      ]
    },
    {
      title: 'Experience & Style',
      icon: Dumbbell,
      stepNumber: 5,
      items: [
        { label: 'Experience', value: getExperienceLabel(data.trainingExperience) },
        { label: 'Current Load', value: data.currentWorkload },
        { label: 'Coaching Style', value: data.coachingStyle },
        { label: 'Strengths', value: data.strengths?.join(', ') || 'Not set' },
        { label: 'Focus Areas', value: data.weaknesses?.join(', ') || 'Not set' }
      ]
    },
    {
      title: 'Mental Profile',
      icon: Brain,
      stepNumber: 6,
      items: [
        { label: 'Confidence', value: `${data.confidenceLevel}/10` },
        { label: 'Focus', value: `${data.focusLevel}/10` },
        { label: 'Readiness', value: `${data.trainingReadiness}/10` },
        { label: 'Recovery', value: data.recoveryPriority },
        { label: 'Mental Tools', value: data.mentalSkills?.length ? `${data.mentalSkills.length} selected` : 'None' }
      ]
    }
  ];

  return (
    <div className="animate-slide-in-up">
      <div className="mb-8">
        <h2 className="text-white mb-3">Review Your GRIT Plan Blueprint</h2>
        <p className="text-gray-400">Review your information before we generate your personalized training plan</p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4 mb-8">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-[#141414] border border-[#252525] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#03fd1c]/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#03fd1c]" />
                  </div>
                  <h3 className="text-white">{section.title}</h3>
                </div>
                <button
                  onClick={() => onEdit(section.stepNumber)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between p-3 bg-[#0a0a0a] rounded-lg">
                    <span className="text-gray-400 text-sm">{item.label}:</span>
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Generation Preview */}
      <div className="bg-gradient-to-r from-[#03fd1c]/20 to-[#02c916]/20 border border-[#03fd1c] rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Sparkles className="w-8 h-8 text-[#03fd1c] flex-shrink-0" />
          <div>
            <h3 className="text-white mb-2">AI-Powered Plan Generation</h3>
            <p className="text-gray-300 mb-4">
              Based on your profile, we'll create a personalized training plan that:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#03fd1c]" />
                <span className="text-gray-300 text-sm">Matches your experience level</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#03fd1c]" />
                <span className="text-gray-300 text-sm">Fits your schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#03fd1c]" />
                <span className="text-gray-300 text-sm">Targets your goals</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#03fd1c]" />
                <span className="text-gray-300 text-sm">Adapts to your progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#03fd1c]" />
                <span className="text-gray-300 text-sm">Considers injury history</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#03fd1c]" />
                <span className="text-gray-300 text-sm">Includes mental training</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commitment Statement */}
      <div className="bg-[#0a0a0a] border border-[#252525] rounded-xl p-6 mb-8">
        <h4 className="text-white mb-3">Your GRIT Commitment</h4>
        <p className="text-gray-300 mb-4">
          By generating this plan, you're committing to:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#03fd1c] mt-1" />
            <span className="text-gray-300">Training {data.trainingDays?.length || 0} days per week</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#03fd1c] mt-1" />
            <span className="text-gray-300">Logging workouts honestly and consistently</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#03fd1c] mt-1" />
            <span className="text-gray-300">Tracking progress toward your goals</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#03fd1c] mt-1" />
            <span className="text-gray-300">Trusting the process and staying patient</span>
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" size="lg" onClick={onBack} disabled={isGenerating}>
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
              Generating Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate My GRIT Plan
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
