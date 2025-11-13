import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Calendar, Clock, Target, TrendingUp, CheckCircle, Circle, ChevronLeft, ChevronRight, BarChart, Activity, Zap } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface Session {
  id: string;
  day: string;
  type: string;
  name: string;
  duration: number;
  focusAreas: string[];
  intensity: 'low' | 'moderate' | 'high' | 'max';
  completed: boolean;
  exercises?: any[];
}

interface WeekData {
  week: number;
  phase: string;
  focus: string;
  sessions: Session[];
  volumeMinutes: number;
  intensityScore: number;
  compliance?: number;
}

interface PlanViewProps {
  accessToken: string;
  onSessionClick?: (session: Session) => void;
}

export function PlanView({ accessToken, onSessionClick }: PlanViewProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'year'>('week');
  const [currentWeekData, setCurrentWeekData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [totalWeeks, setTotalWeeks] = useState(12);

  useEffect(() => {
    fetchCurrentWeek();
  }, []);

  async function fetchCurrentWeek() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/plan/current-week`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentWeekData(data);
        setCurrentWeek(data.week);
        setTotalWeeks(data.totalWeeks);
      }
    } catch (error) {
      console.error('Error fetching current week:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markSessionComplete(sessionId: string) {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/plan/session/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sessionId,
            actualDuration: currentWeekData?.sessions.find(s => s.id === sessionId)?.duration,
            rpe: 7, // Rate of Perceived Exertion (1-10)
            notes: 'Completed successfully'
          })
        }
      );

      if (response.ok) {
        // Refresh the week data
        await fetchCurrentWeek();
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  }

  async function advanceWeek() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/plan/advance-week`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchCurrentWeek();
        }
      }
    } catch (error) {
      console.error('Error advancing week:', error);
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'max': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strength': return '💪';
      case 'conditioning': return '🏃';
      case 'skill': return '🎯';
      case 'power': return '⚡';
      case 'speed': return '🚀';
      case 'recovery': return '🧘';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-[#03fd1c] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!currentWeekData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No training plan found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="bg-[#141414] border border-[#252525] rounded-xl p-2 flex gap-2">
        {['week', 'month', 'year'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`flex-1 py-2 px-4 rounded-lg capitalize transition-all ${
              viewMode === mode
                ? 'bg-[#03fd1c] text-black font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {mode} View
          </button>
        ))}
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <>
          {/* Week Header */}
          <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white mb-1">Week {currentWeek} of {totalWeeks}</h2>
                <p className="text-gray-400">{currentWeekData.phase} Phase</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
                  disabled={currentWeek === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-white">Week {currentWeek}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(Math.min(totalWeeks, currentWeek + 1))}
                  disabled={currentWeek === totalWeeks}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0a] border border-[#252525] rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm">Focus</span>
                </div>
                <p className="text-white text-sm">{currentWeekData.focus}</p>
              </div>
              
              <div className="bg-[#0a0a0a] border border-[#252525] rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Volume</span>
                </div>
                <p className="text-white text-xl font-bold">{currentWeekData.volumeMinutes} min</p>
              </div>
              
              <div className="bg-[#0a0a0a] border border-[#252525] rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Intensity</span>
                </div>
                <p className="text-white text-xl font-bold">{currentWeekData.intensityScore}/10</p>
              </div>
              
              <div className="bg-[#0a0a0a] border border-[#252525] rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <BarChart className="w-4 h-4" />
                  <span className="text-sm">Compliance</span>
                </div>
                <p className="text-[#03fd1c] text-xl font-bold">{currentWeekData.compliance || 0}%</p>
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="space-y-4">
            {currentWeekData.sessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#141414] border border-[#252525] rounded-xl p-6 hover:border-[#03fd1c]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getTypeIcon(session.type)}</div>
                    <div>
                      <h3 className="text-white mb-1">{session.name}</h3>
                      <p className="text-gray-400 text-sm">{session.day} • {session.duration} minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getIntensityColor(session.intensity)}`}>
                      {session.intensity.toUpperCase()}
                    </span>
                    <button
                      onClick={() => markSessionComplete(session.id)}
                      className={`p-2 rounded-lg transition-all ${
                        session.completed
                          ? 'bg-[#03fd1c] text-black'
                          : 'bg-[#0a0a0a] border border-[#252525] text-gray-400 hover:border-[#03fd1c]'
                      }`}
                    >
                      {session.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {session.focusAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#0a0a0a] border border-[#252525] rounded-full text-gray-300 text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSessionClick?.(session)}
                  className="w-full"
                >
                  <Activity className="w-4 h-4" />
                  View Workout Details
                </Button>
              </div>
            ))}
          </div>

          {/* Week Actions */}
          <div className="flex justify-between gap-4">
            <Button variant="outline" size="lg">
              Modify This Week
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              onClick={advanceWeek}
              disabled={currentWeek >= totalWeeks}
            >
              Complete Week & Continue
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
          <h3 className="text-white mb-6">Month Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((week) => {
              const weekNum = (Math.floor((currentWeek - 1) / 4) * 4) + week;
              return (
                <div
                  key={week}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    weekNum === currentWeek
                      ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                      : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
                  }`}
                  onClick={() => setCurrentWeek(weekNum)}
                >
                  <p className="text-white font-medium mb-2">Week {weekNum}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sessions</span>
                      <span className="text-white">5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Compliance</span>
                      <span className="text-[#03fd1c]">80%</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 bg-[#252525] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#03fd1c] to-[#02c916]"
                      style={{ width: '80%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Year View */}
      {viewMode === 'year' && (
        <div className="bg-[#141414] border border-[#252525] rounded-xl p-6">
          <h3 className="text-white mb-6">Annual Training Plan</h3>
          <div className="space-y-4">
            {['Pre-Season', 'In-Season', 'Post-Season', 'Off-Season'].map((phase, idx) => (
              <div key={phase} className="flex items-center gap-4">
                <div className="w-32">
                  <p className="text-white font-medium">{phase}</p>
                  <p className="text-gray-400 text-sm">Weeks {idx * 3 + 1}-{(idx + 1) * 3}</p>
                </div>
                <div className="flex-1 h-12 bg-[#0a0a0a] border border-[#252525] rounded-lg p-2">
                  <div 
                    className={`h-full rounded ${
                      idx === 0 ? 'bg-gradient-to-r from-green-500 to-yellow-500' :
                      idx === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      idx === 2 ? 'bg-gradient-to-r from-orange-500 to-blue-500' :
                      'bg-gradient-to-r from-blue-500 to-green-500'
                    }`}
                    style={{ width: `${((idx + 1) * 3 / totalWeeks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
