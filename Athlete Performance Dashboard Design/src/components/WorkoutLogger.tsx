import React, { useState } from 'react';
import { Calendar, Clock, Activity, TrendingUp, AlertCircle, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import { workoutHelpers, type WorkoutLog } from '../lib/supabase';

interface WorkoutLoggerProps {
  userId: string;
  planId?: number;
  prescribedWorkout?: any; // The planned workout from the training plan
  onComplete: (workout: WorkoutLog) => void;
}

export function WorkoutLogger({ userId, planId, prescribedWorkout, onComplete }: WorkoutLoggerProps) {
  const [workout, setWorkout] = useState<Partial<WorkoutLog>>({
    athlete_id: userId,
    plan_id: planId,
    workout_date: new Date().toISOString().split('T')[0],
    workout_type: prescribedWorkout?.type || '',
    workout_name: prescribedWorkout?.name || '',
    exercises_completed: [],
    completion_status: 'completed',
    pre_workout_state: {},
    post_workout_recovery: {}
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
    rest: 0,
    notes: ''
  });

  const [showPreWorkout, setShowPreWorkout] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleAddExercise = () => {
    if (currentExercise.name) {
      setWorkout({
        ...workout,
        exercises_completed: [...(workout.exercises_completed || []), currentExercise]
      });
      setCurrentExercise({
        name: '',
        sets: 0,
        reps: 0,
        weight: 0,
        rest: 0,
        notes: ''
      });
    }
  };

  const handleSaveWorkout = async () => {
    setSaving(true);
    try {
      const workoutId = await workoutHelpers.saveWorkout(workout as WorkoutLog);
      if (workoutId) {
        onComplete({ ...workout, id: workoutId } as WorkoutLog);
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setSaving(false);
    }
  };

  const completionStatusOptions = [
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-500' },
    { value: 'partial', label: 'Partial', icon: AlertCircle, color: 'text-yellow-500' },
    { value: 'failed', label: 'Failed', icon: XCircle, color: 'text-red-500' },
    { value: 'modified', label: 'Modified', icon: Edit3, color: 'text-blue-500' }
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-[#03fd1c]" />
        Log Your Workout
      </h2>

      {/* Pre-Workout Assessment */}
      {showPreWorkout && (
        <div className="mb-6 p-4 bg-[#141414] rounded-lg">
          <h3 className="text-[#03fd1c] font-semibold mb-4">Pre-Workout Check-In</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Sleep Quality (hours)</label>
              <input
                type="number"
                min="0"
                max="12"
                step="0.5"
                className="bg-[#0a0a0a] border border-[#252525] rounded px-3 py-2 text-white w-full"
                onChange={(e) => setWorkout({
                  ...workout,
                  pre_workout_state: {
                    ...workout.pre_workout_state,
                    sleep_hours: parseFloat(e.target.value)
                  }
                })}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Energy Level (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="bg-[#0a0a0a] border border-[#252525] rounded px-3 py-2 text-white w-full"
                onChange={(e) => setWorkout({
                  ...workout,
                  energy_level: parseInt(e.target.value)
                })}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Soreness Level (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="bg-[#0a0a0a] border border-[#252525] rounded px-3 py-2 text-white w-full"
                onChange={(e) => setWorkout({
                  ...workout,
                  soreness_level: parseInt(e.target.value)
                })}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-gray-400 text-sm block mb-2">Any concerns or limitations?</label>
            <textarea
              className="bg-[#0a0a0a] border border-[#252525] rounded px-3 py-2 text-white w-full"
              rows={2}
              placeholder="e.g., tight hamstrings, feeling fatigued..."
              onChange={(e) => setWorkout({
                ...workout,
                pre_workout_state: {
                  ...workout.pre_workout_state,
                  concerns: e.target.value
                }
              })}
            />
          </div>

          <button
            onClick={() => setShowPreWorkout(false)}
            className="mt-4 bg-[#03fd1c] text-black px-4 py-2 rounded font-semibold hover:bg-[#00e617]"
          >
            Continue to Workout
          </button>
        </div>
      )}

      {/* Workout Details */}
      {!showPreWorkout && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Workout Date</label>
              <input
                type="date"
                value={workout.workout_date}
                onChange={(e) => setWorkout({ ...workout, workout_date: e.target.value })}
                className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={workout.duration_minutes || ''}
                onChange={(e) => setWorkout({ ...workout, duration_minutes: parseInt(e.target.value) })}
                className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
              />
            </div>
          </div>

          {/* Completion Status */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm block mb-2">Completion Status</label>
            <div className="flex gap-2">
              {completionStatusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setWorkout({ ...workout, completion_status: option.value as any })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    workout.completion_status === option.value
                      ? 'border-[#03fd1c] bg-[#03fd1c]/10'
                      : 'border-[#252525] bg-[#141414]'
                  }`}
                >
                  <option.icon className={`w-4 h-4 ${option.color}`} />
                  <span className={workout.completion_status === option.value ? 'text-white' : 'text-gray-400'}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>

            {(workout.completion_status === 'partial' || workout.completion_status === 'modified') && (
              <input
                type="text"
                placeholder="Reason for modification..."
                className="mt-2 bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                onChange={(e) => setWorkout({ ...workout, modification_reason: e.target.value })}
              />
            )}
          </div>

          {/* Exercise Tracking */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Exercises Completed</h3>

            {/* Add Exercise Form */}
            <div className="bg-[#141414] p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={currentExercise.name}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                  className="bg-[#0a0a0a] border border-[#252525] rounded px-2 py-1 text-white"
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={currentExercise.sets || ''}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) })}
                  className="bg-[#0a0a0a] border border-[#252525] rounded px-2 py-1 text-white"
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={currentExercise.reps || ''}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, reps: parseInt(e.target.value) })}
                  className="bg-[#0a0a0a] border border-[#252525] rounded px-2 py-1 text-white"
                />
                <input
                  type="number"
                  placeholder="Weight (lbs)"
                  value={currentExercise.weight || ''}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, weight: parseFloat(e.target.value) })}
                  className="bg-[#0a0a0a] border border-[#252525] rounded px-2 py-1 text-white"
                />
                <button
                  onClick={handleAddExercise}
                  className="bg-[#03fd1c] text-black px-3 py-1 rounded font-semibold hover:bg-[#00e617]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Exercise List */}
            {workout.exercises_completed && workout.exercises_completed.length > 0 && (
              <div className="space-y-2">
                {workout.exercises_completed.map((exercise, index) => (
                  <div key={index} className="bg-[#141414] p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="text-white font-semibold">{exercise.name}</span>
                      <span className="text-gray-400 ml-2">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight > 0 && ` @ ${exercise.weight} lbs`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Performance Feedback</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">RPE (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                  onChange={(e) => setWorkout({ ...workout, rpe: parseInt(e.target.value) })}
                />
                <p className="text-xs text-gray-500 mt-1">1=Very Easy, 10=Maximum Effort</p>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Motivation Level (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                  onChange={(e) => setWorkout({ ...workout, motivation_level: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Perceived Difficulty (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                  onChange={(e) => setWorkout({ ...workout, perceived_difficulty: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-gray-400 text-sm block mb-2">Technique Notes</label>
              <textarea
                className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                rows={2}
                placeholder="Any form issues or technique improvements..."
                onChange={(e) => setWorkout({ ...workout, technique_notes: e.target.value })}
              />
            </div>

            <div className="mt-4">
              <label className="text-gray-400 text-sm block mb-2">General Notes</label>
              <textarea
                className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                rows={3}
                placeholder="How did the workout feel? Any adjustments needed?..."
                onChange={(e) => setWorkout({ ...workout, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Recovery Plans */}
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-4">Post-Workout Recovery</h3>
            <div className="flex flex-wrap gap-2">
              {['Stretching', 'Foam Rolling', 'Ice Bath', 'Massage', 'Compression', 'Hydration', 'Protein Shake'].map(method => (
                <button
                  key={method}
                  onClick={() => {
                    const current = workout.post_workout_recovery?.methods || [];
                    const updated = current.includes(method)
                      ? current.filter((m: string) => m !== method)
                      : [...current, method];
                    setWorkout({
                      ...workout,
                      post_workout_recovery: {
                        ...workout.post_workout_recovery,
                        methods: updated
                      }
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    workout.post_workout_recovery?.methods?.includes(method)
                      ? 'bg-[#03fd1c] text-black'
                      : 'bg-[#141414] text-gray-400 border border-[#252525]'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowPreWorkout(true)}
              className="px-6 py-2 bg-[#141414] text-gray-400 rounded-lg hover:bg-[#252525]"
            >
              Back
            </button>
            <button
              onClick={handleSaveWorkout}
              disabled={saving}
              className="px-6 py-2 bg-[#03fd1c] text-black rounded-lg font-semibold hover:bg-[#00e617] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Workout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}