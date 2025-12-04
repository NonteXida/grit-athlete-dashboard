import React from 'react';
import {
  Dribbble,
  Goal,
  Footprints,
  Volleyball,
  Dumbbell,
  Wind,
  Trophy,
  Users,
  Calendar,
  ClipboardList
} from 'lucide-react';

interface EnhancedSportPositionStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const SPORTS = [
  { name: 'Football', icon: Goal, positions: ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'K/P'] },
  { name: 'Basketball', icon: Dribbble, positions: ['PG', 'SG', 'SF', 'PF', 'C'] },
  { name: 'Soccer', icon: Footprints, positions: ['GK', 'Defender', 'Midfielder', 'Forward'] },
  { name: 'Volleyball', icon: Volleyball, positions: ['Setter', 'Outside Hitter', 'Middle Blocker', 'Libero', 'Opposite'] },
  { name: 'Track & Field', icon: Wind, positions: ['Sprints', 'Distance', 'Hurdles', 'Jumps', 'Throws'] },
  { name: 'Wrestling', icon: Users, positions: ['Lightweight', 'Middleweight', 'Heavyweight'] },
  { name: 'Baseball/Softball', icon: Trophy, positions: ['Pitcher', 'Catcher', 'Infield', 'Outfield'] },
  { name: 'Strength/Fitness', icon: Dumbbell, positions: ['General Athlete', 'Powerlifting', 'Olympic Lifting', 'CrossFit'] },
];

const LEVELS = [
  { id: 'hs-frosh', label: 'HS Freshman' },
  { id: 'hs-jv', label: 'HS JV' },
  { id: 'hs-varsity', label: 'HS Varsity' },
  { id: 'club', label: 'Club/Travel' },
  { id: 'college-d1', label: 'College D1' },
  { id: 'college-d2', label: 'College D2' },
  { id: 'college-d3', label: 'College D3' },
  { id: 'college-naia', label: 'College NAIA' },
  { id: 'semi-pro', label: 'Semi-Pro' },
  { id: 'recreational', label: 'Recreational' },
];

export const EnhancedSportPositionStep: React.FC<EnhancedSportPositionStepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack
}) => {
  const handleNext = () => {
    if (!data.sport || !data.position || !data.level) {
      alert('Please select your sport, position, and level');
      return;
    }
    onNext();
  };

  const selectedSportData = SPORTS.find(s => s.name === data.sport);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Sport & Position</h2>
        <p className="text-gray-400">
          This helps us create sport-specific training programs
        </p>
      </div>

      {/* Sport Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Your Sport *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SPORTS.map((sport) => {
            const Icon = sport.icon;
            const isSelected = data.sport === sport.name;
            return (
              <button
                key={sport.name}
                onClick={() => {
                  onUpdate({
                    ...data,
                    sport: sport.name,
                    position: '' // Reset position when sport changes
                  });
                }}
                className={`
                  p-4 rounded-xl border-2 transition-all text-center
                  ${isSelected
                    ? 'border-[#03fd1c] bg-[#03fd1c]/10'
                    : 'border-[#252525] bg-[#141414] hover:border-[#03fd1c]/50'
                  }
                `}
              >
                <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-[#03fd1c]' : 'text-gray-400'}`} />
                <span className={`text-sm ${isSelected ? 'text-[#03fd1c]' : 'text-white'}`}>
                  {sport.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Position Selection */}
      {selectedSportData && (
        <div className="animate-slide-in">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Your Position *
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedSportData.positions.map((position) => {
              const isSelected = data.position === position;
              return (
                <button
                  key={position}
                  onClick={() => onUpdate({ ...data, position })}
                  className={`
                    px-4 py-2 rounded-full border transition-all
                    ${isSelected
                      ? 'border-[#03fd1c] bg-[#03fd1c] text-black'
                      : 'border-[#252525] bg-[#141414] text-gray-300 hover:border-[#03fd1c]/50'
                    }
                  `}
                >
                  {position}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Level Selection */}
      {data.position && (
        <div className="animate-slide-in">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Competition Level *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {LEVELS.map((level) => {
              const isSelected = data.level === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => onUpdate({ ...data, level: level.id })}
                  className={`
                    px-3 py-2 rounded-lg border transition-all text-sm
                    ${isSelected
                      ? 'border-[#03fd1c] bg-[#03fd1c]/20 text-[#03fd1c]'
                      : 'border-[#252525] bg-[#141414] text-gray-300 hover:border-[#03fd1c]/50'
                    }
                  `}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Season & Competition Info */}
      {data.level && (
        <div className="space-y-4 animate-slide-in">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#03fd1c]" />
            Season Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Season Phase *
            </label>
            <select
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              value={data.seasonPhase || ''}
              onChange={(e) => onUpdate({ ...data, seasonPhase: e.target.value })}
            >
              <option value="">Select phase</option>
              <option value="off-season">Off-season (Building base)</option>
              <option value="pre-season">Pre-season (Preparing)</option>
              <option value="in-season">In-season (Competing)</option>
              <option value="post-season">Post-season (Recovery)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Next Competition Date (optional)
            </label>
            <input
              type="date"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              value={data.nextCompetition || ''}
              onChange={(e) => onUpdate({ ...data, nextCompetition: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Training Schedule (optional)
            </label>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="flex-1 bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                placeholder="e.g., Team practice Mon/Wed/Fri 3-5pm"
                value={data.teamSchedule || ''}
                onChange={(e) => onUpdate({ ...data, teamSchedule: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!data.sport || !data.position || !data.level}
          className={`px-8 py-3 font-medium rounded-xl transition-colors ${
            data.sport && data.position && data.level
              ? 'bg-[#03fd1c] text-black hover:bg-[#00ff00]'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};