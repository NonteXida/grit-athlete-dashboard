-- Insert exercises with correct column types
-- difficulty_level is INTEGER: 1 = beginner, 2 = intermediate, 3 = advanced
-- Column order: name, category, difficulty_level, instructions, muscle_groups, equipment_needed

INSERT INTO exercises (name, category, difficulty_level, instructions, muscle_groups, equipment_needed) VALUES
-- Strength exercises (difficulty: 1=beginner, 2=intermediate, 3=advanced)
('Barbell Squat', 'strength', 2, 'Position the barbell on your upper back, descend by bending knees and hips, then drive up through heels', '["quadriceps", "glutes", "hamstrings"]'::jsonb, '["barbell", "squat rack"]'::jsonb),
('Bench Press', 'strength', 2, 'Lower the bar to chest level with control, then press up to full extension', '["chest", "triceps", "shoulders"]'::jsonb, '["barbell", "bench"]'::jsonb),
('Deadlift', 'strength', 2, 'Hinge at hips, grip bar, drive through heels while maintaining neutral spine', '["hamstrings", "glutes", "lower back"]'::jsonb, '["barbell"]'::jsonb),
('Power Clean', 'strength', 3, 'Explosive pull from floor, catch in front rack position', '["full body"]'::jsonb, '["barbell"]'::jsonb),
('Pull-ups', 'strength', 2, 'Hang from bar, pull body up until chin clears bar', '["back", "biceps"]'::jsonb, '["pull-up bar"]'::jsonb),
('Push-ups', 'strength', 1, 'Maintain plank position, lower chest to floor, push back up', '["chest", "triceps", "shoulders"]'::jsonb, '["none"]'::jsonb),
('Dumbbell Lunges', 'strength', 1, 'Step forward, lower back knee toward ground, drive through front heel to return', '["quadriceps", "glutes"]'::jsonb, '["dumbbells"]'::jsonb),
('Plank', 'strength', 1, 'Hold push-up position on forearms, maintain straight line from head to heels', '["core"]'::jsonb, '["none"]'::jsonb),
('Romanian Deadlift', 'strength', 2, 'Hip hinge movement focusing on hamstring stretch', '["hamstrings", "glutes"]'::jsonb, '["barbell"]'::jsonb),
('Overhead Press', 'strength', 2, 'Press bar overhead from shoulder level', '["shoulders", "triceps"]'::jsonb, '["barbell"]'::jsonb),
('Dumbbell Row', 'strength', 1, 'Row weight to hip while maintaining neutral spine', '["back", "biceps"]'::jsonb, '["dumbbells"]'::jsonb),
('Front Squat', 'strength', 3, 'Squat with barbell in front rack position', '["quadriceps", "core"]'::jsonb, '["barbell"]'::jsonb),
('Hip Thrust', 'strength', 2, 'Drive hips upward while shoulders rest on bench', '["glutes", "hamstrings"]'::jsonb, '["barbell", "bench"]'::jsonb),

-- Cardio exercises
('Sprint Intervals', 'cardio', 2, 'Sprint at 90-95% effort for specified distance, recover, repeat', '["full body"]'::jsonb, '["track or field"]'::jsonb),
('Shuttle Runs', 'cardio', 2, 'Sprint to cone, touch ground, sprint back, repeat', '["legs", "cardiovascular"]'::jsonb, '["cones"]'::jsonb),
('Bike Intervals', 'cardio', 1, 'Alternate between high intensity and recovery periods', '["legs", "cardiovascular"]'::jsonb, '["stationary bike"]'::jsonb),
('Rowing Machine', 'cardio', 2, 'Drive with legs, lean back, pull with arms, return in reverse order', '["full body"]'::jsonb, '["rowing machine"]'::jsonb),
('Jump Rope', 'cardio', 1, 'Jump with both feet, land softly, maintain rhythm', '["calves", "cardiovascular"]'::jsonb, '["jump rope"]'::jsonb),
('Hill Sprints', 'cardio', 3, 'Sprint uphill at maximum effort', '["legs", "cardiovascular"]'::jsonb, '["hill or incline"]'::jsonb),
('Swimming Laps', 'cardio', 2, 'Continuous swimming with proper stroke technique', '["full body"]'::jsonb, '["pool"]'::jsonb),
('Assault Bike', 'cardio', 3, 'High-intensity intervals using arms and legs', '["full body"]'::jsonb, '["assault bike"]'::jsonb),

-- Plyometric exercises
('Box Jumps', 'plyometric', 2, 'Jump explosively onto box, step down, repeat', '["legs", "glutes"]'::jsonb, '["plyometric box"]'::jsonb),
('Medicine Ball Slams', 'plyometric', 2, 'Raise ball overhead, slam down with force, catch and repeat', '["core", "shoulders"]'::jsonb, '["medicine ball"]'::jsonb),
('Depth Jumps', 'plyometric', 3, 'Step off box, land and immediately jump vertically', '["legs"]'::jsonb, '["plyometric box"]'::jsonb),
('Broad Jumps', 'plyometric', 2, 'Jump forward as far as possible, land softly', '["legs", "glutes"]'::jsonb, '["none"]'::jsonb),
('Burpees', 'plyometric', 2, 'Squat, jump back to plank, push-up, jump feet to hands, jump up', '["full body"]'::jsonb, '["none"]'::jsonb),
('Jump Squats', 'plyometric', 1, 'Squat down and explode upward into a jump', '["legs", "glutes"]'::jsonb, '["none"]'::jsonb),
('Clap Push-ups', 'plyometric', 3, 'Explosive push-up with clap at the top', '["chest", "triceps"]'::jsonb, '["none"]'::jsonb),
('Single Leg Bounds', 'plyometric', 2, 'Bound forward on one leg for distance', '["legs"]'::jsonb, '["none"]'::jsonb),
('Tuck Jumps', 'plyometric', 2, 'Jump and bring knees to chest', '["legs", "core"]'::jsonb, '["none"]'::jsonb),

-- Agility exercises
('Ladder Drills', 'agility', 1, 'Various footwork patterns through ladder rungs', '["legs", "coordination"]'::jsonb, '["agility ladder"]'::jsonb),
('Cone Drills', 'agility', 1, 'Change direction quickly around cone pattern', '["legs", "coordination"]'::jsonb, '["cones"]'::jsonb),
('T-Drill', 'agility', 2, 'Sprint forward, shuffle laterally, backpedal in T pattern', '["legs"]'::jsonb, '["cones"]'::jsonb),
('5-10-5 Drill', 'agility', 2, 'Sprint 5 yards, change direction, sprint 10 yards, change direction, sprint 5 yards', '["legs"]'::jsonb, '["cones"]'::jsonb),
('L-Drill', 'agility', 2, 'Sprint, cut at 90 degrees in L pattern', '["legs"]'::jsonb, '["cones"]'::jsonb),
('Box Drill', 'agility', 2, 'Sprint, shuffle, backpedal, shuffle in square pattern', '["legs"]'::jsonb, '["cones"]'::jsonb),
('Figure 8 Drill', 'agility', 1, 'Run figure 8 pattern around cones', '["legs"]'::jsonb, '["cones"]'::jsonb),
('Zig-Zag Drill', 'agility', 1, 'Sprint in zig-zag pattern through cones', '["legs"]'::jsonb, '["cones"]'::jsonb),

-- Flexibility exercises
('Dynamic Warm-up', 'flexibility', 1, 'Leg swings, arm circles, walking lunges, high knees', '["full body"]'::jsonb, '["none"]'::jsonb),
('Static Stretching', 'flexibility', 1, 'Hold stretches for 20-30 seconds per muscle group', '["full body"]'::jsonb, '["none"]'::jsonb),
('Foam Rolling', 'flexibility', 1, 'Roll slowly over muscle groups to release tension', '["full body"]'::jsonb, '["foam roller"]'::jsonb),
('Yoga Flow', 'flexibility', 2, 'Series of yoga poses for flexibility and balance', '["full body"]'::jsonb, '["yoga mat"]'::jsonb),
('PNF Stretching', 'flexibility', 3, 'Contract-relax stretching technique', '["targeted muscles"]'::jsonb, '["partner or band"]'::jsonb),
('Dynamic Leg Swings', 'flexibility', 1, 'Controlled leg swings in multiple directions', '["hips", "legs"]'::jsonb, '["none"]'::jsonb),
('Shoulder Dislocations', 'flexibility', 2, 'Rotate shoulders with band for mobility', '["shoulders"]'::jsonb, '["resistance band"]'::jsonb),

-- Core exercises
('Russian Twists', 'core', 2, 'Rotate torso side to side with weight', '["obliques", "abs"]'::jsonb, '["medicine ball"]'::jsonb),
('Bicycle Crunches', 'core', 1, 'Alternating elbow to opposite knee', '["abs", "obliques"]'::jsonb, '["none"]'::jsonb),
('Dead Bug', 'core', 1, 'Opposite arm and leg extensions while lying', '["abs"]'::jsonb, '["none"]'::jsonb),
('Pallof Press', 'core', 2, 'Anti-rotation exercise with cable resistance', '["core"]'::jsonb, '["cable or band"]'::jsonb),
('Hanging Knee Raises', 'core', 2, 'Hang from bar and raise knees to chest', '["abs", "hip flexors"]'::jsonb, '["pull-up bar"]'::jsonb),
('Ab Wheel Rollout', 'core', 3, 'Roll wheel forward and back maintaining core tension', '["abs"]'::jsonb, '["ab wheel"]'::jsonb),
('Bird Dog', 'core', 1, 'Opposite arm and leg raise from quadruped position', '["core", "back"]'::jsonb, '["none"]'::jsonb),

-- Olympic lifts
('Snatch', 'olympic', 3, 'Explosive lift from floor to overhead in one motion', '["full body"]'::jsonb, '["barbell"]'::jsonb),
('Clean and Jerk', 'olympic', 3, 'Clean to shoulders, then jerk overhead', '["full body"]'::jsonb, '["barbell"]'::jsonb),
('Hang Clean', 'olympic', 2, 'Clean from hang position above knees', '["full body"]'::jsonb, '["barbell"]'::jsonb),
('Push Jerk', 'olympic', 2, 'Drive bar overhead with leg assistance', '["shoulders", "legs"]'::jsonb, '["barbell"]'::jsonb),

-- Sport-specific skill work
('Quarterback Drops', 'skill', 2, '3-step, 5-step, and 7-step drops with proper footwork', '["legs", "coordination"]'::jsonb, '["none"]'::jsonb),
('Dribbling Drills', 'skill', 1, 'Crossovers, between legs, behind back dribbling patterns', '["coordination"]'::jsonb, '["basketball"]'::jsonb),
('Batting Practice', 'skill', 2, 'Tee work, soft toss, live pitching practice', '["core", "arms"]'::jsonb, '["bat", "balls"]'::jsonb),
('Shooting Drills', 'skill', 1, 'Form shooting, spot shooting, game-speed shooting', '["arms", "coordination"]'::jsonb, '["basketball", "hoop"]'::jsonb),
('Passing Drills', 'skill', 1, 'Short passes, long passes, one-touch passing', '["arms", "core"]'::jsonb, '["soccer ball"]'::jsonb),
('Route Running', 'skill', 2, 'Practice precise route patterns for football', '["legs", "coordination"]'::jsonb, '["cones"]'::jsonb),
('Defensive Slides', 'skill', 1, 'Lateral defensive movement for basketball', '["legs"]'::jsonb, '["none"]'::jsonb),
('Tackling Drills', 'skill', 2, 'Proper form tackling technique', '["full body"]'::jsonb, '["tackling dummy"]'::jsonb),

-- Recovery exercises
('Light Jog', 'recovery', 1, 'Easy pace jogging for active recovery', '["legs"]'::jsonb, '["none"]'::jsonb),
('Walking', 'recovery', 1, 'Low-intensity walking for recovery', '["full body"]'::jsonb, '["none"]'::jsonb),
('Swimming Easy', 'recovery', 1, 'Light swimming for active recovery', '["full body"]'::jsonb, '["pool"]'::jsonb),
('Mobility Work', 'recovery', 1, 'Joint circles and gentle movement patterns', '["full body"]'::jsonb, '["none"]'::jsonb);