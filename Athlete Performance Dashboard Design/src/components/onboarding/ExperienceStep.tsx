import React, { useState } from 'react';
import { Button } from '../Button';
import { ChevronRight, ChevronLeft, Award, TrendingUp, Users, Sparkles } from 'lucide-react';

interface ExperienceStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function ExperienceStep({ data, onNext, onBack }: ExperienceStepProps) {
  const [trainingExperience, setTrainingExperience] = useState(data.trainingExperience || '');
  const [currentWorkload, setCurrentWorkload] = useState(data.currentWorkload || '');
  const [coachingStyle, setCoachingStyle] = useState(data.coachingStyle || '');
  const [motivators, setMotivators] = useState(data.motivators || []);
  const [strengths, setStrengths] = useState(data.strengths || []);
  const [weaknesses, setWeaknesses] = useState(data.weaknesses || []);

  const experienceLevels = [
    { 
      id: 'beginner', 
      label: 'Beginner', 
      description: 'New to structured training (< 1 year)',
      icon: '🌱'
    },
    { 
      id: 'intermediate', 
      label: 'Intermediate', 
      description: '1-3 years of consistent training',
      icon: '🌿'
    },
    { 
      id: 'advanced', 
      label: 'Advanced', 
      description: '3+ years of structured training',
      icon: '🌳'
    },
    { 
      id: 'elite', 
      label: 'Elite', 
      description: 'Competition-level training experience',
      icon: '🏆'
    }
  ];

  const workloadOptions = [
    { id: 'light', label: 'Light', description: 'Can handle more volume', color: 'text-green-500' },
    { id: 'moderate', label: 'Moderate', description: 'Current workload feels right', color: 'text-yellow-500' },
    { id: 'heavy', label: 'Heavy', description: 'Near max capacity', color: 'text-orange-500' },
    { id: 'overwhelming', label: 'Overwhelming', description: 'Need recovery focus', color: 'text-red-500' }
  ];

  const coachingStyles = [
    { 
      id: 'structured', 
      label: 'Highly Structured', 
      description: 'Every detail planned, minimal flexibility',
      icon: '📋'
    },
    { 
      id: 'flexible', 
      label: 'Flexible', 
      description: 'Core structure with room for adjustments',
      icon: '🎯'
    },
    { 
      id: 'adaptive', 
      label: 'Adaptive', 
      description: 'Adjust based on daily readiness',
      icon: '🔄'
    },
    { 
      id: 'autonomous', 
      label: 'Self-Directed', 
      description: 'Guidelines with personal freedom',
      icon: '🗺️'
    }
  ];

  const motivatorOptions = [
    { id: 'competition', label: 'Competition', icon: '🏆' },
    { id: 'improvement', label: 'Personal Bests', icon: '📈' },
    { id: 'team', label: 'Team Success', icon: '👥' },
    { id: 'recognition', label: 'Recognition', icon: '⭐' },
    { id: 'health', label: 'Health & Fitness', icon: '💪' },
    { id: 'scholarship', label: 'College Scholarship', icon: '🎓' },
    { id: 'professional', label: 'Pro Potential', icon: '🏅' },
    { id: 'fun', label: 'Enjoyment', icon: '😊' }
  ];

  const strengthOptions = [
    { id: 'strength', label: 'Raw Strength' },
    { id: 'speed', label: 'Speed' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'power', label: 'Explosive Power' },
    { id: 'coordination', label: 'Coordination' },
    { id: 'flexibility', label: 'Flexibility' },
    { id: 'mental', label: 'Mental Toughness' },
    { id: 'technical', label: 'Technical Skills' }
  ];

  const toggleMotivator = (motivatorId: string) => {
    if (motivators.includes(motivatorId)) {
      setMotivators(motivators.filter(m => m !== motivatorId));
    } else {
      setMotivators([...motivators, motivatorId]);
    }
  };

  const toggleStrength = (strengthId: string) => {
    if (strengths.includes(strengthId)) {
      setStrengths(strengths.filter(s => s !== strengthId));
    } else if (strengths.length < 3) {
      setStrengths([...strengths, strengthId]);
    }
  };

  const toggleWeakness = (weaknessId: string) => {
    if (weaknesses.includes(weaknessId)) {
      setWeaknesses(weaknesses.filter(w => w !== weaknessId));
    } else if (weaknesses.length < 3) {
      setWeaknesses([...weaknesses, weaknessId]);
    }
  };

  const handleNext = () => {
    const experienceData = {
      trainingExperience,
      currentWorkload,
      coachingStyle,
      motivators,
      strengths,
      weaknesses
    };
    onNext(experienceData);
  };

  const isValid = trainingExperience && currentWorkload && coachingStyle && 
                   motivators.length >= 2 && strengths.length >= 1 && weaknesses.length >= 1;

  return (
    <div className="animate-slide-in-up">
      <div className="mb-8">
        <h2 className="text-white mb-3">Training Experience & Preferences</h2>
        <p className="text-gray-400">Help us match the plan to your experience level and training style</p>
      </div>

      {/* Training Experience */}
      <div className="mb-8">
        <h3 className="text-white mb-4">Training Experience Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setTrainingExperience(level.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                trainingExperience === level.id
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{level.icon}</span>
                <div>
                  <p className="text-white font-medium mb-1">{level.label}</p>
                  <p className="text-gray-400 text-sm">{level.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Workload */}
      <div className="mb-8">
        <h3 className="text-white mb-4">Current Training Load</h3>
        <p className="text-gray-400 text-sm mb-4">How does your current training volume feel?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {workloadOptions.map((workload) => (
            <button
              key={workload.id}
              onClick={() => setCurrentWorkload(workload.id)}
              className={`p-4 rounded-xl border transition-all ${
                currentWorkload === workload.id
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <p className={`font-medium mb-1 ${
                currentWorkload === workload.id ? workload.color : 'text-white'
              }`}>{workload.label}</p>
              <p className="text-gray-400 text-xs">{workload.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Coaching Style Preference */}
      <div className="mb-8">
        <h3 className="text-white mb-4">Preferred Coaching Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {coachingStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setCoachingStyle(style.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                coachingStyle === style.id
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{style.icon}</span>
                <div>
                  <p className="text-white font-medium mb-1">{style.label}</p>
                  <p className="text-gray-400 text-sm">{style.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Motivators */}
      <div className="mb-8">
        <h3 className="text-white mb-2">What Motivates You?</h3>
        <p className="text-gray-400 text-sm mb-4">Select at least 2</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {motivatorOptions.map((motivator) => (
            <button
              key={motivator.id}
              onClick={() => toggleMotivator(motivator.id)}
              className={`p-3 rounded-xl border transition-all ${
                motivators.includes(motivator.id)
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <span className="text-2xl mb-2 block">{motivator.icon}</span>
              <p className="text-white text-sm">{motivator.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-white mb-2">Your Strengths</h3>
          <p className="text-gray-400 text-sm mb-4">Select up to 3</p>
          <div className="space-y-2">
            {strengthOptions.map((strength) => (
              <button
                key={strength.id}
                onClick={() => toggleStrength(strength.id)}
                disabled={!strengths.includes(strength.id) && strengths.length >= 3}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  strengths.includes(strength.id)
                    ? 'bg-[#03fd1c]/10 border-[#03fd1c] text-white'
                    : 'bg-[#0a0a0a] border-[#252525] text-gray-400 hover:border-[#03fd1c]/50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {strength.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white mb-2">Areas to Improve</h3>
          <p className="text-gray-400 text-sm mb-4">Select up to 3</p>
          <div className="space-y-2">
            {strengthOptions.map((weakness) => (
              <button
                key={weakness.id}
                onClick={() => toggleWeakness(weakness.id)}
                disabled={!weaknesses.includes(weakness.id) && weaknesses.length >= 3}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  weaknesses.includes(weakness.id)
                    ? 'bg-yellow-500/10 border-yellow-500 text-white'
                    : 'bg-[#0a0a0a] border-[#252525] text-gray-400 hover:border-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {weakness.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ChevronLeft className="w-5 h-5" />
          Back
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          onClick={handleNext}
          disabled={!isValid}
        >
          Next Step
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
