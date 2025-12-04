import React from 'react';
import { Calendar, AlertCircle, Heart, Pill, Apple } from 'lucide-react';

interface DemographicsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DemographicsStep: React.FC<DemographicsStepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack
}) => {
  const handleNext = () => {
    // Basic validation
    if (!data.dateOfBirth || !data.gender) {
      alert('Please fill in all required fields');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Personal Information</h2>
        <p className="text-gray-400">
          This helps us create safe, age-appropriate training plans
        </p>
      </div>

      {/* Demographics Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date of Birth *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              value={data.dateOfBirth || ''}
              onChange={(e) => onUpdate({ ...data, dateOfBirth: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gender *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Male', 'Female', 'Other'].map(gender => (
              <button
                key={gender}
                onClick={() => onUpdate({ ...data, gender: gender.toLowerCase() })}
                className={`p-3 rounded-xl transition-all ${
                  data.gender === gender.toLowerCase()
                    ? 'bg-[#03fd1c] text-black'
                    : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#252525]'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Emergency Contact
          </label>
          <input
            type="text"
            className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
            placeholder="Name and phone number"
            value={data.emergencyContact || ''}
            onChange={(e) => onUpdate({ ...data, emergencyContact: e.target.value })}
          />
        </div>
      </div>

      {/* Medical Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Medical Information
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Medical Conditions
          </label>
          <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Asthma',
              'Diabetes',
              'Heart Condition',
              'High Blood Pressure',
              'Arthritis',
              'Previous Surgery',
              'Chronic Pain',
              'None'
            ].map(condition => (
              <label
                key={condition}
                className="flex items-center space-x-2 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer hover:bg-[#252525]"
              >
                <input
                  type="checkbox"
                  checked={data.medicalConditions?.includes(condition) || false}
                  onChange={(e) => {
                    const conditions = data.medicalConditions || [];
                    if (e.target.checked) {
                      if (condition === 'None') {
                        onUpdate({ ...data, medicalConditions: ['None'] });
                      } else {
                        const filtered = conditions.filter((c: string) => c !== 'None');
                        onUpdate({ ...data, medicalConditions: [...filtered, condition] });
                      }
                    } else {
                      onUpdate({
                        ...data,
                        medicalConditions: conditions.filter((c: string) => c !== condition)
                      });
                    }
                  }}
                  className="w-4 h-4 text-[#03fd1c] bg-[#141414] border-gray-600 rounded"
                />
                <span className="text-sm text-gray-300">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Current Medications
          </label>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="flex-1 bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="List any medications (optional)"
              value={data.medications || ''}
              onChange={(e) => onUpdate({ ...data, medications: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dietary Restrictions/Allergies
          </label>
          <div className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="flex-1 bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="e.g., Vegetarian, Gluten-free, Nut allergy"
              value={data.dietaryRestrictions || ''}
              onChange={(e) => onUpdate({ ...data, dietaryRestrictions: e.target.value })}
            />
          </div>
        </div>

        {/* Pregnancy Status (shown only for female) */}
        {data.gender === 'female' && (
          <div className="p-4 bg-[#1a1a1a] rounded-xl">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={data.isPregnant || false}
                onChange={(e) => onUpdate({ ...data, isPregnant: e.target.checked })}
                className="w-4 h-4 text-[#03fd1c] bg-[#141414] border-gray-600 rounded"
              />
              <span className="text-sm text-gray-300">I am currently pregnant</span>
            </label>
          </div>
        )}
      </div>

      {/* Medical Disclaimer */}
      <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-xl">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-200">
            <p className="font-medium mb-1">Important Medical Notice</p>
            <p className="text-xs text-yellow-300/80">
              Always consult with your healthcare provider before starting any new exercise program,
              especially if you have pre-existing medical conditions.
            </p>
          </div>
        </div>
      </div>

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
          className="px-8 py-3 bg-[#03fd1c] text-black font-medium rounded-xl hover:bg-[#00ff00] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};