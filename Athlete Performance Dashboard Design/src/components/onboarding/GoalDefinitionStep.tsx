import React, { useState } from 'react';
import { Button } from '../Button';
import { Zap, Brain, Target, Heart, Utensils, Plus, X } from 'lucide-react';

interface Goal {
  category: string;
  subcategory: string;
  priority: number;
  timeline: string;
}

interface GoalDefinitionStepProps {
  onNext: (goals: Goal[]) => void;
  onBack: () => void;
  initialGoals?: Goal[];
}

const GOAL_CATEGORIES = [
  {
    name: 'Physical',
    icon: Zap,
    color: '#03fd1c',
    options: [
      'Strength',
      'Speed',
      'Power',
      'Agility',
      'Endurance',
      'Vertical Jump',
      'Conditioning',
      'Body Recomposition',
    ],
  },
  {
    name: 'Skill',
    icon: Target,
    color: '#00bfff',
    options: [
      'Sport-Specific Technique',
      'Ball Handling',
      'Footwork',
      'Route Running',
      'Shooting Form',
      'Serving',
      'Defensive Positioning',
      'Game IQ',
    ],
  },
  {
    name: 'Mental',
    icon: Brain,
    color: '#9333ea',
    options: [
      'Confidence',
      'Focus',
      'Composure Under Pressure',
      'Consistency',
      'Leadership',
      'Mental Toughness',
      'Visualization',
    ],
  },
  {
    name: 'Recovery',
    icon: Heart,
    color: '#ef4444',
    options: [
      'Sleep Quality',
      'Mobility',
      'Injury Prevention',
      'Flexibility',
      'Stress Management',
      'Active Recovery',
    ],
  },
  {
    name: 'Lifestyle',
    icon: Utensils,
    color: '#f59e0b',
    options: [
      'Nutrition Consistency',
      'Hydration',
      'Meal Planning',
      'Pre-Game Routine',
      'Post-Game Routine',
      'Film Study',
      'Time Management',
    ],
  },
];

const TIMELINES = [
  { id: '6-weeks', label: '6 Weeks' },
  { id: '3-months', label: '3 Months' },
  { id: '6-months', label: '6 Months' },
  { id: '12-months', label: '12 Months' },
];

export function GoalDefinitionStep({ onNext, onBack, initialGoals = [] }: GoalDefinitionStepProps) {
  const [activeCategory, setActiveCategory] = useState('Physical');
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(initialGoals);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const activeCategoryData = GOAL_CATEGORIES.find(c => c.name === activeCategory);

  const addGoal = (subcategory: string) => {
    const existing = selectedGoals.find(
      g => g.category === activeCategory && g.subcategory === subcategory
    );
    
    if (existing) {
      setExpandedGoal(`${activeCategory}-${subcategory}`);
    } else {
      setSelectedGoals([
        ...selectedGoals,
        {
          category: activeCategory,
          subcategory,
          priority: 3,
          timeline: '3-months',
        },
      ]);
      setExpandedGoal(`${activeCategory}-${subcategory}`);
    }
  };

  const removeGoal = (category: string, subcategory: string) => {
    setSelectedGoals(selectedGoals.filter(
      g => !(g.category === category && g.subcategory === subcategory)
    ));
    setExpandedGoal(null);
  };

  const updateGoal = (category: string, subcategory: string, updates: Partial<Goal>) => {
    setSelectedGoals(selectedGoals.map(g => 
      g.category === category && g.subcategory === subcategory
        ? { ...g, ...updates }
        : g
    ));
  };

  const handleSubmit = () => {
    if (selectedGoals.length > 0) {
      onNext(selectedGoals);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-white mb-2">Define Your Goals</h2>
        <p className="text-gray-400">
          Select goals across different categories. Choose 3-7 for best results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Tabs */}
        <div className="lg:col-span-2">
          {/* Category Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {GOAL_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.name;
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap
                    ${isActive 
                      ? 'border-[#03fd1c] bg-[#03fd1c]/10 text-[#03fd1c]' 
                      : 'border-[#252525] bg-[#141414] text-gray-300 hover:border-[#252525]'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Goal Options */}
          <div className="space-y-2">
            {activeCategoryData?.options.map((option) => {
              const goalKey = `${activeCategory}-${option}`;
              const isSelected = selectedGoals.some(
                g => g.category === activeCategory && g.subcategory === option
              );
              const isExpanded = expandedGoal === goalKey;
              const goalData = selectedGoals.find(
                g => g.category === activeCategory && g.subcategory === option
              );

              return (
                <div key={option} className="bg-[#141414] border border-[#252525] rounded-xl overflow-hidden">
                  <button
                    onClick={() => isSelected ? setExpandedGoal(isExpanded ? null : goalKey) : addGoal(option)}
                    className={`
                      w-full p-4 flex items-center justify-between transition-all
                      ${isSelected ? 'bg-[#03fd1c]/5' : 'hover:bg-[#0a0a0a]'}
                    `}
                  >
                    <span className={isSelected ? 'text-[#03fd1c]' : 'text-white'}>
                      {option}
                    </span>
                    {isSelected ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 px-2 py-1 bg-[#252525] rounded">
                          Priority {goalData?.priority}
                        </span>
                        <Plus className="w-5 h-5 text-[#03fd1c] rotate-45" />
                      </div>
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Expanded Options */}
                  {isExpanded && goalData && (
                    <div className="p-4 border-t border-[#252525] space-y-4 bg-[#0a0a0a]">
                      {/* Priority */}
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Priority (1-5)</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((p) => (
                            <button
                              key={p}
                              onClick={() => updateGoal(activeCategory, option, { priority: p })}
                              className={`
                                w-10 h-10 rounded-lg border transition-all
                                ${goalData.priority === p
                                  ? 'border-[#03fd1c] bg-[#03fd1c] text-black'
                                  : 'border-[#252525] text-gray-400 hover:border-[#03fd1c]/50'
                                }
                              `}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Target Timeline</label>
                        <div className="grid grid-cols-2 gap-2">
                          {TIMELINES.map((timeline) => (
                            <button
                              key={timeline.id}
                              onClick={() => updateGoal(activeCategory, option, { timeline: timeline.id })}
                              className={`
                                px-3 py-2 rounded-lg border transition-all text-sm
                                ${goalData.timeline === timeline.id
                                  ? 'border-[#03fd1c] bg-[#03fd1c]/20 text-[#03fd1c]'
                                  : 'border-[#252525] text-gray-400 hover:border-[#03fd1c]/50'
                                }
                              `}
                            >
                              {timeline.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeGoal(activeCategory, option)}
                        className="text-red-500 text-sm flex items-center gap-1 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Remove Goal
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Goal Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#141414] border border-[#252525] rounded-xl p-6 sticky top-4">
            <h3 className="text-white mb-4">Selected Goals ({selectedGoals.length})</h3>
            {selectedGoals.length === 0 ? (
              <p className="text-gray-500 text-sm">No goals selected yet. Choose 3-7 goals to create your plan.</p>
            ) : (
              <div className="space-y-3">
                {selectedGoals.map((goal, idx) => {
                  const category = GOAL_CATEGORIES.find(c => c.name === goal.category);
                  const Icon = category?.icon || Target;
                  return (
                    <div key={idx} className="p-3 bg-[#0a0a0a] rounded-lg border border-[#252525]">
                      <div className="flex items-start gap-2">
                        <Icon className="w-4 h-4 text-[#03fd1c] mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{goal.subcategory}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{goal.category}</span>
                            <span className="text-xs text-gray-600">•</span>
                            <span className="text-xs text-gray-400">P{goal.priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedGoals.length > 7 && (
              <p className="text-yellow-500 text-xs mt-4">
                ⚠️ 7+ goals selected. Consider focusing on 3-5 for better results.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-[#252525]">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="primary"
          onClick={handleSubmit}
          disabled={selectedGoals.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
