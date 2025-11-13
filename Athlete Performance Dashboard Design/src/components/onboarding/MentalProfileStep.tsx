import React, { useState } from 'react';
import { Button } from '../Button';
import { ChevronRight, ChevronLeft, Brain, Heart, Target, Shield } from 'lucide-react';

interface MentalProfileStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function MentalProfileStep({ data, onNext, onBack }: MentalProfileStepProps) {
  const [confidenceLevel, setConfidenceLevel] = useState(data.confidenceLevel || 5);
  const [stressResponse, setStressResponse] = useState(data.stressResponse || '');
  const [focusLevel, setFocusLevel] = useState(data.focusLevel || 5);
  const [recoveryPriority, setRecoveryPriority] = useState(data.recoveryPriority || '');
  const [mentalSkills, setMentalSkills] = useState(data.mentalSkills || []);
  const [trainingReadiness, setTrainingReadiness] = useState(data.trainingReadiness || 5);

  const stressResponses = [
    { 
      id: 'thrive', 
      label: 'Thrive Under Pressure', 
      description: 'Perform best in high-stress situations',
      emoji: '🔥'
    },
    { 
      id: 'manage', 
      label: 'Manage Well', 
      description: 'Handle pressure with preparation',
      emoji: '⚖️'
    },
    { 
      id: 'improving', 
      label: 'Improving', 
      description: 'Working on stress management',
      emoji: '📈'
    },
    { 
      id: 'struggle', 
      label: 'Need Support', 
      description: 'Pressure affects performance',
      emoji: '🌱'
    }
  ];

  const recoveryOptions = [
    { 
      id: 'high', 
      label: 'High Priority', 
      description: 'Recovery is essential to my performance',
      icon: '🛡️'
    },
    { 
      id: 'balanced', 
      label: 'Balanced', 
      description: 'Equal focus on training and recovery',
      icon: '⚖️'
    },
    { 
      id: 'low', 
      label: 'Train Hard', 
      description: 'Push limits, minimal rest',
      icon: '⚡'
    },
    { 
      id: 'learning', 
      label: 'Learning', 
      description: 'Want to understand recovery better',
      icon: '📚'
    }
  ];

  const mentalSkillOptions = [
    { id: 'visualization', label: 'Visualization', description: 'Mental rehearsal of performance' },
    { id: 'breathing', label: 'Breathing Techniques', description: 'Controlled breathing for focus' },
    { id: 'self-talk', label: 'Positive Self-Talk', description: 'Internal motivation and confidence' },
    { id: 'goal-setting', label: 'Goal Setting', description: 'Clear objectives and milestones' },
    { id: 'mindfulness', label: 'Mindfulness', description: 'Present-moment awareness' },
    { id: 'routine', label: 'Pre-Game Routine', description: 'Consistent preparation rituals' },
    { id: 'journaling', label: 'Journaling', description: 'Reflection and progress tracking' },
    { id: 'meditation', label: 'Meditation', description: 'Mental clarity and calmness' }
  ];

  const toggleMentalSkill = (skillId: string) => {
    if (mentalSkills.includes(skillId)) {
      setMentalSkills(mentalSkills.filter(s => s !== skillId));
    } else {
      setMentalSkills([...mentalSkills, skillId]);
    }
  };

  const handleNext = () => {
    const mentalData = {
      confidenceLevel,
      stressResponse,
      focusLevel,
      recoveryPriority,
      mentalSkills,
      trainingReadiness,
      mentalStrengthScore: Math.round((confidenceLevel + focusLevel + trainingReadiness) / 3)
    };
    onNext(mentalData);
  };

  const isValid = stressResponse && recoveryPriority && mentalSkills.length >= 1;

  return (
    <div className="animate-slide-in-up">
      <div className="mb-8">
        <h2 className="text-white mb-3">Mental Performance Profile</h2>
        <p className="text-gray-400">Your mindset is as important as your physical training</p>
      </div>

      {/* Confidence Level */}
      <div className="mb-8">
        <h3 className="text-white mb-2">Athletic Confidence</h3>
        <p className="text-gray-400 text-sm mb-4">How confident do you feel in your sport?</p>
        <div className="bg-[#0a0a0a] border border-[#252525] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Low</span>
            <span className="text-[#03fd1c] text-2xl font-bold">{confidenceLevel}/10</span>
            <span className="text-gray-400">High</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
            className="w-full accent-[#03fd1c]"
          />
          <div className="mt-4 text-center">
            <p className="text-white">
              {confidenceLevel <= 3 && "Building foundation 🌱"}
              {confidenceLevel > 3 && confidenceLevel <= 6 && "Developing steadily 🌿"}
              {confidenceLevel > 6 && confidenceLevel <= 8 && "Strong and growing 💪"}
              {confidenceLevel > 8 && "Elite confidence 🏆"}
            </p>
          </div>
        </div>
      </div>

      {/* Stress Response */}
      <div className="mb-8">
        <h3 className="text-white mb-4">Competition Pressure</h3>
        <p className="text-gray-400 text-sm mb-4">How do you handle game-day pressure?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stressResponses.map((response) => (
            <button
              key={response.id}
              onClick={() => setStressResponse(response.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                stressResponse === response.id
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{response.emoji}</span>
                <div>
                  <p className="text-white font-medium mb-1">{response.label}</p>
                  <p className="text-gray-400 text-sm">{response.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Focus Level */}
      <div className="mb-8">
        <h3 className="text-white mb-2">Focus & Concentration</h3>
        <p className="text-gray-400 text-sm mb-4">How well can you maintain focus during training?</p>
        <div className="bg-[#0a0a0a] border border-[#252525] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Easily Distracted</span>
            <span className="text-[#03fd1c] text-2xl font-bold">{focusLevel}/10</span>
            <span className="text-gray-400">Laser Focus</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={focusLevel}
            onChange={(e) => setFocusLevel(parseInt(e.target.value))}
            className="w-full accent-[#03fd1c]"
          />
        </div>
      </div>

      {/* Recovery Priority */}
      <div className="mb-8">
        <h3 className="text-white mb-4">Recovery Approach</h3>
        <p className="text-gray-400 text-sm mb-4">How do you view recovery and rest?</p>
        <div className="grid grid-cols-2 gap-3">
          {recoveryOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setRecoveryPriority(option.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                recoveryPriority === option.id
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <span className="text-2xl mb-2 block">{option.icon}</span>
              <p className="text-white font-medium mb-1">{option.label}</p>
              <p className="text-gray-400 text-xs">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mental Skills Interest */}
      <div className="mb-8">
        <h3 className="text-white mb-2">Mental Training Tools</h3>
        <p className="text-gray-400 text-sm mb-4">Select techniques you're interested in or already use</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mentalSkillOptions.map((skill) => (
            <button
              key={skill.id}
              onClick={() => toggleMentalSkill(skill.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                mentalSkills.includes(skill.id)
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Brain className={`w-5 h-5 ${
                  mentalSkills.includes(skill.id) ? 'text-[#03fd1c]' : 'text-gray-400'
                }`} />
                <div>
                  <p className="text-white text-sm font-medium">{skill.label}</p>
                  <p className="text-gray-400 text-xs">{skill.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Training Readiness */}
      <div className="mb-8">
        <h3 className="text-white mb-2">Training Readiness</h3>
        <p className="text-gray-400 text-sm mb-4">How ready are you to commit to a structured plan?</p>
        <div className="bg-[#0a0a0a] border border-[#252525] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Hesitant</span>
            <span className="text-[#03fd1c] text-2xl font-bold">{trainingReadiness}/10</span>
            <span className="text-gray-400">All In!</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={trainingReadiness}
            onChange={(e) => setTrainingReadiness(parseInt(e.target.value))}
            className="w-full accent-[#03fd1c]"
          />
          <div className="mt-4 text-center">
            <p className="text-white">
              {trainingReadiness <= 3 && "Let's start slow and build momentum"}
              {trainingReadiness > 3 && trainingReadiness <= 6 && "Ready to progressively challenge yourself"}
              {trainingReadiness > 6 && trainingReadiness <= 8 && "Committed and ready to push"}
              {trainingReadiness > 8 && "Maximum commitment - let's dominate! 🔥"}
            </p>
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
