import React, { useState, useEffect } from 'react';
import { Trophy, Target, Brain, Heart, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import { journalHelpers, type PracticeGameJournal } from '../lib/supabase';

interface PracticeGameJournalProps {
  userId: string;
  onSave: (journal: PracticeGameJournal) => void;
}

export function PracticeGameJournalComponent({ userId, onSave }: PracticeGameJournalProps) {
  const [journal, setJournal] = useState<Partial<PracticeGameJournal>>({
    athlete_id: userId,
    event_type: 'practice',
    event_date: new Date().toISOString().split('T')[0],
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

  const handleSaveJournal = async () => {
    setSaving(true);
    try {
      const journalId = await journalHelpers.saveJournal(journal as PracticeGameJournal);
      if (journalId) {
        onSave({ ...journal, id: journalId } as PracticeGameJournal);
        // Reset form
        setJournal({
          athlete_id: userId,
          event_type: 'practice',
          event_date: new Date().toISOString().split('T')[0],
          stats: {}
        });
        // Reload recent journals
        loadRecentJournals();
        setActiveTab('history');
      }
    } catch (error) {
      console.error('Error saving journal:', error);
    } finally {
      setSaving(false);
    }
  };

  const eventTypes = [
    { value: 'practice', label: 'Practice', icon: Target },
    { value: 'game', label: 'Game', icon: Trophy },
    { value: 'scrimmage', label: 'Scrimmage', icon: Heart },
    { value: 'tournament', label: 'Tournament', icon: Star },
    { value: 'tryout', label: 'Tryout', icon: AlertTriangle }
  ];

  const sorenessAreas = [
    'Neck', 'Shoulders', 'Upper Back', 'Lower Back', 'Chest',
    'Arms', 'Core', 'Hip Flexors', 'Glutes', 'Quads',
    'Hamstrings', 'Calves', 'Ankles', 'Feet'
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#03fd1c]" />
          Practice & Game Journal
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'new'
                ? 'bg-[#03fd1c] text-black'
                : 'bg-[#141414] text-gray-400'
            }`}
          >
            New Entry
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'history'
                ? 'bg-[#03fd1c] text-black'
                : 'bg-[#141414] text-gray-400'
            }`}
          >
            History
          </button>
        </div>
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    journal.event_type === type.value
                      ? 'border-[#03fd1c] bg-[#03fd1c]/10'
                      : 'border-[#252525] bg-[#141414]'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  <span className={journal.event_type === type.value ? 'text-white' : 'text-gray-400'}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Date</label>
                <input
                  type="date"
                  value={journal.event_date}
                  onChange={(e) => setJournal({ ...journal, event_date: e.target.value })}
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Time</label>
                <input
                  type="time"
                  value={journal.event_time || ''}
                  onChange={(e) => setJournal({ ...journal, event_time: e.target.value })}
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={journal.duration_minutes || ''}
                  onChange={(e) => setJournal({ ...journal, duration_minutes: parseInt(e.target.value) })}
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                />
              </div>
            </div>
          </div>

          {/* Performance Ratings */}
          <div>
            <h3 className="text-white font-semibold mb-4">Performance Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Overall Performance (1-10)</label>
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
                  <span className="text-[#03fd1c] font-bold">{journal.performance_rating || 5}</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Energy Level (1-10)</label>
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
                  <span className="text-[#03fd1c] font-bold">{journal.energy_level || 5}</span>
                  <span>High</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Focus Level (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={journal.focus_level || 5}
                  onChange={(e) => setJournal({ ...journal, focus_level: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Distracted</span>
                  <span className="text-[#03fd1c] font-bold">{journal.focus_level || 5}</span>
                  <span>Locked In</span>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Execution Quality (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={journal.execution_quality || 5}
                  onChange={(e) => setJournal({ ...journal, execution_quality: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Sloppy</span>
                  <span className="text-[#03fd1c] font-bold">{journal.execution_quality || 5}</span>
                  <span>Precise</span>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Sections */}
          <div>
            <h3 className="text-white font-semibold mb-4">Reflection</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">What went well?</label>
                <textarea
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                  rows={3}
                  placeholder="Describe your successes, improvements, or positive moments..."
                  value={journal.what_went_well || ''}
                  onChange={(e) => setJournal({ ...journal, what_went_well: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">What needs improvement?</label>
                <textarea
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                  rows={3}
                  placeholder="Areas to work on, mistakes made, or skills to develop..."
                  value={journal.what_to_improve || ''}
                  onChange={(e) => setJournal({ ...journal, what_to_improve: e.target.value })}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Key moments or highlights</label>
                <textarea
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                  rows={2}
                  placeholder="Important plays, breakthrough moments, or significant events..."
                  value={journal.key_moments || ''}
                  onChange={(e) => setJournal({ ...journal, key_moments: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Physical Feedback */}
          <div>
            <h3 className="text-white font-semibold mb-4">Physical State</h3>

            <div className="mb-4">
              <label className="text-gray-400 text-sm block mb-2">Fatigue Level (1-10)</label>
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
                <span className="text-[#03fd1c] font-bold">{journal.fatigue_level || 5}</span>
                <span>Exhausted</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-sm block mb-2">Soreness Areas</label>
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
                    className={`px-3 py-1 rounded-full text-sm ${
                      journal.soreness_areas?.includes(area)
                        ? 'bg-red-500/20 text-red-400 border border-red-500'
                        : 'bg-[#141414] text-gray-400 border border-[#252525]'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Injury concerns or notes</label>
              <textarea
                className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                rows={2}
                placeholder="Any pain, discomfort, or potential injury risks..."
                value={journal.injury_notes || ''}
                onChange={(e) => setJournal({ ...journal, injury_notes: e.target.value })}
              />
            </div>
          </div>

          {/* Mental/Emotional State */}
          <div>
            <h3 className="text-white font-semibold mb-4">Mental & Emotional State</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Confidence Level (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={journal.confidence_level || ''}
                  onChange={(e) => setJournal({ ...journal, confidence_level: parseInt(e.target.value) })}
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Stress Level (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={journal.stress_level || ''}
                  onChange={(e) => setJournal({ ...journal, stress_level: parseInt(e.target.value) })}
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Enjoyment Level (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={journal.enjoyment_level || ''}
                  onChange={(e) => setJournal({ ...journal, enjoyment_level: parseInt(e.target.value) })}
                  className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-gray-400 text-sm block mb-2">Mental notes</label>
              <textarea
                className="bg-[#141414] border border-[#252525] rounded px-3 py-2 text-white w-full"
                rows={2}
                placeholder="Mindset, emotional state, mental challenges or victories..."
                value={journal.mental_notes || ''}
                onChange={(e) => setJournal({ ...journal, mental_notes: e.target.value })}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveJournal}
              disabled={saving}
              className="px-6 py-2 bg-[#03fd1c] text-black rounded-lg font-semibold hover:bg-[#00e617] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Journal Entry'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {recentJournals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No journal entries yet</p>
          ) : (
            recentJournals.map(entry => (
              <div key={entry.id} className="bg-[#141414] rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[#03fd1c] font-semibold capitalize">{entry.event_type}</span>
                    <span className="text-gray-400 ml-2">{entry.event_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-white">{entry.performance_rating}/10</span>
                  </div>
                </div>

                {entry.what_went_well && (
                  <div className="mb-2">
                    <span className="text-gray-400 text-sm">Went well:</span>
                    <p className="text-white text-sm">{entry.what_went_well}</p>
                  </div>
                )}

                {entry.fatigue_level && entry.fatigue_level > 7 && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500 text-sm">High fatigue reported</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}