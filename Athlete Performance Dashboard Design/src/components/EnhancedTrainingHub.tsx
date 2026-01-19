import React, { useState, useEffect } from 'react';
import { Calendar, Dumbbell, Plus, TrendingUp, Clock, CheckCircle2, Circle, BookOpen, Activity, ChevronRight, Target, Brain, BarChart3, FileText, Zap, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { WorkoutLogger } from './WorkoutLogger';
import { PracticeGameJournalComponent } from './ImprovedPracticeGameJournal';
import { supabase, workoutHelpers, journalHelpers, type WorkoutLog, type PracticeGameJournal } from '../lib/supabase';

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  plan_type: string;
  plan_data: any;
  status: string;
  created_at: string;
  ai_generated: boolean;
}

interface EnhancedTrainingHubProps {
  userId: string;
  onNavigate?: (page: string) => void;
}

export function EnhancedTrainingHub({ userId, onNavigate }: EnhancedTrainingHubProps) {
  const [activeView, setActiveView] = useState<'overview' | 'workout' | 'journal' | 'history'>('overview');
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  const [todaysWorkout, setTodaysWorkout] = useState<any>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutLog[]>([]);
  const [recentJournals, setRecentJournals] = useState<PracticeGameJournal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showLogger, setShowLogger] = useState(false);
  const [showJournal, setShowJournal] = useState(false);

  // Fetch current training plan
  useEffect(() => {
    fetchCurrentPlan();
    fetchRecentActivity();
  }, [userId]);

  async function fetchCurrentPlan() {
    try {
      const { data, error } = await supabase
        .from('training_plans')
        .select('*')
        .eq('athlete_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setCurrentPlan(data);
        determineTodaysWorkout(data);
      }
    } catch (error) {
      console.error('Error fetching training plan:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentActivity() {
    try {
      const [workouts, journals] = await Promise.all([
        workoutHelpers.getRecentWorkouts(userId, 7),
        journalHelpers.getRecentJournals(userId, 5)
      ]);

      setRecentWorkouts(workouts || []);
      setRecentJournals(journals || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  }

  function determineTodaysWorkout(plan: TrainingPlan) {
    if (!plan.plan_data?.weeks) return;

    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today.getDay()];

    // Get current week (simplified - you'd calculate based on plan start date)
    const currentWeek = plan.plan_data.weeks[0]; // For now, use week 1

    if (currentWeek?.workouts) {
      const workout = currentWeek.workouts.find((w: any) => w.day === todayName);
      setTodaysWorkout(workout);
    }
  }

  const quickActions = [
    {
      icon: Dumbbell,
      label: 'Log Workout',
      color: 'bg-blue-500',
      onClick: () => setShowLogger(true)
    },
    {
      icon: FileText,
      label: 'Journal Practice',
      color: 'bg-purple-500',
      onClick: () => setShowJournal(true)
    },
    {
      icon: Target,
      label: 'View Plan',
      color: 'bg-green-500',
      onClick: () => setActiveView('workout')
    },
    {
      icon: BarChart3,
      label: 'See Progress',
      color: 'bg-orange-500',
      onClick: () => setActiveView('history')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#03fd1c] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-white mb-2">Training Hub</h1>
          <p className="text-gray-400">
            {currentPlan ? `Active Plan: ${currentPlan.name}` : 'No active training plan'}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex gap-2">
          {['overview', 'workout', 'journal', 'history'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                activeView === view
                  ? 'bg-[#03fd1c] text-black'
                  : 'bg-[#141414] text-gray-400 hover:bg-[#1a1a1a]'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="bg-[#141414] border border-[#252525] rounded-xl p-6 hover:border-[#03fd1c] transition-all group"
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium">{action.label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Today's Workout Preview */}
      {activeView === 'overview' && todaysWorkout && (
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-white text-xl mb-1">Today's Workout</h3>
              <p className="text-gray-400">{todaysWorkout.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">{todaysWorkout.duration_minutes} min</span>
            </div>
          </div>

          {/* Exercises Preview */}
          <div className="space-y-2 mb-4">
            {todaysWorkout.exercises?.slice(0, 3).map((exercise: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <span className="text-gray-300">{exercise.name}</span>
                <span className="text-gray-500 text-sm">
                  {exercise.sets} × {exercise.reps} {exercise.weight ? `@ ${exercise.weight}lbs` : ''}
                </span>
              </div>
            ))}
            {todaysWorkout.exercises?.length > 3 && (
              <p className="text-gray-500 text-sm">+{todaysWorkout.exercises.length - 3} more exercises</p>
            )}
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              setSelectedWorkout(todaysWorkout);
              setShowLogger(true);
            }}
          >
            Start Workout
          </Button>
        </div>
      )}

      {/* Full Workout View */}
      {activeView === 'workout' && (
        <div className="space-y-6">
          {!currentPlan ? (
            // Show GRIT Plan CTA when no plan exists
            <div className="bg-gradient-to-r from-[#03fd1c] to-[#02c916] rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h3 className="text-black mb-1">Ready to Level Up?</h3>
                    <p className="text-black/80">
                      Build your personalized GRIT training plan in 5 minutes
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate?.('planBuilder')}
                  className="bg-black text-[#03fd1c] hover:bg-black/90 border-black whitespace-nowrap"
                >
                  <Target className="w-5 h-5" />
                  Build My Plan
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#03fd1c]" />
                    <span className="text-[#03fd1c] text-sm">AI Generated Plan</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to rebuild your training plan? This will replace your current plan.')) {
                        onNavigate?.('planBuilder');
                      }
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Rebuild Plan
                  </Button>
                </div>
                <h2 className="text-white text-2xl mb-2">{currentPlan.name}</h2>
                <p className="text-gray-400 mb-4">{currentPlan.description}</p>

            {/* Plan Details */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-1">Duration</p>
                <p className="text-white text-xl">{currentPlan.duration_weeks} weeks</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-1">Type</p>
                <p className="text-white text-xl capitalize">{currentPlan.plan_type}</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <p className="text-gray-500 text-sm mb-1">Status</p>
                <p className="text-[#03fd1c] text-xl capitalize">{currentPlan.status}</p>
              </div>
            </div>

            {/* Weekly Schedule */}
            {currentPlan.plan_data?.weeks?.map((week: any, weekIdx: number) => (
              <div key={weekIdx} className="mb-6">
                <h3 className="text-white text-lg mb-3">Week {week.week_number}: {week.focus}</h3>
                <div className="space-y-3">
                  {week.workouts?.map((workout: any, workoutIdx: number) => {
                    const [isExpanded, setIsExpanded] = useState(false);

                    return (
                    <div
                      key={workoutIdx}
                      className="bg-[#0a0a0a] rounded-lg p-4 transition-all"
                    >
                      <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{workout.day}</span>
                            <span className="text-white font-medium">{workout.name}</span>
                            <span className="text-gray-500 text-sm">({workout.duration_minutes} min)</span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">
                            {workout.exercises?.length || 0} exercises • {workout.type}
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>

                      {/* Expanded Exercise Details */}
                      {isExpanded && workout.exercises && (
                        <div className="mt-4 pt-4 border-t border-[#252525] space-y-3">
                          {workout.warmup && (
                            <div className="mb-3">
                              <p className="text-[#03fd1c] text-sm font-medium mb-1">Warmup</p>
                              <p className="text-gray-400 text-sm">{workout.warmup}</p>
                            </div>
                          )}

                          {workout.exercises.map((exercise: any, exIdx: number) => (
                            <div key={exIdx} className="bg-[#141414] rounded p-3">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-white">{exercise.name}</span>
                                <span className="text-[#03fd1c] text-sm">{exercise.sets} × {exercise.reps}</span>
                              </div>
                              {exercise.rest_seconds && (
                                <p className="text-gray-500 text-xs">Rest: {exercise.rest_seconds}s</p>
                              )}
                              {exercise.notes && (
                                <p className="text-gray-400 text-sm mt-1">{exercise.notes}</p>
                              )}
                            </div>
                          ))}

                          {workout.cooldown && (
                            <div className="mt-3">
                              <p className="text-[#03fd1c] text-sm font-medium mb-1">Cooldown</p>
                              <p className="text-gray-400 text-sm">{workout.cooldown}</p>
                            </div>
                          )}

                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full mt-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWorkout(workout);
                              setShowLogger(true);
                            }}
                          >
                            Start This Workout
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  )}
                </div>
              </div>
            ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Journal View */}
      {activeView === 'journal' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-white text-xl">Practice & Game Journals</h2>
            <Button variant="primary" onClick={() => setShowJournal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </div>

          {recentJournals.length > 0 ? (
            <div className="space-y-4">
              {recentJournals.map((journal) => (
                <div key={journal.id} className="bg-[#141414] border border-[#252525] rounded-xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-white capitalize">{journal.event_type}</h3>
                      <p className="text-gray-500 text-sm">{new Date(journal.event_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Performance</span>
                      <span className="text-[#03fd1c] font-bold">{journal.performance_rating}/10</span>
                    </div>
                  </div>
                  {journal.what_went_well && (
                    <p className="text-gray-400 text-sm mb-2">
                      <span className="text-green-500">Went well:</span> {journal.what_went_well}
                    </p>
                  )}
                  {journal.what_to_improve && (
                    <p className="text-gray-400 text-sm">
                      <span className="text-orange-500">To improve:</span> {journal.what_to_improve}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#252525] rounded-xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No journal entries yet</p>
              <p className="text-gray-500 text-sm mt-2">Start tracking your practices and games</p>
            </div>
          )}
        </div>
      )}

      {/* History View */}
      {activeView === 'history' && (
        <div className="space-y-6">
          <h2 className="text-white text-xl">Workout History</h2>

          {recentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {recentWorkouts.map((workout) => (
                <div key={workout.id} className="bg-[#141414] border border-[#252525] rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white">{new Date(workout.workout_date).toLocaleDateString()}</p>
                      <p className="text-gray-500 text-sm capitalize">Status: {workout.completion_status}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">RPE: </span>
                        <span className="text-white">{workout.rpe}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Energy: </span>
                        <span className="text-white">{workout.energy_level}/10</span>
                      </div>
                    </div>
                  </div>
                  {workout.notes && (
                    <p className="text-gray-400 text-sm mt-3">{workout.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#252525] rounded-xl p-12 text-center">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No workout history yet</p>
              <p className="text-gray-500 text-sm mt-2">Complete your first workout to see progress</p>
            </div>
          )}
        </div>
      )}

      {/* Workout Logger Modal */}
      {showLogger && selectedWorkout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <WorkoutLogger
              userId={userId}
              planId={currentPlan?.id}
              prescribedWorkout={selectedWorkout}
              onComplete={() => {
                setShowLogger(false);
                setSelectedWorkout(null);
                fetchRecentActivity();
              }}
            />
          </div>
        </div>
      )}

      {/* Journal Modal */}
      {showJournal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-12 overflow-y-auto">
          <div className="bg-[#141414] border border-[#252525] rounded-xl max-w-3xl w-full my-8">
            <PracticeGameJournalComponent
              userId={userId}
              onComplete={() => {
                setShowJournal(false);
                fetchRecentActivity();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}