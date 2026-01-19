import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export function TestAIGeneration({ userId }: { userId: string }) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function testDirectInvoke() {
    setTesting(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing direct Edge Function invocation...');

      // Test profile data
      const testProfile = {
        id: userId,
        sport: 'Football',
        position: 'Running Back',
        skill_level: 'intermediate',
        date_of_birth: '2005-01-15',
        gender: 'male',
        equipment_available: ['barbell', 'dumbbells', 'treadmill'],
        training_days: ['Monday', 'Wednesday', 'Friday'],
        session_duration_minutes: 60,
        injuries: [],
        medical_conditions: [],
        primary_goals: ['Increase strength', 'Improve speed', 'Build endurance']
      };

      console.log('Invoking Edge Function with test data:', testProfile);

      const { data, error: invokeError } = await supabase.functions.invoke('generate-training-plan', {
        body: {
          athleteProfile: testProfile,
          planType: 'initial',
          includeRecentData: false
        }
      });

      console.log('Edge Function response:', { data, error: invokeError });

      if (invokeError) {
        throw invokeError;
      }

      setResult(data);
      console.log('Success! Plan generated:', data);

    } catch (err: any) {
      console.error('Test failed:', err);
      setError(err.message || JSON.stringify(err));
    } finally {
      setTesting(false);
    }
  }

  async function testProfileUpdate() {
    setTesting(true);
    setError(null);

    try {
      console.log('Testing profile upsert with test data...');

      // Use upsert to create or update
      const { data, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          sport: 'Football',
          position: 'Running Back',
          skill_level: 'intermediate',
          date_of_birth: '2005-01-15',
          gender: 'male',
          equipment_available: ['barbell', 'dumbbells'],
          training_days: ['Monday', 'Wednesday', 'Friday'],
          session_duration_minutes: 60,
          primary_goals: ['Increase strength', 'Improve speed'],
          onboarding_completed: true
        })
        .select();

      console.log('Profile upsert result:', { data, error: upsertError });

      if (upsertError) {
        throw upsertError;
      }

      setResult({ success: true, message: 'Profile created/updated successfully', data });

    } catch (err: any) {
      console.error('Profile upsert failed:', err);
      setError(err.message || JSON.stringify(err));
    } finally {
      setTesting(false);
    }
  }

  async function checkProfile() {
    setTesting(true);
    setError(null);

    try {
      console.log('Checking profile for user:', userId);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Profile check result:', { data, error: fetchError });

      if (fetchError) {
        throw fetchError;
      }

      setResult({ profile: data });

    } catch (err: any) {
      console.error('Profile check failed:', err);
      setError(err.message || JSON.stringify(err));
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-[#03fd1c] mb-4">AI Generation Test Panel</h2>
      <p className="text-gray-400 mb-4 text-sm">User ID: {userId}</p>

      <div className="flex gap-3 mb-4">
        <button
          onClick={checkProfile}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Checking...' : '1. Check Profile'}
        </button>

        <button
          onClick={testProfileUpdate}
          disabled={testing}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          {testing ? 'Updating...' : '2. Update Profile w/ Test Data'}
        </button>

        <button
          onClick={testDirectInvoke}
          disabled={testing}
          className="px-4 py-2 bg-[#03fd1c] text-black rounded hover:bg-[#02cc17] disabled:opacity-50"
        >
          {testing ? 'Testing...' : '3. Test AI Generation'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded p-4 mb-4">
          <h3 className="text-red-500 font-bold mb-2">Error:</h3>
          <pre className="text-red-300 text-xs overflow-auto">{error}</pre>
        </div>
      )}

      {result && (
        <div className="bg-green-900/20 border border-green-500 rounded p-4">
          <h3 className="text-green-500 font-bold mb-2">Result:</h3>
          <pre className="text-green-300 text-xs overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Steps:</p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Check if profile exists (should see your profile or error)</li>
          <li>Update profile with test data (to avoid filling form)</li>
          <li>Test AI generation directly (calls Edge Function)</li>
        </ol>
      </div>
    </div>
  );
}
