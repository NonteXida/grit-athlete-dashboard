import React, { useState } from 'react';
import { Button } from '../Button';
import { ChevronRight, ChevronLeft, Calendar, Clock, Sun, Moon, Cloud } from 'lucide-react';

interface ScheduleStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function ScheduleStep({ data, onNext, onBack }: ScheduleStepProps) {
  const [trainingDays, setTrainingDays] = useState(data.trainingDays || []);
  const [preferredTime, setPreferredTime] = useState(data.preferredTime || '');
  const [sessionDuration, setSessionDuration] = useState(data.sessionDuration || '60');
  const [competitionSchedule, setCompetitionSchedule] = useState(data.competitionSchedule || '');

  const weekDays = [
    { id: 'monday', label: 'Mon', full: 'Monday' },
    { id: 'tuesday', label: 'Tue', full: 'Tuesday' },
    { id: 'wednesday', label: 'Wed', full: 'Wednesday' },
    { id: 'thursday', label: 'Thu', full: 'Thursday' },
    { id: 'friday', label: 'Fri', full: 'Friday' },
    { id: 'saturday', label: 'Sat', full: 'Saturday' },
    { id: 'sunday', label: 'Sun', full: 'Sunday' }
  ];

  const timePreferences = [
    { id: 'early-morning', label: 'Early Morning', time: '5:00 AM - 8:00 AM', icon: Sun },
    { id: 'morning', label: 'Morning', time: '8:00 AM - 12:00 PM', icon: Sun },
    { id: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM', icon: Cloud },
    { id: 'evening', label: 'Evening', time: '5:00 PM - 9:00 PM', icon: Moon }
  ];

  const durationOptions = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' },
    { value: '120', label: '2 hours' }
  ];

  const competitionOptions = [
    { id: 'pre-season', label: 'Pre-Season', description: 'Building foundation and strength' },
    { id: 'in-season', label: 'In-Season', description: 'Maintaining fitness during competition' },
    { id: 'post-season', label: 'Post-Season', description: 'Recovery and skill development' },
    { id: 'off-season', label: 'Off-Season', description: 'Major gains and improvements' }
  ];

  const toggleDay = (dayId: string) => {
    if (trainingDays.includes(dayId)) {
      setTrainingDays(trainingDays.filter(d => d !== dayId));
    } else {
      setTrainingDays([...trainingDays, dayId]);
    }
  };

  const handleNext = () => {
    const scheduleData = {
      trainingDays,
      preferredTime,
      sessionDuration: parseInt(sessionDuration),
      competitionSchedule,
      weeklyVolume: trainingDays.length * parseInt(sessionDuration)
    };
    onNext(scheduleData);
  };

  const isValid = trainingDays.length >= 3 && preferredTime && sessionDuration && competitionSchedule;

  return (
    <div className="animate-slide-in-up">
      <div className="mb-8">
        <h2 className="text-white mb-3">Training Schedule</h2>
        <p className="text-gray-400">When can you commit to training? We'll build your plan around your availability</p>
      </div>

      {/* Training Days */}
      <div className="mb-8">
        <h3 className="text-white mb-2">Training Days</h3>
        <p className="text-gray-400 text-sm mb-4">Select at least 3 days per week</p>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`p-4 rounded-xl border transition-all ${
                trainingDays.includes(day.id)
                  ? 'bg-[#03fd1c] border-[#03fd1c] text-black'
                  : 'bg-[#0a0a0a] border-[#252525] text-gray-400 hover:border-[#03fd1c]/50'
              }`}
            >
              <p className="text-sm font-medium">{day.label}</p>
              <Calendar className="w-4 h-4 mx-auto mt-2" />
            </button>
          ))}
        </div>
        {trainingDays.length > 0 && (
          <p className="text-[#03fd1c] text-sm">
            {trainingDays.length} day{trainingDays.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Preferred Training Time */}
      <div className="mb-8">
        <h3 className="text-white mb-2">Preferred Training Time</h3>
        <p className="text-gray-400 text-sm mb-4">When do you have the most energy?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timePreferences.map((time) => {
            const Icon = time.icon;
            return (
              <button
                key={time.id}
                onClick={() => setPreferredTime(time.id)}
                className={`p-4 rounded-xl border transition-all ${
                  preferredTime === time.id
                    ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                    : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  preferredTime === time.id ? 'text-[#03fd1c]' : 'text-gray-400'
                }`} />
                <p className="text-white text-sm font-medium">{time.label}</p>
                <p className="text-gray-500 text-xs mt-1">{time.time}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Duration */}
      <div className="mb-8">
        <h3 className="text-white mb-2">Session Duration</h3>
        <p className="text-gray-400 text-sm mb-4">How long can you train per session?</p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {durationOptions.map((duration) => (
            <button
              key={duration.value}
              onClick={() => setSessionDuration(duration.value)}
              className={`p-3 rounded-xl border transition-all ${
                sessionDuration === duration.value
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <Clock className={`w-5 h-5 mx-auto mb-2 ${
                sessionDuration === duration.value ? 'text-[#03fd1c]' : 'text-gray-400'
              }`} />
              <p className="text-white text-sm">{duration.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Competition Schedule */}
      <div className="mb-8">
        <h3 className="text-white mb-2">Competition Phase</h3>
        <p className="text-gray-400 text-sm mb-4">What phase of your season are you in?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {competitionOptions.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setCompetitionSchedule(phase.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                competitionSchedule === phase.id
                  ? 'bg-[#03fd1c]/10 border-[#03fd1c]'
                  : 'bg-[#0a0a0a] border-[#252525] hover:border-[#03fd1c]/50'
              }`}
            >
              <p className="text-white font-medium mb-1">{phase.label}</p>
              <p className="text-gray-400 text-sm">{phase.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Training Volume Summary */}
      {trainingDays.length > 0 && sessionDuration && (
        <div className="mb-8 p-6 bg-[#0a0a0a] border border-[#252525] rounded-xl">
          <h4 className="text-white mb-3">Weekly Training Volume</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Days/Week</p>
              <p className="text-[#03fd1c] text-2xl font-bold">{trainingDays.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Min/Session</p>
              <p className="text-[#03fd1c] text-2xl font-bold">{sessionDuration}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Min/Week</p>
              <p className="text-[#03fd1c] text-2xl font-bold">
                {trainingDays.length * parseInt(sessionDuration)}
              </p>
            </div>
          </div>
        </div>
      )}

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
