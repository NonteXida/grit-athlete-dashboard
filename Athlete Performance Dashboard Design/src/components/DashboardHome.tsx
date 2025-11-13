import React, { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import { ProgressRing } from './ProgressRing';
import { Calendar, Flame, Eye, TrendingUp, ChevronRight, Play, Target, Zap } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DashboardHomeProps {
  userData: any;
  onNavigate?: (page: string) => void;
  accessToken?: string;
}

export function DashboardHome({ userData, onNavigate, accessToken }: DashboardHomeProps) {
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [weeklyGoals, setWeeklyGoals] = useState([
    { label: 'Workouts', progress: 0, value: '0/5' },
    { label: 'Nutrition', progress: 0, value: '0/7' },
    { label: 'Recovery', progress: 0, value: '0/5' },
  ]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [hasGritPlan, setHasGritPlan] = useState(false);

  const upcomingWorkouts = [
    { day: 'Today', title: 'Upper Body Strength', time: '4:00 PM', exercises: 8 },
    { day: 'Tomorrow', title: 'Speed & Agility', time: '3:30 PM', exercises: 6 },
    { day: 'Friday', title: 'Lower Body Power', time: '4:00 PM', exercises: 7 },
  ];

  const recentHighlights = [
    { 
      id: 1, 
      title: 'Game Winning TD vs. Lincoln High',
      views: 1247,
      thumbnail: 'https://images.unsplash.com/photo-1657957746418-6a38df9e1ea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHBsYXllciUyMGFjdGlvbnxlbnwxfHx8fDE3NjIzODkzNzl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    { 
      id: 2, 
      title: 'Championship Game Highlights',
      views: 892,
      thumbnail: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzYyNDI1NDQ5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
  ];

  const motivationalQuotes = [
    "Champions are made when no one is watching.",
    "Hard work beats talent when talent doesn't work hard.",
    "Your only limit is you.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The difference between the impossible and the possible lies in determination."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  useEffect(() => {
    if (accessToken) {
      fetchStats();
      fetchWeeklyGoals();
      checkForGritPlan();
    }
  }, [accessToken]);

  async function fetchStats() {
    try {
      setLoadingStats(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/stats`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Failed to fetch stats:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  }

  async function fetchWeeklyGoals() {
    try {
      setLoadingGoals(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/weekly-goals`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWeeklyGoals(data.goals);
      } else {
        console.error('Failed to fetch weekly goals:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching weekly goals:', error);
    } finally {
      setLoadingGoals(false);
    }
  }

  async function checkForGritPlan() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eec32171/plan/check`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHasGritPlan(data.hasPlan);
      }
    } catch (error) {
      console.error('Error checking for GRIT plan:', error);
    }
  }

  // Default stats for when loading or no data
  const displayStats = stats || {
    daysTrainedThisWeek: { value: 0, trend: { value: 0, isPositive: true } },
    currentStreak: { value: '0 Days', trend: { value: 0, isPositive: true } },
    profileViews: { value: '0', trend: { value: 0, isPositive: true } },
    gritScore: { value: 0, trend: { value: 0, isPositive: true } }
  };

  return (
    <div className="space-y-8 animate-slide-in-up">
      {/* Hero Section */}
      <div className="relative h-80 rounded-2xl overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1759787851041-0d45d2b2db84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHRyYWluaW5nJTIwZ3ltfGVufDF8fHx8MTc2MjQzNDAyMHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-white mb-2">{userData.name}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span>{userData.sport}</span>
                <span>•</span>
                <span>{userData.school}</span>
                <span>•</span>
                <span>Class of {userData.gradYear}</span>
              </div>
            </div>
            <Button variant="primary" onClick={() => onNavigate?.('profile')}>
              View Profile
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingStats ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#141414] border border-[#252525] rounded-xl p-6 h-32 animate-pulse">
                <div className="h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-[#252525] rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-[#252525] rounded w-24" />
                    <div className="h-6 bg-[#252525] rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard 
              icon={Calendar} 
              label="Days Trained This Week" 
              value={displayStats.daysTrainedThisWeek.value} 
              trend={displayStats.daysTrainedThisWeek.trend}
            />
            <StatCard 
              icon={Flame} 
              label="Current Streak" 
              value={displayStats.currentStreak.value} 
              trend={displayStats.currentStreak.trend}
            />
            <StatCard 
              icon={Eye} 
              label="Profile Views" 
              value={displayStats.profileViews.value} 
              trend={displayStats.profileViews.trend}
            />
            <StatCard 
              icon={TrendingUp} 
              label="Grit Score" 
              value={displayStats.gritScore.value} 
              trend={displayStats.gritScore.trend}
            />
          </>
        )}
      </div>

      {/* GRIT Plan CTA or Motivational Quote */}
      {!hasGritPlan ? (
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
        <div className="bg-gradient-to-r from-[#03fd1c] to-[#02c916] rounded-2xl p-8 text-center">
          <p className="text-black text-xl italic">"{randomQuote}"</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Goals */}
        <div className="lg:col-span-1 bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <h3 className="text-white mb-6">Weekly Goals</h3>
          <div className="flex flex-col gap-6">
            {loadingGoals ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-[100px] h-[100px] bg-[#252525] rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-[#252525] rounded w-20" />
                      <div className="h-3 bg-[#252525] rounded w-12" />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              weeklyGoals.map((goal, idx) => (
                <ProgressRing
                  key={idx}
                  progress={goal.progress}
                  label={goal.label}
                  value={goal.value}
                  size={100}
                />
              ))
            )}
          </div>
        </div>

        {/* This Week's Training */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white">This Week's Training</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate?.('training')}>
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingWorkouts.map((workout, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#252525] rounded-xl hover:border-[#03fd1c] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#03fd1c]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-[#03fd1c]" />
                  </div>
                  <div>
                    <p className="text-white">{workout.title}</p>
                    <p className="text-gray-400">{workout.day} • {workout.time} • {workout.exercises} exercises</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Highlights */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white">Recent Highlights</h3>
          <Button variant="ghost" size="sm">
            Upload New
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentHighlights.map((highlight) => (
            <div 
              key={highlight.id}
              className="relative group cursor-pointer rounded-xl overflow-hidden"
            >
              <ImageWithFallback
                src={highlight.thumbnail}
                alt={highlight.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-[#03fd1c] rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-black ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white mb-1">{highlight.title}</p>
                <div className="flex items-center gap-2 text-gray-300">
                  <Eye className="w-4 h-4" />
                  <span>{highlight.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
