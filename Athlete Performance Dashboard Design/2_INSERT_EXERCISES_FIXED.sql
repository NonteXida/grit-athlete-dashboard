-- Insert exercises with explicit column names to avoid column order issues
-- This assumes the table has: id (auto), name, category, muscle_groups, equipment_needed, difficulty_level, instructions

INSERT INTO exercises (name, category, muscle_groups, equipment_needed, difficulty_level, instructions) VALUES
-- Strength exercises
('Barbell Squat', 'strength', '["quadriceps", "glutes", "hamstrings"]'::jsonb, '["barbell", "squat rack"]'::jsonb, 'intermediate', 'Position the barbell on your upper back, descend by bending knees and hips, then drive up through heels'),
('Bench Press', 'strength', '["chest", "triceps", "shoulders"]'::jsonb, '["barbell", "bench"]'::jsonb, 'intermediate', 'Lower the bar to chest level with control, then press up to full extension'),
('Deadlift', 'strength', '["hamstrings", "glutes", "lower back"]'::jsonb, '["barbell"]'::jsonb, 'intermediate', 'Hinge at hips, grip bar, drive through heels while maintaining neutral spine'),
('Power Clean', 'strength', '["full body"]'::jsonb, '["barbell"]'::jsonb, 'advanced', 'Explosive pull from floor, catch in front rack position'),
('Pull-ups', 'strength', '["back", "biceps"]'::jsonb, '["pull-up bar"]'::jsonb, 'intermediate', 'Hang from bar, pull body up until chin clears bar'),
('Push-ups', 'strength', '["chest", "triceps", "shoulders"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Maintain plank position, lower chest to floor, push back up'),
('Dumbbell Lunges', 'strength', '["quadriceps", "glutes"]'::jsonb, '["dumbbells"]'::jsonb, 'beginner', 'Step forward, lower back knee toward ground, drive through front heel to return'),
('Plank', 'strength', '["core"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Hold push-up position on forearms, maintain straight line from head to heels'),
('Romanian Deadlift', 'strength', '["hamstrings", "glutes"]'::jsonb, '["barbell"]'::jsonb, 'intermediate', 'Hip hinge movement focusing on hamstring stretch'),
('Overhead Press', 'strength', '["shoulders", "triceps"]'::jsonb, '["barbell"]'::jsonb, 'intermediate', 'Press bar overhead from shoulder level'),
('Dumbbell Row', 'strength', '["back", "biceps"]'::jsonb, '["dumbbells"]'::jsonb, 'beginner', 'Row weight to hip while maintaining neutral spine'),
('Front Squat', 'strength', '["quadriceps", "core"]'::jsonb, '["barbell"]'::jsonb, 'advanced', 'Squat with barbell in front rack position'),
('Hip Thrust', 'strength', '["glutes", "hamstrings"]'::jsonb, '["barbell", "bench"]'::jsonb, 'intermediate', 'Drive hips upward while shoulders rest on bench'),

-- Cardio exercises
('Sprint Intervals', 'cardio', '["full body"]'::jsonb, '["track or field"]'::jsonb, 'intermediate', 'Sprint at 90-95% effort for specified distance, recover, repeat'),
('Shuttle Runs', 'cardio', '["legs", "cardiovascular"]'::jsonb, '["cones"]'::jsonb, 'intermediate', 'Sprint to cone, touch ground, sprint back, repeat'),
('Bike Intervals', 'cardio', '["legs", "cardiovascular"]'::jsonb, '["stationary bike"]'::jsonb, 'beginner', 'Alternate between high intensity and recovery periods'),
('Rowing Machine', 'cardio', '["full body"]'::jsonb, '["rowing machine"]'::jsonb, 'intermediate', 'Drive with legs, lean back, pull with arms, return in reverse order'),
('Jump Rope', 'cardio', '["calves", "cardiovascular"]'::jsonb, '["jump rope"]'::jsonb, 'beginner', 'Jump with both feet, land softly, maintain rhythm'),
('Hill Sprints', 'cardio', '["legs", "cardiovascular"]'::jsonb, '["hill or incline"]'::jsonb, 'advanced', 'Sprint uphill at maximum effort'),
('Swimming Laps', 'cardio', '["full body"]'::jsonb, '["pool"]'::jsonb, 'intermediate', 'Continuous swimming with proper stroke technique'),
('Assault Bike', 'cardio', '["full body"]'::jsonb, '["assault bike"]'::jsonb, 'advanced', 'High-intensity intervals using arms and legs'),

-- Plyometric exercises
('Box Jumps', 'plyometric', '["legs", "glutes"]'::jsonb, '["plyometric box"]'::jsonb, 'intermediate', 'Jump explosively onto box, step down, repeat'),
('Medicine Ball Slams', 'plyometric', '["core", "shoulders"]'::jsonb, '["medicine ball"]'::jsonb, 'intermediate', 'Raise ball overhead, slam down with force, catch and repeat'),
('Depth Jumps', 'plyometric', '["legs"]'::jsonb, '["plyometric box"]'::jsonb, 'advanced', 'Step off box, land and immediately jump vertically'),
('Broad Jumps', 'plyometric', '["legs", "glutes"]'::jsonb, '["none"]'::jsonb, 'intermediate', 'Jump forward as far as possible, land softly'),
('Burpees', 'plyometric', '["full body"]'::jsonb, '["none"]'::jsonb, 'intermediate', 'Squat, jump back to plank, push-up, jump feet to hands, jump up'),
('Jump Squats', 'plyometric', '["legs", "glutes"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Squat down and explode upward into a jump'),
('Clap Push-ups', 'plyometric', '["chest", "triceps"]'::jsonb, '["none"]'::jsonb, 'advanced', 'Explosive push-up with clap at the top'),
('Single Leg Bounds', 'plyometric', '["legs"]'::jsonb, '["none"]'::jsonb, 'intermediate', 'Bound forward on one leg for distance'),
('Tuck Jumps', 'plyometric', '["legs", "core"]'::jsonb, '["none"]'::jsonb, 'intermediate', 'Jump and bring knees to chest'),

-- Agility exercises
('Ladder Drills', 'agility', '["legs", "coordination"]'::jsonb, '["agility ladder"]'::jsonb, 'beginner', 'Various footwork patterns through ladder rungs'),
('Cone Drills', 'agility', '["legs", "coordination"]'::jsonb, '["cones"]'::jsonb, 'beginner', 'Change direction quickly around cone pattern'),
('T-Drill', 'agility', '["legs"]'::jsonb, '["cones"]'::jsonb, 'intermediate', 'Sprint forward, shuffle laterally, backpedal in T pattern'),
('5-10-5 Drill', 'agility', '["legs"]'::jsonb, '["cones"]'::jsonb, 'intermediate', 'Sprint 5 yards, change direction, sprint 10 yards, change direction, sprint 5 yards'),
('L-Drill', 'agility', '["legs"]'::jsonb, '["cones"]'::jsonb, 'intermediate', 'Sprint, cut at 90 degrees in L pattern'),
('Box Drill', 'agility', '["legs"]'::jsonb, '["cones"]'::jsonb, 'intermediate', 'Sprint, shuffle, backpedal, shuffle in square pattern'),
('Figure 8 Drill', 'agility', '["legs"]'::jsonb, '["cones"]'::jsonb, 'beginner', 'Run figure 8 pattern around cones'),
('Zig-Zag Drill', 'agility', '["legs"]'::jsonb, '["cones"]'::jsonb, 'beginner', 'Sprint in zig-zag pattern through cones'),

-- Flexibility exercises
('Dynamic Warm-up', 'flexibility', '["full body"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Leg swings, arm circles, walking lunges, high knees'),
('Static Stretching', 'flexibility', '["full body"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Hold stretches for 20-30 seconds per muscle group'),
('Foam Rolling', 'flexibility', '["full body"]'::jsonb, '["foam roller"]'::jsonb, 'beginner', 'Roll slowly over muscle groups to release tension'),
('Yoga Flow', 'flexibility', '["full body"]'::jsonb, '["yoga mat"]'::jsonb, 'intermediate', 'Series of yoga poses for flexibility and balance'),
('PNF Stretching', 'flexibility', '["targeted muscles"]'::jsonb, '["partner or band"]'::jsonb, 'advanced', 'Contract-relax stretching technique'),
('Dynamic Leg Swings', 'flexibility', '["hips", "legs"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Controlled leg swings in multiple directions'),
('Shoulder Dislocations', 'flexibility', '["shoulders"]'::jsonb, '["resistance band"]'::jsonb, 'intermediate', 'Rotate shoulders with band for mobility'),

-- Core exercises
('Russian Twists', 'core', '["obliques", "abs"]'::jsonb, '["medicine ball"]'::jsonb, 'intermediate', 'Rotate torso side to side with weight'),
('Bicycle Crunches', 'core', '["abs", "obliques"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Alternating elbow to opposite knee'),
('Dead Bug', 'core', '["abs"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Opposite arm and leg extensions while lying'),
('Pallof Press', 'core', '["core"]'::jsonb, '["cable or band"]'::jsonb, 'intermediate', 'Anti-rotation exercise with cable resistance'),
('Hanging Knee Raises', 'core', '["abs", "hip flexors"]'::jsonb, '["pull-up bar"]'::jsonb, 'intermediate', 'Hang from bar and raise knees to chest'),
('Ab Wheel Rollout', 'core', '["abs"]'::jsonb, '["ab wheel"]'::jsonb, 'advanced', 'Roll wheel forward and back maintaining core tension'),
('Bird Dog', 'core', '["core", "back"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Opposite arm and leg raise from quadruped position'),

-- Olympic lifts
('Snatch', 'olympic', '["full body"]'::jsonb, '["barbell"]'::jsonb, 'advanced', 'Explosive lift from floor to overhead in one motion'),
('Clean and Jerk', 'olympic', '["full body"]'::jsonb, '["barbell"]'::jsonb, 'advanced', 'Clean to shoulders, then jerk overhead'),
('Hang Clean', 'olympic', '["full body"]'::jsonb, '["barbell"]'::jsonb, 'intermediate', 'Clean from hang position above knees'),
('Push Jerk', 'olympic', '["shoulders", "legs"]'::jsonb, '["barbell"]'::jsonb, 'intermediate', 'Drive bar overhead with leg assistance'),

-- Sport-specific skill work
('Quarterback Drops', 'skill', '["legs", "coordination"]'::jsonb, '["none"]'::jsonb, 'intermediate', '3-step, 5-step, and 7-step drops with proper footwork'),
('Dribbling Drills', 'skill', '["coordination"]'::jsonb, '["basketball"]'::jsonb, 'beginner', 'Crossovers, between legs, behind back dribbling patterns'),
('Batting Practice', 'skill', '["core", "arms"]'::jsonb, '["bat", "balls"]'::jsonb, 'intermediate', 'Tee work, soft toss, live pitching practice'),
('Shooting Drills', 'skill', '["arms", "coordination"]'::jsonb, '["basketball", "hoop"]'::jsonb, 'beginner', 'Form shooting, spot shooting, game-speed shooting'),
('Passing Drills', 'skill', '["arms", "core"]'::jsonb, '["soccer ball"]'::jsonb, 'beginner', 'Short passes, long passes, one-touch passing'),
('Route Running', 'skill', '["legs", "coordination"]'::jsonb, '["cones"]'::jsonb, 'intermediate', 'Practice precise route patterns for football'),
('Defensive Slides', 'skill', '["legs"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Lateral defensive movement for basketball'),
('Tackling Drills', 'skill', '["full body"]'::jsonb, '["tackling dummy"]'::jsonb, 'intermediate', 'Proper form tackling technique'),

-- Recovery exercises
('Light Jog', 'recovery', '["legs"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Easy pace jogging for active recovery'),
('Walking', 'recovery', '["full body"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Low-intensity walking for recovery'),
('Swimming Easy', 'recovery', '["full body"]'::jsonb, '["pool"]'::jsonb, 'beginner', 'Light swimming for active recovery'),
('Mobility Work', 'recovery', '["full body"]'::jsonb, '["none"]'::jsonb, 'beginner', 'Joint circles and gentle movement patterns');