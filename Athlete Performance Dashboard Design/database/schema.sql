-- GRIT Athlete Dashboard Database Schema
-- Run this in your Supabase SQL Editor
-- Created: December 2024

-- ============================================
-- 1. PROFILES TABLE (Extended Auth Users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Demographics
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  emergency_contact TEXT,

  -- Physical Attributes
  height_cm NUMERIC,
  weight_kg NUMERIC,
  body_type TEXT CHECK (body_type IN ('ectomorph', 'mesomorph', 'endomorph', 'combination')),

  -- Sport Information
  sport TEXT NOT NULL,
  position TEXT NOT NULL,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  training_years INT DEFAULT 0,
  season_phase TEXT CHECK (season_phase IN ('off-season', 'pre-season', 'in-season', 'post-season')),
  next_competition DATE,
  team_schedule TEXT,

  -- Medical Information
  medical_conditions JSONB DEFAULT '[]',
  medications JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  injuries JSONB DEFAULT '[]',
  is_pregnant BOOLEAN DEFAULT FALSE,
  dietary_restrictions TEXT,

  -- Training Preferences
  equipment_available JSONB DEFAULT '[]',
  training_days JSONB DEFAULT '[]',
  preferred_time TEXT,
  session_duration_minutes INT,

  -- Performance Baselines
  fitness_metrics JSONB DEFAULT '{}', -- pushups, pullups, mile time, etc.
  recent_training_frequency TEXT,
  recent_training_focus TEXT,
  sleep_hours NUMERIC,
  stress_level INT CHECK (stress_level BETWEEN 1 AND 10),
  hydration_glasses INT,
  nutrition_approach TEXT,
  recovery_tools JSONB DEFAULT '[]',

  -- Goals
  primary_goals JSONB DEFAULT '[]',

  -- Meta
  onboarding_completed BOOLEAN DEFAULT FALSE,
  grit_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. EXERCISE LIBRARY
-- ============================================
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('strength', 'cardio', 'skill', 'mobility', 'plyometric', 'recovery')),
  muscle_groups JSONB DEFAULT '[]', -- ['chest', 'triceps', 'shoulders']
  equipment_needed JSONB DEFAULT '[]', -- ['barbell', 'bench']
  difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5),
  video_url TEXT,
  instructions TEXT,
  form_cues JSONB DEFAULT '[]',
  contraindications JSONB DEFAULT '{}', -- {"knee_pain": true, "pregnancy": false}
  position_specific_for JSONB DEFAULT '[]', -- ['quarterback', 'point_guard']
  energy_system TEXT CHECK (energy_system IN ('aerobic', 'anaerobic_lactic', 'anaerobic_alactic', 'mixed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. TRAINING PLANS
-- ============================================
CREATE TABLE IF NOT EXISTS training_plans (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INT NOT NULL CHECK (duration_weeks BETWEEN 1 AND 52),
  start_date DATE,
  end_date DATE,
  plan_type TEXT CHECK (plan_type IN ('strength', 'skill', 'hybrid', 'endurance', 'recovery')),
  periodization_phase TEXT CHECK (periodization_phase IN ('preparation', 'accumulation', 'intensification', 'realization', 'recovery')),

  -- AI Generation Info
  ai_generated BOOLEAN DEFAULT TRUE,
  ai_model TEXT,
  ai_prompt_version INT DEFAULT 1,
  generation_cost NUMERIC, -- Track cost per plan

  -- Plan Data
  plan_data JSONB NOT NULL, -- Complete plan structure

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'paused', 'archived')),
  completion_percentage INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. WORKOUT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS workout_logs (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id INT REFERENCES training_plans(id) ON DELETE SET NULL,

  -- Workout Info
  workout_date DATE NOT NULL,
  workout_type TEXT,
  workout_name TEXT,

  -- Performance Data
  exercises_completed JSONB DEFAULT '[]',
  duration_minutes INT,
  calories_burned INT,

  -- Subjective Measures
  rpe INT CHECK (rpe BETWEEN 1 AND 10), -- Rate of Perceived Exertion
  energy_level INT CHECK (energy_level BETWEEN 1 AND 10),
  soreness_level INT CHECK (soreness_level BETWEEN 1 AND 10),

  -- Notes
  notes TEXT,
  coach_feedback TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. NUTRITION LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,

  -- Meal Data
  meals JSONB DEFAULT '[]', -- Array of meal objects with timing, foods, macros

  -- Daily Totals
  total_calories INT,
  total_protein_g NUMERIC,
  total_carbs_g NUMERIC,
  total_fat_g NUMERIC,
  total_fiber_g NUMERIC,
  water_ml INT,

  -- Supplements
  supplements_taken JSONB DEFAULT '[]',

  -- Notes
  notes TEXT,
  energy_rating INT CHECK (energy_rating BETWEEN 1 AND 10),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. GOALS
-- ============================================
CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Goal Details
  category TEXT NOT NULL CHECK (category IN ('strength', 'endurance', 'skill', 'body_composition', 'performance', 'health', 'mental')),
  title TEXT NOT NULL,
  description TEXT,

  -- Measurable Targets
  target_value NUMERIC,
  target_unit TEXT,
  current_value NUMERIC,
  starting_value NUMERIC,

  -- Timeline
  target_date DATE,
  milestones JSONB DEFAULT '[]',

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  progress_percentage INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. MEDIA
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Media Info
  type TEXT NOT NULL CHECK (type IN ('photo', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,

  -- Metadata
  title TEXT,
  description TEXT,
  tags JSONB DEFAULT '[]',

  -- Analytics
  views INT DEFAULT 0,
  likes INT DEFAULT 0,

  -- Privacy
  is_public BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Achievement Info
  type TEXT NOT NULL CHECK (type IN ('milestone', 'streak', 'personal_record', 'challenge', 'badge')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Requirements
  requirement_type TEXT, -- 'workouts_completed', 'weight_lifted', 'distance_run', etc.
  requirement_value NUMERIC,

  -- Badge Info
  icon_name TEXT,
  badge_color TEXT,

  -- Status
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE
);

-- ============================================
-- 9. GRIT SCORES (Historical tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS grit_scores (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Score Components
  overall_score NUMERIC NOT NULL,
  consistency_score NUMERIC,
  intensity_score NUMERIC,
  improvement_score NUMERIC,
  mental_toughness_score NUMERIC,

  -- Calculation Metadata
  calculation_date DATE NOT NULL,
  data_points_used INT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. COACH RELATIONSHIPS (Future feature)
-- ============================================
CREATE TABLE IF NOT EXISTS coach_relationships (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Relationship Info
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  relationship_type TEXT CHECK (relationship_type IN ('personal', 'team', 'remote', 'ai_assisted')),

  -- Permissions
  can_view_workouts BOOLEAN DEFAULT TRUE,
  can_edit_plans BOOLEAN DEFAULT FALSE,
  can_view_nutrition BOOLEAN DEFAULT FALSE,
  can_message BOOLEAN DEFAULT TRUE,

  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,

  UNIQUE(athlete_id, coach_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_profiles_sport ON profiles(sport);
CREATE INDEX idx_profiles_position ON profiles(position);
CREATE INDEX idx_workout_logs_athlete_date ON workout_logs(athlete_id, workout_date DESC);
CREATE INDEX idx_nutrition_logs_athlete_date ON nutrition_logs(athlete_id, log_date DESC);
CREATE INDEX idx_training_plans_athlete_status ON training_plans(athlete_id, status);
CREATE INDEX idx_goals_athlete_status ON goals(athlete_id, status);
CREATE INDEX idx_achievements_athlete_type ON achievements(athlete_id, type);
CREATE INDEX idx_grit_scores_athlete_date ON grit_scores(athlete_id, calculation_date DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE grit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_relationships ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Users can view and edit their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Exercises: Everyone can read (public library)
CREATE POLICY "Anyone can read exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- Training Plans: Users can manage their own plans
CREATE POLICY "Users can view own plans"
  ON training_plans FOR SELECT
  USING (auth.uid() = athlete_id);

CREATE POLICY "Users can create own plans"
  ON training_plans FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Users can update own plans"
  ON training_plans FOR UPDATE
  USING (auth.uid() = athlete_id);

CREATE POLICY "Users can delete own plans"
  ON training_plans FOR DELETE
  USING (auth.uid() = athlete_id);

-- Workout Logs: Users can manage their own logs
CREATE POLICY "Users can view own workout logs"
  ON workout_logs FOR SELECT
  USING (auth.uid() = athlete_id);

CREATE POLICY "Users can create own workout logs"
  ON workout_logs FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Users can update own workout logs"
  ON workout_logs FOR UPDATE
  USING (auth.uid() = athlete_id);

-- Nutrition Logs: Users can manage their own logs
CREATE POLICY "Users can view own nutrition logs"
  ON nutrition_logs FOR SELECT
  USING (auth.uid() = athlete_id);

CREATE POLICY "Users can create own nutrition logs"
  ON nutrition_logs FOR INSERT
  WITH CHECK (auth.uid() = athlete_id);

CREATE POLICY "Users can update own nutrition logs"
  ON nutrition_logs FOR UPDATE
  USING (auth.uid() = athlete_id);

-- Goals: Users can manage their own goals
CREATE POLICY "Users can manage own goals"
  ON goals FOR ALL
  USING (auth.uid() = athlete_id);

-- Media: Users can manage their own media
CREATE POLICY "Users can manage own media"
  ON media FOR ALL
  USING (auth.uid() = athlete_id);

-- Public media can be viewed by anyone
CREATE POLICY "Anyone can view public media"
  ON media FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Achievements: Users can view their own achievements
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = athlete_id);

-- Grit Scores: Users can view their own scores
CREATE POLICY "Users can view own grit scores"
  ON grit_scores FOR SELECT
  USING (auth.uid() = athlete_id);

-- Coach Relationships: Both parties can view
CREATE POLICY "Users can view own coach relationships"
  ON coach_relationships FOR SELECT
  USING (auth.uid() = athlete_id OR auth.uid() = coach_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_plans_updated_at BEFORE UPDATE ON training_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL SEED DATA (Optional)
-- ============================================

-- You can uncomment and modify this section to add initial exercise data
/*
INSERT INTO exercises (name, category, muscle_groups, equipment_needed, difficulty_level, instructions) VALUES
  ('Push-up', 'strength', '["chest", "triceps", "shoulders"]', '[]', 1, 'Start in plank position, lower chest to ground, push back up'),
  ('Squat', 'strength', '["quadriceps", "glutes", "hamstrings"]', '[]', 1, 'Stand tall, lower hips back and down, stand back up'),
  ('Burpee', 'cardio', '["full_body"]', '[]', 3, 'Squat, jump back to plank, push-up, jump forward, jump up'),
  ('Plank', 'strength', '["core", "shoulders"]', '[]', 1, 'Hold body straight in push-up position on forearms');
*/

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- If you see this, the schema was created successfully!
-- Next steps:
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Populate the exercises table with your exercise library
-- 3. Update your application to use these tables