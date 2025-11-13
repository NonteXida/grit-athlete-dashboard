import React, { useState } from 'react';
import { Button } from '../Button';
import { 
  Dribbble, 
  Goal, 
  Footprints, 
  Volleyball, 
  Dumbbell,
  Wind,
  Trophy,
  Users
} from 'lucide-react';

interface SportPositionStepProps {
  onNext: (data: { sport: string; position: string; level: string }) => void;
  onBack: () => void;
  initialData?: { sport: string; position: string; level: string };
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

export function SportPositionStep({ onNext, onBack, initialData }: SportPositionStepProps) {
  const [selectedSport, setSelectedSport] = useState(initialData?.sport || '');
  const [selectedPosition, setSelectedPosition] = useState(initialData?.position || '');
  const [selectedLevel, setSelectedLevel] = useState(initialData?.level || '');

  const selectedSportData = SPORTS.find(s => s.name === selectedSport);

  const handleSubmit = () => {
    if (selectedSport && selectedPosition && selectedLevel) {
      onNext({ sport: selectedSport, position: selectedPosition, level: selectedLevel });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-white mb-2">What's Your Sport?</h2>
        <p className="text-gray-400">
          This helps us create sport-specific training programs
        </p>
      </div>

      {/* Sport Selection */}
      <div className="mb-8">
        <label className="text-white mb-4 block">Select Your Sport</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SPORTS.map((sport) => {
            const Icon = sport.icon;
            const isSelected = selectedSport === sport.name;
            return (
              <button
                key={sport.name}
                onClick={() => {
                  setSelectedSport(sport.name);
                  setSelectedPosition(''); // Reset position when sport changes
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
        <div className="mb-8 animate-slide-in-up">
          <label className="text-white mb-4 block">Select Your Position</label>
          <div className="flex flex-wrap gap-2">
            {selectedSportData.positions.map((position) => {
              const isSelected = selectedPosition === position;
              return (
                <button
                  key={position}
                  onClick={() => setSelectedPosition(position)}
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
      {selectedPosition && (
        <div className="mb-8 animate-slide-in-up">
          <label className="text-white mb-4 block">Competition Level</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {LEVELS.map((level) => {
              const isSelected = selectedLevel === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
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

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 mt-12 pt-8 border-t border-[#252525]">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="primary"
          onClick={handleSubmit}
          disabled={!selectedSport || !selectedPosition || !selectedLevel}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
