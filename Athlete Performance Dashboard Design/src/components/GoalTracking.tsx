import React, { useState } from 'react';
import { Target, Trophy, TrendingUp, Plus, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { Button } from './Button';

export function GoalTracking() {
  const [showCreateGoal, setShowCreateGoal] = useState(false);

  const activeGoals = [
    {
      id: 1,
      title: 'Bench Press 225 lbs',
      category: 'Strength',
      current: 185,
      target: 225,
      unit: 'lbs',
      deadline: '2024-12-31',
      progress: 82,
      milestones: [
        { value: 195, achieved: true, date: '2024-10-15' },
        { value: 205, achieved: true, date: '2024-10-22' },
        { value: 215, achieved: false, date: null },
        { value: 225, achieved: false, date: null },
      ],
      coachFeedback: [
        { coach: 'Coach Johnson', message: 'Great progress! Focus on form over weight.', date: '2024-11-01' }
      ]
    },
    {
      id: 2,
      title: 'Run 40-yard dash in 4.4 seconds',
      category: 'Speed',
      current: 4.6,
      target: 4.4,
      unit: 'seconds',
      deadline: '2024-12-15',
      progress: 67,
      milestones: [
        { value: 4.7, achieved: true, date: '2024-09-20' },
        { value: 4.6, achieved: true, date: '2024-10-18' },
        { value: 4.5, achieved: false, date: null },
        { value: 4.4, achieved: false, date: null },
      ],
      coachFeedback: []
    },
    {
      id: 3,
      title: 'Maintain 3.5+ GPA',
      category: 'Academic',
      current: 3.4,
      target: 3.5,
      unit: 'GPA',
      deadline: '2024-12-20',
      progress: 97,
      milestones: [],
      coachFeedback: []
    },
  ];

  const completedGoals = [
    {
      title: 'Complete 30 consecutive workouts',
      completedDate: '2024-10-30',
      category: 'Consistency'
    },
    {
      title: 'Squat 275 lbs',
      completedDate: '2024-10-15',
      category: 'Strength'
    },
  ];

  const achievements = [
    { name: 'Iron Will', description: 'Complete 50 workouts', icon: '🏋️', unlocked: true },
    { name: 'Speed Demon', description: 'Run under 4.5s 40-yard', icon: '⚡', unlocked: true },
    { name: 'Scholar Athlete', description: 'Maintain 3.5+ GPA', icon: '📚', unlocked: false },
    { name: 'Team Captain', description: 'Lead 10 team workouts', icon: '👑', unlocked: true },
    { name: 'Consistency King', description: '100 day workout streak', icon: '🔥', unlocked: false },
  ];

  const gritScore = {
    overall: 87,
    consistency: 92,
    improvement: 85,
    effort: 88,
    accountability: 83
  };

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-white mb-2">Goal Tracking</h2>
          <p className="text-gray-400">Set targets, track progress, and achieve greatness</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateGoal(!showCreateGoal)}>
          <Plus className="w-5 h-5" />
          Create Goal
        </Button>
      </div>

      {/* Grit Score */}
      <div className="bg-gradient-to-r from-[#03fd1c] to-[#02c916] rounded-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-black mb-2">Your Grit Score</h3>
            <p className="text-black/80">A measure of your dedication, consistency, and growth mindset</p>
          </div>
          <div className="text-center">
            <div className="text-6xl text-black mb-2">{gritScore.overall}</div>
            <div className="flex gap-4 text-black/80">
              <div className="text-center">
                <div className="text-2xl">{gritScore.consistency}</div>
                <div className="text-xs">Consistency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">{gritScore.improvement}</div>
                <div className="text-xs">Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">{gritScore.effort}</div>
                <div className="text-xs">Effort</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-6 h-6 text-[#03fd1c]" />
          <h3 className="text-white">Active Goals</h3>
        </div>
        <div className="space-y-6">
          {activeGoals.map((goal) => (
            <div key={goal.id} className="bg-[#0a0a0a] border border-[#252525] rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white">{goal.title}</h4>
                    <span className="px-3 py-1 bg-[#03fd1c]/10 text-[#03fd1c] rounded-full text-xs">
                      {goal.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>{goal.current} / {goal.target} {goal.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#03fd1c] text-3xl mb-1">{goal.progress}%</div>
                  <p className="text-gray-400">Complete</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#252525] rounded-full h-3 mb-4">
                <div 
                  className="bg-[#03fd1c] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              {/* Milestones */}
              {goal.milestones.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-400 mb-3">Milestones</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {goal.milestones.map((milestone, idx) => (
                      <div 
                        key={idx}
                        className={`
                          p-3 rounded-lg border
                          ${milestone.achieved 
                            ? 'bg-[#03fd1c]/10 border-[#03fd1c]' 
                            : 'bg-[#141414] border-[#252525]'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {milestone.achieved ? (
                            <CheckCircle2 className="w-4 h-4 text-[#03fd1c]" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-white">{milestone.value} {goal.unit}</span>
                        </div>
                        {milestone.date && (
                          <p className="text-gray-400 text-xs">{new Date(milestone.date).toLocaleDateString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coach Feedback */}
              {goal.coachFeedback.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#252525]">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-[#03fd1c]" />
                    <p className="text-gray-400">Coach Feedback</p>
                  </div>
                  {goal.coachFeedback.map((feedback, idx) => (
                    <div key={idx} className="bg-[#141414] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white">{feedback.coach}</p>
                        <p className="text-gray-500 text-xs">{new Date(feedback.date).toLocaleDateString()}</p>
                      </div>
                      <p className="text-gray-300">{feedback.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Goals */}
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-6 h-6 text-[#03fd1c]" />
            <h3 className="text-white">Completed Goals</h3>
          </div>
          <div className="space-y-3">
            {completedGoals.map((goal, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-[#03fd1c] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white">{goal.title}</p>
                  <p className="text-gray-400 text-sm">
                    {goal.category} • Completed {new Date(goal.completedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-[#03fd1c]" />
            <h3 className="text-white">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, idx) => (
              <div 
                key={idx}
                className={`
                  p-4 rounded-lg border text-center
                  ${achievement.unlocked 
                    ? 'bg-[#03fd1c]/10 border-[#03fd1c]' 
                    : 'bg-[#0a0a0a] border-[#252525] opacity-50'
                  }
                `}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="text-white mb-1">{achievement.name}</p>
                <p className="text-gray-400 text-xs">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Check-in */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <h3 className="text-white mb-4">Weekly Check-in</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 block mb-2">How are you feeling about your progress?</label>
            <div className="flex gap-3">
              {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, idx) => (
                <button 
                  key={idx}
                  className="w-12 h-12 bg-[#0a0a0a] border border-[#252525] rounded-lg hover:border-[#03fd1c] transition-all text-2xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-gray-400 block mb-2">What challenges did you face this week?</label>
            <textarea 
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg p-4 text-white resize-none"
              rows={3}
              placeholder="Share your thoughts..."
            />
          </div>
          <Button variant="primary" className="w-full md:w-auto">
            Submit Check-in
          </Button>
        </div>
      </div>
    </div>
  );
}
