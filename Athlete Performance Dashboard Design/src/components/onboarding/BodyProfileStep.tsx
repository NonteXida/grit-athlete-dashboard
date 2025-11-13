import React, { useState } from 'react';
import { Button } from '../Button';
import { ChevronRight, ChevronLeft, User, AlertCircle, Dumbbell, Home, Building2 } from 'lucide-react';

interface BodyProfileStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export function BodyProfileStep({ data, onNext, onBack }: BodyProfileStepProps) {
  const [bodyType, setBodyType] = useState(data.bodyType || '');
  const [height, setHeight] = useState(data.height || { feet: '', inches: '' });
  const [weight, setWeight] = useState(data.weight || '');
  const [injuries, setInjuries] = useState(data.injuries || []);
  const [equipmentAccess, setEquipmentAccess] = useState(data.equipmentAccess || []);
  const [currentInjury, setCurrentInjury] = useState('');

  const bodyTypes = [
    { id: 'ectomorph', label: 'Lean/Slim', description: 'Naturally lean, fast metabolism' },
    { id: 'mesomorph', label: 'Athletic', description: 'Naturally muscular, builds muscle easily' },
    { id: 'endomorph', label: 'Powerful', description: 'Naturally strong, gains mass easily' },
    { id: 'combination', label: 'Combination', description: 'Mix of body types' }
  ];

  const equipmentOptions = [
    { id: 'full-gym', label: 'Full Gym', icon: Building2, description: 'Access to complete gym facilities' },
    { id: 'home-gym', label: 'Home Gym', icon: Home, description: 'Basic weights and equipment at home' },
    { id: 'bodyweight', label: 'Bodyweight Only', icon: User, description: 'No equipment, bodyweight exercises' },
    { id: 'school-gym', label: 'School Gym', icon: Building2, description: 'Access to school training facilities' }
  ];

  const handleAddInjury = () => {
    if (currentInjury.trim()) {
      setInjuries([...injuries, currentInjury.trim()]);
      setCurrentInjury('');
    }
  };

  const handleRemoveInjury = (index: number) => {
    setInjuries(injuries.filter((_, i) => i !== index));
  };

  const toggleEquipment = (equipmentId: string) => {
    if (equipmentAccess.includes(equipmentId)) {
      setEquipmentAccess(equipmentAccess.filter(e => e !== equipmentId));
    } else {
      setEquipmentAccess([...equipmentAccess, equipmentId]);
    }
  };

  const handleNext = () => {
    const profileData = {
      bodyType,
      height,
      weight: parseInt(weight),
      injuries,
      equipmentAccess
    };
    onNext(profileData);
  };

  const isValid = bodyType && height.feet && height.inches && weight && equipmentAccess.length > 0;

  return (
    <div className="animate-slide-in-up">
      <div className="mb-8">
        <h2 className="text-white mb-3">Body Profile & Equipment</h2>
        <p className="text-gray-400">Help us understand your physical attributes and available resources</p>
      </div>

      {/* Body Measurements */}
      <div className="mb-8">
        <h3 className="text-white mb-4">Physical Attributes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Height</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Feet"
                value={height.feet}
                onChange={(e) => setHeight({ ...height, feet: e.target.value })}
                className="flex-1 bg-[#0a0a0a] border border-[#252525] text-white px-4 py-3 rounded-lg focus:border-[#03fd1c] transition-all"
                min="4"
                max="7"
              />
              <input
                type="number"
                placeholder="Inches"
                value={height.inches}
                onChange={(e) => setHeight({ ...height, inches: e.target.value })}
                className="flex-1 bg-[#0a0a0a] border border-[#252525] text-white px-4 py-3 rounded-lg focus:border-[#03fd1c] transition-all"
                min="0"
                max="11"
              />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">Weight (lbs)</label>
            <input
              type="number"
              placeholder="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#252525] text-white px-4 py-3 rounded-lg focus:border-[#03fd1c] transition-all"
              min="80"
              max="400"
            />
          </div>
        </div>

        {/* Body Type */}
        <div className="mb-6">
          <label className="text-gray-400 text-sm block mb-3">Body Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bodyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setBodyType(type.id)}
                className={`p-4 bg-[#0a0a0a] border rounded-xl text-left transition-all ${
                  bodyType === type.id
                    ? 'border-[#03fd1c] bg-[#03fd1c]/10'
                    : 'border-[#252525] hover:border-[#03fd1c]/50'
                }`}
              >
                <p className="text-white font-medium mb-1">{type.label}</p>
                <p className="text-gray-400 text-sm">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Injury History */}
      <div className="mb-8">
        <h3 className="text-white mb-4">
          <AlertCircle className="inline w-5 h-5 mr-2 text-yellow-500" />
          Injury History
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          List any current or past injuries we should consider in your training plan
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="e.g., Right shoulder impingement"
            value={currentInjury}
            onChange={(e) => setCurrentInjury(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddInjury()}
            className="flex-1 bg-[#0a0a0a] border border-[#252525] text-white px-4 py-3 rounded-lg focus:border-[#03fd1c] transition-all"
          />
          <Button variant="outline" onClick={handleAddInjury}>Add</Button>
        </div>
        {injuries.length > 0 && (
          <div className="space-y-2">
            {injuries.map((injury, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#0a0a0a] border border-[#252525] rounded-lg"
              >
                <span className="text-white">{injury}</span>
                <button
                  onClick={() => handleRemoveInjury(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Equipment Access */}
      <div className="mb-8">
        <h3 className="text-white mb-4">
          <Dumbbell className="inline w-5 h-5 mr-2 text-[#03fd1c]" />
          Equipment Access
        </h3>
        <p className="text-gray-400 text-sm mb-4">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {equipmentOptions.map((equipment) => {
            const Icon = equipment.icon;
            return (
              <button
                key={equipment.id}
                onClick={() => toggleEquipment(equipment.id)}
                className={`p-4 bg-[#0a0a0a] border rounded-xl text-left transition-all ${
                  equipmentAccess.includes(equipment.id)
                    ? 'border-[#03fd1c] bg-[#03fd1c]/10'
                    : 'border-[#252525] hover:border-[#03fd1c]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-1 ${
                    equipmentAccess.includes(equipment.id) ? 'text-[#03fd1c]' : 'text-gray-400'
                  }`} />
                  <div>
                    <p className="text-white font-medium mb-1">{equipment.label}</p>
                    <p className="text-gray-400 text-sm">{equipment.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

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
