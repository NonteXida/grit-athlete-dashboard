-- GRIT Athlete Dashboard - Exercise Library Seed Data
-- Run this AFTER schema.sql to populate initial exercises
-- Organized by category and difficulty

-- ============================================
-- STRENGTH EXERCISES - BODYWEIGHT (Difficulty 1-2)
-- ============================================
INSERT INTO exercises (name, category, muscle_groups, equipment_needed, difficulty_level, instructions, form_cues, energy_system) VALUES
-- Basic Bodyweight
('Push-up', 'strength', '["chest", "triceps", "shoulders", "core"]', '[]', 1,
 'Start in plank position with hands shoulder-width apart. Lower chest to ground maintaining straight line from head to heels. Push back up to starting position.',
 '["Keep core tight", "Elbows at 45 degrees", "Full range of motion"]', 'anaerobic_lactic'),

('Bodyweight Squat', 'strength', '["quadriceps", "glutes", "hamstrings"]', '[]', 1,
 'Stand with feet shoulder-width apart. Lower hips back and down as if sitting in a chair. Drive through heels to return to standing.',
 '["Knees track over toes", "Chest up", "Weight in heels"]', 'anaerobic_lactic'),

('Plank', 'strength', '["core", "shoulders", "glutes"]', '[]', 1,
 'Hold body in straight line on forearms and toes. Keep hips level and core engaged throughout.',
 '["Neutral spine", "Breathe normally", "Squeeze glutes"]', 'anaerobic_alactic'),

('Lunges', 'strength', '["quadriceps", "glutes", "hamstrings", "calves"]', '[]', 1,
 'Step forward and lower back knee toward ground. Push through front heel to return to standing. Alternate legs.',
 '["90-degree angles", "Upright torso", "Controlled movement"]', 'anaerobic_lactic'),

('Pull-up', 'strength', '["back", "biceps", "core"]', '["pull_up_bar"]', 3,
 'Hang from bar with overhand grip. Pull body up until chin clears bar. Lower with control.',
 '["Full extension at bottom", "No kipping", "Engage lats"]', 'anaerobic_lactic'),

('Dips', 'strength', '["triceps", "chest", "shoulders"]', '["dip_bars", "bench"]', 2,
 'Support body on bars or bench edge. Lower body by bending elbows to 90 degrees. Push back up.',
 '["Lean forward slightly", "Elbows close to body", "Control descent"]', 'anaerobic_lactic'),

-- ============================================
-- STRENGTH EXERCISES - WEIGHTED (Difficulty 2-4)
-- ============================================
('Barbell Back Squat', 'strength', '["quadriceps", "glutes", "hamstrings", "core"]', '["barbell", "squat_rack"]', 3,
 'Position bar on upper traps. Unrack and step back. Lower hips below parallel. Drive up through heels.',
 '["Maintain neutral spine", "Knees out", "Big breath at top"]', 'anaerobic_lactic'),

('Bench Press', 'strength', '["chest", "triceps", "shoulders"]', '["barbell", "bench", "rack"]', 3,
 'Lie on bench, grip bar slightly wider than shoulders. Lower to chest with control. Press up to full extension.',
 '["Feet flat on floor", "Maintain arch", "Bar path over mid-chest"]', 'anaerobic_lactic'),

('Deadlift', 'strength', '["hamstrings", "glutes", "back", "traps", "core"]', '["barbell"]', 4,
 'Stand with feet hip-width apart. Hinge at hips, grip bar. Drive through heels and hips to stand tall.',
 '["Neutral spine throughout", "Bar close to body", "Lock out hips and knees"]', 'anaerobic_alactic'),

('Overhead Press', 'strength', '["shoulders", "triceps", "core"]', '["barbell", "dumbbells"]', 2,
 'Hold weight at shoulders. Press overhead to full extension. Lower with control.',
 '["Core tight", "No back lean", "Full lockout"]', 'anaerobic_lactic'),

('Bent-Over Row', 'strength', '["back", "biceps", "rear_delts"]', '["barbell", "dumbbells"]', 2,
 'Hinge at hips, grip weight. Pull to lower chest/upper abdomen. Squeeze shoulder blades together.',
 '["Maintain hip hinge", "Elbows close", "No momentum"]', 'anaerobic_lactic'),

('Romanian Deadlift', 'strength', '["hamstrings", "glutes", "back"]', '["barbell", "dumbbells"]', 2,
 'Hold weight at hips. Push hips back while lowering weight. Feel stretch in hamstrings. Return to standing.',
 '["Soft knee bend", "Weight close to legs", "Hip drive to return"]', 'anaerobic_lactic'),

-- ============================================
-- CARDIO EXERCISES (Difficulty 1-3)
-- ============================================
('Running', 'cardio', '["legs", "cardiovascular"]', '[]', 1,
 'Maintain steady pace with proper running form. Land midfoot, arms at 90 degrees.',
 '["Relaxed shoulders", "Cadence 170-180 spm", "Breathe rhythmically"]', 'aerobic'),

('Burpees', 'cardio', '["full_body"]', '[]', 3,
 'Squat down, jump back to plank, perform push-up, jump feet forward, jump up with arms overhead.',
 '["Stay low in squat", "Land softly", "Maintain rhythm"]', 'anaerobic_lactic'),

('Mountain Climbers', 'cardio', '["core", "shoulders", "legs"]', '[]', 2,
 'Hold plank position. Alternate driving knees toward chest rapidly.',
 '["Hips down", "Core tight", "Quick feet"]', 'anaerobic_lactic'),

('Jump Rope', 'cardio', '["calves", "shoulders", "cardiovascular"]', '["jump_rope"]', 2,
 'Jump with both feet, rotating rope with wrists. Maintain rhythm and posture.',
 '["Stay on balls of feet", "Minimal jump height", "Wrists do work"]', 'mixed'),

('Box Jumps', 'cardio', '["legs", "glutes"]', '["box", "platform"]', 2,
 'Stand facing box. Jump up landing softly on box. Step down and repeat.',
 '["Full hip extension", "Soft landing", "Step down safely"]', 'anaerobic_alactic'),

-- ============================================
-- SPORT-SPECIFIC EXERCISES (Difficulty 2-4)
-- ============================================
-- Football Specific
('3-Cone Drill', 'skill', '["agility", "quickness"]', '["cones"]', 2,
 'Sprint to first cone, back to start, around second cone, figure-8 around third cone.',
 '["Stay low", "Quick feet", "Sharp cuts"]', 'anaerobic_alactic'),

('Sled Push', 'strength', '["legs", "glutes", "core"]', '["sled"]', 3,
 'Drive sled forward with arms extended. Push through legs maintaining forward lean.',
 '["Drive through balls of feet", "Core engaged", "Maintain posture"]', 'anaerobic_lactic'),

-- Basketball Specific
('Defensive Slides', 'skill', '["legs", "agility"]', '[]', 1,
 'Maintain athletic stance. Slide laterally without crossing feet.',
 '["Stay low", "Active hands", "Quick feet"]', 'anaerobic_lactic'),

('Vertical Jump Training', 'plyometric', '["legs", "glutes"]', '[]', 2,
 'Quick dip, explosive jump reaching maximum height. Land softly and reset.',
 '["Full hip extension", "Arm drive", "Soft landing"]', 'anaerobic_alactic'),

-- Soccer Specific
('Cone Weaving', 'skill', '["agility", "coordination"]', '["cones", "soccer_ball"]', 2,
 'Dribble ball through cone pattern using both feet.',
 '["Close control", "Head up", "Use both feet"]', 'mixed'),

-- ============================================
-- MOBILITY/RECOVERY EXERCISES (Difficulty 1)
-- ============================================
('Dynamic Warm-up', 'mobility', '["full_body"]', '[]', 1,
 'Series of movement patterns: leg swings, arm circles, hip circles, walking lunges.',
 '["Controlled movement", "Full range of motion", "Gradually increase intensity"]', 'aerobic'),

('Foam Rolling', 'recovery', '["targeted_muscles"]', '["foam_roller"]', 1,
 'Roll targeted muscle groups slowly, pausing on tight spots.',
 '["Breathe deeply", "30-60 seconds per area", "Avoid bones/joints"]', 'aerobic'),

('Static Stretching', 'mobility', '["targeted_muscles"]', '[]', 1,
 'Hold stretches for major muscle groups 30-60 seconds each.',
 '["No bouncing", "Breathe normally", "Mild tension only"]', 'aerobic'),

('Yoga Flow', 'mobility', '["full_body", "core"]', '["yoga_mat"]', 2,
 'Series of yoga poses focusing on flexibility and breathing.',
 '["Synchronize breath", "Hold positions", "Focus on form"]', 'aerobic'),

-- ============================================
-- OLYMPIC LIFTS (Difficulty 4-5)
-- ============================================
('Power Clean', 'strength', '["full_body", "explosive"]', '["barbell", "bumper_plates"]', 5,
 'Explosive pull from floor, catch in front rack position.',
 '["Triple extension", "Fast elbows", "Athletic catch"]', 'anaerobic_alactic'),

('Snatch', 'strength', '["full_body", "explosive"]', '["barbell", "bumper_plates"]', 5,
 'Explosive pull from floor to overhead in one motion.',
 '["Wide grip", "Bar close", "Stable overhead"]', 'anaerobic_alactic'),

-- ============================================
-- CORE SPECIFIC (Difficulty 1-3)
-- ============================================
('Bicycle Crunches', 'strength', '["core", "obliques"]', '[]', 1,
 'Lie on back, bring opposite elbow to knee while extending other leg.',
 '["Control the motion", "Dont pull neck", "Full extension"]', 'anaerobic_lactic'),

('Russian Twists', 'strength', '["core", "obliques"]', '["medicine_ball", "dumbbell"]', 2,
 'Sit with knees bent, lean back slightly, rotate side to side with weight.',
 '["Chest up", "Control rotation", "Breathe steadily"]', 'anaerobic_lactic'),

('Hanging Knee Raises', 'strength', '["core", "hip_flexors"]', '["pull_up_bar"]', 3,
 'Hang from bar, raise knees to chest, lower with control.',
 '["Minimize swing", "Full contraction", "Control descent"]', 'anaerobic_lactic'),

('Ab Wheel Rollout', 'strength', '["core", "shoulders"]', '["ab_wheel"]', 4,
 'Kneel with wheel, roll forward maintaining straight line, pull back to start.',
 '["Neutral spine", "Go only as far as control allows", "Engage lats"]', 'anaerobic_lactic'),

-- ============================================
-- PLYOMETRIC EXERCISES (Difficulty 2-4)
-- ============================================
('Depth Jumps', 'plyometric', '["legs", "explosive"]', '["box"]', 4,
 'Step off box, immediately jump up upon landing.',
 '["Minimal ground contact", "Maximum height", "Soft landing"]', 'anaerobic_alactic'),

('Medicine Ball Slams', 'plyometric', '["core", "shoulders"]', '["medicine_ball"]', 2,
 'Raise ball overhead, slam down with full force, catch on bounce.',
 '["Full body motion", "Explosive", "Stay athletic"]', 'anaerobic_alactic'),

('Broad Jumps', 'plyometric', '["legs", "glutes"]', '[]', 2,
 'Jump forward as far as possible, landing softly.',
 '["Arm drive", "Full extension", "Stick landing"]', 'anaerobic_alactic'),

('Split Jump Lunges', 'plyometric', '["legs", "glutes"]', '[]', 3,
 'Jump from lunge position, switch legs in air, land in opposite lunge.',
 '["Explosive jump", "Quick switch", "Soft landing"]', 'anaerobic_lactic');

-- ============================================
-- Update position-specific tags
-- ============================================
UPDATE exercises SET position_specific_for = '["quarterback", "pitcher"]'
WHERE name IN ('Overhead Press', 'Medicine Ball Slams');

UPDATE exercises SET position_specific_for = '["running_back", "linebacker"]'
WHERE name IN ('Sled Push', '3-Cone Drill');

UPDATE exercises SET position_specific_for = '["point_guard", "shooting_guard"]'
WHERE name IN ('Defensive Slides', 'Vertical Jump Training');

UPDATE exercises SET position_specific_for = '["lineman", "wrestler"]'
WHERE name IN ('Power Clean', 'Deadlift', 'Sled Push');

-- ============================================
-- Add contraindications for safety
-- ============================================
UPDATE exercises SET contraindications = '{"knee_pain": true, "pregnancy": false}'
WHERE name IN ('Jump Rope', 'Box Jumps', 'Split Jump Lunges', 'Depth Jumps');

UPDATE exercises SET contraindications = '{"back_pain": true, "pregnancy": true}'
WHERE name IN ('Deadlift', 'Power Clean', 'Snatch');

UPDATE exercises SET contraindications = '{"shoulder_injury": true}'
WHERE name IN ('Overhead Press', 'Snatch', 'Bench Press');

UPDATE exercises SET contraindications = '{"pregnancy": true}'
WHERE name IN ('Plank', 'Ab Wheel Rollout', 'Russian Twists') AND category = 'strength';

-- ============================================
-- Success Message
-- ============================================
-- Initial exercise library populated with 40+ exercises!
-- You can add more sport-specific exercises as needed.