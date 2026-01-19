import { createClient } from '@supabase/supabase-js';

// Get from your existing configuration
const supabaseUrl = 'https://svdznqczeedptnmwopem.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZHpucWN6ZWVkcHRubXdvcGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzA1NDAsImV4cCI6MjA3ODA0NjU0MH0.osZK03Zyt_NrbrBV0Andv-VSEbEQVA-U5J0BqmDCIDI';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export interface Profile {
  id: string;
  name?: string;
  date_of_birth: string | null;
  gender: string | null;
  emergency_contact?: string;
  height_cm?: number;
  weight_kg?: number;
  body_type?: string;
  sport: string | null;
  position: string | null;
  sports?: string[];  // Multi-sport support
  positions?: string[]; // Multi-position support
  skill_level: string;
  school?: string;
  graduation_year?: string;
  profile_image_url?: string;
  banner_image_url?: string;
  training_years?: number;
  season_phase?: string;
  next_competition?: string;
  team_schedule?: string;
  medical_conditions?: any[];
  medications?: any[];
  allergies?: any[];
  injuries?: any[];
  is_pregnant?: boolean;
  dietary_restrictions?: string;
  equipment_available?: any[];
  training_days?: any[];
  preferred_time?: string;
  session_duration_minutes?: number;
  fitness_metrics?: any;
  recent_training_frequency?: string;
  recent_training_focus?: string;
  sleep_hours?: number;
  stress_level?: number;
  hydration_glasses?: number;
  nutrition_approach?: string;
  recovery_tools?: any[];
  primary_goals?: any[];
  onboarding_completed: boolean;
  grit_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Exercise {
  id: number;
  name: string;
  category: string;
  muscle_groups?: string[];
  equipment_needed?: string[];
  difficulty_level: number;
  video_url?: string;
  instructions?: string;
  form_cues?: string[];
  contraindications?: any;
  position_specific_for?: string[];
  energy_system?: string;
}

export interface TrainingPlan {
  id: number;
  athlete_id: string;
  name: string;
  description?: string;
  duration_weeks: number;
  start_date?: string;
  end_date?: string;
  plan_type?: string;
  periodization_phase?: string;
  ai_generated: boolean;
  ai_model?: string;
  ai_prompt_version?: number;
  generation_cost?: number;
  plan_data: any;
  status: string;
  completion_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutLog {
  id?: number;
  athlete_id: string;
  plan_id?: number;
  workout_date: string;
  workout_type?: string;
  workout_name?: string;
  exercises_completed: any[];
  duration_minutes?: number;
  calories_burned?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  energy_level?: number;
  soreness_level?: number;
  completion_status?: 'completed' | 'partial' | 'failed' | 'modified';
  modification_reason?: string;
  actual_vs_prescribed?: any;
  performance_metrics?: any;
  technique_notes?: string;
  motivation_level?: number;
  perceived_difficulty?: number;
  would_repeat?: boolean;
  environmental_factors?: any;
  pre_workout_state?: any;
  post_workout_recovery?: any;
  notes?: string;
  coach_feedback?: string;
  created_at?: string;
}

export interface PracticeGameJournal {
  id?: number;
  athlete_id: string;
  event_type: 'practice' | 'game' | 'scrimmage' | 'tournament' | 'tryout';
  event_date: string;
  event_time?: string;
  duration_minutes?: number;
  performance_rating?: number;
  energy_level?: number;
  focus_level?: number;
  execution_quality?: number;
  stats?: any; // Sport-specific stats
  what_went_well?: string;
  what_to_improve?: string;
  key_moments?: string;
  coach_feedback?: string;
  soreness_areas?: string[];
  injury_notes?: string;
  fatigue_level?: number;
  confidence_level?: number;
  stress_level?: number;
  enjoyment_level?: number;
  mental_notes?: string;
  tags?: string[];
  ai_insights?: any;
  ai_recommendations?: any[];
  created_at?: string;
}

export interface FeedbackSignal {
  id?: number;
  athlete_id: string;
  source_type: string;
  source_id?: number;
  signal_type: string;
  signal_strength: number;
  context?: any;
  processed?: boolean;
  processed_at?: string;
  applied_to_plan_id?: number;
  created_at?: string;
}

// Helper functions for common operations
export const profileHelpers = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    console.log('Attempting to update profile with:', updates);

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('Error updating profile:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return false;
    }

    console.log('Profile update successful:', data);
    return true;
  },

  async createProfile(profile: Profile): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .insert(profile);

    if (error) {
      console.error('Error creating profile:', error);
      return false;
    }

    return true;
  }
};

export const exerciseHelpers = {
  async getAllExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }

    return data || [];
  },

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('category', category)
      .order('difficulty_level');

    if (error) {
      console.error('Error fetching exercises by category:', error);
      return [];
    }

    return data || [];
  },

  async getExercisesForPosition(position: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .contains('position_specific_for', [position]);

    if (error) {
      console.error('Error fetching position-specific exercises:', error);
      return [];
    }

    return data || [];
  }
};

export const workoutHelpers = {
  async saveWorkout(workout: WorkoutLog): Promise<number | null> {
    const { data, error } = await supabase
      .from('workout_logs')
      .insert(workout)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving workout:', error);
      return null;
    }

    return data?.id || null;
  },

  async getRecentWorkouts(userId: string, limit: number = 10): Promise<WorkoutLog[]> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('athlete_id', userId)
      .order('workout_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent workouts:', error);
      return [];
    }

    return data || [];
  },

  async updateWorkout(workoutId: number, updates: Partial<WorkoutLog>): Promise<boolean> {
    const { error } = await supabase
      .from('workout_logs')
      .update(updates)
      .eq('id', workoutId);

    if (error) {
      console.error('Error updating workout:', error);
      return false;
    }

    return true;
  }
};

export const journalHelpers = {
  async saveJournal(journal: PracticeGameJournal): Promise<number | null> {
    const { data, error } = await supabase
      .from('practice_game_journals')
      .insert(journal)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving journal:', error);
      return null;
    }

    return data?.id || null;
  },

  async getRecentJournals(userId: string, limit: number = 10): Promise<PracticeGameJournal[]> {
    const { data, error } = await supabase
      .from('practice_game_journals')
      .select('*')
      .eq('athlete_id', userId)
      .order('event_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent journals:', error);
      return [];
    }

    return data || [];
  },

  async getJournalsByType(userId: string, eventType: string): Promise<PracticeGameJournal[]> {
    const { data, error } = await supabase
      .from('practice_game_journals')
      .select('*')
      .eq('athlete_id', userId)
      .eq('event_type', eventType)
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error fetching journals by type:', error);
      return [];
    }

    return data || [];
  }
};

export const feedbackHelpers = {
  async getUnprocessedSignals(userId: string): Promise<FeedbackSignal[]> {
    const { data, error } = await supabase
      .from('feedback_signals')
      .select('*')
      .eq('athlete_id', userId)
      .eq('processed', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback signals:', error);
      return [];
    }

    return data || [];
  },

  async markSignalsProcessed(signalIds: number[], planId: number): Promise<boolean> {
    const { error } = await supabase
      .from('feedback_signals')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        applied_to_plan_id: planId
      })
      .in('id', signalIds);

    if (error) {
      console.error('Error marking signals as processed:', error);
      return false;
    }

    return true;
  }
};

export const imageHelpers = {
  async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileNameWithTimestamp = `${userId}/profile-${timestamp}.${fileExt}`;

      const { error } = await supabase.storage
        .from('make-eec32171-athlete-images')
        .upload(fileNameWithTimestamp, file, { upsert: true });

      if (error) {
        console.error('Error uploading profile image:', error);
        return null;
      }

      const { data } = supabase.storage
        .from('make-eec32171-athlete-images')
        .getPublicUrl(fileNameWithTimestamp);

      // Update profile with new image URL
      await profileHelpers.updateProfile(userId, { profile_image_url: data.publicUrl });

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadProfileImage:', error);
      return null;
    }
  },

  async uploadBannerImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileNameWithTimestamp = `${userId}/banner-${timestamp}.${fileExt}`;

      const { error } = await supabase.storage
        .from('make-eec32171-athlete-images')
        .upload(fileNameWithTimestamp, file, { upsert: true });

      if (error) {
        console.error('Error uploading banner image:', error);
        return null;
      }

      const { data } = supabase.storage
        .from('make-eec32171-athlete-images')
        .getPublicUrl(fileNameWithTimestamp);

      // Update profile with new image URL
      await profileHelpers.updateProfile(userId, { banner_image_url: data.publicUrl });

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadBannerImage:', error);
      return null;
    }
  }
};