-- GRIT Athlete Dashboard - Journal & Enhanced Workout Schema Extensions
-- Run this AFTER schema.sql to add journaling capabilities
-- Created: December 2024

-- ============================================
-- PRACTICE/GAME JOURNALS
-- ============================================
CREATE TABLE IF NOT EXISTS practice_game_journals (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Event Information
  event_type TEXT NOT NULL CHECK (event_type IN ('practice', 'game', 'scrimmage', 'tournament', 'tryout')),
  event_date DATE NOT NULL,
  event_time TIME,
  duration_minutes INT,

  -- Performance Metrics
  performance_rating INT CHECK (performance_rating BETWEEN 1 AND 10), -- Self-assessment
  energy_level INT CHECK (energy_level BETWEEN 1 AND 10),
  focus_level INT CHECK (focus_level BETWEEN 1 AND 10),
  execution_quality INT CHECK (execution_quality BETWEEN 1 AND 10),

  -- Sport-Specific Stats (JSONB for flexibility)
  stats JSONB DEFAULT '{}', -- e.g., {"goals": 2, "assists": 1, "saves": 5}

  -- Narrative Journal
  what_went_well TEXT,
  what_to_improve TEXT,
  key_moments TEXT,
  coach_feedback TEXT,

  -- Physical Feedback
  soreness_areas JSONB DEFAULT '[]', -- ["hamstrings", "shoulders"]
  injury_notes TEXT,
  fatigue_level INT CHECK (fatigue_level BETWEEN 1 AND 10),

  -- Mental/Emotional State
  confidence_level INT CHECK (confidence_level BETWEEN 1 AND 10),
  stress_level INT CHECK (stress_level BETWEEN 1 AND 10),
  enjoyment_level INT CHECK (enjoyment_level BETWEEN 1 AND 10),
  mental_notes TEXT,

  -- Tags for AI Analysis
  tags JSONB DEFAULT '[]', -- ["great_performance", "needs_recovery", "injury_risk"]

  -- AI Insights (populated after analysis)
  ai_insights JSONB DEFAULT '{}',
  ai_recommendations JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENHANCED WORKOUT LOGS (Additional fields)
-- ============================================
ALTER TABLE workout_logs
ADD COLUMN IF NOT EXISTS completion_status TEXT DEFAULT 'completed'
  CHECK (completion_status IN ('completed', 'partial', 'failed', 'modified')),
ADD COLUMN IF NOT EXISTS modification_reason TEXT,
ADD COLUMN IF NOT EXISTS actual_vs_prescribed JSONB DEFAULT '{}', -- Track what was prescribed vs what was done
ADD COLUMN IF NOT EXISTS performance_metrics JSONB DEFAULT '{}', -- Speed, power, heart rate, etc.
ADD COLUMN IF NOT EXISTS technique_notes TEXT,
ADD COLUMN IF NOT EXISTS motivation_level INT CHECK (motivation_level BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS perceived_difficulty INT CHECK (perceived_difficulty BETWEEN 1 AND 10),
ADD COLUMN IF NOT EXISTS would_repeat BOOLEAN,
ADD COLUMN IF NOT EXISTS environmental_factors JSONB DEFAULT '{}', -- Temperature, humidity, altitude
ADD COLUMN IF NOT EXISTS pre_workout_state JSONB DEFAULT '{}', -- Sleep quality, nutrition, stress
ADD COLUMN IF NOT EXISTS post_workout_recovery JSONB DEFAULT '{}'; -- Recovery methods used

-- ============================================
-- PERFORMANCE TRENDS (For AI Analysis)
-- ============================================
CREATE TABLE IF NOT EXISTS performance_trends (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Trend Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT CHECK (period_type IN ('week', 'month', 'season', 'custom')),

  -- Aggregated Metrics
  avg_performance_rating NUMERIC,
  avg_energy_level NUMERIC,
  avg_rpe NUMERIC,
  avg_soreness NUMERIC,

  -- Training Load
  total_training_minutes INT,
  total_practice_minutes INT,
  total_game_minutes INT,
  training_load_score NUMERIC, -- Calculated metric

  -- Progress Indicators
  strength_progress JSONB DEFAULT '{}',
  skill_progress JSONB DEFAULT '{}',
  endurance_progress JSONB DEFAULT '{}',

  -- AI Analysis
  trend_direction TEXT CHECK (trend_direction IN ('improving', 'maintaining', 'declining', 'variable')),
  fatigue_risk_level TEXT CHECK (fatigue_risk_level IN ('low', 'moderate', 'high', 'critical')),
  readiness_score NUMERIC,

  -- Recommendations
  ai_observations JSONB DEFAULT '[]',
  adjustment_recommendations JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AI PLAN ADJUSTMENTS (Track all AI modifications)
-- ============================================
CREATE TABLE IF NOT EXISTS plan_adjustments (
  id SERIAL PRIMARY KEY,
  plan_id INT REFERENCES training_plans(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Adjustment Details
  adjustment_date TIMESTAMPTZ DEFAULT NOW(),
  adjustment_type TEXT CHECK (adjustment_type IN ('auto', 'manual', 'coach', 'ai_suggested')),
  adjustment_reason TEXT NOT NULL,

  -- Trigger Data
  trigger_source TEXT, -- 'workout_log', 'journal_entry', 'performance_trend'
  trigger_id INT, -- ID of the triggering record
  trigger_data JSONB DEFAULT '{}', -- Relevant data that triggered adjustment

  -- Changes Made
  previous_plan JSONB NOT NULL,
  updated_plan JSONB NOT NULL,
  changes_summary JSONB DEFAULT '[]',

  -- AI Metadata
  ai_model TEXT,
  ai_confidence_score NUMERIC,
  ai_reasoning TEXT,

  -- Approval Status
  status TEXT DEFAULT 'applied' CHECK (status IN ('pending', 'applied', 'rejected', 'reverted')),
  reviewed_by UUID REFERENCES profiles(id),
  review_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FEEDBACK SIGNALS (For AI Learning)
-- ============================================
CREATE TABLE IF NOT EXISTS feedback_signals (
  id SERIAL PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Signal Source
  source_type TEXT NOT NULL, -- 'workout', 'journal', 'manual'
  source_id INT,

  -- Signal Data
  signal_type TEXT NOT NULL, -- 'too_easy', 'too_hard', 'injury', 'great_progress'
  signal_strength NUMERIC, -- 0-1 scale
  context JSONB DEFAULT '{}',

  -- Processing Status
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  applied_to_plan_id INT REFERENCES training_plans(id),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_practice_game_journals_athlete_date
  ON practice_game_journals(athlete_id, event_date DESC);
CREATE INDEX idx_practice_game_journals_event_type
  ON practice_game_journals(event_type);
CREATE INDEX idx_performance_trends_athlete_period
  ON performance_trends(athlete_id, period_end DESC);
CREATE INDEX idx_plan_adjustments_plan
  ON plan_adjustments(plan_id, adjustment_date DESC);
CREATE INDEX idx_feedback_signals_athlete_processed
  ON feedback_signals(athlete_id, processed);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE practice_game_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_signals ENABLE ROW LEVEL SECURITY;

-- Policies for practice_game_journals
CREATE POLICY "Users can manage own journals"
  ON practice_game_journals FOR ALL
  USING (auth.uid() = athlete_id);

-- Policies for performance_trends
CREATE POLICY "Users can view own trends"
  ON performance_trends FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policies for plan_adjustments
CREATE POLICY "Users can view own plan adjustments"
  ON plan_adjustments FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policies for feedback_signals
CREATE POLICY "Users can manage own feedback"
  ON feedback_signals FOR ALL
  USING (auth.uid() = athlete_id);

-- ============================================
-- TRIGGER FOR FEEDBACK SIGNAL GENERATION
-- ============================================
CREATE OR REPLACE FUNCTION generate_feedback_signals()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate feedback signals based on workout completion
  IF TG_TABLE_NAME = 'workout_logs' THEN
    -- Signal if workout was too hard
    IF NEW.rpe > 8 OR NEW.completion_status = 'failed' THEN
      INSERT INTO feedback_signals (athlete_id, source_type, source_id, signal_type, signal_strength)
      VALUES (NEW.athlete_id, 'workout', NEW.id, 'too_hard', LEAST(NEW.rpe / 10.0, 1.0));
    END IF;

    -- Signal if workout was too easy
    IF NEW.rpe < 4 AND NEW.completion_status = 'completed' THEN
      INSERT INTO feedback_signals (athlete_id, source_type, source_id, signal_type, signal_strength)
      VALUES (NEW.athlete_id, 'workout', NEW.id, 'too_easy', (5 - NEW.rpe) / 5.0);
    END IF;
  END IF;

  -- Generate feedback signals based on journal entries
  IF TG_TABLE_NAME = 'practice_game_journals' THEN
    -- Signal if high fatigue
    IF NEW.fatigue_level > 7 THEN
      INSERT INTO feedback_signals (athlete_id, source_type, source_id, signal_type, signal_strength)
      VALUES (NEW.athlete_id, 'journal', NEW.id, 'high_fatigue', NEW.fatigue_level / 10.0);
    END IF;

    -- Signal great progress
    IF NEW.performance_rating >= 9 THEN
      INSERT INTO feedback_signals (athlete_id, source_type, source_id, signal_type, signal_strength)
      VALUES (NEW.athlete_id, 'journal', NEW.id, 'great_progress', NEW.performance_rating / 10.0);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to workout_logs
CREATE TRIGGER workout_feedback_trigger
  AFTER INSERT OR UPDATE ON workout_logs
  FOR EACH ROW EXECUTE FUNCTION generate_feedback_signals();

-- Apply trigger to practice_game_journals
CREATE TRIGGER journal_feedback_trigger
  AFTER INSERT OR UPDATE ON practice_game_journals
  FOR EACH ROW EXECUTE FUNCTION generate_feedback_signals();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- Journal and enhanced workout schema created successfully!
-- This enables:
-- 1. Practice/game journaling with performance tracking
-- 2. Enhanced workout logs with completion status and modifications
-- 3. Performance trend analysis for AI
-- 4. Plan adjustment tracking
-- 5. Feedback signal generation for dynamic adjustments