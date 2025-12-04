-- Create exercises table if it doesn't exist
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100), -- strength, cardio, plyometric, agility, flexibility
  muscle_groups TEXT[], -- array of muscle groups
  equipment_needed TEXT[], -- array of equipment
  difficulty_level VARCHAR(50), -- beginner, intermediate, advanced
  sport_specificity TEXT[], -- array of sports this exercise is good for
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all authenticated users
CREATE POLICY "Exercises are viewable by all authenticated users"
  ON exercises
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Insert sample exercises for various sports
INSERT INTO exercises (name, category, muscle_groups, equipment_needed, difficulty_level, sport_specificity, instructions) VALUES
-- Strength exercises
('Barbell Squat', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['barbell', 'squat rack'], 'intermediate', ARRAY['football', 'basketball', 'soccer'], 'Position the barbell on your upper back, descend by bending knees and hips, then drive up through heels'),
('Bench Press', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'intermediate', ARRAY['football', 'basketball', 'baseball'], 'Lower the bar to chest level with control, then press up to full extension'),
('Deadlift', 'strength', ARRAY['hamstrings', 'glutes', 'lower back'], ARRAY['barbell'], 'intermediate', ARRAY['football', 'track', 'wrestling'], 'Hinge at hips, grip bar, drive through heels while maintaining neutral spine'),
('Power Clean', 'strength', ARRAY['full body'], ARRAY['barbell'], 'advanced', ARRAY['football', 'basketball', 'track'], 'Explosive pull from floor, catch in front rack position'),
('Pull-ups', 'strength', ARRAY['back', 'biceps'], ARRAY['pull-up bar'], 'intermediate', ARRAY['all'], 'Hang from bar, pull body up until chin clears bar'),
('Push-ups', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['none'], 'beginner', ARRAY['all'], 'Maintain plank position, lower chest to floor, push back up'),
('Dumbbell Lunges', 'strength', ARRAY['quadriceps', 'glutes'], ARRAY['dumbbells'], 'beginner', ARRAY['all'], 'Step forward, lower back knee toward ground, drive through front heel to return'),
('Plank', 'strength', ARRAY['core'], ARRAY['none'], 'beginner', ARRAY['all'], 'Hold push-up position on forearms, maintain straight line from head to heels'),

-- Cardio exercises
('Sprint Intervals', 'cardio', ARRAY['full body'], ARRAY['track or field'], 'intermediate', ARRAY['football', 'soccer', 'basketball'], 'Sprint at 90-95% effort for specified distance, recover, repeat'),
('Shuttle Runs', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['cones'], 'intermediate', ARRAY['basketball', 'soccer', 'tennis'], 'Sprint to cone, touch ground, sprint back, repeat'),
('Bike Intervals', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['stationary bike'], 'beginner', ARRAY['all'], 'Alternate between high intensity and recovery periods'),
('Rowing Machine', 'cardio', ARRAY['full body'], ARRAY['rowing machine'], 'intermediate', ARRAY['all'], 'Drive with legs, lean back, pull with arms, return in reverse order'),
('Jump Rope', 'cardio', ARRAY['calves', 'cardiovascular'], ARRAY['jump rope'], 'beginner', ARRAY['boxing', 'basketball'], 'Jump with both feet, land softly, maintain rhythm'),

-- Plyometric exercises
('Box Jumps', 'plyometric', ARRAY['legs', 'glutes'], ARRAY['plyometric box'], 'intermediate', ARRAY['basketball', 'volleyball', 'football'], 'Jump explosively onto box, step down, repeat'),
('Medicine Ball Slams', 'plyometric', ARRAY['core', 'shoulders'], ARRAY['medicine ball'], 'intermediate', ARRAY['all'], 'Raise ball overhead, slam down with force, catch and repeat'),
('Depth Jumps', 'plyometric', ARRAY['legs'], ARRAY['plyometric box'], 'advanced', ARRAY['basketball', 'volleyball'], 'Step off box, land and immediately jump vertically'),
('Broad Jumps', 'plyometric', ARRAY['legs', 'glutes'], ARRAY['none'], 'intermediate', ARRAY['track', 'football'], 'Jump forward as far as possible, land softly'),
('Burpees', 'plyometric', ARRAY['full body'], ARRAY['none'], 'intermediate', ARRAY['all'], 'Squat, jump back to plank, push-up, jump feet to hands, jump up'),

-- Agility exercises
('Ladder Drills', 'agility', ARRAY['legs', 'coordination'], ARRAY['agility ladder'], 'beginner', ARRAY['soccer', 'basketball', 'tennis'], 'Various footwork patterns through ladder rungs'),
('Cone Drills', 'agility', ARRAY['legs', 'coordination'], ARRAY['cones'], 'beginner', ARRAY['all'], 'Change direction quickly around cone pattern'),
('T-Drill', 'agility', ARRAY['legs'], ARRAY['cones'], 'intermediate', ARRAY['basketball', 'soccer', 'tennis'], 'Sprint forward, shuffle laterally, backpedal in T pattern'),
('5-10-5 Drill', 'agility', ARRAY['legs'], ARRAY['cones'], 'intermediate', ARRAY['football', 'basketball'], 'Sprint 5 yards, change direction, sprint 10 yards, change direction, sprint 5 yards'),

-- Flexibility exercises
('Dynamic Warm-up', 'flexibility', ARRAY['full body'], ARRAY['none'], 'beginner', ARRAY['all'], 'Leg swings, arm circles, walking lunges, high knees'),
('Static Stretching', 'flexibility', ARRAY['full body'], ARRAY['none'], 'beginner', ARRAY['all'], 'Hold stretches for 20-30 seconds per muscle group'),
('Foam Rolling', 'flexibility', ARRAY['full body'], ARRAY['foam roller'], 'beginner', ARRAY['all'], 'Roll slowly over muscle groups to release tension'),
('Yoga Flow', 'flexibility', ARRAY['full body'], ARRAY['yoga mat'], 'intermediate', ARRAY['all'], 'Series of yoga poses for flexibility and balance'),

-- Sport-specific exercises
('Quarterback Drops', 'skill', ARRAY['legs', 'coordination'], ARRAY['none'], 'intermediate', ARRAY['football'], '3-step, 5-step, and 7-step drops with proper footwork'),
('Dribbling Drills', 'skill', ARRAY['coordination'], ARRAY['basketball'], 'beginner', ARRAY['basketball'], 'Crossovers, between legs, behind back dribbling patterns'),
('Batting Practice', 'skill', ARRAY['core', 'arms'], ARRAY['bat', 'balls'], 'intermediate', ARRAY['baseball', 'softball'], 'Tee work, soft toss, live pitching practice'),
('Shooting Drills', 'skill', ARRAY['arms', 'coordination'], ARRAY['basketball', 'hoop'], 'beginner', ARRAY['basketball'], 'Form shooting, spot shooting, game-speed shooting'),
('Passing Drills', 'skill', ARRAY['arms', 'core'], ARRAY['soccer ball'], 'beginner', ARRAY['soccer'], 'Short passes, long passes, one-touch passing');

-- Add indexes for better query performance
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX idx_exercises_sport ON exercises USING gin(sport_specificity);