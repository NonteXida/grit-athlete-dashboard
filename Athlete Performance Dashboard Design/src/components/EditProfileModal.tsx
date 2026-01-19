import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { ALL_SPORTS, SKILL_LEVELS, getPositionsForSports } from '../constants/sportsData';
import { Profile } from '../lib/supabase';

interface EditProfileModalProps {
  profile: Profile | null;
  onClose: () => void;
  onSave: (updatedData: Partial<Profile>) => Promise<void>;
}

export function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    sports: profile?.sports || [],
    positions: profile?.positions || [],
    heightFeet: Math.floor((profile?.height_cm || 0) / 30.48) || '',
    heightInches: Math.round(((profile?.height_cm || 0) % 30.48) / 2.54) || '',
    weight_kg: profile?.weight_kg || '',
    date_of_birth: profile?.date_of_birth || '',
    skill_level: profile?.skill_level || '',
    school: profile?.school || '',
    graduation_year: profile?.graduation_year || '',
    bio: profile?.bio || ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);

  // Update available positions when sports change
  useEffect(() => {
    if (formData.sports.length > 0) {
      const positions = getPositionsForSports(formData.sports);
      setAvailablePositions(positions);

      // Filter out positions that are no longer valid for selected sports
      const validPositions = formData.positions.filter(p => positions.includes(p));
      if (validPositions.length !== formData.positions.length) {
        setFormData(prev => ({ ...prev, positions: validPositions }));
      }
    } else {
      setAvailablePositions([]);
      setFormData(prev => ({ ...prev, positions: [] }));
    }
  }, [formData.sports]);

  const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    // Name validation
    if (!formData.name || formData.name.trim() === '') {
      newErrors.push('Name is required');
    }

    // Sports validation
    if (!formData.sports || formData.sports.length === 0) {
      newErrors.push('At least one sport is required');
    }

    // Positions validation
    if (!formData.positions || formData.positions.length === 0) {
      newErrors.push('At least one position is required');
    }

    // Age validation
    if (formData.date_of_birth) {
      const age = calculateAge(formData.date_of_birth);
      if (age && age < 12) {
        newErrors.push('Age must be at least 12 years old');
      }
    }

    // Weight validation
    if (formData.weight_kg) {
      const weightLbs = Number(formData.weight_kg) * 2.20462;
      if (weightLbs < 60 || weightLbs > 400) {
        newErrors.push('Weight must be between 60 and 400 lbs');
      }
    }

    // Height validation
    if (formData.heightFeet && Number(formData.heightFeet) < 0) {
      newErrors.push('Height cannot be negative');
    }
    if (formData.heightInches && Number(formData.heightInches) < 0) {
      newErrors.push('Height cannot be negative');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Convert height to cm
      const heightCm = formData.heightFeet && formData.heightInches
        ? (Number(formData.heightFeet) * 30.48) + (Number(formData.heightInches) * 2.54)
        : undefined;

      const updates: Partial<Profile> = {
        name: formData.name,
        sports: formData.sports,
        positions: formData.positions,
        height_cm: heightCm,
        weight_kg: formData.weight_kg ? Number(formData.weight_kg) : undefined,
        date_of_birth: formData.date_of_birth || null,
        skill_level: formData.skill_level,
        school: formData.school,
        graduation_year: formData.graduation_year,
        bio: formData.bio
      };

      await onSave(updates);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors(['Failed to save profile. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  const toggleSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const togglePosition = (position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div
        className="bg-[#141414] border border-[#252525] rounded-2xl max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#141414] border-b border-[#252525] p-6 flex items-center justify-between">
          <h2 className="text-white text-xl">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
            {/* Error Messages */}
            {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-500 font-medium mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-red-400 text-sm space-y-1">
                    {errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-gray-400 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="Your full name"
            />
          </div>

          {/* Sports */}
          <div>
            <label className="block text-gray-400 mb-2">Sports * (select all that apply)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-[#0a0a0a] rounded-lg border border-[#252525]">
              {ALL_SPORTS.map(sport => (
                <button
                  key={sport}
                  type="button"
                  onClick={() => toggleSport(sport)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.sports.includes(sport)
                      ? 'bg-[#03fd1c] text-black font-medium'
                      : 'bg-[#141414] text-gray-300 hover:bg-[#252525]'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {/* Positions */}
          {formData.sports.length > 0 && (
            <div>
              <label className="block text-gray-400 mb-2">Positions * (select all that apply)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-[#0a0a0a] rounded-lg border border-[#252525]">
                {availablePositions.map(position => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => togglePosition(position)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      formData.positions.includes(position)
                        ? 'bg-[#03fd1c] text-black font-medium'
                        : 'bg-[#141414] text-gray-300 hover:bg-[#252525]'
                    }`}
                  >
                    {position}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Height */}
          <div>
            <label className="block text-gray-400 mb-2">Height</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={formData.heightFeet}
                  onChange={(e) => setFormData(prev => ({ ...prev, heightFeet: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                  placeholder="Feet"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={formData.heightInches}
                  onChange={(e) => setFormData(prev => ({ ...prev, heightInches: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                  placeholder="Inches"
                />
              </div>
            </div>
          </div>

          {/* Weight */}
          <div>
            <label className="block text-gray-400 mb-2">Weight (60-400 lbs)</label>
            <input
              type="number"
              min="27"
              max="181"
              step="0.1"
              value={formData.weight_kg}
              onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="Weight in kg"
            />
            {formData.weight_kg && (
              <p className="text-gray-400 text-sm mt-1">
                {Math.round(Number(formData.weight_kg) * 2.20462)} lbs
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-400 mb-2">Date of Birth (must be ≥12 years old)</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
            />
            {formData.date_of_birth && (
              <p className="text-gray-400 text-sm mt-1">
                Age: {calculateAge(formData.date_of_birth)} years
              </p>
            )}
          </div>

          {/* Skill Level */}
          <div>
            <label className="block text-gray-400 mb-2">Skill Level</label>
            <select
              value={formData.skill_level}
              onChange={(e) => setFormData(prev => ({ ...prev, skill_level: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
            >
              <option value="">Select skill level</option>
              {SKILL_LEVELS.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* School */}
          <div>
            <label className="block text-gray-400 mb-2">School</label>
            <input
              type="text"
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="Your school name"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-gray-400 mb-2">Graduation Year</label>
            <input
              type="text"
              value={formData.graduation_year}
              onChange={(e) => setFormData(prev => ({ ...prev, graduation_year: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="e.g., 2025"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-400 mb-2">About / Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="w-full bg-[#0a0a0a] border border-[#252525] rounded-lg px-4 py-3 text-white resize-none focus:outline-none focus:border-[#03fd1c]"
              placeholder="Tell us about yourself, your athletic journey, and your goals..."
            />
          </div>
          </div>

          {/* Actions */}
          <div className="bg-[#141414] border-t border-[#252525] p-6 flex justify-end gap-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
