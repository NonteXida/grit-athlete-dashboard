import React, { useState } from 'react';
import { Calendar, Dumbbell, Plus, TrendingUp, Clock, CheckCircle2, Circle } from 'lucide-react';
import { Button } from './Button';

interface TrainingHubProps {
  onSaveWorkout: (workout: any) => void;
}

export function TrainingHub({ onSaveWorkout }: TrainingHubProps) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showLogger, setShowLogger] = useState(false);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const workoutSchedule = {
    Monday: {
      name: 'Upper Body Strength',
      duration: '60 min',
      completed: true,
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 8, weight: 185, completed: true },
        { name: 'Dumbbell Rows', sets: 4, reps: 10, weight: 70, completed: true },
        { name: 'Shoulder Press', sets: 3, reps: 10, weight: 95, completed: true },
        { name: 'Pull-ups', sets: 3, reps: 12, weight: 0, completed: true },
      ]
    },
    Tuesday: {
      name: 'Speed & Agility',
      duration: '45 min',
      completed: true,
      exercises: [
        { name: '40-Yard Dash', sets: 5, reps: 1, weight: 0, completed: true },
        { name: 'Cone Drills', sets: 4, reps: 1, weight: 0, completed: true },
        { name: 'Box Jumps', sets: 3, reps: 10, weight: 0, completed: true },
      ]
    },
    Wednesday: {
      name: 'Lower Body Power',
      duration: '60 min',
      completed: false,
      exercises: [
        { name: 'Squats', sets: 4, reps: 8, weight: 225, completed: false },
        { name: 'Deadlifts', sets: 3, reps: 6, weight: 275, completed: false },
        { name: 'Leg Press', sets: 4, reps: 10, weight: 360, completed: false },
        { name: 'Lunges', sets: 3, reps: 12, weight: 40, completed: false },
      ]
    },
    Thursday: {
      name: 'Active Recovery',
      duration: '30 min',
      completed: false,
      exercises: [
        { name: 'Yoga Flow', sets: 1, reps: 30, weight: 0, completed: false },
        { name: 'Foam Rolling', sets: 1, reps: 15, weight: 0, completed: false },
      ]
    },
    Friday: {
      name: 'Full Body Circuit',
      duration: '50 min',
      completed: false,
      exercises: [
        { name: 'Clean & Press', sets: 4, reps: 6, weight: 135, completed: false },
        { name: 'Burpees', sets: 3, reps: 15, weight: 0, completed: false },
        { name: 'Kettlebell Swings', sets: 4, reps: 20, weight: 45, completed: false },
      ]
    },
    Saturday: {
      name: 'Sport-Specific Drills',
      duration: '90 min',
      completed: false,
      exercises: []
    },
    Sunday: {
      name: 'Rest Day',
      duration: '0 min',
      completed: false,
      exercises: []
    }
  };

  const currentWorkout = workoutSchedule[selectedDay as keyof typeof workoutSchedule];

  const progressData = [
    { exercise: 'Bench Press', current: 185, start: 155, goal: 225 },
    { exercise: 'Squat', current: 225, start: 185, goal: 275 },
    { exercise: 'Deadlift', current: 275, start: 225, goal: 315 },
    { exercise: '40-Yard Dash', current: 4.6, start: 4.9, goal: 4.4 },
  ];

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-white mb-2">Training Hub</h2>
          <p className="text-gray-400">Track your workouts and monitor your progress</p>
        </div>
        <Button variant="primary" onClick={() => setShowLogger(true)}>
          <Plus className="w-5 h-5" />
          Log Workout
        </Button>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6 text-[#03fd1c]" />
          <h3 className="text-white">This Week's Schedule</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const workout = workoutSchedule[day as keyof typeof workoutSchedule];
            const isSelected = selectedDay === day;
            const isCompleted = workout.completed;
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${isSelected 
                    ? 'border-[#03fd1c] bg-[#03fd1c]/10' 
                    : 'border-[#252525] hover:border-[#03fd1c]/50'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">{day.slice(0, 3)}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#03fd1c]" />}
                </div>
                <p className="text-gray-400 text-xs">{workout.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white mb-1">{currentWorkout.name}</h3>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{currentWorkout.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  <span>{currentWorkout.exercises.length} exercises</span>
                </div>
              </div>
            </div>
            {currentWorkout.exercises.length > 0 && (
              <div className="text-right">
                <div className="text-[#03fd1c] text-2xl">
                  {currentWorkout.exercises.filter(e => e.completed).length}/{currentWorkout.exercises.length}
                </div>
                <p className="text-gray-400">Completed</p>
              </div>
            )}
          </div>

          {currentWorkout.exercises.length > 0 ? (
            <div className="space-y-3">
              {currentWorkout.exercises.map((exercise, idx) => (
                <div 
                  key={idx}
                  className={`
                    p-4 rounded-lg border transition-all
                    ${exercise.completed 
                      ? 'bg-[#03fd1c]/5 border-[#03fd1c]/30' 
                      : 'bg-[#0a0a0a] border-[#252525]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {exercise.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#03fd1c]" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600" />
                      )}
                      <div>
                        <p className="text-white">{exercise.name}</p>
                        <p className="text-gray-400">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                        </p>
                      </div>
                    </div>
                    {!exercise.completed && (
                      <Button variant="outline" size="sm">
                        Log Set
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">{currentWorkout.name}</p>
            </div>
          )}
        </div>

        {/* Progress Tracking */}
        <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-[#03fd1c]" />
            <h3 className="text-white">Progress</h3>
          </div>
          <div className="space-y-6">
            {progressData.map((item, idx) => {
              const progress = ((item.current - item.start) / (item.goal - item.start)) * 100;
              
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white">{item.exercise}</p>
                    <span className="text-[#03fd1c]">{item.current}</span>
                  </div>
                  <div className="w-full bg-[#252525] rounded-full h-2 mb-1">
                    <div 
                      className="bg-[#03fd1c] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Start: {item.start}</span>
                    <span>Goal: {item.goal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Exercise Library Preview */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white">Exercise Library</h3>
          <Button variant="ghost" size="sm">
            Browse All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Upper Body', 'Lower Body', 'Core', 'Cardio', 'Sport-Specific', 'Flexibility'].map((category, idx) => (
            <div 
              key={idx}
              className="p-4 bg-[#0a0a0a] border border-[#252525] rounded-lg hover:border-[#03fd1c] transition-all cursor-pointer"
            >
              <Dumbbell className="w-8 h-8 text-[#03fd1c] mb-2" />
              <p className="text-white">{category}</p>
              <p className="text-gray-400">12-24 exercises</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
