import React, { useState, useEffect } from 'react';
import { Trophy, Target, Brain, Heart, TrendingUp, AlertTriangle, Star, X } from 'lucide-react';
import { journalHelpers, type PracticeGameJournal } from '../lib/supabase';
import { Button } from './Button';

interface PracticeGameJournalProps {
  userId: string;
  onComplete?: () => void;
}

export function PracticeGameJournalComponent({ userId, onComplete }: PracticeGameJournalProps) {
  const [journal, setJournal] = useState<Partial<PracticeGameJournal>>({
    athlete_id: userId,
    event_type: 'practice',
    event_date: new Date().toISOString().split('T')[0],
    performance_rating: 7,
    energy_level: 7,
    fatigue_level: 3,
    stats: {}
  });

  const [recentJournals, setRecentJournals] = useState<PracticeGameJournal[]>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRecentJournals();
  }, [userId]);

  const loadRecentJournals = async () => {
    const journals = await journalHelpers.getRecentJournals(userId, 5);
    setRecentJournals(journals);
  };

  const handleClose = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleSaveJournal = async () => {
    setSaving(true);
    try {
      const journalId = await journalHelpers.saveJournal(journal as PracticeGameJournal);
      if (journalId) {
        // Show success message or transition to history
        setActiveTab('history');
        await loadRecentJournals();

        // Close after a short delay to show success
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving journal:', error);
      alert('Failed to save journal entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const eventTypes = [
    { value: 'practice', label: 'Practice', icon: Target },
    { value: 'game', label: 'Game', icon: Trophy },
    { value: 'scrimmage', label: 'Scrimmage', icon: Heart }
  ];

  const sorenessAreas = [
    'Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Chest',
    'Arms', 'Core', 'Hip Flexors', 'Glutes', 'Quads',
    'Hamstrings', 'Calves', 'Ankles', 'Feet'
  ];

  return (
    <div className="relative max-h-[90vh] overflow-y-auto flex flex-col">
      <style>{`
        /* Slider styling with proper track visibility */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          background: transparent;
          cursor: pointer;
        }

        /* Track styling - visible with proper color */
        input[type="range"]::-webkit-slider-track {
          width: 100%;
          height: 6px;
          background: #252525;
          border-radius: 3px;
          border: 1px solid #1a1a1a;
        }

        input[type="range"]::-moz-range-track {
          width: 100%;
          height: 6px;
          background: #252525;
          border-radius: 3px;
          border: 1px solid #1a1a1a;
        }

        /* Fill the track up to the thumb */
        input[type="range"]::-webkit-slider-runnable-track {
          background: #252525;
          height: 6px;
          border-radius: 3px;
        }

        /* Thumb styling */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #03fd1c;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -7px;
          border: 2px solid #141414;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #03fd1c;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #141414;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]:hover::-webkit-slider-thumb {
          box-shadow: 0 0 0 6px rgba(3, 253, 28, 0.1);
        }

        input[type="range"]:hover::-moz-range-thumb {
          box-shadow: 0 0 0 6px rgba(3, 253, 28, 0.1);
        }

        input[type="range"]:focus {
          outline: none;
        }

        input[type="range"]:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 8px rgba(3, 253, 28, 0.2);
        }

        input[type="range"]:focus::-moz-range-thumb {
          box-shadow: 0 0 0 8px rgba(3, 253, 28, 0.2);
        }

        /* Custom scrollbar styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #03fd1c #1a1a1a;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #252525;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #03fd1c;
        }
      `}</style>

      <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#03fd1c]" />
          Practice & Game Journal
        </h2>

        <button
          onClick={handleClose}
          className="p-2 hover:bg-[#252525] rounded-lg transition-all"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'new'
              ? 'bg-[#03fd1c] text-black'
              : 'bg-[#252525] text-gray-400 hover:bg-[#2a2a2a]'
          }`}
        >
          New Entry
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'history'
              ? 'bg-[#03fd1c] text-black'
              : 'bg-[#252525] text-gray-400 hover:bg-[#2a2a2a]'
          }`}
        >
          History ({recentJournals.length})
        </button>
      </div>

      {activeTab === 'new' ? (
        <div className="space-y-6">
          {/* Event Type & Date */}
          <div>
            <label className="text-gray-400 text-sm block mb-2">Event Type</label>
            <div className="flex gap-2 mb-4">
              {eventTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setJournal({ ...journal, event_type: type.value as any })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    journal.event_type === type.value
                      ? 'border-[#03fd1c] bg-[#03fd1c]/10 text-white'
                      : 'border-[#252525] bg-[#1a1a1a] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Date</label>
                <input
                  type="date"
                  value={journal.event_date}
                  onChange={(e) => setJournal({ ...journal, event_date: e.target.value })}
                  className="bg-[#1a1a1a] border border-[#252525] rounded px-3 py-2 text-white w-full focus:border-[#03fd1c] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={journal.duration_minutes || ''}
                  onChange={(e) => setJournal({ ...journal, duration_minutes: parseInt(e.target.value) })}
                  className="bg-[#1a1a1a] border border-[#252525] rounded px-3 py-2 text-white w-full focus:border-[#03fd1c] focus:outline-none"
                  placeholder="60"
                />
              </div>
            </div>
          </div>

          {/* Performance Ratings */}
          <div>
            <h3 className="text-white font-semibold mb-4">Performance Assessment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Overall Performance</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={journal.performance_rating || 5}
                  onChange={(e) => setJournal({ ...journal, performance_rating: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span className="text-[#03fd1c] font-bold text-lg">{journal.performance_rating || 5}</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Energy Level</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={journal.energy_level || 5}
                  onChange={(e) => setJournal({ ...journal, energy_level: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low</span>
                  <span className="text-[#03fd1c] font-bold text-lg">{journal.energy_level || 5}</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Fatigue Level</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={journal.fatigue_level || 5}
                  onChange={(e) => setJournal({ ...journal, fatigue_level: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Fresh</span>
                  <span className="text-[#03fd1c] font-bold text-lg">{journal.fatigue_level || 5}</span>
                  <span>Exhausted</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Mental Focus</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={journal.mental_focus || 5}
                  onChange={(e) => setJournal({ ...journal, mental_focus: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Distracted</span>
                  <span className="text-[#03fd1c] font-bold text-lg">{journal.mental_focus || 5}</span>
                  <span>Locked In</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reflection */}
          <div>
            <h3 className="text-white font-semibold mb-4">Reflection</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">What went well?</label>
                <textarea
                  className="bg-[#1a1a1a] border border-[#252525] rounded px-3 py-2 text-white w-full focus:border-[#03fd1c] focus:outline-none"
                  rows={3}
                  placeholder="Describe your successes, improvements, or positive moments..."
                  value={journal.what_went_well || ''}
                  onChange={(e) => setJournal({ ...journal, what_went_well: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">What needs improvement?</label>
                <textarea
                  className="bg-[#1a1a1a] border border-[#252525] rounded px-3 py-2 text-white w-full focus:border-[#03fd1c] focus:outline-none"
                  rows={3}
                  placeholder="Areas to work on, mistakes made, or skills to develop..."
                  value={journal.what_to_improve || ''}
                  onChange={(e) => setJournal({ ...journal, what_to_improve: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Soreness Areas (Optional) */}
          <div>
            <h3 className="text-white font-semibold mb-4">Physical State</h3>
            <label className="text-gray-400 text-sm block mb-2">Soreness Areas (optional)</label>
            <div className="flex flex-wrap gap-2">
              {sorenessAreas.map(area => (
                <button
                  key={area}
                  onClick={() => {
                    const current = journal.soreness_areas || [];
                    const updated = current.includes(area)
                      ? current.filter(a => a !== area)
                      : [...current, area];
                    setJournal({ ...journal, soreness_areas: updated });
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    journal.soreness_areas?.includes(area)
                      ? 'bg-red-500/20 text-red-400 border border-red-500'
                      : 'bg-[#1a1a1a] text-gray-400 border border-[#252525] hover:border-gray-600'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-[#252525]">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveJournal}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Journal Entry'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recentJournals.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No journal entries yet</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => setActiveTab('new')}
              >
                Create First Entry
              </Button>
            </div>
          ) : (
            <>
              {recentJournals.map(entry => (
                <div key={entry.id} className="bg-[#1a1a1a] border border-[#252525] rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[#03fd1c] font-semibold capitalize">{entry.event_type}</span>
                      <span className="text-gray-400 ml-2">{new Date(entry.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-white">{entry.performance_rating}/10</span>
                    </div>
                  </div>

                  {entry.what_went_well && (
                    <div className="mb-2">
                      <span className="text-green-500 text-sm">Went well:</span>
                      <p className="text-gray-300 text-sm mt-1">{entry.what_went_well}</p>
                    </div>
                  )}

                  {entry.what_to_improve && (
                    <div className="mb-2">
                      <span className="text-orange-500 text-sm">To improve:</span>
                      <p className="text-gray-300 text-sm mt-1">{entry.what_to_improve}</p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="text-gray-500">Energy: {entry.energy_level}/10</span>
                    <span className="text-gray-500">Fatigue: {entry.fatigue_level}/10</span>
                    {entry.mental_focus && <span className="text-gray-500">Focus: {entry.mental_focus}/10</span>}
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-4">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}